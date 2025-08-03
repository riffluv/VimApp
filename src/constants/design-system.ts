/**
 * Design System 2025 - Modern CSS Standards Compliant
 * Container Queries, CSS Custom Properties, Logical Properties
 */

// =============================================================================
// COLOR SYSTEM - Rich Black & Orange
// =============================================================================
export const COLORS = {
  // Background Colors - Rich Black Variations
  bg: {
    primary: "#0a0a0a",      // Pure rich black
    secondary: "#141414",    // Slightly lighter rich black
    tertiary: "#1e1e1e",     // Card/component background
    quaternary: "#2a2a2a",   // Elevated surfaces
    editor: "#0f0f0f",       // Editor specific background
    overlay: "rgba(10, 10, 10, 0.95)", // Modal/overlay background
  },

  // Text Colors - High contrast hierarchy
  text: {
    primary: "#ffffff",      // Pure white for primary text
    secondary: "#e8e8e8",    // High contrast secondary
    tertiary: "#c4c4c4",     // Medium contrast
    muted: "#9a9a9a",        // Low contrast/disabled
    inverse: "#0a0a0a",      // Black text on light backgrounds
  },

  // Orange Accent System - Professional gradient
  accent: {
    primary: "#ff6b35",      // Main orange - vibrant but professional
    secondary: "#ff8757",    // Lighter orange for hover states
    tertiary: "#ff4500",     // Deeper orange for active states
    subtle: "rgba(255, 107, 53, 0.1)",  // Very light orange tint
    muted: "rgba(255, 107, 53, 0.6)",   // Semi-transparent orange
  },

  // Border System - Subtle but defined
  border: {
    primary: "rgba(255, 107, 53, 0.3)",   // Orange borders
    secondary: "rgba(255, 107, 53, 0.2)",  // Subtle orange borders
    subtle: "rgba(255, 255, 255, 0.1)",    // Neutral borders
    muted: "rgba(255, 255, 255, 0.05)",    // Very subtle borders
  },

  // Status Colors - Harmonized with orange theme
  status: {
    success: "#10b981",      // Green that works with orange
    warning: "#f59e0b",      // Amber that complements orange
    error: "#ef4444",        // Red that doesn't clash
    info: "#3b82f6",         // Blue for information
  },

  // Interactive States
  interactive: {
    hover: "rgba(255, 107, 53, 0.15)",
    active: "rgba(255, 107, 53, 0.25)",
    focus: "rgba(255, 107, 53, 0.4)",
    disabled: "rgba(255, 255, 255, 0.1)",
  },
} as const;

// =============================================================================
// SPACING SYSTEM - 2025年標準（Logical Properties対応）
// =============================================================================
export const SPACING = {
  "0": "0",
  "3xs": "0.25rem",  // 4px
  "2xs": "0.5rem",   // 8px
  "xs": "0.75rem",   // 12px
  "sm": "1rem",      // 16px
  "md": "1.5rem",    // 24px
  "lg": "2rem",      // 32px
  "xl": "3rem",      // 48px
  "2xl": "4rem",     // 64px
  "3xl": "6rem",     // 96px

  // Legacy support
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
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
    xs: "0.75rem",   // 12px
    sm: "0.875rem",  // 14px
    base: "1rem",    // 16px
    lg: "1.125rem",  // 18px
    xl: "1.25rem",   // 20px
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
    sm: "0.25rem",  // 4px
    md: "0.5rem",   // 8px
    lg: "0.75rem",  // 12px
    xl: "1rem",     // 16px
    full: "9999px",
  },

  colors: {
    primary: "rgba(255, 107, 53, 0.3)",
    secondary: "rgba(255, 107, 53, 0.2)",
    subtle: "rgba(255, 255, 255, 0.1)",
  },
} as const;

