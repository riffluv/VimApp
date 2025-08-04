import {
  ButtonProps,
  Button as ChakraButton,
  IconButton,
} from "@chakra-ui/react";
import { forwardRef } from "react";

/**
 * Enhanced Button Component System
 *
 * Features:
 * - Type-safe variants and sizes
 * - Consistent design patterns
 * - Accessibility-first approach
 * - Performance optimized
 * - Future-ready patterns (V3 compatible)
 *
 * @see Design System: /src/constants/design-system.ts
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ButtonVariant =
  | "solid"
  | "ghost"
  | "outline"
  | "editorAction"
  | "editorPrimary"
  | "danger";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface EnhancedButtonProps
  extends Omit<ButtonProps, "variant" | "size"> {
  /** Button visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Full width button */
  isFullWidth?: boolean;
  /** Icon for the button */
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

// =============================================================================
// STYLE DEFINITIONS - Based on Design System
// =============================================================================

const buttonStyles = {
  // Base styles applied to all buttons
  base: {
    fontWeight: "semibold",
    borderRadius: "md",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    position: "relative" as const,
    overflow: "hidden",
    textDecoration: "none",
    userSelect: "none" as const,
    WebkitTapHighlightColor: "transparent",

    // Focus styles
    _focus: {
      outline: "none",
      boxShadow: "0 0 0 3px var(--chakra-colors-brand-focusRing)",
    },

    // Disabled styles
    _disabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none !important",
      boxShadow: "none !important",
    },

    // Loading styles
    _loading: {
      opacity: 0.8,
      cursor: "default",
    },
  },

  // Size variants
  sizes: {
    xs: {
      fontSize: "xs",
      h: 7,
      minW: 7,
      px: 3,
      py: 1.5,
    },
    sm: {
      fontSize: "sm",
      h: 9,
      minW: 9,
      px: 4,
      py: 2,
    },
    md: {
      fontSize: "md",
      h: 10,
      minW: 10,
      px: 6,
      py: 2.5,
    },
    lg: {
      fontSize: "lg",
      h: 12,
      minW: 12,
      px: 8,
      py: 3,
    },
  },

  // Visual variants
  variants: {
    solid: {
      bg: "brand.500",
      color: "white",
      border: "none",
      boxShadow: "0 2px 6px rgba(255, 107, 53, 0.3)",

      _hover: {
        bg: "brand.600",
        boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
        transform: "translateY(-1px)",
        _disabled: {
          bg: "brand.500",
          transform: "none",
        },
      },

      _active: {
        bg: "brand.700",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
        transform: "translateY(0)",
      },
    },

    ghost: {
      bg: "gray.700",
      color: "gray.100",
      border: "1px solid",
      borderColor: "gray.600",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",

      _hover: {
        bg: "gray.600",
        color: "gray.50",
        borderColor: "gray.500",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        transform: "translateY(-1px)",
        _disabled: {
          bg: "gray.700",
          transform: "none",
        },
      },

      _active: {
        bg: "gray.800",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
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
      bg: "transparent",
      color: "brand.500",
      border: "1px solid",
      borderColor: "brand.500",

      _hover: {
        bg: "brand.50",
        borderColor: "brand.600",
        boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
        transform: "translateY(-1px)",
        _dark: {
          bg: "brand.900",
        },
        _disabled: {
          bg: "transparent",
          transform: "none",
        },
      },

      _active: {
        bg: "brand.100",
        boxShadow: "inset 0 2px 4px rgba(255, 107, 53, 0.2)",
        transform: "translateY(0)",
        _dark: {
          bg: "brand.800",
        },
      },
    },

    editorAction: {
      bg: "gray.700",
      color: "gray.200",
      border: "1px solid",
      borderColor: "gray.600",
      minH: "2.25rem",
      px: 4,
      py: 2.5,
      fontSize: "sm",
      fontWeight: "medium",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",

      _hover: {
        bg: "gray.600",
        color: "gray.100",
        borderColor: "gray.500",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        transform: "translateY(-1px)",
        _disabled: {
          bg: "gray.700",
          transform: "none",
        },
      },

      _active: {
        bg: "gray.800",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
        transform: "translateY(0)",
      },
    },

    editorPrimary: {
      bg: "brand.500",
      color: "white",
      border: "none",
      minH: "2.25rem",
      px: 4,
      py: 2.5,
      fontSize: "sm",
      fontWeight: "semibold",
      boxShadow: "0 2px 6px rgba(255, 107, 53, 0.3)",

      _hover: {
        bg: "brand.600",
        boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
        transform: "translateY(-1px)",
        _disabled: {
          bg: "brand.500",
          transform: "none",
        },
      },

      _active: {
        bg: "brand.700",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
        transform: "translateY(0)",
      },
    },

    danger: {
      bg: "red.500",
      color: "white",
      border: "none",
      boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)",

      _hover: {
        bg: "red.600",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
        transform: "translateY(-1px)",
        _disabled: {
          bg: "red.500",
          transform: "none",
        },
      },

      _active: {
        bg: "red.700",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
        transform: "translateY(0)",
      },
    },
  },
};

