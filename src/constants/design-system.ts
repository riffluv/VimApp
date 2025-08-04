/**
 * Design System 2025 - Clean & Professional
 * Simple rem-based system for natural DPI scaling
 */

// =============================================================================
// COLOR SYSTEM - Warmly Professional Dark Theme
// =============================================================================
export const COLORS = {
  bg: {
    primary: "#121212", // Material Design recommended dark surface
    secondary: "#1e1e1e", // Elevated surface
    tertiary: "#2a2a2a", // Higher elevation
    quaternary: "#333333", // Highest elevation
    editor: "#0d1117", // GitHub-inspired editor bg (slightly cooler for code)
  },

  text: {
    primary: "#ffffff", // High emphasis (87% white on dark)
    secondary: "#e6e6e6", // Medium emphasis (60% white on dark)
    tertiary: "#b3b3b3", // Lower emphasis
    muted: "#8a8a8a", // Disabled text (38% white on dark)
  },

  accent: {
    primary: "#ff8a65", // Warm orange 300 - perfect for dark themes
    secondary: "#ffab91", // Warm orange 200 - lighter accent
    tertiary: "#ff7043", // Deep warm orange 400
    subtle: "rgba(255, 138, 101, 0.12)", // Very subtle accent background
  },

  border: {
    primary: "rgba(255, 138, 101, 0.3)", // Warm accent borders
    secondary: "rgba(255, 255, 255, 0.12)", // Subtle white borders
    subtle: "rgba(255, 255, 255, 0.08)", // Very subtle borders
  },

  status: {
    success: "#81c784", // Soft green for success
    warning: "#ffb74d", // Warm amber for warnings
    error: "#e57373", // Soft red for errors
  },

  interactive: {
    hover: "rgba(255, 138, 101, 0.08)", // Subtle hover state
    active: "rgba(255, 138, 101, 0.16)", // Active state
    focus: "rgba(255, 138, 101, 0.24)", // Focus ring
  },

  // Special surfaces for different contexts
  surface: {
    card: "#1a1a1a", // Cards and elevated content
    overlay: "#252525", // Modal overlays
    tooltip: "#2f2f2f", // Tooltips and popovers
    input: "#1f1f1f", // Form inputs
  },
} as const;

// =============================================================================
// SPACING SYSTEM - Simple rem progression
// =============================================================================
export const SPACING = {
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
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM - Clean rem scale
// =============================================================================
export const TYPOGRAPHY = {
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: "1.25",
    base: "1.5",
    relaxed: "1.75",
  },

  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Monaco, monospace',
  },
} as const;

// =============================================================================
// BORDER SYSTEM - Simple rem values
// =============================================================================
export const BORDERS = {
  width: {
    none: "0",
    thin: "0.0625rem", // 1px
    thick: "0.125rem", // 2px
  },

  radius: {
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
  },

  colors: {
    primary: "rgba(255, 138, 101, 0.3)", // Updated to match new accent
    secondary: "rgba(255, 255, 255, 0.12)", // Updated to match new system
    subtle: "rgba(255, 255, 255, 0.08)", // Updated to match new system
  },
} as const;

// =============================================================================
// SHADOW SYSTEM - Warm & Professional depth
// =============================================================================
export const SHADOWS = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.6)",
  md: "0 4px 12px rgba(0, 0, 0, 0.4)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.3)",
  xl: "0 16px 48px rgba(0, 0, 0, 0.2)",
  orange: "0 4px 16px rgba(255, 138, 101, 0.25)", // Updated to match new accent
  focus: "0 0 0 3px rgba(255, 138, 101, 0.3)", // Updated focus ring
  inner: "inset 0 1px 3px rgba(0, 0, 0, 0.4)", // Inner shadows for inputs
} as const;

// =============================================================================
// ANIMATION SYSTEM - Missing from previous version
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
// Z-INDEX SYSTEM
// =============================================================================
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1040,
  tooltip: 1060,
} as const;

