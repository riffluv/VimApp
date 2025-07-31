/**
 * Design System 2025 - Performance-First Design Tokens
 *
 * モダンCSS技術とChakra UIを組み合わせた統一デザインシステム
 * レイアウトスラッシング完全回避を前提とした設計
 */

// =============================================================================
// COLOR SYSTEM - Semantic Color Tokens
// =============================================================================
export const COLORS = {
  // Background Colors
  bg: {
    primary: "#0f0f12",
    secondary: "#1a1a1e",
    tertiary: "#2a2a2e",
    surface: "#3a3a3e",
    overlay: "#1a1a1d",
  },

  // Text Colors
  text: {
    primary: "#ffffff",
    secondary: "#d1d5db",
    tertiary: "#9ca3af",
    muted: "#6b7280",
  },

  // Accent Colors
  accent: {
    primary: "#e8833a",
    secondary: "#ff9800",
    tertiary: "#ffab40",
  },

  // Status Colors
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Interactive States
  interactive: {
    hover: "rgba(232, 131, 58, 0.1)",
    focus: "rgba(232, 131, 58, 0.2)",
    active: "rgba(232, 131, 58, 0.3)",
  },
} as const;

// =============================================================================
// SPACING SYSTEM - Consistent Spacing Scale
// =============================================================================
export const SPACING = {
  unit: "0.25rem", // 4px base unit

  // Numeric spacing scale (for array index access)
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

  // Standard spacing scale
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "3rem", // 48px
  "2xl": "4rem", // 64px
  "3xl": "6rem", // 96px

  // Component-specific spacing
  component: {
    buttonPadding: "0.75rem 1rem",
    inputPadding: "0.5rem 0.75rem",
    cardPadding: "1.5rem",
    sectionPadding: "2rem",
  },
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM - Harmonious Type Scale
// =============================================================================
export const TYPOGRAPHY = {
  // Font families
  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
  },

  // Font sizes
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  // Font weights
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line heights
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// =============================================================================
// BORDER SYSTEM - Consistent Border Styles
// =============================================================================
export const BORDERS = {
  radius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },

  width: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  style: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
  },

  colors: {
    primary: "rgba(232, 131, 58, 0.20)",
    secondary: "rgba(232, 131, 58, 0.12)",
    tertiary: "rgba(232, 131, 58, 0.08)",
    subtle: "rgba(255, 255, 255, 0.06)",
    strong: "rgba(232, 131, 58, 0.35)",
  },
} as const;

// =============================================================================
// SHADOW SYSTEM - Elevation and Depth
// =============================================================================
export const SHADOWS = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",

  // Component-specific shadows
  glass: {
    subtle: "0 4px 16px rgb(232 131 58 / 0.1)",
    medium: "0 8px 32px rgb(232 131 58 / 0.15)",
    strong: "0 16px 64px rgb(232 131 58 / 0.2)",
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
// ANIMATION SYSTEM - Performance-First Animations
// =============================================================================
export const ANIMATION = {
  // Duration scale
  duration: {
    instant: "0ms",
    fastest: "100ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "750ms",
  },

  // Timing functions
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bouncy: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Common animation variants (Framer Motion)
  variants: {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -20 },
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
    },

    sizes: {
      sm: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        padding: "0.5rem 0.75rem",
        minHeight: "2rem",
      },
      md: {
        fontSize: TYPOGRAPHY.fontSize.base,
        padding: "0.75rem 1rem",
        minHeight: "2.5rem",
      },
      lg: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        padding: "1rem 1.5rem",
        minHeight: "3rem",
      },
    },

    variants: {
      solid: {
        bg: COLORS.accent.primary,
        color: COLORS.text.primary,
        _hover: {
          bg: COLORS.accent.secondary,
          transform: "translateY(-1px)", // Compositor-only
        },
      },
      ghost: {
        bg: "transparent",
        color: COLORS.text.secondary,
        _hover: {
          bg: COLORS.interactive.hover,
          color: COLORS.text.primary,
          transform: "translateY(-1px)", // Compositor-only
        },
      },
      outline: {
        bg: "transparent",
        color: COLORS.accent.primary,
        border: `${BORDERS.width.thin} ${BORDERS.style.solid} ${COLORS.accent.primary}`,
        _hover: {
          bg: COLORS.interactive.hover,
          transform: "translateY(-1px)", // Compositor-only
        },
      },
    },
  },

  // Card system
  card: {
    base: {
      bg: COLORS.bg.secondary,
      borderRadius: BORDERS.radius.lg,
      border: `${BORDERS.width.thin} ${BORDERS.style.solid} ${COLORS.bg.tertiary}`,
      padding: SPACING.component.cardPadding,
      boxShadow: SHADOWS.glass.subtle,
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
// ACCESSIBILITY - WCAG Compliance
// =============================================================================
export const ACCESSIBILITY = {
  // Minimum touch target sizes (iOS/Android HIG)
  touchTarget: {
    minSize: "44px",
    comfortable: "48px",
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
