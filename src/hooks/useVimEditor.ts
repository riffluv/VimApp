/**
 * VimEditorで使用するカスタムフック
 */

import { getCM } from "@replit/codemirror-vim";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_SAMPLE_CODE } from "@/constants";
import type { DocsState, EditorMode, VimMode } from "@/types/editor";
import { getEditorExtensions } from "@/utils/editor";
import {
  cleanCode,
  debounce,
  initializeStorage,
  saveDocsToStorage,
} from "@/utils/storage";

/**
 * ドキュメント状態管理フック
 */
export const useDocs = () => {
  const [docs, setDocs] = useState<DocsState>(DEFAULT_SAMPLE_CODE);

  // 初期化
  useEffect(() => {
    const initialDocs = initializeStorage();
    setDocs(initialDocs);
  }, []);

  // デバウンス付き保存関数
  const debouncedSave = useMemo(() => debounce(saveDocsToStorage, 300), []);

  // ドキュメント更新関数
  const updateDoc = useCallback(
    (mode: EditorMode, value: string) => {
      setDocs((prev) => {
        const updated = { ...prev, [mode]: value };
        debouncedSave(updated);
        return updated;
      });
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
        const cm = getCM(viewUpdate.view);
        if (cm?.state?.vim?.mode) {
          const vimModeRaw = cm.state.vim.mode;
          switch (vimModeRaw) {
            case "insert":
              nextVimMode = "insert";
              break;
            case "visual":
              nextVimMode = "visual";
              break;
            default:
              nextVimMode = "normal";
              break;
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
