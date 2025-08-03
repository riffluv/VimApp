import { createSystem, defaultConfig } from "@chakra-ui/react";

const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      // 2025年最新: モダンビューポート単位とDPIスケーリング対応
      sizes: {
        // コンテナクエリ対応サイズ
        "container-xs": { value: "20rem" },
        "container-sm": { value: "24rem" },
        "container-md": { value: "28rem" },
        "container-lg": { value: "32rem" },
        "container-xl": { value: "36rem" },
        "container-2xl": { value: "42rem" },
        // 動的ビューポート単位
        "screen-min": { value: "100svh" }, // Small viewport height
        "screen-dynamic": { value: "100dvh" }, // Dynamic viewport height
        "screen-large": { value: "100lvh" }, // Large viewport height
        // DPIスケーリング対応
        "safe-min": {
          value:
            "calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right))",
        },
      },
      spacing: {
        // clamp()を使った流体スペーシング
        "fluid-xs": { value: "clamp(0.25rem, 0.5vw, 0.5rem)" },
        "fluid-sm": { value: "clamp(0.5rem, 1vw, 1rem)" },
        "fluid-md": { value: "clamp(1rem, 2vw, 2rem)" },
        "fluid-lg": { value: "clamp(1.5rem, 3vw, 3rem)" },
        "fluid-xl": { value: "clamp(2rem, 4vw, 4rem)" },
        "fluid-2xl": { value: "clamp(3rem, 6vw, 6rem)" },
        // DPI 125%最適化
        "dpi-safe": { value: "clamp(0.5rem, 1.25vw, 1.5rem)" },
      },
      fontSizes: {
        // 2025年流体タイポグラフィ
        "fluid-xs": { value: "clamp(0.75rem, 0.875vw, 0.875rem)" },
        "fluid-sm": { value: "clamp(0.875rem, 1vw, 1rem)" },
        "fluid-base": { value: "clamp(1rem, 1.125vw, 1.125rem)" },
        "fluid-lg": { value: "clamp(1.125rem, 1.25vw, 1.25rem)" },
        "fluid-xl": { value: "clamp(1.25rem, 1.5vw, 1.5rem)" },
        "fluid-2xl": { value: "clamp(1.5rem, 2vw, 2rem)" },
        "fluid-3xl": { value: "clamp(1.875rem, 2.5vw, 2.5rem)" },
        "fluid-4xl": { value: "clamp(2.25rem, 3vw, 3rem)" },
        "fluid-5xl": { value: "clamp(3rem, 4vw, 4rem)" },
        // DPI 125%対応
        "dpi-xs": { value: "clamp(0.8rem, 1vw + 0.1rem, 0.95rem)" },
        "dpi-sm": { value: "clamp(0.9rem, 1.2vw + 0.1rem, 1.05rem)" },
        "dpi-base": { value: "clamp(1rem, 1.3vw + 0.1rem, 1.2rem)" },
        "dpi-lg": { value: "clamp(1.2rem, 1.5vw + 0.15rem, 1.4rem)" },
      },
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
        // Professional Gradient System
        gradient: {
          primary: {
            value:
              "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #1e1e1e 100%)",
          },
          secondary: {
            value:
              "linear-gradient(135deg, #ff6b35 0%, #ff8757 50%, #ff4500 100%)",
          },
          "secondary-subtle": {
            value:
              "linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 135, 87, 0.05) 100%)",
          },
          glass: {
            value:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          },
          "glass-warm": {
            value:
              "linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 107, 53, 0.02) 100%)",
          },
          accent: {
            value: "linear-gradient(135deg, #ff6b35 0%, #ff8757 100%)",
          },
          subtle: {
            value: "rgba(255, 107, 53, 0.1)",
          },
          "rich-black": {
            value:
              "linear-gradient(135deg, #0a0a0a 0%, #141414 25%, #1e1e1e 75%, #2a2a2a 100%)",
          },
        },
        // Professional Effects System
        effects: {
          glow: { value: "rgba(255, 107, 53, 0.3)" },
          "glow-subtle": { value: "rgba(255, 107, 53, 0.15)" },
          "glow-intense": { value: "rgba(255, 107, 53, 0.5)" },
          shadow: { value: "rgba(0, 0, 0, 0.8)" },
          "shadow-soft": { value: "rgba(0, 0, 0, 0.4)" },
          shimmer: { value: "rgba(255, 255, 255, 0.1)" },
          blur: { value: "rgba(10, 10, 10, 0.8)" },
          "blur-light": { value: "rgba(20, 20, 20, 0.6)" },
        },
        bgDark: { value: "#0a0a0a" },
      },
      // 2025年最新: Container Query対応ブレークポイント
      breakpoints: {
        xs: { value: "20em" }, // 320px
        sm: { value: "30em" }, // 480px
        md: { value: "48em" }, // 768px
        lg: { value: "64em" }, // 1024px
        xl: { value: "80em" }, // 1280px
        "2xl": { value: "96em" }, // 1536px
        // コンテナクエリ用
        "container-sm": { value: "24em" }, // 384px
        "container-md": { value: "32em" }, // 512px
        "container-lg": { value: "48em" }, // 768px
        "container-xl": { value: "64em" }, // 1024px
      },
      // Professional Shadow System
      shadows: {
        glow: { value: "0 0 20px rgba(255, 107, 53, 0.3)" },
        "glow-sm": { value: "0 0 10px rgba(255, 107, 53, 0.2)" },
        "glow-lg": { value: "0 0 40px rgba(255, 107, 53, 0.4)" },
        "glow-subtle": { value: "0 0 30px rgba(255, 107, 53, 0.15)" },
        glass: {
          value:
            "0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
        "glass-hover": {
          value:
            "0 12px 48px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        },
        "glass": {
          value: "0 8px 24px rgba(0, 0, 0, 0.4)",
        },
        neo: {
          value:
            "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        },
        elevated: {
          value:
            "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 107, 53, 0.1)",
        },
        "rich-black": {
          value:
            "0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 107, 53, 0.1)",
        },
        "rich-black-hover": {
          value:
            "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)",
        },
      },
      // カスタムフォント - より洗練されたフォントスタック
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
          secondary: { value: { base: "gray.300", _dark: "gray.300" } }, // より読みやすいコントラスト
          accent: { value: { base: "secondary.500", _dark: "secondary.500" } }, // 調整されたオレンジ
          muted: { value: { base: "gray.500", _dark: "gray.500" } }, // 新規追加：控えめなテキスト
        },
        border: {
          primary: { value: { base: "primary.700", _dark: "primary.700" } },
          accent: { value: { base: "secondary.600", _dark: "secondary.600" } }, // より落ち着いた境界線
          subtle: { value: { base: "primary.600", _dark: "primary.600" } }, // 新規追加：控えめな境界線
        },
      },
      // 2025年最新: Container Query対応のセマンティックサイズ
      sizes: {
        container: {
          sm: { value: "container-sm" },
          md: { value: "container-md" },
          lg: { value: "container-lg" },
          xl: { value: "container-xl" },
        },
        fluid: {
          xs: { value: "clamp(1rem, 5vw, 2rem)" },
          sm: { value: "clamp(2rem, 10vw, 4rem)" },
          md: { value: "clamp(4rem, 15vw, 8rem)" },
          lg: { value: "clamp(8rem, 20vw, 16rem)" },
          xl: { value: "clamp(16rem, 25vw, 32rem)" },
        },
      },
      spacing: {
        fluid: {
          xs: { value: "fluid-xs" },
          sm: { value: "fluid-sm" },
          md: { value: "fluid-md" },
          lg: { value: "fluid-lg" },
          xl: { value: "fluid-xl" },
          "2xl": { value: "fluid-2xl" },
        },
        dpi: {
          safe: { value: "dpi-safe" },
        },
      },
      fontSizes: {
        fluid: {
          xs: { value: "fluid-xs" },
          sm: { value: "fluid-sm" },
          base: { value: "fluid-base" },
          lg: { value: "fluid-lg" },
          xl: { value: "fluid-xl" },
          "2xl": { value: "fluid-2xl" },
          "3xl": { value: "fluid-3xl" },
          "4xl": { value: "fluid-4xl" },
          "5xl": { value: "fluid-5xl" },
        },
        dpi: {
          xs: { value: "dpi-xs" },
          sm: { value: "dpi-sm" },
          base: { value: "dpi-base" },
          lg: { value: "dpi-lg" },
        },
      },
    },
  },
});

export default customTheme;
