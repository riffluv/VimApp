/**
 * アプリケーション定数 2025 - パフォーマンスファーストアーキテクチャ
 *
 * Features:
 * - TypeScript完全型安全 + 厳密型定義
 * - パフォーマンス最適化（デバウンス、メモ化、GPU最適化）
 * - セキュリティ強化（XSS防止、入力サニタイゼーション）
 * - アクセシビリティ対応（ARIA、セマンティック）
 * - 2025年最新技術（Container Query、CSS Isolation、Cascade Layers）
 */

import type {
  CategoryInfo,
  Command,
  CommandCategory,
  DocsState,
  StorageKeys,
  VimModeInfo,
} from "@/types/editor";
import { FiCommand, FiCpu, FiEdit2, FiSearch } from "react-icons/fi";
import { DESIGN_SYSTEM } from "./design-system";

// LocalStorage キー
export const STORAGE_KEYS: StorageKeys = {
  SHARED_DOCS: "vimapp_shared_docs",
};

// Vimモード情報（2025年拡張版）
export const VIM_MODE_INFO: Record<string, VimModeInfo> = {
  normal: {
    text: "NORMAL",
    color: "secondary.400",
    icon: FiCommand,
    hint: "Press i to enter insert mode",
  },
  insert: {
    text: "INSERT",
    color: "green.400",
    icon: FiEdit2,
    hint: "Press Esc to return to normal mode",
  },
  visual: {
    text: "VISUAL",
    color: "purple.400",
    icon: FiCommand,
    hint: "Select text with h,j,k,l or use y to copy",
  },
  visualLine: {
    text: "V-LINE",
    color: "purple.500",
    icon: FiCommand,
    hint: "Line-wise visual selection mode",
  },
  visualBlock: {
    text: "V-BLOCK",
    color: "purple.600",
    icon: FiCommand,
    hint: "Block-wise visual selection mode",
  },
} as const;

// カテゴリ情報
export const CATEGORY_INFO: Record<CommandCategory, CategoryInfo> = {
  basic: {
    icon: FiEdit2,
    color: "green.400",
    title: "1. 基本の移動（まずはここから！）",
    description:
      "マウスを使わずにカーソルを動かす基本。hjklを覚えればVimの第一歩！",
  },
  movement: {
    icon: FiCommand,
    color: "blue.400",
    title: "2. 文字入力と編集の基本",
    description:
      "文字を入力したり、削除したり。Vimの基本的な編集操作を覚えよう。",
  },
  editing: {
    icon: FiCpu,
    color: "purple.400",
    title: "3. コピー・貼り付け・検索",
    description: "効率的な編集のためのコピペと検索。実用性がぐっと上がります。",
  },
  webdev: {
    icon: FiSearch,
    color: "orange.400",
    title: "4. 実務で使える便利技",
    description: "HTML/CSS/JS編集で威力を発揮する実践的なコマンド集。",
  },
};

