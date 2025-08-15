import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        trueGray: colors.neutral,
        foreground: colors.gray,
        // Custom colors for light/dark mode
        primary: {
          light: '#333333',
          dark: '#ffffff',
        },
        secondary: {
          light: '#4b5563',
          dark: '#d1d5db',
        },
        accent: {
          light: '#4f46e5',
          dark: '#818cf8',
        },
      },
      textColor: {
        primary: {
          light: '#333333',
          dark: '#ffffff',
        },
        secondary: {
          light: '#4b5563',
          dark: '#d1d5db',
        },
      },
    },
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      stock: [defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};
export default config;