// =============================================================================
// MAIN BUTTON COMPONENT
// =============================================================================

export const Button = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      variant = "solid",
      size = "md",
      isLoading = false,
      isDisabled = false,
      isFullWidth = false,
      leftIcon,
      rightIcon,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Combine styles
    const combinedStyles = {
      ...buttonStyles.base,
      ...buttonStyles.sizes[size],
      ...buttonStyles.variants[variant],
      ...(isFullWidth && { width: "100%" }),
      ...style,
    };

    return (
      <ChakraButton
        ref={ref}
        isLoading={isLoading}
        isDisabled={isDisabled}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        sx={combinedStyles}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";

// =============================================================================
// SPECIALIZED BUTTON COMPONENTS
// =============================================================================

/**
 * Editor Action Button - Optimized for editor toolbar
 */
export const EditorActionButton = forwardRef<
  HTMLButtonElement,
  Omit<EnhancedButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="editorAction" {...props} />);

EditorActionButton.displayName = "EditorActionButton";

/**
 * Editor Primary Button - Optimized for primary actions in editor
 */
export const EditorPrimaryButton = forwardRef<
  HTMLButtonElement,
  Omit<EnhancedButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="editorPrimary" {...props} />);

EditorPrimaryButton.displayName = "EditorPrimaryButton";

/**
 * Secondary Button - Ghost variant with semantic naming
 */
export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  Omit<EnhancedButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="ghost" {...props} />);

SecondaryButton.displayName = "SecondaryButton";

/**
 * Danger Button - For destructive actions
 */
export const DangerButton = forwardRef<
  HTMLButtonElement,
  Omit<EnhancedButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="danger" {...props} />);

DangerButton.displayName = "DangerButton";

// =============================================================================
// MODE TAB BUTTON - Specialized for editor mode switching
// =============================================================================

export interface ModeTabButtonProps
  extends Omit<ButtonProps, "variant" | "size"> {
  /** Whether this tab is currently active */
  isActive?: boolean;
  /** The mode name to display */
  children: React.ReactNode;
}

export const ModeTabButton = forwardRef<HTMLButtonElement, ModeTabButtonProps>(
  ({ isActive = false, children, ...props }, ref) => {
    const tabStyles = {
      px: 4,
      py: 2,
      fontSize: "sm",
      fontWeight: isActive ? "semibold" : "medium",
      borderRadius: "md",
      transition: "all 0.2s ease",
      position: "relative" as const,

      // Base styles
      bg: isActive ? "brand.500" : "transparent",
      color: isActive ? "white" : "gray.400",
      border: "1px solid",
      borderColor: isActive ? "brand.500" : "gray.600",

      // Hover styles
      _hover: {
        bg: isActive ? "brand.600" : "gray.700",
        color: isActive ? "white" : "gray.200",
        borderColor: isActive ? "brand.600" : "gray.500",
        transform: "translateY(-1px)",
      },

      // Active press styles
      _active: {
        transform: "translateY(0)",
      },

      // Focus styles
      _focus: {
        outline: "none",
        boxShadow: `0 0 0 2px ${
          isActive ? "rgba(255, 107, 53, 0.4)" : "rgba(156, 163, 175, 0.4)"
        }`,
      },

      // Disabled styles
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
        transform: "none !important",
      },
    };

    return (
      <ChakraButton
        ref={ref}
        sx={tabStyles}
        aria-pressed={isActive}
        role="tab"
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

ModeTabButton.displayName = "ModeTabButton";

// =============================================================================
// ICON BUTTON WRAPPER
// =============================================================================

export interface EnhancedIconButtonProps
  extends Omit<ButtonProps, "variant" | "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon: React.ReactElement;
  "aria-label": string;
}

export const EnhancedIconButton = forwardRef<
  HTMLButtonElement,
  EnhancedIconButtonProps
>(({ variant = "ghost", size = "md", icon, ...props }, ref) => {
  const iconButtonStyles = {
    ...buttonStyles.base,
    ...buttonStyles.sizes[size],
    ...buttonStyles.variants[variant],
    minW: buttonStyles.sizes[size].h, // Make it square
    p: 0, // Remove padding for icon-only button
  };

  return <IconButton ref={ref} icon={icon} sx={iconButtonStyles} {...props} />;
});

EnhancedIconButton.displayName = "EnhancedIconButton";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get button styles for a specific variant and size
 */
export function getButtonStyles(variant: ButtonVariant, size: ButtonSize) {
  return {
    ...buttonStyles.base,
    ...buttonStyles.sizes[size],
    ...buttonStyles.variants[variant],
  };
}

/**
 * Check if a variant is a primary style (has solid background)
 */
export function isPrimaryVariant(variant: ButtonVariant): boolean {
  return ["solid", "editorPrimary", "danger"].includes(variant);
}

/**
 * Get appropriate text color for button variant
 */
export function getButtonTextColor(variant: ButtonVariant): string {
  const primaryVariants = ["solid", "editorPrimary", "danger"];
  return primaryVariants.includes(variant) ? "white" : "current";
}

// =============================================================================
// EXPORTS
// =============================================================================

export { Button as default, type EnhancedButtonProps as ButtonProps };
