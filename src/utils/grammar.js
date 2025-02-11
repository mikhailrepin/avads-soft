/**
 * Список предлогов и союзов, перед которыми нужно ставить неразрывный пробел
 */
const prepositions = [
  "а",
  "в",
  "во",
  "и",
  "к",
  "о",
  "об",
  "от",
  "с",
  "у",
  "за",
  "на",
  "не",
  "но",
  "по",
  "из",
  "или",
  "над",
  "без",
  "при",
  "про",
  "для",
  "под",
  "через",
];

/**
 * Добавляет неразрывные пробелы перед предлогами и заменяет кавычки
 * @param {string} text - Исходный текст
 * @returns {string} - Обработанный текст
 */
export function formatText(text) {
  if (!text) return "";

  console.log("🔍 grammar.js: Начало форматирования текста");

  let stats = {
    quotes: 0,
    spaces: 0,
  };

  // Заменяем обычные кавычки на типографские
  let formattedText = text;
  const quotesCount = (text.match(/"/g) || []).length;
  formattedText = formattedText.replace(/"/g, "«").replace(/"/g, "»");
  stats.quotes = Math.floor(quotesCount / 2);

  // Добавляем неразрывные пробелы перед предлогами
  prepositions.forEach((prep) => {
    const regex = new RegExp(`\\s${prep}\\s`, "g");
    const matches = (text.match(regex) || []).length;
    stats.spaces += matches;
    formattedText = formattedText.replace(regex, `\u00A0${prep} `);
  });

  // Выводим статистику в консоль
  console.log(
    `%cТипографика: обработан текст "${text.slice(0, 30)}${
      text.length > 30 ? "..." : ""
    }"`,
    "color: #666; font-weight: bold"
  );
  console.log(`%c→ Заменено кавычек: ${stats.quotes}`, "color: #666");
  console.log(
    `%c→ Добавлено неразрывных пробелов: ${stats.spaces}`,
    "color: #666"
  );

  return formattedText;
}

/**
 * Форматирует заголовок с учетом типографики
 * @param {string} title - Исходный заголовок
 * @returns {string} - Отформатированный заголовок
 */
export function formatTitle(title) {
  return formatText(title);
}

/**
 * Форматирует описание с учетом типографики
 * @param {string} description - Исходное описание
 * @returns {string} - Отформатированное описание
 */
export function formatDescription(description) {
  return formatText(description);
}
