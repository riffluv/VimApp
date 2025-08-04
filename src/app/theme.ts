import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.100",
      },
    },
  },
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
  },
  fonts: {
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    heading:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  fontSizes: {
    // 流体タイポグラフィ
    "fluid-xs": "clamp(0.75rem, 0.875vw, 0.875rem)",
    "fluid-sm": "clamp(0.875rem, 1vw, 1rem)",
    "fluid-base": "clamp(1rem, 1.125vw, 1.125rem)",
    "fluid-lg": "clamp(1.125rem, 1.25vw, 1.25rem)",
    "fluid-xl": "clamp(1.25rem, 1.5vw, 1.5rem)",
    "fluid-2xl": "clamp(1.5rem, 2vw, 2rem)",
    "fluid-3xl": "clamp(1.875rem, 2.5vw, 2.5rem)",
    "fluid-4xl": "clamp(2.25rem, 3vw, 3rem)",
    "fluid-5xl": "clamp(3rem, 4vw, 4rem)",
  },
  space: {
    // 流体スペーシング
    "fluid-xs": "clamp(0.25rem, 0.5vw, 0.5rem)",
    "fluid-sm": "clamp(0.5rem, 1vw, 1rem)",
    "fluid-md": "clamp(1rem, 2vw, 2rem)",
    "fluid-lg": "clamp(1.5rem, 3vw, 3rem)",
    "fluid-xl": "clamp(2rem, 4vw, 4rem)",
    "fluid-2xl": "clamp(3rem, 6vw, 6rem)",
  },
  shadows: {
    glow: "0 0 20px rgba(255, 107, 53, 0.3)",
    "glow-sm": "0 0 10px rgba(255, 107, 53, 0.2)",
    "glow-lg": "0 0 40px rgba(255, 107, 53, 0.4)",
    "glow-subtle": "0 0 30px rgba(255, 107, 53, 0.15)",
    glass:
      "0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    "glass-hover":
      "0 12px 48px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
    neo: "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    elevated:
      "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 107, 53, 0.1)",
    "rich-black":
      "0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 107, 53, 0.1)",
    "rich-black-hover":
      "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)",
  },
  radii: {
    "4xl": "2rem",
    "5xl": "2.5rem",
  },
  breakpoints: {
    xs: "20em", // 320px
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "64em", // 1024px
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
  },
});

export default customTheme;