// 初心者ウェブ制作者向け厳選コマンド（段階的学習用）
export const CHEAT_SHEET_COMMANDS: Command[] = [
  // 1. 基本の移動（まずはここから！）
  { command: "h", description: "← 左に移動", category: "basic" },
  { command: "j", description: "↓ 下に移動", category: "basic" },
  { command: "k", description: "↑ 上に移動", category: "basic" },
  { command: "l", description: "→ 右に移動", category: "basic" },
  { command: "w", description: "次の単語の先頭へ", category: "basic" },
  { command: "b", description: "前の単語の先頭へ", category: "basic" },
  { command: "0", description: "行の最初へ", category: "basic" },
  { command: "$", description: "行の最後へ", category: "basic" },
  { command: "gg", description: "ファイルの最初へ", category: "basic" },
  { command: "G", description: "ファイルの最後へ", category: "basic" },

  // 2. 文字入力と編集の基本
  { command: "i", description: "カーソル位置で入力開始", category: "movement" },
  { command: "a", description: "カーソルの次で入力開始", category: "movement" },
  {
    command: "o",
    description: "下に新しい行を作って入力",
    category: "movement",
  },
  {
    command: "O",
    description: "上に新しい行を作って入力",
    category: "movement",
  },
  { command: "A", description: "行末で入力開始", category: "movement" },
  { command: "I", description: "行頭で入力開始", category: "movement" },
  { command: "Esc", description: "ノーマルモードに戻る", category: "movement" },
  { command: "x", description: "1文字削除", category: "movement" },
  { command: "dd", description: "1行削除", category: "movement" },
  { command: "u", description: "元に戻す（取り消し）", category: "movement" },
  { command: "Ctrl+r", description: "やり直し", category: "movement" },

  // 3. コピー・貼り付け・検索
  { command: "yy", description: "1行コピー", category: "editing" },
  { command: "yw", description: "単語をコピー", category: "editing" },
  { command: "p", description: "カーソル後に貼り付け", category: "editing" },
  { command: "P", description: "カーソル前に貼り付け", category: "editing" },
  { command: "v", description: "文字選択モード", category: "editing" },
  { command: "V", description: "行選択モード", category: "editing" },
  { command: "y", description: "選択範囲をコピー", category: "editing" },
  { command: "d", description: "選択範囲を削除", category: "editing" },
  { command: "/text", description: "textを検索", category: "editing" },
  { command: "n", description: "次の検索結果へ", category: "editing" },
  { command: "N", description: "前の検索結果へ", category: "editing" },
  { command: ".", description: "直前の操作を繰り返し", category: "editing" },

  // 4. 実務で使える便利技
  {
    command: "ciw",
    description: "単語を変更（クラス名等）",
    category: "webdev",
  },
  { command: 'ci"', description: '"の中身を変更', category: "webdev" },
  { command: "ci'", description: "'の中身を変更", category: "webdev" },
  { command: "ci(", description: "()の中身を変更", category: "webdev" },
  { command: "cit", description: "HTMLタグの中身を変更", category: "webdev" },
  { command: "dit", description: "HTMLタグの中身を削除", category: "webdev" },
  { command: "cc", description: "行全体を変更", category: "webdev" },
  { command: ">>", description: "行を右にインデント", category: "webdev" },
  { command: "<<", description: "行を左にインデント", category: "webdev" },
  {
    command: "Ctrl+v",
    description: "矩形選択（複数行編集）",
    category: "webdev",
  },
  { command: ":%s/old/new/g", description: "全体置換", category: "webdev" },
  { command: "%", description: "対応する括弧へジャンプ", category: "webdev" },
];

