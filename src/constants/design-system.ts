/**
 * Design System 2025 - Premium Rich Black & Orange
 *
 * 一流UI/UXデザイナーが設計した高品質デザインシステム
 * 黄金比ベースの美しいプロポーション、リッチブラック＋オレンジの洗練された色彩設計
 */

// =============================================================================
// COLOR SYSTEM - Premium Rich Black & Orange Palette
// =============================================================================
export const COLORS = {
  // Rich Black Background System - 深みのあるブラック階層
  bg: {
    primary: "#0a0a0a", // リッチブラック - 最も深い層
    secondary: "#121212", // セカンダリブラック - 浮き上がる要素
    tertiary: "#1e1e1e", // ターシャリーブラック - カードやパネル
    surface: "#2a2a2a", // サーフェス - インタラクティブ要素
    overlay: "#0f0f0f", // オーバーレイ - モーダル背景
    editor: "#0d1117", // エディター専用背景 - GitHubライク
    editorGutter: "#161b22", // エディターガター - 行番号領域
  },

  // Typography System - 視認性を重視したコントラスト設計
  text: {
    primary: "#ffffff", // プライマリテキスト - 最高コントラスト
    secondary: "#e0e0e0", // セカンダリテキスト - 読みやすさ維持
    tertiary: "#b0b0b0", // ターシャリーテキスト - サブ情報
    muted: "#808080", // ミュートテキスト - メタ情報
  },

  // Premium Orange Accent System - 洗練されたオレンジ階層
  accent: {
    primary: "#ff6b35", // プライマリオレンジ - メインアクション
    secondary: "#ff8757", // セカンダリオレンジ - ホバー状態
    tertiary: "#ffa379", // ターシャリーオレンジ - アクティブ状態
  },

  // Status System - 直感的で美しい状態表現
  status: {
    success: "#00d9ff", // シアン - 成功の爽やかさ
    warning: "#ffb800", // アンバー - 注意の暖かさ
    error: "#ff4757", // レッド - エラーの明確さ
    info: "#3742fa", // ブルー - 情報の信頼性
  },

  // Interactive States - 微細で上品な状態変化
  interactive: {
    hover: "rgba(255, 107, 53, 0.08)", // 控えめなオレンジホバー
    focus: "rgba(255, 107, 53, 0.16)", // 明確なフォーカス
    active: "rgba(255, 107, 53, 0.24)", // アクティブ状態
  },
} as const;

// =============================================================================
// SPACING SYSTEM - Golden Ratio Based Spacing (φ = 1.618)
// =============================================================================
export const SPACING = {
  unit: "0.25rem", // 4px base unit (16px root)

  // Golden Ratio Progressive Scale - 美的に完璧なプロポーション
  "0": "0",
  "1": "0.25rem", // 4px
  "2": "0.5rem", // 8px
  "3": "0.75rem", // 12px
  "4": "1rem", // 16px
  "5": "1.25rem", // 20px
  "6": "1.5rem", // 24px
  "8": "2rem", // 32px
  "10": "2.5rem", // 40px
  "12": "3rem", // 48px
  "16": "4rem", // 64px
  "20": "5rem", // 80px
  "24": "6rem", // 96px

  // Golden Ratio Semantic Scale - φベースの美しい間隔
  xs: "0.618rem", // 9.888px - φ^(-1) × 16px
  sm: "1rem", // 16px - ベースユニット
  md: "1.618rem", // 25.888px - φ × 16px
  lg: "2.618rem", // 41.888px - φ² × 16px
  xl: "4.236rem", // 67.776px - φ³ × 16px
  "2xl": "6.854rem", // 109.664px - φ⁴ × 16px
  "3xl": "11.09rem", // 177.44px - φ⁵ × 16px

  // Component-specific spacing - 使いやすさと美しさの両立
  component: {
    buttonPadding: "0.75rem 1.5rem", // 12px × 24px - 1:2の美しい比率
    inputPadding: "0.75rem 1rem", // 12px × 16px - 快適な入力エリア
    cardPadding: "1.618rem", // φ × 16px - ゴールデン比
    sectionPadding: "2.618rem", // φ² × 16px - セクション間隔
  },
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM - Premium Typography for Enhanced Readability
// =============================================================================
export const TYPOGRAPHY = {
  // Premium Font Stack - 最高の読みやすさとブランド表現
  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
    display: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif', // ヘッダー用
  },

  // Perfect Scale Typography - タイポグラフィックスケール (1.25 - Major Third)
  fontSize: {
    xs: "0.8rem", // 12.8px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px - ベースフォントサイズ
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.563rem", // 25px
    "3xl": "1.953rem", // 31.25px
    "4xl": "2.441rem", // 39px
    "5xl": "3.052rem", // 48.8px
  },

  // Professional Font Weights - 階層的な情報表現
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // Optimized Line Heights - 完璧な読みやすさ
  lineHeight: {
    tight: "1.25", // ヘッドライン用
    normal: "1.5", // 本文用
    relaxed: "1.625", // ゆったり読むコンテンツ用
    loose: "1.75", // 最大限の読みやすさ
  },

  // Letter Spacing - 洗練された文字間隔
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
  },
} as const;

