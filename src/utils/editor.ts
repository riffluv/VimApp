/**
 * CodeMirror関連のユーティリティ関数
 */

import { history } from "@codemirror/commands";
import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { drawSelection, EditorView, keymap } from "@codemirror/view";
import {
  abbreviationTracker,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { vim } from "@replit/codemirror-vim";

import { EDITOR_CONFIG, EMMET_CONFIGS } from "@/constants";
import type { EditorMode } from "@/types/editor";

// Vimキーバインドを保護するための最小限のキーマップ
// Ctrl+Aのブラウザのデフォルト動作（全選択）のみを防ぐ
const vimProtectionKeymap = Prec.highest(
  keymap.of([
    {
      key: "Ctrl-a",
      run: () => {
        // ブラウザのデフォルト動作（全選択）を防ぐだけ
        // CodeMirror Vimが処理するように、falseを返す
        return false;
      },
      preventDefault: true,
    },
  ])
);

// 共通のキーマップ設定
const commonKeymap = keymap.of([
  { key: "Ctrl-e", run: expandAbbreviation },
  { key: "Cmd-e", run: expandAbbreviation },
]);

// アクティブライン（カーソル行）のハイライトを控えめに調整
const subtleActiveLineHighlight = EditorView.theme({
  "&.cm-focused .cm-activeLine": {
    backgroundColor: "rgba(232, 131, 58, 0.05) !important", // 非常に薄いオレンジ
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(232, 131, 58, 0.03) !important", // フォーカス外はさらに薄く
  },
  "&.cm-focused .cm-activeLineGutter": {
    backgroundColor: "rgba(232, 131, 58, 0.08) !important", // ガター部分も薄く
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(232, 131, 58, 0.05) !important",
  },
  // INSERT時のカーソル（縦線）は表示させる
  ".cm-cursor": {
    borderLeft: `${EDITOR_CONFIG.cursor.width} solid ${EDITOR_CONFIG.cursor.color} !important`,
    display: "block !important",
    visibility: "visible !important",
  },
  "&.cm-focused .cm-cursor": {
    borderLeft: `${EDITOR_CONFIG.cursor.width} solid ${EDITOR_CONFIG.cursor.color} !important`,
    display: "block !important",
    visibility: "visible !important",
  },
  // Vimモード別のカーソルスタイル
  ".cm-cursor.cm-cursor-primary": {
    borderLeft: `${EDITOR_CONFIG.cursor.width} solid ${EDITOR_CONFIG.cursor.color} !important`, // INSERT mode - 縦線
    backgroundColor: "transparent !important",
  },
  ".cm-cursor.cm-cursor-secondary": {
    borderLeft: "none !important",
    backgroundColor: `${EDITOR_CONFIG.cursor.color} !important`, // NORMAL mode - ブロック
    width: `${EDITOR_CONFIG.cursor.blockWidth} !important`,
    height: `${EDITOR_CONFIG.cursor.height} !important`,
  },
});

// 言語固有の拡張機能マップ
const languageExtensions = {
  html: htmlLang(),
  css: cssLang(),
  js: jsLang(),
} as const;

/**
 * エディターモードに応じた拡張機能を取得
 * 各モードごとに独立したhistoryインスタンスを作成
 */
export const getEditorExtensions = (mode: EditorMode) => {
  // 各モードごとに独立したhistoryインスタンスを作成
  const modeHistory = history();

  // 基本拡張機能の配列（正しい順序で設定）
  const baseExtensions = [
    vimProtectionKeymap, // Ctrl+Aのブラウザデフォルト動作を防ぐ
    Prec.highest(vim()), // Vim拡張を最高優先度で設定
    drawSelection(),
    languageExtensions[mode],
    modeHistory, // 独立したhistoryインスタンス
    commonKeymap, // Emmet用キーマップ
    oneDark,
    subtleActiveLineHighlight, // 控えめなアクティブライン（カーソル行）のハイライト
  ];

  if (mode === "html" || mode === "css") {
    const emmetExtension = Prec.high(abbreviationTracker(EMMET_CONFIGS[mode]));
    // Emmet拡張を含む場合の配列
    return [
      vimProtectionKeymap,
      Prec.highest(vim()),
      drawSelection(),
      languageExtensions[mode],
      modeHistory,
      emmetExtension,
      commonKeymap,
      oneDark,
      subtleActiveLineHighlight, // 控えめなアクティブライン（カーソル行）のハイライト
    ];
  }

  return baseExtensions;
};

/**
 * プレビュー用HTMLを生成
 */
export const generatePreviewHTML = (
  htmlCode: string,
  cssCode: string,
  jsCode: string
): string => {
  // HTMLからbodyタグ内の内容を抽出
  const bodyMatch = htmlCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlCode;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>${cssCode}</style>
  <script src="https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"></script>
</head>
<body>
  ${bodyContent}
  <script>
    // JavaScriptの実行を保証するラッパー
    (function() {
      try {
        // tsParticlesの読み込み完了を待つ
        function waitForTsParticles(callback) {
          if (typeof tsParticles !== 'undefined') {
            callback();
          } else {
            setTimeout(() => waitForTsParticles(callback), 100);
          }
        }
        
        // オリジナルのwindow.onloadを保存
        const originalWindowOnload = window.onload;
        
        // カスタムロード処理
        function executeUserCode() {
          ${jsCode}
          
          // オリジナルのwindow.onloadがある場合は実行
          if (typeof originalWindowOnload === 'function') {
            originalWindowOnload();
          }
        }
        
        // 実行順序を保証
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            waitForTsParticles(executeUserCode);
          });
        } else {
          waitForTsParticles(executeUserCode);
        }
        
      } catch (error) {
        console.error('JavaScript execution error:', error);
      }
    })();
  </script>
</body>
</html>`;
};

/**
 * サンドボックス属性を取得
 */
export const getSandboxAttributes = (): string => {
  return process.env.NODE_ENV === "development"
    ? "allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-downloads"
    : "allow-scripts allow-same-origin allow-modals allow-downloads";
};
