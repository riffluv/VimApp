import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

/**
 * VimApp Design System - Enhanced Chakra UI Implementation
 *
 * Features:
 * - Semantic token system for consistent theming
 * - Color palette with automatic dark mode support
 * - Type-safe design tokens
 * - Performance optimized theme
 * - Accessibility-first design
 *
 * Compatible with Chakra UI v2 with v3-ready patterns
 * @see https://www.chakra-ui.com/docs/theming/theme
 */

// =============================================================================
// COLOR PALETTE SYSTEM - Chakra v3 Semantic Tokens
// =============================================================================

const colors = {
  // Brand Colors - Orange Theme
  brand: {
    50: "#fff8f1",
    100: "#feecdc",
    200: "#fcd9bd",
    300: "#fdba8c",
    400: "#ff8757",
    500: "#ff6b35", // Primary brand color
    600: "#ff4500",
    700: "#e63900",
    800: "#c73100",
    900: "#9c2a00",
    950: "#7a1f00",
  },

  // Gray Scale - Rich Black System
  gray: {
    50: "#ffffff",
    100: "#f8f8f8",
    200: "#e8e8e8",
    300: "#c4c4c4",
    400: "#9a9a9a",
    500: "#6b6b6b",
    600: "#4a4a4a",
    700: "#2a2a2a",
    800: "#1e1e1e",
    900: "#141414",
    950: "#0a0a0a", // Primary background
  },

  // Status Colors - Harmonized with brand
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#10b981", // Success
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },

  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Error
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Warning
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },

  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Info
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
};

// =============================================================================
// SEMANTIC TOKEN SYSTEM - V3-Ready Implementation
// =============================================================================

const semanticTokens = {
  colors: {
    // Surface colors
    bg: {
      canvas: {
        default: "gray.50",
        _dark: "gray.950",
      },
      default: {
        default: "white",
        _dark: "gray.900",
      },
      subtle: {
        default: "gray.100",
        _dark: "gray.800",
      },
      muted: {
        default: "gray.200",
        _dark: "gray.700",
      },
      emphasized: {
        default: "gray.300",
        _dark: "gray.600",
      },
    },

    // Text colors
    fg: {
      default: {
        default: "gray.900",
        _dark: "gray.100",
      },
      muted: {
        default: "gray.600",
        _dark: "gray.400",
      },
      subtle: {
        default: "gray.500",
        _dark: "gray.500",
      },
      disabled: {
        default: "gray.400",
        _dark: "gray.600",
      },
    },

    // Border colors
    border: {
      default: {
        default: "gray.200",
        _dark: "gray.700",
      },
      muted: {
        default: "gray.100",
        _dark: "gray.800",
      },
      subtle: {
        default: "gray.50",
        _dark: "gray.900",
      },
    },

    // Brand semantic tokens
    brand: {
      solid: "brand.500",
      contrast: "white",
      fg: {
        default: "brand.600",
        _dark: "brand.400",
      },
      muted: {
        default: "brand.100",
        _dark: "brand.900",
      },
      subtle: {
        default: "brand.50",
        _dark: "brand.950",
      },
      emphasized: {
        default: "brand.600",
        _dark: "brand.300",
      },
      focusRing: {
        default: "brand.500",
        _dark: "brand.400",
      },
    },
  },
};

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

const fonts = {
  heading: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "JetBrains Mono, Fira Code, Monaco, monospace",
};

const fontSizes = {
  "2xs": "0.625rem", // 10px
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  md: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
  "8xl": "6rem", // 96px
  "9xl": "8rem", // 128px
};

const fontWeights = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

// =============================================================================
// SPACING & SIZING SYSTEM
// =============================================================================

const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
};

// =============================================================================
// BORDER SYSTEM
// =============================================================================

const radii = {
  none: "0",
  sm: "0.125rem",
  base: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

const borders = {
  none: "0",
  "1px": "1px solid",
  "2px": "2px solid",
  "4px": "4px solid",
  "8px": "8px solid",
};

// =============================================================================
// ANIMATION SYSTEM
// =============================================================================

const transition = {
  property: {
    common:
      "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
    colors: "background-color, border-color, color, fill, stroke",
    dimensions: "width, height",
    position: "left, right, top, bottom",
    background: "background-color, background-image, background-position",
  },
  easing: {
    "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
    "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  duration: {
    "ultra-fast": "50ms",
    faster: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    "ultra-slow": "1000ms",
  },
};

// =============================================================================
// BREAKPOINTS - Mobile First Design
// =============================================================================

const breakpoints = {
  base: "0em", // 0px
  sm: "30em", // 480px
  md: "48em", // 768px
  lg: "62em", // 992px
  xl: "80em", // 1280px
  "2xl": "96em", // 1536px
};

// =============================================================================
// THEME CONFIGURATION - Chakra UI Enhanced
// =============================================================================

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
  disableTransitionOnChange: false,
};