// =============================================================================
// BORDER SYSTEM - Imperfect, Artisan Border Styles
// =============================================================================
export const BORDERS = {
  // Perfect Radius Scale - 黄金比に基づく美しい角丸
  radius: {
    none: "0",
    sm: "0.25rem", // 4px - 細やかなディテール
    md: "0.5rem", // 8px - スタンダード
    lg: "0.75rem", // 12px - カード要素
    xl: "1rem", // 16px - 大きな要素
    "2xl": "1.5rem", // 24px - プレミアム感
    full: "9999px", // 完全な円形
  },

  // Precise Border Widths - 目的に応じた最適な太さ
  width: {
    thin: "1px", // デリケートな境界
    medium: "2px", // スタンダード
    thick: "3px", // 強調要素
    bold: "4px", // アクセント
  },

  // Border Styles - 表現の幅を提供
  style: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
    double: "double",
  },

  // Rich Black & Orange Border Colors - 統一感のある境界色
  colors: {
    primary: "rgba(255, 107, 53, 0.24)", // プライマリオレンジ境界
    secondary: "rgba(255, 107, 53, 0.16)", // セカンダリオレンジ境界
    tertiary: "rgba(255, 107, 53, 0.08)", // ターシャリーオレンジ境界
    subtle: "rgba(255, 255, 255, 0.08)", // 控えめな白境界
    strong: "rgba(255, 107, 53, 0.32)", // 強調オレンジ境界
    surface: "rgba(255, 255, 255, 0.12)", // サーフェス境界
    muted: "rgba(176, 176, 176, 0.16)", // ミュート境界
  },
} as const;

// =============================================================================
// SHADOW SYSTEM - Premium Rich Black Shadows
// =============================================================================
export const SHADOWS = {
  // Progressive Shadow Scale - 深度を表現する美しいシャドウ
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.08)",
  sm: "0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 1px 2px -1px rgba(0, 0, 0, 0.08)",
  md: "0 4px 8px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.08)",
  lg: "0 12px 20px -3px rgba(0, 0, 0, 0.18), 0 4px 6px -4px rgba(0, 0, 0, 0.12)",
  xl: "0 24px 32px -5px rgba(0, 0, 0, 0.22), 0 8px 10px -6px rgba(0, 0, 0, 0.15)",
  "2xl": "0 32px 64px -12px rgba(0, 0, 0, 0.35)",

  // Premium Component Shadows - 用途別の最適化された影
  premium: {
    card: "0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)", // カード要素
    float: "0 8px 24px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.08)", // フローティング要素
    overlay: "0 16px 48px rgba(0, 0, 0, 0.24), 0 8px 16px rgba(0, 0, 0, 0.12)", // オーバーレイ
    glow: "0 0 20px rgba(255, 107, 53, 0.16)", // オレンジグロー効果
  },

  // Interactive Shadows - ホバー・フォーカス用の動的な影
  interactive: {
    hover: "0 8px 32px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.08)",
    focus: "0 0 0 4px rgba(255, 107, 53, 0.16)", // オレンジフォーカスリング
    active: "0 2px 8px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.08)",
  },
} as const;

// =============================================================================
// Z-INDEX SYSTEM - Layering Management
// =============================================================================
export const Z_INDEX = {
  hide: -1,
  auto: "auto",
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  overlay: 1070,
  max: 2147483647,
} as const;

// =============================================================================
// ANIMATION SYSTEM - Premium Motion Design
// =============================================================================
export const ANIMATION = {
  // Precise Duration Scale - 心地よいタイミング設計
  duration: {
    instant: "0ms",
    fastest: "100ms", // マイクロインタラクション
    fast: "200ms", // ボタンホバー
    normal: "300ms", // 標準トランジション
    slow: "500ms", // ページトランジション
    slower: "700ms", // 複雑なアニメーション
  },

  // Professional Easing Curves - Apple Human Interface Guidelines準拠
  easing: {
    linear: "linear",
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // 自然な減速
    easeIn: "cubic-bezier(0.55, 0.085, 0.68, 0.53)", // 自然な加速
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)", // 滑らかな加減速
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", // バウンシーなスプリング
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)", // きびきびとした動き
  },

  // Sophisticated Motion Variants - プロフェッショナルなアニメーション
  variants: {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 17 }, // 少し非対称な動き
      visible: { opacity: 1, y: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.93 }, // 完全な0.95ではなく少し不規則
      visible: { opacity: 1, scale: 1 },
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -23 }, // 少し非対称な値
      visible: { opacity: 1, x: 0 },
    },
  },
} as const;

