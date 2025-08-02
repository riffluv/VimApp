"use client";

import { DESIGN_SYSTEM } from "@/constants";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

export type ButtonVariant = "solid" | "ghost" | "outline" | "editorAction";
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
      ...rest
    },
    ref
  ) => {
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

      return {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        outline: "none",
        userSelect: "none" as const,
        fontFamily: "inherit",
        fontSize: sizeConfig.fontSize,
        padding: `${paddingValues.py} ${paddingValues.px}`,
        minHeight: sizeConfig.minHeight,
        lineHeight: sizeConfig.lineHeight,
        width: isFullWidth ? "100%" : "auto",
        backgroundColor: variantConfig.bg,
        color: variantConfig.color,
        borderWidth: variantConfig.border !== "none" ? "1px" : "0",
        borderColor:
          variantConfig.border !== "none" &&
          variantConfig.border.includes("solid")
            ? variantConfig.border.split(" ")[3]
            : "transparent",
        borderStyle: variantConfig.border !== "none" ? "solid" : "none",
        borderRadius: DESIGN_SYSTEM.borders.radius.md,
        transition: "all 0.2s ease",
        opacity: disabled && !isLoading ? 0.6 : 1,
        gap: DESIGN_SYSTEM.spacing["1"],
        ...style,
      };
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        style={getButtonStyles()}
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
  const tabStyles = {
    backgroundColor: isActive
      ? "rgba(255, 107, 53, 0.15)"
      : "rgba(30, 30, 30, 0.6)",
    color: isActive
      ? DESIGN_SYSTEM.colors.accent.primary
      : DESIGN_SYSTEM.colors.text.tertiary,
    borderColor: isActive
      ? "rgba(255, 107, 53, 0.4)"
      : "rgba(255, 255, 255, 0.08)",
    borderWidth: "1px",
    borderStyle: "solid",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    minHeight: "2rem",
    maxHeight: "2rem",
    padding: "0.25rem 0.75rem",
    transition: "all 0.2s ease",
    ...style,
  };

  return (
    <Button ref={ref} variant="ghost" size="sm" style={tabStyles} {...props}>
      {children}
    </Button>
  );
});

ModeTabButton.displayName = "ModeTabButton";

export default Button;
