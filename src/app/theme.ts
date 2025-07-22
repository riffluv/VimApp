import { createSystem, defaultConfig } from "@chakra-ui/react";

const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Rich Black (Primary) - より深みのあるブラック
        primary: {
          50: { value: "#f7f7f8" },
          100: { value: "#eeeef0" },
          200: { value: "#d7d7dc" },
          300: { value: "#b8b8c1" },
          400: { value: "#8b8b96" },
          500: { value: "#6a6a75" },
          600: { value: "#55555e" },
          700: { value: "#45454d" },
          800: { value: "#18181b" }, // Rich Black
          900: { value: "#0a0a0b" }, // Deeper Black
          950: { value: "#050507" }, // Ultra Deep Black
        },
        // Orange (Secondary) - より洗練されたオレンジ
        secondary: {
          50: { value: "#fffbf0" },
          100: { value: "#fef3e2" },
          200: { value: "#fde4c0" },
          300: { value: "#fbd28e" },
          400: { value: "#f8b85a" },
          500: { value: "#ff9800" }, // メインオレンジ
          600: { value: "#f57c00" },
          700: { value: "#ef6c00" },
          800: { value: "#e65100" },
          900: { value: "#bf360c" },
          950: { value: "#8d2600" },
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
        // グラデーション用カラー
        gradient: {
          primary: {
            value:
              "linear-gradient(135deg, #0a0a0b 0%, #18181b 50%, #27272a 100%)",
          },
          secondary: {
            value:
              "linear-gradient(135deg, #ff9800 0%, #f57c00 50%, #ef6c00 100%)",
          },
          glass: {
            value:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          },
          accent: {
            value: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
          },
        },
        // 特殊エフェクト用
        effects: {
          glow: { value: "rgba(255, 152, 0, 0.3)" },
          shadow: { value: "rgba(0, 0, 0, 0.8)" },
          shimmer: { value: "rgba(255, 255, 255, 0.1)" },
          blur: { value: "rgba(24, 24, 27, 0.8)" },
        },
        bgDark: { value: "#121214" },
      },
      // カスタムシャドウ
      shadows: {
        glow: { value: "0 0 20px rgba(255, 152, 0, 0.3)" },
        "glow-sm": { value: "0 0 10px rgba(255, 152, 0, 0.2)" },
        "glow-lg": { value: "0 0 40px rgba(255, 152, 0, 0.4)" },
        glass: {
          value:
            "0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
        "glass-hover": {
          value:
            "0 12px 48px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        },
        neo: {
          value:
            "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
      },
      // カスタムフォント
      fonts: {
        mono: {
          value:
            "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
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
      // カスタムボーダー半径
      radii: {
        "4xl": { value: "2rem" },
        "5xl": { value: "2.5rem" },
      },
    },
    semanticTokens: {
      colors: {
        // セマンティックカラー
        bg: {
          canvas: { value: { base: "primary.900", _dark: "primary.900" } },
          surface: { value: { base: "primary.800", _dark: "primary.800" } },
          glass: {
            value: {
              base: "rgba(24, 24, 27, 0.8)",
              _dark: "rgba(24, 24, 27, 0.8)",
            },
          },
        },
        text: {
          primary: { value: { base: "gray.50", _dark: "gray.50" } },
          secondary: { value: { base: "gray.400", _dark: "gray.400" } },
          accent: { value: { base: "secondary.400", _dark: "secondary.400" } },
        },
        border: {
          primary: { value: { base: "primary.700", _dark: "primary.700" } },
          accent: { value: { base: "secondary.800", _dark: "secondary.800" } },
        },
      },
    },
  },
});

export default customTheme;
