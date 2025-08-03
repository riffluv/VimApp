/**
 * Design System 2025 - Simplified & Maintainable
 * Simple design tokens for practical development
 */

// =============================================================================
// COLOR SYSTEM - Rich Black & Orange (Premium Edition)
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
// SPACING SYSTEM - 8px Grid
// =============================================================================
export const SPACING = {
  "0": "0",
  "1": "0.25rem",  // 4px
  "2": "0.5rem",   // 8px
  "3": "0.75rem",  // 12px
  "4": "1rem",     // 16px
  "5": "1.25rem",  // 20px
  "6": "1.5rem",   // 24px
  "8": "2rem",     // 32px
  "10": "2.5rem",  // 40px
  "12": "3rem",    // 48px
  "16": "4rem",    // 64px
  "20": "5rem",    // 80px
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

  // Premium shadows with orange glow
  premium: {
    card: "0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 107, 53, 0.1)",
    float: "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 107, 53, 0.15)",
    overlay: "0 16px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 107, 53, 0.2)",
    glow: "0 0 20px rgba(255, 107, 53, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4)",
  },

  // Interactive shadows
  interactive: {
    hover: "0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 107, 53, 0.2)",
    active: "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)",
    focus: "0 0 0 3px rgba(255, 107, 53, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)",
  },

  // Inner shadows for depth
  inset: {
    subtle: "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
    medium: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
    deep: "inset 0 4px 8px rgba(0, 0, 0, 0.4)",
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
        bg: `linear-gradient(135deg, ${COLORS.accent.primary}, ${COLORS.accent.secondary})`,
        color: COLORS.text.primary,
        border: "none",
        boxShadow: SHADOWS.premium.glow,
        _hover: {
          bg: `linear-gradient(135deg, ${COLORS.accent.secondary}, ${COLORS.accent.tertiary})`,
          boxShadow: SHADOWS.interactive.hover,
          transform: "translateY(-1px)",
        },
        _active: {
          boxShadow: SHADOWS.interactive.active,
          transform: "translateY(0)",
        },
      },

      // Subtle ghost button
      ghost: {
        bg: `rgba(30, 30, 30, 0.6)`,
        color: COLORS.text.secondary,
        border: `1px solid ${COLORS.border.subtle}`,
        backdropFilter: "blur(8px)",
        _hover: {
          bg: COLORS.interactive.hover,
          color: COLORS.text.primary,
          border: `1px solid ${COLORS.border.secondary}`,
        },
        _active: {
          bg: COLORS.interactive.active,
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
        },
        _active: {
          bg: COLORS.interactive.active,
        },
      },

      // Premium Editor Actions - Professional & Rich Design
      editorAction: {
        bg: `linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.9))`,
        color: COLORS.text.secondary,
        border: `1px solid ${COLORS.border.subtle}`,
        minHeight: "2.25rem",
        padding: "0.625rem 1rem",
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        backdropFilter: "blur(12px)",
        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        borderRadius: BORDERS.radius.md,
        _hover: {
          bg: `linear-gradient(135deg, rgba(40, 40, 40, 0.95), rgba(30, 30, 30, 0.9))`,
          color: COLORS.text.primary,
          border: `1px solid ${COLORS.border.secondary}`,
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          transform: "translateY(-1px)",
        },
        _active: {
          bg: `linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(10, 10, 10, 0.9))`,
          boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)`,
          transform: "translateY(0)",
        },
      },

      // Premium Primary Variant for Reset/Primary Actions
      editorPrimary: {
        bg: `linear-gradient(135deg, ${COLORS.accent.primary}, ${COLORS.accent.secondary})`,
        color: COLORS.text.primary,
        border: "none",
        minHeight: "2.25rem",
        padding: "0.625rem 1rem",
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        backdropFilter: "blur(12px)",
        boxShadow: `0 4px 16px rgba(255, 107, 53, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        borderRadius: BORDERS.radius.md,
        _hover: {
          bg: `linear-gradient(135deg, ${COLORS.accent.secondary}, ${COLORS.accent.tertiary})`,
          boxShadow: `0 6px 20px rgba(255, 107, 53, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
          transform: "translateY(-2px)",
        },
        _active: {
          bg: `linear-gradient(135deg, ${COLORS.accent.tertiary}, ${COLORS.accent.primary})`,
          boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(255, 107, 53, 0.3)`,
          transform: "translateY(0)",
        },
      },

      // Danger/destructive actions
      danger: {
        bg: `linear-gradient(135deg, ${COLORS.status.error}, #dc2626)`,
        color: COLORS.text.primary,
        border: "none",
        boxShadow: `0 4px 16px rgba(239, 68, 68, 0.3)`,
        _hover: {
          bg: `linear-gradient(135deg, #dc2626, #b91c1c)`,
          boxShadow: `0 6px 20px rgba(239, 68, 68, 0.4)`,
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
        boxShadow: SHADOWS.premium.card,
        backdropFilter: "blur(8px)",
      },
      elevated: {
        bg: COLORS.bg.quaternary,
        border: `1px solid ${COLORS.border.secondary}`,
        borderRadius: BORDERS.radius.lg,
        boxShadow: SHADOWS.premium.float,
        backdropFilter: "blur(12px)",
      },
      glass: {
        bg: "rgba(30, 30, 30, 0.4)",
        border: `1px solid ${COLORS.border.muted}`,
        borderRadius: BORDERS.radius.lg,
        boxShadow: SHADOWS.premium.card,
        backdropFilter: "blur(16px)",
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
          boxShadow: SHADOWS.interactive.focus,
          outline: "none",
        },
        _hover: {
          border: `1px solid ${COLORS.border.secondary}`,
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
