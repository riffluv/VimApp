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

      // paddingを適切に解析
      const getPaddingValues = (padding: string) => {
        const parts = padding.split(" ");
        return {
          py: parts[0] || "0.5rem",
          px: parts[1] || parts[0] || "0.75rem",
        };
      };

      const paddingValues = getPaddingValues(sizeConfig.padding);

      return {
        // 基本スタイル
        fontFamily: DESIGN_SYSTEM.typography.fonts.sans,
        fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
        borderRadius: DESIGN_SYSTEM.borders.radius.md,
        cursor: disabled || isLoading ? "not-allowed" : "pointer",

        // サイズ設定（Chakra UI v3形式）
        fontSize: sizeConfig.fontSize,
        px: paddingValues.px,
        py: paddingValues.py,
        minH: sizeConfig.minHeight, // 最小高さを確実に設定
        lineHeight: sizeConfig.lineHeight,

        // Variant設定
        bg: variantConfig.bg,
        color: variantConfig.color,
        borderWidth: variantConfig.border !== "none" ? "1px" : "0",
        borderColor:
          variantConfig.border !== "none" ? "transparent" : undefined,
        borderStyle: variantConfig.border !== "none" ? "solid" : undefined,

        // ホバー効果
        _hover: disabled || isLoading ? {} : variantConfig._hover,
        _active: disabled || isLoading ? {} : variantConfig._active,

        // パフォーマンス最適化
        isolation: "isolate",
        position: "relative",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        transition: `all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`,

        // 無効状態
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

// エディタアクションボタン
export const EditorActionButton = forwardRef<
  HTMLButtonElement,
  ButtonProps // variant プロパティを許可
>((props, ref) => (
  <Button
    ref={ref}
    variant="ghost" // デフォルトvariant
    size="sm"
    // 確実にサイズを強制
    minH="2.25rem"
    px="0.75rem"
    py="0.5rem"
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

// モードタブボタン（特殊なスタイリング）
export const ModeTabButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant"> & { isActive: boolean }
>(({ isActive, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    // Chakra UI v3 対応 - styleではなくpropsで設定
    bg={isActive ? DESIGN_SYSTEM.colors.bg.surface : "transparent"}
    color={
      isActive
        ? DESIGN_SYSTEM.colors.accent.secondary
        : DESIGN_SYSTEM.colors.text.muted
    }
    borderColor={
      isActive
        ? DESIGN_SYSTEM.borders.colors.secondary
        : DESIGN_SYSTEM.borders.colors.subtle
    }
    textTransform="uppercase"
    letterSpacing="0.05em"
    fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
    fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
    fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
    position="relative"
    // サイズ保証
    minH="1.875rem"
    px="0.625rem"
    py="0.3125rem"
    _hover={{
      backgroundColor: DESIGN_SYSTEM.colors.bg.surface,
      color: isActive
        ? DESIGN_SYSTEM.colors.accent.primary
        : DESIGN_SYSTEM.colors.accent.secondary,
      borderColor: isActive
        ? DESIGN_SYSTEM.borders.colors.primary
        : DESIGN_SYSTEM.borders.colors.secondary,
      transform: "translateY(-1px) translateZ(0)",
    }}
    // アクティブ状態の下線
    _after={
      isActive
        ? {
            content: '""',
            position: "absolute",
            bottom: "-1px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "2px",
            backgroundColor: DESIGN_SYSTEM.colors.accent.secondary,
            borderRadius: "1px",
          }
        : undefined
    }
    {...props}
  >
    {children}
  </Button>
));

ModeTabButton.displayName = "ModeTabButton";

export default Button;