// =============================================================================
// COMPONENT SYSTEM - Reusable Component Props
// =============================================================================
export const COMPONENT_STYLES = {
  // Button system
  button: {
    base: {
      fontFamily: TYPOGRAPHY.fonts.sans,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      borderRadius: BORDERS.radius.md,
      transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.easeOut}`,
      cursor: "pointer",
      // Performance optimization
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      isolation: "isolate",
      // プレミアム3D押し込み効果の基盤
      position: "relative",
      willChange: "transform, box-shadow",
    },

    sizes: {
      xs: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        padding: "0.375rem 0.5rem",
        minHeight: "1.75rem", // 28px - 最小タッチサイズ確保
        lineHeight: "1.2",
      },
      sm: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        padding: "0.5rem 0.75rem",
        minHeight: "2.25rem", // 36px - モバイル対応
        lineHeight: "1.3",
      },
      md: {
        fontSize: TYPOGRAPHY.fontSize.base,
        padding: "0.75rem 1rem",
        minHeight: "2.75rem", // 44px - アクセシビリティ準拠
        lineHeight: "1.4",
      },
      lg: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        padding: "1rem 1.5rem",
        minHeight: "3.25rem", // 52px - 大型ボタン
        lineHeight: "1.5",
      },
    },

    variants: {
      solid: {
        bg: COLORS.accent.primary,
        color: COLORS.text.primary,
        border: "none",
        boxShadow:
          "0 3px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        _hover: {
          bg: COLORS.accent.secondary,
          transform: "translateY(-2px) translateZ(0)", // より明確な浮上感
          boxShadow:
            "0 6px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        },
        _active: {
          transform: "translateY(1px) translateZ(0)", // 明確な押し込み感
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)",
          bg: COLORS.accent.tertiary,
          transition: `all ${ANIMATION.duration.fastest} ${ANIMATION.easing.sharp}`,
        },
      } as const,
      ghost: {
        bg: "rgba(42, 42, 42, 0.3)", // 半透明のサーフェス
        color: COLORS.text.secondary,
        border: `${BORDERS.width.thin} ${BORDERS.style.solid} rgba(255, 255, 255, 0.1)`,
        backdropFilter: "blur(8px)", // プレミアムなガラス効果
        boxShadow:
          "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        _hover: {
          bg: "rgba(255, 107, 53, 0.12)", // オレンジのホバー
          color: COLORS.accent.primary,
          borderColor: "rgba(255, 107, 53, 0.3)",
          transform: "translateY(-1px) translateZ(0)",
          boxShadow:
            "0 4px 16px rgba(255, 107, 53, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
        },
        _active: {
          transform: "translateY(0.5px) translateZ(0)", // 微細な押し込み
          bg: "rgba(255, 107, 53, 0.2)",
          boxShadow:
            "0 1px 4px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.08)",
          transition: `all ${ANIMATION.duration.fastest} ${ANIMATION.easing.sharp}`,
        },
      } as const,
      outline: {
        bg: "transparent",
        color: COLORS.accent.primary,
        border: `${BORDERS.width.medium} ${BORDERS.style.solid} ${COLORS.accent.primary}`,
        boxShadow: "0 2px 4px rgba(255, 107, 53, 0.1)",
        _hover: {
          bg: "rgba(255, 107, 53, 0.08)",
          borderColor: COLORS.accent.secondary,
          transform: "translateY(-1px) translateZ(0)",
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.2)",
        },
        _active: {
          transform: "translateY(0.5px) translateZ(0)",
          bg: "rgba(255, 107, 53, 0.15)",
          boxShadow:
            "0 1px 3px rgba(255, 107, 53, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.1)",
          transition: `all ${ANIMATION.duration.fastest} ${ANIMATION.easing.sharp}`,
        },
      } as const,
      // 新しい専用variant: エディタボタン用 - プレミアム3D効果
      editorAction: {
        bg: "rgba(30, 30, 30, 0.8)", // より深いサーフェス
        color: COLORS.text.tertiary,
        border: `${BORDERS.width.thin} ${BORDERS.style.solid} rgba(255, 255, 255, 0.08)`,
        minHeight: "2.25rem",
        padding: "0.5rem 0.75rem",
        fontSize: TYPOGRAPHY.fontSize.xs,
        backdropFilter: "blur(4px)",
        boxShadow:
          "0 2px 6px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        _hover: {
          bg: "rgba(42, 42, 42, 0.9)",
          color: COLORS.accent.primary,
          borderColor: "rgba(255, 107, 53, 0.4)",
          transform: "translateY(-1px) translateZ(0)",
          boxShadow:
            "0 4px 12px rgba(255, 107, 53, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(8px)",
        },
        _active: {
          transform: "translateY(0.5px) translateZ(0)", // 繊細な押し込み
          bg: "rgba(255, 107, 53, 0.15)",
          borderColor: "rgba(255, 107, 53, 0.6)",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)",
          transition: `all ${ANIMATION.duration.fastest} ${ANIMATION.easing.sharp}`,
        },
      } as const,
    },
  },

  // Card system
  card: {
    base: {
      bg: COLORS.bg.secondary,
      borderRadius: BORDERS.radius.lg,
      border: `${BORDERS.width.thin} ${BORDERS.style.solid} ${COLORS.bg.tertiary}`,
      padding: SPACING.component.cardPadding,
      boxShadow: SHADOWS.premium.card,
      // CSS Isolation
      isolation: "isolate",
      position: "relative",
    },
  },

  // Input system
  input: {
    base: {
      bg: COLORS.bg.tertiary,
      color: COLORS.text.primary,
      border: `${BORDERS.width.thin} ${BORDERS.style.solid} ${COLORS.bg.surface}`,
      borderRadius: BORDERS.radius.md,
      padding: SPACING.component.inputPadding,
      fontSize: TYPOGRAPHY.fontSize.base,
      fontFamily: TYPOGRAPHY.fonts.sans,
      transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.easeOut}`,
      _focus: {
        borderColor: COLORS.accent.primary,
        boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        outline: "none",
      },
    },
  },

  // Tooltip system
  tooltip: {
    base: {
      bg: COLORS.bg.surface,
      color: COLORS.text.primary,
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      padding: "0.5rem 0.75rem",
      borderRadius: BORDERS.radius.md,
      boxShadow: SHADOWS.lg,
      border: `${BORDERS.width.thin} ${BORDERS.style.solid} ${COLORS.bg.tertiary}`,
      zIndex: Z_INDEX.tooltip,
      // Performance optimization
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
    },
  },
} as const;

