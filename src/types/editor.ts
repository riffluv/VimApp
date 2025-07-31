/**
 * VimApp エディター関連の型定義
 */

import type { IconType } from "react-icons";

// エディターモード
export type EditorMode = "html" | "css" | "js";

// Vimモード (2025年拡張版)
export type VimMode =
  | "normal"
  | "insert"
  | "visual"
  | "visualLine"
  | "visualBlock";

// 型ガード関数
export const isValidEditorMode = (mode: string): mode is EditorMode => {
  return ["html", "css", "js"].includes(mode);
};

export const isValidVimMode = (mode: string): mode is VimMode => {
  return ["normal", "insert", "visual", "visualLine", "visualBlock"].includes(
    mode
  );
};

// ドキュメント状態
export interface DocsState {
  html: string;
  css: string;
  js: string;
}

// Vimモード情報
export interface VimModeInfo {
  text: string;
  color: string;
  icon: IconType;
  hint: string;
}

// コマンド情報
export interface Command {
  command: string;
  description: string;
  category: CommandCategory;
}

// コマンドカテゴリ
export type CommandCategory = "basic" | "movement" | "editing" | "webdev";

// カテゴリ情報
export interface CategoryInfo {
  icon: IconType;
  color: string;
  title: string;
  description: string;
}

// VimEditor Props
export interface VimEditorProps {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
}

// CheatSheet Props
export interface CheatSheetProps {
  // 将来の拡張のために空のインターフェース
}

// テーマ関連
export interface ThemeColors {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  accent: Record<string, string>;
}

// LocalStorage関連
export interface StorageKeys {
  SHARED_DOCS: string;
}

// エラー関連
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}