// =============================================================================
// COMPONENT STYLES - Clean button system
// =============================================================================
export const COMPONENT_STYLES = {
  button: {
    sizes: {
      sm: {
        fontSize: "0.75rem", // xs
        padding: "0.5rem 0.75rem", // 8px 12px
        minHeight: "2rem", // 32px
        borderRadius: "0.375rem", // md
      },
      md: {
        fontSize: "0.875rem", // sm
        padding: "0.75rem 1rem", // 12px 16px
        minHeight: "2.5rem", // 40px
        borderRadius: "0.375rem", // md
      },
      lg: {
        fontSize: "1rem", // base
        padding: "1rem 1.5rem", // 16px 24px
        minHeight: "3rem", // 48px
        borderRadius: "0.5rem", // lg
      },
    },

    variants: {
      solid: {
        bg: "#ff8a65", // Updated to warm orange
        color: "#ffffff",
        border: "none",
        boxShadow: "0 4px 16px rgba(255, 138, 101, 0.25)",
        _hover: {
          bg: "#ffab91", // Lighter warm orange
          transform: "translateY(-1px)",
          boxShadow: "0 6px 20px rgba(255, 138, 101, 0.35)",
        },
        _active: {
          bg: "#ff7043", // Deeper warm orange
          transform: "translateY(0)",
          boxShadow: "0 2px 8px rgba(255, 138, 101, 0.4)",
        },
      },

      ghost: {
        bg: "transparent",
        color: "#e6e6e6",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        _hover: {
          bg: "#2a2a2a",
          color: "#ffffff",
          border: "1px solid rgba(255, 138, 101, 0.2)",
        },
        _active: {
          bg: "#333333",
          color: "#ffffff",
          border: "1px solid rgba(255, 138, 101, 0.3)",
        },
      },

      outline: {
        bg: "transparent",
        color: "#ff8a65",
        border: "1px solid #ff8a65",
        _hover: {
          bg: "rgba(255, 138, 101, 0.08)",
          color: "#ffab91",
          border: "1px solid #ffab91",
        },
        _active: {
          bg: "rgba(255, 138, 101, 0.16)",
          color: "#ff7043",
          border: "1px solid #ff7043",
        },
      },

      editorAction: {
        bg: "#1e1e1e",
        color: "#b3b3b3",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        fontSize: "0.75rem",
        padding: "0.375rem 0.75rem",
        minHeight: "1.75rem",
        borderRadius: "0.25rem",
        _hover: {
          bg: "#2a2a2a",
          color: "#ffffff",
          border: "1px solid rgba(255, 138, 101, 0.3)",
        },
        _active: {
          bg: "#333333",
          color: "#ff8a65",
          border: "1px solid rgba(255, 138, 101, 0.5)",
        },
      },

      editorPrimary: {
        bg: "rgba(255, 138, 101, 0.12)",
        color: "#ff8a65",
        border: "1px solid rgba(255, 138, 101, 0.3)",
        fontSize: "0.75rem",
        padding: "0.375rem 0.75rem",
        minHeight: "1.75rem",
        borderRadius: "0.25rem",
        _hover: {
          bg: "rgba(255, 138, 101, 0.16)",
          color: "#ffab91",
          border: "1px solid rgba(255, 138, 101, 0.4)",
        },
        _active: {
          bg: "rgba(255, 138, 101, 0.24)",
          color: "#ffffff",
          border: "1px solid #ff8a65",
        },
      },
    },
  },

  card: {
    bg: "#1a1a1a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
  },

  input: {
    bg: "#1f1f1f",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "0.375rem",
    padding: "0.75rem",
    fontSize: "0.875rem",
    _focus: {
      borderColor: "#ff8a65",
      boxShadow: "0 0 0 3px rgba(255, 138, 101, 0.3)",
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
  animation: ANIMATION,
  zIndex: Z_INDEX,
  components: COMPONENT_STYLES,
} as const;

export default DESIGN_SYSTEM;