// =============================================================================
// BREAKPOINT SYSTEM - Responsive Design
// =============================================================================
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// =============================================================================
// CONTAINER QUERIES - Modern Responsive Design
// =============================================================================
export const CONTAINER_QUERIES = {
  card: {
    sm: "(width >= 320px)",
    md: "(width >= 480px)",
    lg: "(width >= 640px)",
  },

  sidebar: {
    collapsed: "(width < 200px)",
    expanded: "(width >= 200px)",
  },

  toolbar: {
    compact: "(width < 400px)",
    comfortable: "(width >= 400px)",
    spacious: "(width >= 600px)",
  },
} as const;

// =============================================================================
// ACCESSIBILITY - WCAG Compliance + Touch Target Optimization
// =============================================================================
export const ACCESSIBILITY = {
  // Minimum touch target sizes (iOS/Android HIG + WCAG AAA)
  touchTarget: {
    minSize: "44px", // WCAG AAA minimum
    comfortable: "48px", // iOS HIG recommendation
    spacious: "56px", // Material Design 3
  },

  // Focus indicators
  focus: {
    outline: `2px solid ${COLORS.accent.primary}`,
    outlineOffset: "2px",
    borderRadius: BORDERS.radius.sm,
  },

  // Color contrast ratios (WCAG AA)
  contrast: {
    normal: 4.5, // Normal text
    large: 3, // Large text (18pt+ or 14pt+ bold)
    ui: 3, // UI components
  },

  // Reduced motion support
  reducedMotion: {
    prefersReducedMotion: "(prefers-reduced-motion: reduce)",
    fastTransition: "0.01ms",
  },
} as const;

// =============================================================================
// EXPORT ALL DESIGN TOKENS
// =============================================================================
export const DESIGN_SYSTEM = {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borders: BORDERS,
  shadows: SHADOWS,
  zIndex: Z_INDEX,
  animation: ANIMATION,
  components: COMPONENT_STYLES,
  breakpoints: BREAKPOINTS,
  containerQueries: CONTAINER_QUERIES,
  accessibility: ACCESSIBILITY,
} as const;

export default DESIGN_SYSTEM;
