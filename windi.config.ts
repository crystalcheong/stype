import { defineConfig } from "vite-plugin-windicss";
const typography = require('windicss/plugin/typography')

export default defineConfig({
  darkMode: "class",
  preflight: true,
  extract: {
    include: ["src/**/*.{vue,html,jsx,tsx}"],
    exclude: ["node_modules", ".git"],
  },
  plugins: [typography],
});
