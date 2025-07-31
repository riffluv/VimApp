/* =============================================================================
   Design System - 2025 Modern Design Tokens
   ============================================================================= */

// Base Colors
const baseColors = {
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",

  // Gray Scale
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Primary Colors (Vim-themed)
  primary: {
    50: "#fef7ee",
    100: "#fdedd3",
    200: "#fbd6a6",
    300: "#f7b86e",
    400: "#f39134",
    500: "#f0750f",
    600: "#e8833a",
    700: "#bd5f2b",
    800: "#974b28",
    900: "#7a3f25",
  },

  // Semantic Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
};

// Typography Scale
const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "Menlo", "Monaco", "monospace"],
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  fontWeight: {
    light: "300",
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

  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
};

// Spacing Scale (8px base unit)
const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
};

// Border Radius
const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

// Shadow System
const boxShadow = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  glow: "0 0 20px rgb(240 117 15 / 0.3)",
};

// Animation System
const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  easing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Transition presets
  transition: {
    colors:
      "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Z-Index Scale
const zIndex = {
  auto: "auto",
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  dropdown: "1000",
  sticky: "1020",
  fixed: "1030",
  modalBackdrop: "1040",
  modal: "1050",
  popover: "1060",
  tooltip: "1070",
  toast: "1080",
  max: "2147483647",
};

// Component Specific Styles
const components = {
  button: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.tight,
      transition: animation.transition.all,
      cursor: "pointer",
      userSelect: "none",
      border: "none",
      outline: "none",
      position: "relative",
      textDecoration: "none",
    },

    sizes: {
      sm: {
        height: "2rem",
        paddingX: spacing[3],
        paddingY: spacing[1],
        fontSize: typography.fontSize.xs,
      },
      md: {
        height: "2.5rem",
        paddingX: spacing[4],
        paddingY: spacing[2],
        fontSize: typography.fontSize.sm,
      },
      lg: {
        height: "3rem",
        paddingX: spacing[6],
        paddingY: spacing[3],
        fontSize: typography.fontSize.base,
      },
    },

    variants: {
      primary: {
        backgroundColor: baseColors.primary[500],
        color: baseColors.white,
        "&:hover": {
          backgroundColor: baseColors.primary[600],
          transform: "translateY(-1px)",
          boxShadow: boxShadow.md,
        },
        "&:active": {
          backgroundColor: baseColors.primary[700],
          transform: "translateY(0)",
        },
      },

      secondary: {
        backgroundColor: baseColors.gray[100],
        color: baseColors.gray[900],
        "&:hover": {
          backgroundColor: baseColors.gray[200],
          transform: "translateY(-1px)",
          boxShadow: boxShadow.sm,
        },
        "&:active": {
          backgroundColor: baseColors.gray[300],
          transform: "translateY(0)",
        },
      },

      ghost: {
        backgroundColor: "transparent",
        color: baseColors.gray[700],
        "&:hover": {
          backgroundColor: baseColors.gray[100],
          color: baseColors.gray[900],
        },
        "&:active": {
          backgroundColor: baseColors.gray[200],
        },
      },
    },
  },

  card: {
    base: {
      backgroundColor: baseColors.white,
      borderRadius: borderRadius.lg,
      boxShadow: boxShadow.sm,
      border: `1px solid ${baseColors.gray[200]}`,
      overflow: "hidden",
    },

    padding: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8],
    },
  },

  input: {
    base: {
      width: "100%",
      height: "2.5rem",
      paddingX: spacing[3],
      paddingY: spacing[2],
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.tight,
      color: baseColors.gray[900],
      backgroundColor: baseColors.white,
      border: `1px solid ${baseColors.gray[300]}`,
      borderRadius: borderRadius.md,
      transition: animation.transition.colors,
      outline: "none",

      "&:focus": {
        borderColor: baseColors.primary[500],
        boxShadow: `0 0 0 3px ${baseColors.primary[50]}`,
      },

      "&:placeholder": {
        color: baseColors.gray[400],
      },
    },
  },
};

// Export complete design system
export const DESIGN_SYSTEM = {
  colors: baseColors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  animation,
  zIndex,
  components,
} as const;

// Export individual systems for granular imports
export {
  animation,
  borderRadius,
  boxShadow,
  baseColors as colors,
  components,
  spacing,
  typography,
  zIndex,
};

// Type definitions for TypeScript support
export type DesignSystem = typeof DESIGN_SYSTEM;
export type Colors = typeof baseColors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type BoxShadow = typeof boxShadow;
export type Animation = typeof animation;
export type ZIndex = typeof zIndex;
export type Components = typeof components;
