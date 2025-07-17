import type { TabType } from "@/types/interfaces";

// Глобальный контекст для управления состоянием табов
class TabContext {
  private static instance: TabContext;
  private activeTab: TabType = "software";
  private listeners: Set<(tab: TabType) => void> = new Set();
  private storageKey = "avads-active-tab";

  private constructor() {
    // Восстанавливаем состояние из localStorage при инициализации
    this.restoreFromStorage();
  }

  static getInstance(): TabContext {
    if (!TabContext.instance) {
      TabContext.instance = new TabContext();
    }
    return TabContext.instance;
  }

  // Получить текущий активный таб
  getActiveTab(): TabType {
    return this.activeTab;
  }

  // Установить активный таб
  setActiveTab(tab: TabType): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Подписаться на изменения активного таба
  subscribe(listener: (tab: TabType) => void): () => void {
    this.listeners.add(listener);
    // Возвращаем функцию для отписки
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Уведомить всех слушателей об изменении
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.activeTab));
  }

  // Сохранить состояние в localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, this.activeTab);
    } catch (error) {
      console.warn("Не удалось сохранить состояние таба:", error);
    }
  }

  // Восстановить состояние из localStorage
  private restoreFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && (saved === "software" || saved === "hardware")) {
        this.activeTab = saved;
      }
    } catch (error) {
      console.warn("Не удалось восстановить состояние таба:", error);
    }
  }

  // Переключить таб по якорю на странице
  switchTabByAnchor(hash: string): void {
    if (!hash) return;

    const softwareProducts = ["tsdb", "sar-expert", "opc-db"];
    const hardwareProducts = ["ASP", "AVK", "AMV", "asp", "avk", "amv"];

    let targetTabType: TabType | null = null;

    if (softwareProducts.includes(hash)) {
      targetTabType = "software";
    } else if (hardwareProducts.includes(hash)) {
      targetTabType = "hardware";
    }

    if (targetTabType) {
      this.setActiveTab(targetTabType);
    }
  }
}

export default TabContext;
