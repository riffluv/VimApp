import { createSystem, defaultConfig } from "@chakra-ui/react";

const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Rich Black (Primary) - より深みのあるブラック
        primary: {
          50: { value: "#f8f8f9" },
          100: { value: "#f0f0f2" },
          200: { value: "#e1e1e6" },
          300: { value: "#c4c4cc" },
          400: { value: "#a1a1aa" },
          500: { value: "#71717a" },
          600: { value: "#52525b" },
          700: { value: "#3f3f46" },
          800: { value: "#18181b" }, // Rich Black - メイン
          900: { value: "#0f0f10" }, // Deeper Black
          950: { value: "#09090b" }, // Ultra Deep Black
        },
        // Orange (Secondary) - より洗練されたオレンジ
        secondary: {
          50: { value: "#fffbf0" },
          100: { value: "#fef4e6" },
          200: { value: "#fde6c7" },
          300: { value: "#fbd49a" },
          400: { value: "#ff9f43" }, // より温かみのあるライトオレンジ
          500: { value: "#ff8c42" }, // メインオレンジ - より洗練された色合い
          600: { value: "#e67e22" }, // ダークオレンジ - より深みのある色
          700: { value: "#d35400" },
          800: { value: "#c0392b" },
          900: { value: "#a93226" },
          950: { value: "#8b2635" },
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
              "linear-gradient(135deg, #ff8c42 0%, #e67e22 50%, #d35400 100%)",
          },
          "secondary-subtle": {
            value:
              "linear-gradient(135deg, rgba(255, 140, 66, 0.1) 0%, rgba(230, 126, 34, 0.05) 100%)",
          },
          glass: {
            value:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          },
          "glass-warm": {
            value:
              "linear-gradient(135deg, rgba(255, 140, 66, 0.08) 0%, rgba(255, 140, 66, 0.02) 100%)",
          },
          accent: {
            value: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
          },
          "premium": {
            value:
              "linear-gradient(135deg, rgba(255, 140, 66, 0.15) 0%, transparent 50%, rgba(255, 140, 66, 0.05) 100%)",
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
        glow: { value: "0 0 20px rgba(255, 140, 66, 0.3)" },
        "glow-sm": { value: "0 0 10px rgba(255, 140, 66, 0.2)" },
        "glow-lg": { value: "0 0 40px rgba(255, 140, 66, 0.4)" },
        "glow-subtle": { value: "0 0 30px rgba(255, 140, 66, 0.15)" },
        glass: {
          value:
            "0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
        "glass-hover": {
          value:
            "0 12px 48px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        },
        "glass-premium": {
          value:
            "0 20px 60px 0 rgba(0, 0, 0, 0.5), 0 8px 25px 0 rgba(255, 140, 66, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
        neo: {
          value:
            "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
        "elevated": {
          value:
            "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 140, 66, 0.1)",
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
