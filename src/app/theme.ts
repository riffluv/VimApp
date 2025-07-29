import { createSystem, defaultConfig } from "@chakra-ui/react";

const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Rich Black (Primary) - より深みと洗練度を増したブラック
        primary: {
          50: { value: "#fafafa" }, // 純白に近いグレー
          100: { value: "#f4f4f5" }, // 非常に薄いグレー
          200: { value: "#e4e4e7" }, // 薄いグレー
          300: { value: "#d1d1d6" }, // ライトグレー
          400: { value: "#a8a8b3" }, // ミディアムグレー
          500: { value: "#737380" }, // ニュートラルグレー
          600: { value: "#52525f" }, // ダークグレー
          700: { value: "#3a3a44" }, // より深いグレー
          800: { value: "#1a1a1e" }, // Rich Black - メイン（わずかに紫がかった深いブラック）
          900: { value: "#0f0f12" }, // Deeper Black（より深い紫がかったブラック）
          950: { value: "#08080a" }, // Ultra Deep Black（最も深いブラック）
        },
        // Orange (Secondary) - より洗練されたオレンジ（色彩心理学に基づく調整）
        secondary: {
          50: { value: "#fffbf4" }, // より温かい白
          100: { value: "#fef5e7" }, // 柔らかいクリーム
          200: { value: "#fde8cc" }, // 穏やかなベージュ
          300: { value: "#fbd7a8" }, // 上品なライトオレンジ
          400: { value: "#f39c3d" }, // 落ち着いたミディアムオレンジ
          500: { value: "#e8833a" }, // メインオレンジ - より洗練され目に優しい色合い
          600: { value: "#d4741f" }, // 深みのあるダークオレンジ
          700: { value: "#b86118" }, // リッチなブラウンオレンジ
          800: { value: "#9a4e14" }, // 高級感のあるダークブラウン
          900: { value: "#7d3c11" }, // 深いエスプレッソ
          950: { value: "#5a2a0c" }, // 最も深いブラウン
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
          premium: {
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
        elevated: {
          value:
            "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 140, 66, 0.1)",
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
    },
  },
});

export default customTheme;
