/**
 * VimEditorで使用するカスタムフック（2025年製品化レベル）
 *
 * Features:
 * - TypeScript型安全
 * - エラーハンドリング
 * - パフォーマンス最適化
 * - メモ化とデバウンス
 */

import { getCM } from "@replit/codemirror-vim";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_SAMPLE_CODE, EDITOR_CONFIG } from "@/constants";
import type { DocsState, EditorMode, VimMode } from "@/types/editor";
import { getEditorExtensions } from "@/utils/editor";
import {
  cleanCode,
  debounce,
  initializeStorage,
  saveDocsToStorage,
} from "@/utils/storage";

/**
 * ドキュメント状態管理フック（エラーハンドリング対応）
 */
export const useDocs = () => {
  const [docs, setDocs] = useState<DocsState>(DEFAULT_SAMPLE_CODE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期化（エラーハンドリング付き）
  useEffect(() => {
    try {
      const initialDocs = initializeStorage();
      setDocs(initialDocs);
      setError(null);
    } catch (err) {
      console.error("Failed to initialize storage:", err);
      setError("ストレージの初期化に失敗しました");
      // フォールバックとしてデフォルト値を使用
      setDocs(DEFAULT_SAMPLE_CODE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // デバウンス付き保存関数（設定可能な遅延時間）
  const debouncedSave = useMemo(
    () => debounce(saveDocsToStorage, EDITOR_CONFIG.performance.debounceMs),
    []
  );

  // ドキュメント更新関数（エラーハンドリング付き）
  const updateDoc = useCallback(
    (mode: EditorMode, value: string) => {
      try {
        setDocs((prev) => {
          const updated = { ...prev, [mode]: value };
          debouncedSave(updated);
          return updated;
        });
        setError(null);
      } catch (err) {
        console.error("Failed to update document:", err);
        setError("ドキュメントの更新に失敗しました");
      }
    },
    [debouncedSave]
  );

  // 単一ドキュメントをクリア
  const clearDoc = useCallback((mode: EditorMode) => {
    setDocs((prev) => {
      const updated = { ...prev, [mode]: "" };
      saveDocsToStorage(updated);
      return updated;
    });
  }, []);

  // 全ドキュメントをリセット
  const resetAllDocs = useCallback(() => {
    setDocs(DEFAULT_SAMPLE_CODE);
    saveDocsToStorage(DEFAULT_SAMPLE_CODE);
  }, []);

  // クリーンなドキュメント状態
  const cleanDocs = useMemo(
    () => ({
      html: cleanCode(docs.html),
      css: cleanCode(docs.css),
      js: cleanCode(docs.js),
    }),
    [docs]
  );

  return {
    docs,
    cleanDocs,
    updateDoc,
    clearDoc,
    resetAllDocs,
    isLoading,
    error,
  };
};

/**
 * Vimモード監視フック
 */
export const useVimMode = () => {
  const [vimMode, setVimMode] = useState<VimMode>("normal");

  const onUpdate = useCallback((viewUpdate: any) => {
    try {
      let nextVimMode: VimMode = "normal";

      if (viewUpdate?.view) {
        // Vimの状態を直接取得する方法を試す
        const cm = getCM(viewUpdate.view);
        if (cm?.state?.vim) {
          const vimState = cm.state.vim;

          // より詳細な状態チェック
          if (
            vimState.visualMode ||
            vimState.visualLine ||
            vimState.visualBlock
          ) {
            nextVimMode = "visual";
          } else if (vimState.insertMode || vimState.mode === "insert") {
            nextVimMode = "insert";
          } else {
            nextVimMode = "normal";
          }

          // デバッグログを追加（開発時のみ）
          if (process.env.NODE_ENV === "development") {
            console.log("Vim state:", {
              mode: vimState.mode,
              insertMode: vimState.insertMode,
              visualMode: vimState.visualMode,
              visualLine: vimState.visualLine,
              visualBlock: vimState.visualBlock,
              detected: nextVimMode,
            });
          }
        } else {
          // fallback: DOM要素のクラス名からも判定を試す
          const editorEl = viewUpdate.view.dom;
          if (editorEl.classList.contains("cm-fat-cursor")) {
            nextVimMode = "normal";
          } else if (editorEl.classList.contains("cm-vim-insert")) {
            nextVimMode = "insert";
          } else if (editorEl.classList.contains("cm-vim-visual")) {
            nextVimMode = "visual";
          }
        }
      }

      setVimMode(nextVimMode);
    } catch (error) {
      console.warn("Error updating vim mode:", error);
      setVimMode("normal");
    }
  }, []);

  return { vimMode, onUpdate };
};

/**
 * エディター拡張機能管理フック
 */
export const useEditorExtensions = () => {
  // 現在のモードに応じた拡張を返す（各呼び出しで新しいインスタンスを作成）
  const getCurrentExtensions = useCallback((mode: EditorMode) => {
    // 各モードごとに新しい拡張機能インスタンスを返す
    return getEditorExtensions(mode);
  }, []);

  return {
    getCurrentExtensions,
  };
};

/**
 * UI状態管理フック
 */
export const useUIState = (
  onCodePenModeChange?: (isCodePenMode: boolean) => void
) => {
  const [mode, setMode] = useState<EditorMode>("html");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showCodePenMode, setShowCodePenMode] = useState<boolean>(false);

  // モード切り替え
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setShowPreview(false); // プレビュー解除
    setMode(newMode);
  }, []);

  // プレビュー切り替え
  const handlePreviewToggle = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  // CodePenモード切り替え
  const handleCodePenToggle = useCallback(() => {
    setShowCodePenMode((prev) => {
      const newValue = !prev;
      onCodePenModeChange?.(newValue);
      return newValue;
    });
    setShowPreview(false); // CodePenモード時はPreviewボタンは無効化
  }, [onCodePenModeChange]);

  return {
    mode,
    showPreview,
    showCodePenMode,
    handleModeChange,
    handlePreviewToggle,
    handleCodePenToggle,
  };
};
