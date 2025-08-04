"use client";

import type { ComponentProps } from "react";
import { forwardRef, useState } from "react";
import { DESIGN_SYSTEM } from "../../constants";

export type ButtonVariant =
  | "solid"
  | "ghost"
  | "outline"
  | "editorAction"
  | "editorPrimary";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "ghost",
      size = "sm",
      isFullWidth = false,
      children,
      disabled,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...rest
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const getButtonStyles = () => {
      const sizeConfig =
        DESIGN_SYSTEM.components.button.sizes[
          size as keyof typeof DESIGN_SYSTEM.components.button.sizes
        ];
      const variantConfig =
        DESIGN_SYSTEM.components.button.variants[
          variant as keyof typeof DESIGN_SYSTEM.components.button.variants
        ];

      const getPaddingValues = (padding: string) => {
        const parts = padding.split(" ");
        return {
          py: parts[0] || "0.5rem",
          px: parts[1] || parts[0] || "0.75rem",
        };
      };

      const paddingValues = getPaddingValues(sizeConfig.padding);

      // Clean professional button styles
      const baseStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        outline: "none",
        userSelect: "none" as const,
        fontFamily: DESIGN_SYSTEM.typography.fonts.sans,
        fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
        fontSize: sizeConfig.fontSize,
        padding: `${paddingValues.py} ${paddingValues.px}`,
        minHeight: sizeConfig.minHeight,
        width: isFullWidth ? "100%" : "auto",
        borderRadius:
          sizeConfig.borderRadius || DESIGN_SYSTEM.borders.radius.md,
        transition: "all 0.2s ease",
        opacity: disabled && !isLoading ? 0.5 : 1,
        gap: DESIGN_SYSTEM.spacing["2"],
        ...style,
      };

      // Get current state styles
      const getCurrentStyles = () => {
        let currentBg = variantConfig.bg;
        let currentColor = variantConfig.color;
        let currentBorder = variantConfig.border;

        // Apply hover styles
        if (isHovered && !disabled && !isLoading) {
          const hoverConfig = (variantConfig as any)._hover;
          if (hoverConfig) {
            currentBg = hoverConfig.bg || currentBg;
            currentColor = hoverConfig.color || currentColor;
            currentBorder = hoverConfig.border || currentBorder;
          }
        }

        // Apply active/pressed styles (override hover)
        if (isPressed && !disabled && !isLoading) {
          const activeConfig = (variantConfig as any)._active;
          if (activeConfig) {
            currentBg = activeConfig.bg || currentBg;
            currentColor = activeConfig.color || currentColor;
            currentBorder = activeConfig.border || currentBorder;
          }
        }

        return {
          background: currentBg,
          color: currentColor,
          border: currentBorder || "none",
          minHeight: (variantConfig as any).minHeight || sizeConfig.minHeight,
          padding:
            (variantConfig as any).padding ||
            `${paddingValues.py} ${paddingValues.px}`,
          fontSize: (variantConfig as any).fontSize || sizeConfig.fontSize,
          fontWeight:
            (variantConfig as any).fontWeight ||
            DESIGN_SYSTEM.typography.fontWeight.medium,
          borderRadius:
            (variantConfig as any).borderRadius ||
            DESIGN_SYSTEM.borders.radius.md,
        };
      };

      return {
        ...baseStyles,
        ...getCurrentStyles(),
      };
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      setIsPressed(false);
      onMouseLeave?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onMouseUp?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        style={getButtonStyles()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...rest}
      >
        {leftIcon && !isLoading && leftIcon}
        {isLoading && (
          <span
            style={{
              display: "inline-block",
              width: "1em",
              height: "1em",
              border: "2px solid currentColor",
              borderRadius: "50%",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
            }}
            aria-hidden="true"
          />
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {rightIcon && !isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export const EditorActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button ref={ref} variant="editorAction" size="sm" {...props} />
  )
);

EditorActionButton.displayName = "EditorActionButton";

export const EditorPrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button ref={ref} variant="editorPrimary" size="sm" {...props} />
  )
);

EditorPrimaryButton.displayName = "EditorPrimaryButton";

export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="solid" size="md" {...props} />);

PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="ghost" size="sm" {...props} />);

SecondaryButton.displayName = "SecondaryButton";

export const ModeTabButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant"> & { isActive: boolean }
>(({ isActive, children, style, ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = {
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    fontWeight: isActive ? "600" : "500",
    minHeight: "2.25rem",
    maxHeight: "2.25rem",
    padding: "0.375rem 1rem",
    borderRadius: DESIGN_SYSTEM.borders.radius.md,
    transition: "all 0.2s ease",
    cursor: "pointer",
    outline: "none",
    userSelect: "none" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  const getStateStyles = () => {
    if (isActive) {
      return {
        background: "rgba(255, 138, 101, 0.15)",
        color: "#ff8a65",
        border: "1px solid rgba(255, 138, 101, 0.3)",
      };
    }

    if (isHovered) {
      return {
        background: "#2a2a2a",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      };
    }

    return {
      background: "#1e1e1e",
      color: "#c4c4c4",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    };
  };

  return (
    <button
      ref={ref}
      type="button"
      style={{ ...baseStyles, ...getStateStyles() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  );
});

ModeTabButton.displayName = "ModeTabButton";

export default Button;
