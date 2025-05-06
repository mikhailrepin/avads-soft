#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Получаем абсолютный путь к текущему директории скрипта
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Пути к директориям и файлам
const DOWNLOADS_DIR = path.resolve(rootDir, "public/downloads");
const PROD_SOFT_PATH = path.resolve(rootDir, "src/data/prodSoft.json");

// Шаблоны имен файлов для разных продуктов и платформ
const FILE_PATTERNS = {
  tsdb: {
    windows: /avads_sa_win_x64_.*\.exe$/i,
    linux: /avads_sa_.*\.tar\.gz$/i,
  },
  "sar-expert": {
    windows: /sar-expert\..*\.exe$/i,
    linux: /sar-expert\..*\.tar\.gz$/i,
  },
  "opc-db": {
    windows: /AVADS_OPC_DB_Gateway_win_.*\.exe$/i,
    linux: /AVADS_OPC_DB_Gateway_linux_.*\.zip$/i,
  },
};

// Функция для получения самого нового файла из директории по шаблону
function getLatestFileByPattern(dir, pattern) {
  try {
    if (!fs.existsSync(dir)) {
      console.warn(`Директория ${dir} не существует`);
      return null;
    }

    const files = fs
      .readdirSync(dir)
      .filter((file) => pattern.test(file))
      .map((file) => ({
        name: file,
        path: path.join(dir, file),
        mtime: fs.statSync(path.join(dir, file)).mtime,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    return files.length > 0 ? files[0].name : null;
  } catch (error) {
    console.error(`Ошибка при сканировании директории ${dir}:`, error);
    return null;
  }
}

function updateProdSoftJson() {
  try {
    console.log("Запуск обновления ссылок на загрузки...");

    // Чтение файла prodSoft.json
    const prodSoftContent = fs.readFileSync(PROD_SOFT_PATH, "utf8");
    let prodSoft = JSON.parse(prodSoftContent);
    let updated = false;

    // Для каждого продукта
    for (const product of prodSoft.products) {
      const productId = product.id;
      if (!productId || !FILE_PATTERNS[productId]) continue;

      const productDir = path.join(DOWNLOADS_DIR, productId);
      if (!fs.existsSync(productDir)) {
        console.warn(
          `Директория ${productDir} не существует. Пропускаем продукт ${productId}`
        );
        continue;
      }

      // Обработка для Windows и Linux
      for (const os of ["windows", "linux"]) {
        if (
          !product.supports ||
          !product.supports[os] ||
          !product.supports[os].downloads ||
          !product.supports[os].downloads.demo
        ) {
          continue;
        }

        const pattern = FILE_PATTERNS[productId][os];
        const latestFile = getLatestFileByPattern(productDir, pattern);

        if (latestFile) {
          const newLink = `/downloads/${productId}/${latestFile}`;
          const currentLink = product.supports[os].downloads.demo.link;

          if (newLink !== currentLink) {
            console.log(
              `Обновление ссылки для ${productId} (${os}): ${currentLink} -> ${newLink}`
            );
            product.supports[os].downloads.demo.link = newLink;
            updated = true;
          } else {
            console.log(
              `Ссылка для ${productId} (${os}) не изменилась: ${currentLink}`
            );
          }
        } else {
          console.warn(
            `Не найдены файлы для ${productId} (${os}) по шаблону ${pattern}`
          );
        }
      }
    }

    if (updated) {
      // Запись обновленного файла с сохранением форматирования
      fs.writeFileSync(
        PROD_SOFT_PATH,
        JSON.stringify(prodSoft, null, 2),
        "utf8"
      );
      console.log(`Файл ${PROD_SOFT_PATH} успешно обновлен`);
    } else {
      console.log("Изменений в ссылках не обнаружено");
    }
  } catch (error) {
    console.error("Ошибка при обновлении prodSoft.json:", error);
    process.exit(1);
  }
}

// Запуск обновления
updateProdSoftJson();
