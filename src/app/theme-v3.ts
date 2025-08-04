import { createSystem, defaultConfig } from "@chakra-ui/react";

/**
 * VimApp Design System - Enhanced Chakra UI v3 Implementation
 *
 * Features:
 * - Semantic token system for consistent theming
 * - Color palette with automatic dark mode support
 * - Type-safe design tokens
 * - Performance optimized theme
 * - Accessibility-first design
 *
 * Compatible with Chakra UI v3
 * @see https://www.chakra-ui.com/docs/theming/theme
 */

// =============================================================================
// THEME EXPORT - Chakra UI v3 System
// =============================================================================

const enhancedTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Brand Colors - Orange Theme
        brand: {
          50: { value: "#fff8f1" },
          100: { value: "#feecdc" },
          200: { value: "#fcd9bd" },
          300: { value: "#fdba8c" },
          400: { value: "#ff8757" },
          500: { value: "#ff6b35" }, // Primary brand color
          600: { value: "#ff4500" },
          700: { value: "#e63900" },
          800: { value: "#c73100" },
          900: { value: "#9c2a00" },
          950: { value: "#7a1f00" },
        },

        // Gray Scale - Rich Black System
        gray: {
          50: { value: "#ffffff" },
          100: { value: "#f8f8f8" },
          200: { value: "#e8e8e8" },
          300: { value: "#c4c4c4" },
          400: { value: "#9a9a9a" },
          500: { value: "#6b6b6b" },
          600: { value: "#4a4a4a" },
          700: { value: "#2a2a2a" },
          800: { value: "#1e1e1e" },
          900: { value: "#141414" },
          950: { value: "#0a0a0a" }, // Primary background
        },

        // Status Colors - Harmonized with brand
        green: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#10b981" }, // Success
          600: { value: "#059669" },
          700: { value: "#047857" },
          800: { value: "#065f46" },
          900: { value: "#064e3b" },
          950: { value: "#022c22" },
        },

        red: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#ef4444" }, // Error
          600: { value: "#dc2626" },
          700: { value: "#b91c1c" },
          800: { value: "#991b1b" },
          900: { value: "#7f1d1d" },
          950: { value: "#450a0a" },
        },

        amber: {
          50: { value: "#fffbeb" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" },
          500: { value: "#f59e0b" }, // Warning
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
          950: { value: "#451a03" },
        },

        blue: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" }, // Info
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
          950: { value: "#172554" },
        },
      },
      fonts: {
        heading: {
          value:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        body: {
          value:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        mono: { value: "JetBrains Mono, Fira Code, Monaco, monospace" },
      },
    },
    semanticTokens: {
      colors: {
        // Surface colors
        bg: {
          canvas: {
            value: { base: "{colors.gray.50}", _dark: "{colors.gray.950}" },
          },
          default: { value: { base: "white", _dark: "{colors.gray.900}" } },
          subtle: {
            value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
          },
          muted: {
            value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
          },
          emphasized: {
            value: { base: "{colors.gray.300}", _dark: "{colors.gray.600}" },
          },
        },

        // Text colors
        fg: {
          default: {
            value: { base: "{colors.gray.900}", _dark: "{colors.gray.100}" },
          },
          muted: {
            value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
          },
          subtle: {
            value: { base: "{colors.gray.500}", _dark: "{colors.gray.500}" },
          },
          disabled: {
            value: { base: "{colors.gray.400}", _dark: "{colors.gray.600}" },
          },
        },

        // Border colors
        border: {
          default: {
            value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
          },
          muted: {
            value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
          },
          subtle: {
            value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" },
          },
        },

        // Brand semantic tokens
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "white" },
          fg: {
            value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" },
          },
          muted: {
            value: { base: "{colors.brand.100}", _dark: "{colors.brand.900}" },
          },
          subtle: {
            value: { base: "{colors.brand.50}", _dark: "{colors.brand.950}" },
          },
          emphasized: {
            value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" },
          },
          focusRing: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" },
          },
        },
      },
    },
  },
});

export default enhancedTheme;
