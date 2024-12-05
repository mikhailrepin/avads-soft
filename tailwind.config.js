/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "hsla(37, 71%, 90%, 1)", // extra light
          200: "hsla(37, 71%, 70%, 1)",
          300: "hsla(37, 71%, 60%, 1)", // base
          400: "hsla(40, 70%, 40%, 1)",
          500: "hsla(40, 70%, 10%, 1)", // extra dark
        },
        secondary: {
          100: "hsla(0, 0%, 25%, 1)", // extra light
          200: "hsla(0, 0%, 20%, 1)",
          300: "hsla(0, 0%, 15%, 1)", // base
          400: "hsla(0, 0%, 10%, 1)",
          500: "hsla(0, 0%, 5%, 1)", // extra dark
        },
      },
    },
  },
  plugins: [],
};
