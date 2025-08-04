import { createSystem, defaultConfig } from "@chakra-ui/react";

// シンプルなテーマ設定（v3対応）
const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Rich Black (Primary) - Professional Rich Black System
        primary: {
          50: { value: "#ffffff" }, // Pure white
          100: { value: "#f8f8f8" }, // Near white
          200: { value: "#e8e8e8" }, // Light gray
          300: { value: "#c4c4c4" }, // Medium light gray
          400: { value: "#9a9a9a" }, // Medium gray
          500: { value: "#6b6b6b" }, // Neutral gray
          600: { value: "#4a4a4a" }, // Dark gray
          700: { value: "#2a2a2a" }, // Darker gray
          800: { value: "#1e1e1e" }, // Rich black tertiary
          900: { value: "#141414" }, // Rich black secondary
          950: { value: "#0a0a0a" }, // Rich black primary
        },
        // Orange (Secondary) - Professional Orange System
        secondary: {
          50: { value: "#fff8f1" }, // Warm white
          100: { value: "#feecdc" }, // Light cream
          200: { value: "#fcd9bd" }, // Soft peach
          300: { value: "#fdba8c" }, // Light orange
          400: { value: "#ff8757" }, // Medium orange
          500: { value: "#ff6b35" }, // Primary orange
          600: { value: "#ff4500" }, // Deep orange
          700: { value: "#e63900" }, // Darker orange
          800: { value: "#c73100" }, // Dark orange-red
          900: { value: "#9c2a00" }, // Deep orange-red
          950: { value: "#7a1f00" }, // Darkest orange
        },
        // アクセントカラー
        accent: {
          purple: { value: "#8b5cf6" },
          blue: { value: "#3b82f6" },
          green: { value: "#10b981" },
          red: { value: "#ef4444" },
          yellow: { value: "#f59e0b" },
          pink: { value: "#ec4899" },
          cyan: { value: "#06b6d4" },
        },
        bgDark: { value: "#0a0a0a" },
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
          canvas: { value: "{colors.primary.900}" },
        },
        fg: {
          default: { value: "{colors.primary.100}" },
        },
      },
    },
  },
});

export default customTheme;
