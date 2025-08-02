/**
 * Design System 2025 - Simplified & Maintainable
 * Simple design tokens for practical development
 */

// =============================================================================
// COLOR SYSTEM - Rich Black & Orange
// =============================================================================
export const COLORS = {
  // Background Colors
  bg: {
    primary: "#0a0a0a",
    secondary: "#1a1a1a",
    tertiary: "#2a2a2a",
    editor: "#0d1117",
  },

  // Text Colors
  text: {
    primary: "#ffffff",
    secondary: "#e0e0e0",
    tertiary: "#b0b0b0",
    muted: "#808080",
  },

  // Accent Colors
  accent: {
    primary: "#ff6b35",
    secondary: "#ff8757",
  },

  // Status Colors
  status: {
    success: "#00d9ff",
    warning: "#ffb800",
    error: "#ff4757",
    info: "#3742fa",
  },
} as const;

// =============================================================================
// SPACING SYSTEM - 8px Grid
// =============================================================================
export const SPACING = {
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
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================
export const TYPOGRAPHY = {
  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// =============================================================================
// BORDER SYSTEM
// =============================================================================
export const BORDERS = {
  radius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    full: "9999px",
  },

  colors: {
    primary: "rgba(255, 107, 53, 0.3)",
    secondary: "rgba(255, 107, 53, 0.2)",
    subtle: "rgba(255, 255, 255, 0.1)",
  },
} as const;

// =============================================================================
// SHADOW SYSTEM
// =============================================================================
export const SHADOWS = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1)",

  premium: {
    card: "0 4px 16px rgba(0, 0, 0, 0.12)",
    float: "0 8px 24px rgba(0, 0, 0, 0.16)",
    overlay: "0 16px 48px rgba(0, 0, 0, 0.24)",
  },
} as const;

// =============================================================================
// Z-INDEX SYSTEM
// =============================================================================
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1040,
  tooltip: 1060,
} as const;

// =============================================================================
// ANIMATION SYSTEM
// =============================================================================
export const ANIMATION = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
  },

  easing: {
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  },
} as const;

// =============================================================================
// COMPONENT SYSTEM - Simplified Button Styles
// =============================================================================
export const COMPONENT_STYLES = {
  button: {
    sizes: {
      sm: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        padding: "0.5rem 0.75rem",
        minHeight: "2rem",
        lineHeight: "1.4",
      },
      md: {
        fontSize: TYPOGRAPHY.fontSize.base,
        padding: "0.75rem 1rem",
        minHeight: "2.5rem",
        lineHeight: "1.5",
      },
    },

    variants: {
      solid: {
        bg: COLORS.accent.primary,
        color: COLORS.text.primary,
        border: "none",
        boxShadow: SHADOWS.md,
      },
      ghost: {
        bg: "rgba(42, 42, 42, 0.6)",
        color: COLORS.text.secondary,
        border: `1px solid ${BORDERS.colors.subtle}`,
      },
      outline: {
        bg: "transparent",
        color: COLORS.accent.primary,
        border: `1px solid ${COLORS.accent.primary}`,
      },
      editorAction: {
        bg: "rgba(30, 30, 30, 0.8)",
        color: COLORS.text.tertiary,
        border: `1px solid ${BORDERS.colors.subtle}`,
        minHeight: "2rem",
        padding: "0.5rem 0.75rem",
        fontSize: TYPOGRAPHY.fontSize.sm,
      },
    },
  },
} as const;

// =============================================================================
// EXPORT DESIGN SYSTEM
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
} as const;

export default DESIGN_SYSTEM;
