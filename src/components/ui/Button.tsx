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
 * 最適化されたボタンコンポーネント - 2025年プレミアム3D効果対応
 *
 * Features:
 * - 2025年CSS最適化（GPU accelerated, CSS isolation）
 * - プレミアム3D押し込み効果
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
    // Chakra UI v3対応：デザインシステムから直接スタイルを取得
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
        // 基本スタイル（デザインシステムから - プレミアム3D効果対応）
        ...DESIGN_SYSTEM.components.button.base,

        // サイズ設定
        fontSize: sizeConfig.fontSize,
        px: paddingValues.px,
        py: paddingValues.py,
        minH: sizeConfig.minHeight,
        lineHeight: sizeConfig.lineHeight,

        // バリアント設定（プレミアム3D効果付き）
        bg: variantConfig.bg,
        color: variantConfig.color,
        borderWidth: variantConfig.border !== "none" ? "1px" : "0",
        borderColor:
          variantConfig.border !== "none" &&
          variantConfig.border.includes("solid")
            ? variantConfig.border.split(" ")[3]
            : undefined,
        borderStyle: variantConfig.border !== "none" ? "solid" : undefined,

        // プレミアム3D効果の追加（型安全な方法）
        boxShadow:
          "boxShadow" in variantConfig ? variantConfig.boxShadow : undefined,
        backdropFilter:
          "backdropFilter" in variantConfig
            ? variantConfig.backdropFilter
            : undefined,

        // プレミアム3D押し込み効果（デザインシステムから）
        _hover:
          disabled || isLoading
            ? {}
            : {
                ...variantConfig._hover,
                transition: `all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
              },
        _active:
          disabled || isLoading
            ? {}
            : {
                ...variantConfig._active,
                // アクティブ時は即座に反応する
                transition: `all ${DESIGN_SYSTEM.animation.duration.fastest} ${DESIGN_SYSTEM.animation.easing.sharp}`,
              },

        // 状態管理
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
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

// エディタアクションボタン（2025年プレミアム3D効果付き）
export const EditorActionButton = forwardRef<
  HTMLButtonElement,
  ButtonProps // variant プロパティを許可
>((props, ref) => (
  <Button
    ref={ref}
    variant="editorAction" // 新しいプレミアムvariantを使用
    size="sm"
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

// モードタブボタン（2025年プレミアム3D効果付き特殊スタイリング）
export const ModeTabButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant"> & { isActive: boolean }
>(({ isActive, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    // プレミアム3D効果付きのスタイル設定
    bg={isActive ? "rgba(255, 107, 53, 0.15)" : "rgba(30, 30, 30, 0.6)"}
    color={
      isActive
        ? DESIGN_SYSTEM.colors.accent.primary
        : DESIGN_SYSTEM.colors.text.tertiary
    }
    borderColor={
      isActive ? "rgba(255, 107, 53, 0.4)" : "rgba(255, 255, 255, 0.08)"
    }
    borderWidth="1px"
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
    // プレミアム3D効果
    boxShadow={
      isActive
        ? "0 2px 8px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
        : "0 1px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)"
    }
    backdropFilter="blur(6px)"
    _hover={{
      bg: "rgba(255, 107, 53, 0.12)",
      color: DESIGN_SYSTEM.colors.accent.primary,
      borderColor: "rgba(255, 107, 53, 0.5)",
      transform: "translateY(-1px) translateZ(0)",
      boxShadow:
        "0 4px 12px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(8px)",
    }}
    _active={{
      transform: "translateY(0.5px) translateZ(0)", // 繊細な押し込み
      bg: "rgba(255, 107, 53, 0.2)",
      boxShadow:
        "0 1px 3px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: `all ${DESIGN_SYSTEM.animation.duration.fastest} ${DESIGN_SYSTEM.animation.easing.sharp}`,
    }}
    {...props}
  >
    {children}
  </Button>
));

ModeTabButton.displayName = "ModeTabButton";

export default Button;
