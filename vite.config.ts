import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        {
          // Используйте glob для импорта всех компонентов из подпапок
          paths: ["./src/components/**/*.astro"], // Измените на glob-выражение
          extensions: [".astro"],
        },
      ],
    }),
  ],
});
