import { extendTheme } from "@chakra-ui/react";

// シンプルなテーマ設定（v2互換）
const customTheme = extendTheme({
  colors: {
    // Rich Black (Primary) - Professional Rich Black System
    primary: {
      50: "#ffffff", // Pure white
      100: "#f8f8f8", // Near white
      200: "#e8e8e8", // Light gray
      300: "#c4c4c4", // Medium light gray
      400: "#9a9a9a", // Medium gray
      500: "#6b6b6b", // Neutral gray
      600: "#4a4a4a", // Dark gray
      700: "#2a2a2a", // Darker gray
      800: "#1e1e1e", // Rich black tertiary
      900: "#141414", // Rich black secondary
      950: "#0a0a0a", // Rich black primary
    },
    // Orange (Secondary) - Professional Orange System
    secondary: {
      50: "#fff8f1", // Warm white
      100: "#feecdc", // Light cream
      200: "#fcd9bd", // Soft peach
      300: "#fdba8c", // Light orange
      400: "#ff8757", // Medium orange
      500: "#ff6b35", // Primary orange
      600: "#ff4500", // Deep orange
      700: "#e63900", // Darker orange
      800: "#c73100", // Dark orange-red
      900: "#9c2a00", // Deep orange-red
      950: "#7a1f00", // Darkest orange
    },
    // アクセントカラー
    accent: {
      purple: "#8b5cf6",
      blue: "#3b82f6",
      green: "#10b981",
      red: "#ef4444",
      yellow: "#f59e0b",
      pink: "#ec4899",
      cyan: "#06b6d4",
    },
    bgDark: "#0a0a0a",
  },
  fonts: {
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    heading:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "primary.900",
        color: "primary.100",
      },
    },
  },
});

export default customTheme;
