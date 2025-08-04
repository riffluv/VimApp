import { createSystem, defaultConfig } from "@chakra-ui/react";

// シンプルなテーマ設定（v3対応） - Warmly Professional Dark Theme
const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Warmly Professional Dark Background System
        primary: {
          50: { value: "#ffffff" }, // High emphasis text
          100: { value: "#e6e6e6" }, // Medium emphasis text
          200: { value: "#b3b3b3" }, // Lower emphasis text
          300: { value: "#8a8a8a" }, // Disabled text
          400: { value: "#666666" }, // Neutral
          500: { value: "#4a4a4a" }, // Mid tone
          600: { value: "#333333" }, // Highest elevation bg
          700: { value: "#2a2a2a" }, // Higher elevation bg
          800: { value: "#1e1e1e" }, // Elevated surface bg
          900: { value: "#121212" }, // Primary bg (Material Design recommended)
          950: { value: "#0d1117" }, // Editor bg (GitHub-inspired)
        },
        // Warm Orange Accent System
        secondary: {
          50: { value: "#fff4f0" }, // Very light warm
          100: { value: "#ffe6d9" }, // Light warm
          200: { value: "#ffab91" }, // Warm orange 200 - lighter accent
          300: { value: "#ff8a65" }, // Warm orange 300 - primary accent
          400: { value: "#ff7043" }, // Deep warm orange 400
          500: { value: "#ff5722" }, // Standard warm orange
          600: { value: "#f4511e" }, // Deeper warm
          700: { value: "#e64a19" }, // Dark warm
          800: { value: "#d84315" }, // Darker warm
          900: { value: "#bf360c" }, // Darkest warm
          950: { value: "#8d2f0b" }, // Deep warm
        },
        // Status colors optimized for dark theme
        accent: {
          success: { value: "#81c784" }, // Soft green for success
          warning: { value: "#ffb74d" }, // Warm amber for warnings
          error: { value: "#e57373" }, // Soft red for errors
          info: { value: "#64b5f6" }, // Soft blue for info
        },
        bgDark: { value: "#121212" }, // Updated to Material Design recommended
      },
      fonts: {
        mono: {
          value:
            "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
        },
        body: {
          value:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        },
        heading: {
          value:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.primary.900}" }, // Primary dark background
          surface: { value: "{colors.primary.800}" }, // Elevated surfaces
        },
        fg: {
          default: { value: "{colors.primary.50}" }, // High emphasis text
          muted: { value: "{colors.primary.100}" }, // Medium emphasis text
        },
      },
    },
  },
});

export default customTheme;
