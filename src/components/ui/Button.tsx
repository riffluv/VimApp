"use client";

import { DESIGN_SYSTEM } from "@/constants";
import type { ComponentProps } from "react";
import { forwardRef, useCallback, useState } from "react";

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
      onClick,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      style,
      ...rest
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isLoading) return;
        setIsPressed(true);
        onMouseDown?.(e);
      },
      [disabled, isLoading, onMouseDown]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsPressed(false);
        onMouseUp?.(e);
      },
      [onMouseUp]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsPressed(false);
        onMouseLeave?.(e);
      },
      [onMouseLeave]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isLoading) return;
        setIsPressed(false);
        onClick?.(e);
      },
      [disabled, isLoading, onClick]
    );

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

      const pressedTransform =
        isPressed && !disabled && !isLoading
          ? "translateY(1px) translateZ(0)"
          : "translateZ(0)";

      const pressedBoxShadow =
        isPressed && !disabled && !isLoading
          ? "0 1px 3px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)"
          : "boxShadow" in variantConfig
          ? variantConfig.boxShadow
          : "none";

      return {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        outline: "none",
        textDecoration: "none",
        userSelect: "none" as const,
        WebkitUserSelect: "none" as const,
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
        transform: pressedTransform,
        boxShadow: pressedBoxShadow,
        backdropFilter:
          "backdropFilter" in variantConfig
            ? variantConfig.backdropFilter
            : "none",
        transition: isPressed
          ? `all ${DESIGN_SYSTEM.animation.duration.fastest} ${DESIGN_SYSTEM.animation.easing.sharp}`
          : `all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
        backfaceVisibility: "hidden" as const,
        isolation: "isolate" as const,
        willChange: "transform, box-shadow",
        opacity: disabled && !isLoading ? 0.6 : 1,
        gap: DESIGN_SYSTEM.spacing["1"],
        ...style,
      };
    };

    const buttonStyles = getButtonStyles();
    const variantConfig =
      DESIGN_SYSTEM.components.button.variants[
        variant as keyof typeof DESIGN_SYSTEM.components.button.variants
      ];

    const hoverStyles =
      !disabled && !isLoading && !isPressed
        ? {
            backgroundColor:
              variant === "ghost" ? "rgba(255, 107, 53, 0.12)" : undefined,
            transform: "translateY(-1px) translateZ(0)",
            boxShadow:
              variant === "solid"
                ? "0 6px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                : "0 4px 12px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }
        : {};

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        style={buttonStyles}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading && !isPressed) {
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.backgroundColor = variantConfig.bg;
            e.currentTarget.style.transform = isPressed
              ? "translateY(1px) translateZ(0)"
              : "translateZ(0)";
            e.currentTarget.style.boxShadow = isPressed
              ? "0 1px 3px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)"
              : "boxShadow" in variantConfig
              ? variantConfig.boxShadow
              : "none";
          }
          handleMouseLeave(e);
        }}
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
>(({ isActive, children, onClick, style, ...props }, ref) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      setIsPressed(true);
      props.onMouseDown?.(e);
    },
    [props.disabled, props.onMouseDown]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e);
    },
    [props.onMouseUp]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseLeave?.(e);
    },
    [props.onMouseLeave]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      setIsPressed(false);
      onClick?.(e);
    },
    [props.disabled, onClick]
  );

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
    position: "relative" as const,
    minHeight: "2rem",
    maxHeight: "2rem",
    padding: "0.25rem 0.75rem",
    transform: isPressed ? "translateY(0.5px) translateZ(0)" : "translateZ(0)",
    boxShadow: isPressed
      ? "0 1px 3px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1)"
      : isActive
      ? "0 2px 8px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      : "0 1px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(6px)",
    transition: isPressed
      ? `all ${DESIGN_SYSTEM.animation.duration.fastest} ${DESIGN_SYSTEM.animation.easing.sharp}`
      : `all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
    ...style,
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      style={tabStyles}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
});

ModeTabButton.displayName = "ModeTabButton";

export default Button;
