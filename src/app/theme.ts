import { createSystem, defaultConfig } from "@chakra-ui/react";
const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#e9e9ea" },
          100: { value: "#c7c7ca" },
          200: { value: "#a2a2a7" },
          300: { value: "#7c7d84" },
          400: { value: "#616169" },
          500: { value: "#45454d" },
          600: { value: "#353539" },
          700: { value: "#252527" },
          800: { value: "#18181b" },
          900: { value: "#0a0a0b" },
        },
        secondary: {
          50: { value: "#fff6e5" },
          100: { value: "#ffe4b8" },
          200: { value: "#ffd28a" },
          300: { value: "#ffc05c" },
          400: { value: "#ffae2e" },
          500: { value: "#ff9800" },
          600: { value: "#e67e00" },
          700: { value: "#cc6400" },
          800: { value: "#a45000" },
          900: { value: "#7a3c00" },
        },
        bgDark: { value: "#121214" },
      },
    },
  },
});

export default customTheme;
