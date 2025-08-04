/**
 * Design System 2025 - Clean & Professional
 * Simple rem-based system for natural DPI scaling
 */

// =============================================================================
// COLOR SYSTEM - Clean Black & Orange
// =============================================================================
export const COLORS = {
  bg: {
    primary: "#0a0a0a",
    secondary: "#141414",
    tertiary: "#1e1e1e",
    quaternary: "#2a2a2a",
  },

  text: {
    primary: "#ffffff",
    secondary: "#e8e8e8",
    tertiary: "#c4c4c4",
    muted: "#9a9a9a",
  },

  accent: {
    primary: "#ff6b35",
    secondary: "#ff8757",
    tertiary: "#ff4500",
    subtle: "rgba(255, 107, 53, 0.1)",
  },

  border: {
    primary: "rgba(255, 107, 53, 0.3)",
    secondary: "rgba(255, 255, 255, 0.1)",
    subtle: "rgba(255, 255, 255, 0.05)",
  },

  status: {
    success: "#4ade80",
    warning: "#facc15",
    error: "#ef4444",
  },

  interactive: {
    hover: "rgba(255, 107, 53, 0.15)",
    active: "rgba(255, 107, 53, 0.25)",
    focus: "rgba(255, 107, 53, 0.4)",
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
    primary: "rgba(255, 107, 53, 0.3)",
    secondary: "rgba(255, 255, 255, 0.1)",
    subtle: "rgba(255, 255, 255, 0.05)",
  },
} as const;

// =============================================================================
// SHADOW SYSTEM - Professional depth
// =============================================================================
export const SHADOWS = {
  sm: "0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.4)",
  md: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.3)",
  lg: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",
  xl: "0 1rem 2rem rgba(0, 0, 0, 0.2)",
  orange: "0 0.25rem 0.75rem rgba(255, 107, 53, 0.3)",
  focus: "0 0 0 0.1875rem rgba(255, 107, 53, 0.4)",
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
        bg: "#ff6b35",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 0.25rem 0.75rem rgba(255, 107, 53, 0.3)",
        _hover: {
          bg: "#ff8757",
          transform: "translateY(-0.0625rem)", // -1px
          boxShadow: "0 0.5rem 1rem rgba(255, 107, 53, 0.4)",
        },
        _active: {
          bg: "#ff4500",
          transform: "translateY(0)",
          boxShadow: "0 0.125rem 0.25rem rgba(255, 107, 53, 0.5)",
        },
      },

      ghost: {
        bg: "transparent",
        color: "#e8e8e8",
        border: "0.0625rem solid rgba(255, 255, 255, 0.05)",
        _hover: {
          bg: "#1e1e1e",
          color: "#ffffff",
          border: "0.0625rem solid rgba(255, 107, 53, 0.2)",
        },
        _active: {
          bg: "#2a2a2a",
          color: "#ffffff",
          border: "0.0625rem solid rgba(255, 107, 53, 0.3)",
        },
      },

      outline: {
        bg: "transparent",
        color: "#ff6b35",
        border: "0.0625rem solid #ff6b35",
        _hover: {
          bg: "rgba(255, 107, 53, 0.1)",
          color: "#ff8757",
          border: "0.0625rem solid #ff8757",
        },
        _active: {
          bg: "rgba(255, 107, 53, 0.2)",
          color: "#ff4500",
          border: "0.0625rem solid #ff4500",
        },
      },

      editorAction: {
        bg: "#141414",
        color: "#c4c4c4",
        border: "0.0625rem solid rgba(255, 255, 255, 0.1)",
        fontSize: "0.75rem",
        padding: "0.375rem 0.75rem",
        minHeight: "1.75rem",
        borderRadius: "0.25rem",
        _hover: {
          bg: "#1e1e1e",
          color: "#ffffff",
          border: "0.0625rem solid rgba(255, 107, 53, 0.3)",
        },
        _active: {
          bg: "#2a2a2a",
          color: "#ff6b35",
          border: "0.0625rem solid rgba(255, 107, 53, 0.5)",
        },
      },

      editorPrimary: {
        bg: "rgba(255, 107, 53, 0.1)",
        color: "#ff6b35",
        border: "0.0625rem solid rgba(255, 107, 53, 0.3)",
        fontSize: "0.75rem",
        padding: "0.375rem 0.75rem",
        minHeight: "1.75rem",
        borderRadius: "0.25rem",
        _hover: {
          bg: "rgba(255, 107, 53, 0.2)",
          color: "#ff8757",
          border: "0.0625rem solid rgba(255, 107, 53, 0.5)",
        },
        _active: {
          bg: "rgba(255, 107, 53, 0.3)",
          color: "#ffffff",
          border: "0.0625rem solid #ff6b35",
        },
      },
    },
  },

  card: {
    bg: "#1e1e1e",
    border: "0.0625rem solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.3)",
  },

  input: {
    bg: "#141414",
    color: "#ffffff",
    border: "0.0625rem solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.375rem",
    padding: "0.75rem",
    fontSize: "0.875rem",
    _focus: {
      borderColor: "#ff6b35",
      boxShadow: "0 0 0 0.1875rem rgba(255, 107, 53, 0.4)",
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