const styles = {
  global: (props: any) => ({
    // CSS Custom Properties for better performance
    ":root": {
      "--chakra-vh": "100vh",
      "--chakra-space-4": "1rem",
      "--chakra-colors-brand-500": colors.brand[500],
    },

    // Base styles
    "*": {
      borderColor: "gray.200",
      _dark: {
        borderColor: "gray.700",
      },
    },

    html: {
      lineHeight: 1.5,
      textRendering: "optimizeLegibility",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      WebkitTextSizeAdjust: "100%",
      scrollBehavior: "smooth",
    },

    body: {
      fontFamily: "body",
      bg: props.colorMode === "dark" ? "gray.950" : "gray.50",
      color: props.colorMode === "dark" ? "gray.100" : "gray.900",
      minHeight: "100vh",
      overflowX: "hidden",
    },

    // Focus styles
    "*:focus-visible": {
      outline: "2px solid",
      outlineColor: "brand.500",
      outlineOffset: "2px",
    },

    // Selection styles
    "::selection": {
      backgroundColor: "brand.100",
      color: "brand.600",
      _dark: {
        backgroundColor: "brand.900",
        color: "brand.400",
      },
    },

    // Scrollbar styles
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-track": {
      bg: props.colorMode === "dark" ? "gray.800" : "gray.100",
    },
    "::-webkit-scrollbar-thumb": {
      bg: props.colorMode === "dark" ? "gray.700" : "gray.200",
      borderRadius: "md",
    },
    "::-webkit-scrollbar-thumb:hover": {
      bg: props.colorMode === "dark" ? "gray.600" : "gray.300",
    },
  }),
};

// =============================================================================
// COMPONENT STYLES - Enhanced with Semantic Patterns
// =============================================================================

const components = {
  Button: {
    baseStyle: {
      fontWeight: "semibold",
      borderRadius: "md",
      transition: "all 0.2s",
      _focus: {
        outline: "none",
        boxShadow: "0 0 0 3px",
        boxShadowColor: "brand.500",
      },
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
          transform: "translateY(-1px)",
          boxShadow: "md",
        },
        _active: {
          bg: "brand.700",
          transform: "translateY(0)",
        },
      },
      ghost: {
        bg: "gray.700",
        color: "gray.100",
        border: "1px solid",
        borderColor: "gray.600",
        _hover: {
          bg: "gray.600",
          borderColor: "gray.500",
          transform: "translateY(-1px)",
        },
        _active: {
          bg: "gray.800",
          transform: "translateY(0)",
        },
        _dark: {
          bg: "gray.700",
          color: "gray.100",
          borderColor: "gray.600",
          _hover: {
            bg: "gray.600",
            borderColor: "gray.500",
          },
          _active: {
            bg: "gray.800",
          },
        },
      },
      outline: {
        border: "1px solid",
        borderColor: "brand.500",
        color: "brand.500",
        _hover: {
          bg: "brand.50",
          _dark: {
            bg: "brand.900",
          },
        },
      },
    },
    sizes: {
      sm: {
        fontSize: "sm",
        px: 3,
        py: 2,
        minH: 8,
      },
      md: {
        fontSize: "md",
        px: 4,
        py: 2.5,
        minH: 10,
      },
      lg: {
        fontSize: "lg",
        px: 6,
        py: 3,
        minH: 12,
      },
    },
  },

  Box: {
    baseStyle: {
      position: "relative",
    },
  },

  Text: {
    baseStyle: {
      lineHeight: "normal",
    },
  },

  Heading: {
    baseStyle: {
      fontFamily: "heading",
      fontWeight: "bold",
      lineHeight: "tight",
    },
  },
};

// =============================================================================
// THEME EXPORT - Chakra UI Enhanced System
// =============================================================================

const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  space: spacing,
  radii,
  borders,
  breakpoints,
  transition,
  styles,
  components,
  semanticTokens,
});

export default theme;

// =============================================================================
// TYPE EXPORTS - TypeScript Support
// =============================================================================

export type ThemeColor = keyof typeof colors;
export type SemanticToken = keyof typeof semanticTokens.colors;
export type FontSize = keyof typeof fontSizes;
export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radii;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get semantic token value with type safety
 */
export function getSemanticToken(token: SemanticToken): string {
  return `var(--chakra-colors-${token.replace(".", "-")})`;
}

/**
 * Create color palette with automatic dark mode
 */
export function createColorPalette(baseColor: ThemeColor) {
  return {
    solid: `${baseColor}.500`,
    contrast: "white",
    fg: { base: `${baseColor}.600`, _dark: `${baseColor}.400` },
    muted: { base: `${baseColor}.100`, _dark: `${baseColor}.900` },
    subtle: { base: `${baseColor}.50`, _dark: `${baseColor}.950` },
    emphasized: { base: `${baseColor}.600`, _dark: `${baseColor}.300` },
    focusRing: { base: `${baseColor}.500`, _dark: `${baseColor}.400` },
  };
}

/**
 * Responsive value helper
 */
export function responsive<T>(values: Record<string, T>) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value])
  );
}
