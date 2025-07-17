// Базовые типы для элементов
export type Elem = {
  Variant: "primary" | "secondary";
  Size: "default" | "small" | "big";
  Style: "filled" | "outlined" | "ghosted" | "hidden";
  Target: "action" | "link";
};

// Базовый интерфейс для текстовых элементов
export interface BaseText {
  Title: string;
  Subtitle?: string;
  Description?: string;
  Caption?: string;
  CustomClass?: string;
}

// Базовый интерфейс для иконок
export interface IconProps {
  IconSprite: string;
  IconVisible: boolean;
}

// Базовый интерфейс для кнопки
export interface BaseButton {
  Visible?: boolean;
  Variant?: Elem["Variant"];
  Size?: Elem["Size"];
  Style?: Elem["Style"];
  Disabled?: boolean;
  Loading?: boolean;
  Toggle?: boolean;
  Tooltip?: string;
  IconLeft?: IconProps;
  IconRight?: IconProps;
  ButtonLabel?: string;
  ButtonLink?: string;
  Blank?: boolean;
  CustomClass?: string;
  Onclick?: () => void;
  Target?: Elem["Target"];
  type?: "button" | "submit" | "reset";
}

// Интерфейс для карточек
export interface BaseCard extends BaseText {
  Image: string;
  Status?: string;
  ProductLink?: string;
  FirstButton?: BaseButton;
  SecondButton?: BaseButton;
  CustomClass?: string;
}

// Интерфейс для Call to Action
export interface CallToAction extends BaseText {
  ButtonProps?: BaseButton;
  AlignItems?: "center" | "left" | "right";
  BackgroundImage?: string;
  Hovered?: boolean;
}

// Интерфейс для карточек новостей
export interface Post {
  title: string;
  description: string;
  date: string;
  image: string;
  url: string;
}

// Типы для контекста табов
export type TabType = "software" | "hardware";

export interface TabContextState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export interface TabsProps {
  showLabels?: boolean;
  customClass?: string;
  storageKey?: string;
}

// Типы для продуктов
export interface SoftProduct {
  id: string;
  app: {
    name: string;
    description: string;
    image: string;
    status: string;
  };
  buttons?: {
    demo?: {
      link: string;
      label: string;
    };
    buy?: {
      link: string;
      label: string;
    };
    more?: {
      link: string;
      label: string;
    };
  };
  prices?: any;
  supports?: any;
}

export interface HardProduct {
  id: string;
  device: {
    name: string;
    description: string;
    image: string;
    status: string;
  };
  supports?: any;
  prices?: any;
}
