/**
 * LocalStorage操作のユーティリティ関数
 */

import { DEFAULT_SAMPLE_CODE, STORAGE_KEYS } from "@/constants";
import type { AppError, DocsState } from "@/types/editor";

/**
 * LocalStorageからドキュメントを読み込む
 */
export const loadDocsFromStorage = (): DocsState => {
  try {
    const savedDocs = localStorage.getItem(STORAGE_KEYS.SHARED_DOCS);

    if (savedDocs) {
      const parsedDocs = JSON.parse(savedDocs);

      // 型チェック（簡易）
      if (
        parsedDocs &&
        typeof parsedDocs === "object" &&
        "html" in parsedDocs &&
        "css" in parsedDocs &&
        "js" in parsedDocs
      ) {
        return parsedDocs as DocsState;
      }
    }

    // データがない場合はデフォルトを返す
    return DEFAULT_SAMPLE_CODE;
  } catch (error) {
    console.warn("Failed to load docs from localStorage:", error);
    return DEFAULT_SAMPLE_CODE;
  }
};

/**
 * LocalStorageにドキュメントを保存する
 */
export const saveDocsToStorage = (docs: DocsState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHARED_DOCS, JSON.stringify(docs));
  } catch (error) {
    console.warn("Failed to save docs to localStorage:", error);
  }
};

/**
 * LocalStorageを初期化する
 */
export const initializeStorage = (): DocsState => {
  const docs = loadDocsFromStorage();

  // 初回訪問時にデフォルトサンプルを保存
  if (!localStorage.getItem(STORAGE_KEYS.SHARED_DOCS)) {
    saveDocsToStorage(DEFAULT_SAMPLE_CODE);
    return DEFAULT_SAMPLE_CODE;
  }

  return docs;
};

/**
 * コードをクリーンアップ（Vimヒントコメントを削除）
 */
export const cleanCode = (code: string): string => {
  return code
    .split("\n")
    .filter((line: string) => {
      const trimmedLine = line.trim();
      // 空行は保持
      if (trimmedLine === "") return true;
      // vimtipsコメント行のみ除去（一般的なコメントは保持）
      return (
        !trimmedLine.startsWith("// //vimtips") &&
        !trimmedLine.startsWith("/* //vimtips") &&
        !trimmedLine.startsWith("<!-- //vimtips")
      );
    })
    .join("\n");
};

/**
 * エラーハンドリング付きの非同期関数実行
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  fallback: T,
  errorCode: string = "UNKNOWN_ERROR"
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError: AppError = {
      code: errorCode,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      details: error,
    };
    console.error(`[${errorCode}]`, appError);
    return fallback;
  }
};

/**
 * デバウンス関数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
