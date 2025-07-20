import { createSystem, defaultConfig } from "@chakra-ui/react";

// Add custom colors to the default config
const customTheme = createSystem(defaultConfig);

// Add custom values that will be available in the app
customTheme.colors = {
  ...customTheme.colors,
  primary: {
    50: "#e9e9ea",
    100: "#c7c7ca",
    200: "#a2a2a7",
    300: "#7c7d84",
    400: "#616169",
    500: "#45454d",
    600: "#353539",
    700: "#252527", // Rich black (primary color)
    800: "#18181b",
    900: "#0a0a0b",
  },
  secondary: {
    50: "#fff6e5",
    100: "#ffe4b8",
    200: "#ffd28a",
    300: "#ffc05c",
    400: "#ffae2e",
    500: "#ff9800", // Orange (secondary color)
    600: "#e67e00",
    700: "#cc6400",
    800: "#a45000",
    900: "#7a3c00",
  },
  bgDark: "#121214",
};

export default customTheme;
