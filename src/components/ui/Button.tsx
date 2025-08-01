"use client";

import { Button as ChakraButton } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

import { DESIGN_SYSTEM } from "@/constants";

/**
 * Button Component Types
 *
 * 2025年製品化レベル - 最高の拡張性とパフォーマンス
 */
export type ButtonVariant = "solid" | "ghost" | "outline" | "editorAction";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ComponentProps<typeof ChakraButton>, "variant" | "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

/**
 * 最適化されたボタンコンポーネント
 *
 * Features:
 * - 2025年CSS最適化（GPU accelerated, CSS isolation）
 * - 完全型安全
 * - 拡張性の高いvariant/sizeシステム
 * - アクセシビリティ準拠
 * - パフォーマンス最適化
 */
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
      ...rest
    },
    ref
  ) => {
    // Chakra UI v3対応：直接プロパティを設定
    const getButtonStyles = () => {
      const sizeConfig = DESIGN_SYSTEM.components.button.sizes[size];
      const variantConfig = DESIGN_SYSTEM.components.button.variants[variant];
      const getPaddingValues = (padding: string) => {
        const parts = padding.split(" ");
        return {
          py: parts[0] || "0.5rem",
          px: parts[1] || parts[0] || "0.75rem",
        };
      };
      const paddingValues = getPaddingValues(sizeConfig.padding);
      return {
        fontFamily: DESIGN_SYSTEM.typography.fonts.sans,
        fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
        borderRadius: DESIGN_SYSTEM.borders.radius.md,
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        fontSize: sizeConfig.fontSize,
        px: paddingValues.px,
        py: paddingValues.py,
        minH: sizeConfig.minHeight,
        lineHeight: sizeConfig.lineHeight,
        bg: variantConfig.bg,
        color: variantConfig.color,
        borderWidth: variantConfig.border !== "none" ? "1px" : "0",
        borderColor: variantConfig.border !== "none" ? "#d1bfa3" : undefined,
        borderStyle: variantConfig.border !== "none" ? "solid" : undefined,
        // 控えめなhover/active
        _hover:
          disabled || isLoading
            ? {}
            : {
                bg: "#f5e9d7",
                color: variantConfig.color,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              },
        _active:
          disabled || isLoading
            ? {}
            : { bg: "#e9dcc3", color: variantConfig.color },
        isolation: "isolate",
        position: "relative",
        transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
        opacity: disabled && !isLoading ? 0.6 : 1,
      };
    };

    return (
      <ChakraButton
        ref={ref}
        variant="plain" // Chakra UI v3でのプレーンスタイル
        disabled={disabled || isLoading}
        width={isFullWidth ? "100%" : "auto"}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        gap={DESIGN_SYSTEM.spacing["1"]}
        // アクセシビリティ
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        // カスタムスタイルを適用
        {...getButtonStyles()}
        // restを最後に適用してユーザーのカスタマイズを許可
        {...rest}
      >
        {/* Left Icon */}
        {leftIcon && !isLoading && leftIcon}

        {/* Loading Spinner - 簡易実装 */}
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

        {/* Button Text */}
        <span>{isLoading && loadingText ? loadingText : children}</span>

        {/* Right Icon */}
        {rightIcon && !isLoading && rightIcon}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";

/**
 * 特化型ボタンコンポーネント群
 * 使用頻度の高いパターンを事前定義
 */

// エディタアクションボタン（2025年スタイルの3D効果付き）
export const EditorActionButton = forwardRef<
  HTMLButtonElement,
  ButtonProps // variant プロパティを許可
>((props, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    minH="2.25rem"
    px="0.75rem"
    py="0.5rem"
    position="relative"
    borderColor="#d1bfa3"
    fontWeight="500"
    fontSize="sm"
    letterSpacing="0.01em"
    _hover={{
      bg: "#f5e9d7",
      color: "#a67c52",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}
    _active={{ bg: "#e9dcc3", color: "#a67c52" }}
    {...props}
  />
));

EditorActionButton.displayName = "EditorActionButton";

// プライマリアクションボタン
export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="solid" size="md" {...props} />);

PrimaryButton.displayName = "PrimaryButton";

// セカンダリアクションボタン
export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="ghost" size="sm" {...props} />);

SecondaryButton.displayName = "SecondaryButton";

// モードタブボタン（2025年レベルの3D効果付き特殊スタイリング）
export const ModeTabButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant"> & { isActive: boolean }
>(({ isActive, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    bg={isActive ? "#f5e9d7" : "transparent"}
    color={isActive ? "#a67c52" : "#b0a18f"}
    borderColor={isActive ? "#d1bfa3" : "#e5e0d6"}
    textTransform="uppercase"
    letterSpacing="0.05em"
    fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
    fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
    fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
    position="relative"
    minH="2rem"
    maxH="2rem"
    px="0.75rem"
    py="0.25rem"
    _hover={{ bg: "#f5e9d7", color: "#a67c52" }}
    _active={{ bg: "#e9dcc3", color: "#a67c52" }}
    {...props}
  >
    {children}
  </Button>
));

ModeTabButton.displayName = "ModeTabButton";

export default Button;
