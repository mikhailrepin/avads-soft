# AVADS Soft

Корпоративный веб-сайт компании АВАДС с каталогом программных продуктов.

## Особенности

- Построен на Astro.js
- Использует Tailwind CSS для стилизации
- Адаптивный дизайн

## Разработка

### Установка

```bash
npm install
```

### Запуск сервера разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
```

### Предварительный просмотр сборки

```bash
npm run preview
```

## Автоматизация

### Обновление ссылок на файлы загрузки

В проекте реализовано автоматическое обновление ссылок на загружаемые файлы в `src/data/prodSoft.json`. Скрипт `scripts/update-downloads.js` автоматически запускается при запуске `npm run dev` и `npm run build`.

При добавлении новых файлов в директории `/public/downloads/tsdb`, `/public/downloads/sar-expert` или `/public/downloads/opc-db` ссылки в prodSoft.json будут обновлены автоматически.

Дополнительная информация о скрипте доступна в [scripts/README.md](scripts/README.md).