// デフォルトドキュメント内容（軽量化版）
export const DEFAULT_SAMPLE_CODE: DocsState = {
  html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>VimEditor</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div class="container">
    <h1>Hello Vim World!</h1>
    <p>Edit this text using Vim commands.</p>
    <div class="highlight">
      Try: i to insert, Esc to normal mode
    </div>
  </div>
</body>
</html>`,
  css: `/* Modern CSS Example */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

h1 {
  color: #e8833a;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.highlight {
  background: rgba(232, 131, 58, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #e8833a;
}`,
  js: `// JavaScript Example
document.addEventListener('DOMContentLoaded', () => {
  console.log('Vim Editor Ready!');
  
  const container = document.querySelector('.container');
  if (container) {
    container.addEventListener('click', () => {
      console.log('Container clicked');
    });
  }
});`,
};

// パフォーマンス最適化アニメーション（Compositor-Only Properties）
export const ANIMATION_VARIANTS = {
  container: {
    hidden: {
      opacity: 0,
      transform: "scale(0.98) translateZ(0)", // GPU acceleration
    },
    visible: {
      opacity: 1,
      transform: "scale(1) translateZ(0)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      transform: "translateY(10px) translateZ(0)",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0) translateZ(0)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  },
  modeIndicator: {
    hidden: {
      opacity: 0,
      transform: "translateX(-15px) scale(0.9) translateZ(0)",
    },
    visible: {
      opacity: 1,
      transform: "translateX(0) scale(1) translateZ(0)",
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transform: "translateX(15px) scale(0.9) translateZ(0)",
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  },
};

// パフォーマンス最適化 UI スタイリング
export const UI_STYLES = {
  animation: {
    // Compositor-friendly transitions
    spring: { type: "spring", damping: 25, stiffness: 300 },
    easeOut: {
      type: "tween",
      ease: DESIGN_SYSTEM.animation.easing.easeOut,
      duration: parseFloat(DESIGN_SYSTEM.animation.duration.fast) / 1000,
    },
    transition: {
      duration: parseFloat(DESIGN_SYSTEM.animation.duration.fast) / 1000,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  spacing: {
    buttonGap: 1,
    containerPadding: 4,
    borderRadius: DESIGN_SYSTEM.borders.radius.lg,
    iconMargin: 1.5,
  },
  shadow: {
    subtle: DESIGN_SYSTEM.shadows.premium.card,
    medium: DESIGN_SYSTEM.shadows.premium.float,
  },
  colors: {
    primary: DESIGN_SYSTEM.colors.accent.primary,
    accent: DESIGN_SYSTEM.colors.accent.secondary,
    transparent: DESIGN_SYSTEM.colors.interactive.hover,
  },
} as const;

// エディタ設定（2025年製品化レベル最適化版）
export const EDITOR_CONFIG = {
  modes: ["html", "css", "js"] as const,
  defaultMode: "html" as const,
  fonts: {
    mono: DESIGN_SYSTEM.typography.fonts.mono,
    ui: DESIGN_SYSTEM.typography.fonts.sans,
  },
  cursor: {
    color: DESIGN_SYSTEM.colors.accent.primary,
    width: "2px",
    blockWidth: "8px",
    height: "1.2em",
    // 2025年新機能：アニメーション対応
    animationDuration: DESIGN_SYSTEM.animation.duration.fast,
    blinkRate: "1s",
  },
  scroll: {
    margins: "120px 0",
    bottomPadding: "30vh",
    cursorMargin: 150,
    // 2025年新機能：スムーズスクロール
    behavior: "smooth" as ScrollBehavior,
    smoothScrolling: true,
  },
  autocomplete: {
    maxHeight: "280px",
    minItems: 10,
    maxItems: 16,
    zIndex: DESIGN_SYSTEM.zIndex.tooltip,
    // 2025年最新：デザインシステム完全統合
    colors: {
      border: `${DESIGN_SYSTEM.colors.accent.primary}15`,
      background: `${DESIGN_SYSTEM.colors.bg.primary}f9`,
      shadow: `${DESIGN_SYSTEM.shadows.lg}, 0 0 0 0.5px ${DESIGN_SYSTEM.colors.accent.primary}06`,
      selectedBg: `${DESIGN_SYSTEM.colors.accent.primary}12`,
      selectedBorder: DESIGN_SYSTEM.colors.accent.primary,
      selectedAccent: `${DESIGN_SYSTEM.colors.accent.primary}35`,
      label: DESIGN_SYSTEM.colors.text.primary,
      detail: DESIGN_SYSTEM.colors.text.tertiary,
      text: DESIGN_SYSTEM.colors.text.secondary,
      muted: DESIGN_SYSTEM.colors.text.muted,
    },
    typography: {
      fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
      lineHeight: "1.3",
      fontWeight: DESIGN_SYSTEM.typography.fontWeight.normal,
      selectedFontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
      fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
    },
    spacing: {
      itemPadding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
      listPadding: `${DESIGN_SYSTEM.spacing.xs} 0`,
      borderRadius: DESIGN_SYSTEM.borders.radius.md,
      itemBorderRadius: DESIGN_SYSTEM.borders.radius.sm,
    },
    // 2025年新機能：アクセシビリティ強化
    accessibility: {
      announceSelection: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      highContrastMode: false,
    },
  },
  performance: {
    debounceMs: 150,
    memoizationCacheSize: 100,
    largeDocumentThreshold: 50000,
    // 2025年新機能：GPU最適化設定
    enableGPUAcceleration: true,
    layerPromotion: true,
    compositingOptimization: true,
    // Container Query最適化
    containerQueryPolyfill: false, // 2025年はネイティブサポート
  },
  errorHandling: {
    errorDisplayTimeMs: 5000,
    maxRetries: 3,
    retryDelayMs: 1000,
    // 2025年新機能：グレースフルデグラデーション
    gracefulDegradation: true,
    fallbackMode: "basic" as const,
    errorReporting: process.env.NODE_ENV === "production",
  },
  // 2025年新機能：セキュリティ設定
  security: {
    enableXSSProtection: true,
    sanitizeInput: true,
    allowedTags: ["div", "span", "p", "br", "strong", "em", "code", "pre"],
    maxInputLength: 100000,
    rateLimitMs: 100,
  },
} as const;

// Export design system for external use
export { DESIGN_SYSTEM };