// =============================================================================
// SHADOW SYSTEM - Rich Black & Orange Themed
// =============================================================================
export const SHADOWS = {
  // Basic shadows with rich black depth
  sm: "0 1px 3px rgba(0, 0, 0, 0.4)",
  md: "0 4px 8px rgba(0, 0, 0, 0.3)",
  lg: "0 8px 16px rgba(0, 0, 0, 0.25)",
  xl: "0 16px 32px rgba(0, 0, 0, 0.2)",

  // Simple focus shadow
  focus: "0 0 0 3px rgba(255, 107, 53, 0.4)",
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
// COMPONENT SYSTEM - Professional Button & UI Styles
// =============================================================================
export const COMPONENT_STYLES = {
  button: {
    sizes: {
      xs: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        padding: "0.375rem 0.5rem",
        minHeight: "1.75rem",
        lineHeight: "1.3",
        borderRadius: BORDERS.radius.sm,
      },
      sm: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        padding: "0.5rem 0.75rem",
        minHeight: "2rem",
        lineHeight: "1.4",
        borderRadius: BORDERS.radius.md,
      },
      md: {
        fontSize: TYPOGRAPHY.fontSize.base,
        padding: "0.75rem 1rem",
        minHeight: "2.5rem",
        lineHeight: "1.5",
        borderRadius: BORDERS.radius.md,
      },
      lg: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        padding: "1rem 1.5rem",
        minHeight: "3rem",
        lineHeight: "1.5",
        borderRadius: BORDERS.radius.lg,
      },
    },

    variants: {
      // Primary orange button
      solid: {
        bg: COLORS.accent.primary,
        color: COLORS.text.primary,
        border: "none",
        boxShadow: "0 2px 6px rgba(255, 107, 53, 0.3)",
        _hover: {
          bg: COLORS.accent.secondary,
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
          transform: "translateY(-1px)",
        },
        _active: {
          bg: COLORS.accent.tertiary,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: "translateY(0)",
        },
      },

      // Subtle ghost button
      ghost: {
        bg: COLORS.bg.tertiary,
        color: COLORS.text.secondary,
        border: `1px solid ${COLORS.border.subtle}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        _hover: {
          bg: COLORS.bg.quaternary,
          color: COLORS.text.primary,
          border: `1px solid ${COLORS.border.secondary}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          transform: "translateY(-1px)",
        },
        _active: {
          bg: COLORS.bg.secondary,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: "translateY(0)",
        },
      },

      // Orange outline button
      outline: {
        bg: "transparent",
        color: COLORS.accent.primary,
        border: `1px solid ${COLORS.accent.primary}`,
        _hover: {
          bg: COLORS.accent.subtle,
          color: COLORS.accent.primary,
          border: `1px solid ${COLORS.accent.secondary}`,
          boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
          transform: "translateY(-1px)",
        },
        _active: {
          bg: COLORS.interactive.active,
          boxShadow: "inset 0 2px 4px rgba(255, 107, 53, 0.2)",
          transform: "translateY(0)",
        },
      },

      // Editor action button with natural hover effects
      editorAction: {
        bg: COLORS.bg.tertiary,
        color: COLORS.text.secondary,
        border: `1px solid ${COLORS.border.subtle}`,
        minHeight: "2.25rem",
        padding: "0.625rem 1rem",
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        borderRadius: BORDERS.radius.md,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        _hover: {
          bg: COLORS.bg.quaternary,
          color: COLORS.text.primary,
          border: `1px solid ${COLORS.border.secondary}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          transform: "translateY(-1px)",
        },
        _active: {
          bg: COLORS.bg.secondary,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: "translateY(0)",
        },
      },

      // Primary button with natural hover effects
      editorPrimary: {
        bg: COLORS.accent.primary,
        color: COLORS.text.primary,
        border: "none",
        minHeight: "2.25rem",
        padding: "0.625rem 1rem",
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        borderRadius: BORDERS.radius.md,
        boxShadow: "0 2px 6px rgba(255, 107, 53, 0.3)",
        _hover: {
          bg: COLORS.accent.secondary,
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
          transform: "translateY(-1px)",
        },
        _active: {
          bg: COLORS.accent.tertiary,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: "translateY(0)",
        },
      },

      // Danger/destructive actions
      danger: {
        bg: COLORS.status.error,
        color: COLORS.text.primary,
        border: "none",
        _hover: {
          bg: "#dc2626",
        },
      },
    },
  },

  // Card component styles
  card: {
    variants: {
      default: {
        bg: COLORS.bg.tertiary,
        border: `1px solid ${COLORS.border.subtle}`,
        borderRadius: BORDERS.radius.lg,
        boxShadow: SHADOWS.md,
      },
      elevated: {
        bg: COLORS.bg.quaternary,
        border: `1px solid ${COLORS.border.secondary}`,
        borderRadius: BORDERS.radius.lg,
        boxShadow: SHADOWS.lg,
      },
      glass: {
        bg: "rgba(30, 30, 30, 0.4)",
        border: `1px solid ${COLORS.border.muted}`,
        borderRadius: BORDERS.radius.lg,
        boxShadow: SHADOWS.md,
      },
    },
  },

  // Input component styles
  input: {
    variants: {
      default: {
        bg: COLORS.bg.secondary,
        color: COLORS.text.primary,
        border: `1px solid ${COLORS.border.subtle}`,
        borderRadius: BORDERS.radius.md,
        _focus: {
          border: `1px solid ${COLORS.accent.primary}`,
          boxShadow: SHADOWS.focus,
          outline: "none",
        },
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
