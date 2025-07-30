/**
 * CodeMirror 6 拡張・ユーティリティ集（2025年ベストプラクティス）
 * - 言語/テーマ/補完/Emmet/Vim/スクロール/ユーティリティを責務分離
 * - 型安全・拡張性・保守性・UI/UXを徹底
 */

import {
  acceptCompletion,
  autocompletion,
  completionStatus,
  moveCompletionSelection,
} from "@codemirror/autocomplete";
import { indentMore } from "@codemirror/commands";

import { history } from "@codemirror/commands";
import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { language } from "@codemirror/language";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  drawSelection,
  EditorView,
  keymap,
  scrollPastEnd,
} from "@codemirror/view";
import {
  abbreviationTracker,
  EmmetKnownSyntax,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { vim } from "@replit/codemirror-vim";

import { EDITOR_CONFIG } from "@/constants";
import type { EditorMode } from "@/types/editor";

// ==============================
// 言語拡張
// ==============================
const languageExtensions = {
  html: htmlLang(),
  css: cssLang(),
  js: jsLang(),
} as const;

// ==============================
// 自動補完拡張
// ==============================
const advancedAutocompletion = autocompletion({
  maxRenderedOptions: EDITOR_CONFIG.autocomplete.maxItems,
  defaultKeymap: true, // デフォルトのキーマップを有効化（重要）
  aboveCursor: false,
  optionClass: () => "cm-completion-option-enhanced",
  activateOnTyping: true,
  closeOnBlur: true,
  tooltipClass: () => "cm-tooltip-no-animation",
  selectOnOpen: true, // 最初の候補を自動選択（UX向上）
});

// ==============================
// 補完UIの位置調整（UI/UX）
// ==============================
const smartPositioning = EditorView.updateListener.of((update) => {
  if (update.selectionSet || update.docChanged) {
    requestAnimationFrame(() => {
      const view = update.view;
      const tooltip = view.dom.querySelector(
        ".cm-tooltip-autocomplete"
      ) as HTMLElement;
      if (!tooltip) return;
      try {
        const { main } = view.state.selection;
        const cursorCoords = view.coordsAtPos(main.head);
        if (!cursorCoords) return;
        const editorRect = view.scrollDOM.getBoundingClientRect();
        const cursorScreenY = cursorCoords.top;
        const editorScreenMiddle = editorRect.top + editorRect.height / 2;
        const shouldShowAbove = cursorScreenY > editorScreenMiddle;
        tooltip.style.position = "absolute";
        tooltip.style.transform = "none";
        tooltip.style.margin = "0";
        if (shouldShowAbove) {
          tooltip.style.top = "auto";
          tooltip.style.bottom = "100%";
          tooltip.style.marginBottom = "8px";
          tooltip.setAttribute("data-position", "above");
        } else {
          tooltip.style.bottom = "auto";
          tooltip.style.top = "100%";
          tooltip.style.marginTop = "8px";
          tooltip.setAttribute("data-position", "below");
        }
      } catch (error) {
        console.warn("Position calculation error:", error);
      }
    });
  }
});

// ==============================
// スクロール拡張
// ==============================
const scrollMargins = EditorView.theme({
  "&": { scrollMargin: EDITOR_CONFIG.scroll.margins },
  ".cm-scroller": {
    paddingBottom: `${EDITOR_CONFIG.scroll.bottomPadding} !important`,
  },
});
const livecodesScrolling = EditorView.updateListener.of((update) => {
  if (update.selectionSet || update.docChanged) {
    const view = update.view;
    const { main } = view.state.selection;
    const line = view.lineBlockAt(main.head);
    const viewportHeight = view.scrollDOM.clientHeight;
    const targetBottom = line.bottom + EDITOR_CONFIG.scroll.cursorMargin;
    if (targetBottom > view.scrollDOM.scrollTop + viewportHeight) {
      view.scrollDOM.scrollTop = targetBottom - viewportHeight;
    }
  }
});

// ==============================
// Vim/Emmet/キーマップ拡張
// ==============================
const vimProtectionKeymap = Prec.highest(
  keymap.of([
    {
      key: "Ctrl-a",
      run: () => false,
      preventDefault: true,
    },
  ])
);

const emmetKeymap = Prec.highest(
  keymap.of([
    {
      key: "Tab",
      run: (view) => {
        const completion = completionStatus(view.state);
        if (completion === "active") {
          return moveCompletionSelection(true)(view);
        }

        // カーソル位置の文字列を取得
        const lang = view.state.facet(language);
        const mode = lang?.name || "";
        const line = view.state.doc.lineAt(view.state.selection.main.head).text;
        const cursorPos =
          view.state.selection.main.head -
          view.state.doc.lineAt(view.state.selection.main.from).from;
        const beforeCursor = line.slice(0, cursorPos).trim();

        // 有効なEmmet記法の判定を厳密化
        const isValidEmmetAbbreviation = (text: string): boolean => {
          if (!text || text.length === 0) return false;

          // HTMLの有効な要素名または記法かチェック
          const htmlElementPattern =
            /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z0-9_-]+)*(\#[a-zA-Z0-9_-]+)*(\[[^\]]*\])*(\{[^}]*\})*(\*[0-9]+)*(\+[a-zA-Z0-9][a-zA-Z0-9]*)*(\>[a-zA-Z0-9][a-zA-Z0-9]*)*$/;
          const cssPropertyPattern = /^[a-zA-Z-]+:[^;]*$/;

          // CSS構文の場合
          if (mode === "css") {
            return cssPropertyPattern.test(text);
          }

          // HTML構文の場合 - 明確にHTMLタグ名として認識できるもののみ
          if (mode === "html") {
            // 一般的なHTMLタグ名のみ許可
            const commonHtmlTags = [
              "div",
              "span",
              "p",
              "a",
              "img",
              "ul",
              "li",
              "ol",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "section",
              "article",
              "header",
              "footer",
              "nav",
              "main",
              "aside",
              "form",
              "input",
              "button",
              "textarea",
              "select",
              "option",
              "table",
              "tr",
              "td",
              "th",
              "thead",
              "tbody",
              "tfoot",
              "script",
              "style",
              "link",
              "meta",
              "title",
              "head",
              "body",
              "html",
            ];

            // 基本的なタグ名かどうかをチェック
            const baseTag = text.split(/[.#\[\{*+>]/)[0];
            if (!commonHtmlTags.includes(baseTag.toLowerCase())) {
              return false;
            }

            return htmlElementPattern.test(text);
          }

          // JS/JSXの場合は<から始まる場合のみ
          if (mode === "javascript" || mode === "jsx") {
            return /^\s*<.*/.test(text);
          }

          return false;
        };

        // 有効なEmmet記法の場合のみ展開、そうでなければインデント
        if (isValidEmmetAbbreviation(beforeCursor)) {
          if (expandAbbreviation(view)) return true;
        }

        return indentMore(view);
      },
      preventDefault: true,
    },
    {
      key: "Shift-Tab",
      run: (view) => {
        const completion = completionStatus(view.state);
        if (completion === "active") {
          return moveCompletionSelection(false)(view);
        }
        return false;
      },
      preventDefault: true,
    },
    {
      key: "Enter",
      run: (view) => {
        // 補完UIがactiveならacceptCompletionを最優先で実行
        const completion = completionStatus(view.state);
        if (completion === "active") {
          return acceptCompletion(view);
        }

        // カーソル位置の文字列を取得
        const lang = view.state.facet(language);
        const mode = lang?.name || "";
        const line = view.state.doc.lineAt(view.state.selection.main.head).text;
        const cursorPos =
          view.state.selection.main.head -
          view.state.doc.lineAt(view.state.selection.main.from).from;
        const beforeCursor = line.slice(0, cursorPos).trim();

        // 有効なEmmet記法の判定を厳密化
        const isValidEmmetAbbreviation = (text: string): boolean => {
          if (!text || text.length === 0) return false;

          // HTMLの有効な要素名または記法かチェック
          const htmlElementPattern =
            /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z0-9_-]+)*(\#[a-zA-Z0-9_-]+)*(\[[^\]]*\])*(\{[^}]*\})*(\*[0-9]+)*(\+[a-zA-Z0-9][a-zA-Z0-9]*)*(\>[a-zA-Z0-9][a-zA-Z0-9]*)*$/;
          const cssPropertyPattern = /^[a-zA-Z-]+:[^;]*$/;

          // CSS構文の場合
          if (mode === "css") {
            return cssPropertyPattern.test(text);
          }

          // HTML構文の場合 - 明確にHTMLタグ名として認識できるもののみ
          if (mode === "html") {
            // 一般的なHTMLタグ名のみ許可
            const commonHtmlTags = [
              "div",
              "span",
              "p",
              "a",
              "img",
              "ul",
              "li",
              "ol",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "section",
              "article",
              "header",
              "footer",
              "nav",
              "main",
              "aside",
              "form",
              "input",
              "button",
              "textarea",
              "select",
              "option",
              "table",
              "tr",
              "td",
              "th",
              "thead",
              "tbody",
              "tfoot",
              "script",
              "style",
              "link",
              "meta",
              "title",
              "head",
              "body",
              "html",
            ];

            // 基本的なタグ名かどうかをチェック
            const baseTag = text.split(/[.#\[\{*+>]/)[0];
            if (!commonHtmlTags.includes(baseTag.toLowerCase())) {
              return false;
            }

            return htmlElementPattern.test(text);
          }

          // JS/JSXの場合は<から始まる場合のみ
          if (mode === "javascript" || mode === "jsx") {
            return /^\s*<.*/.test(text);
          }

          return false;
        };

        // 有効なEmmet記法の場合のみ展開
        if (isValidEmmetAbbreviation(beforeCursor)) {
          if (expandAbbreviation(view)) return true;
        }

        return false;
      },
      preventDefault: true,
    },
    {
      key: "Ctrl-e",
      run: expandAbbreviation,
    },
    {
      key: "Cmd-e",
      run: expandAbbreviation,
    },
  ])
);

// ==============================
// テーマ/スタイリング拡張
// ==============================

/**
 * アクティブライン（カーソル行）のハイライトを控えめに調整
 * オレンジ系の薄いハイライトでVimらしい見た目を実現
 */
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

/**
 * 自動補完候補のスタイリング
 * 正確な位置制御と美しいデザインの両立
 */
const autocompleteTheme = EditorView.theme({
  ".cm-tooltip-autocomplete": {
    border: `1px solid ${EDITOR_CONFIG.autocomplete.colors.border}`,
    borderRadius: `${EDITOR_CONFIG.autocomplete.spacing.borderRadius}`,
    backgroundColor: `${EDITOR_CONFIG.autocomplete.colors.background}`,
    backdropFilter: "blur(20px) saturate(1.2)",
    boxShadow: `${EDITOR_CONFIG.autocomplete.colors.shadow}`,
    maxHeight: `${EDITOR_CONFIG.autocomplete.maxHeight}`,
    minHeight: "140px",
    overflow: "hidden",
    zIndex: `${EDITOR_CONFIG.autocomplete.zIndex}`,
    // 位置調整のための重要なスタイル - 相対位置ベース
    position: "absolute",
    transform: "none",
    margin: "0",
    // アニメーション完全無効化でやかましさを排除
    transition: "none",
    opacity: "1",
  },
  ".cm-tooltip-autocomplete > ul": {
    fontFamily: EDITOR_CONFIG.fonts.mono,
    fontSize: `${EDITOR_CONFIG.autocomplete.typography.fontSize}`,
    lineHeight: `${EDITOR_CONFIG.autocomplete.typography.lineHeight}`,
    fontWeight: `${EDITOR_CONFIG.autocomplete.typography.fontWeight}`,
    margin: "0",
    padding: `${EDITOR_CONFIG.autocomplete.spacing.listPadding}`,
    maxHeight: `${EDITOR_CONFIG.autocomplete.maxHeight}`,
    overflow: "auto",
    // ミニマルスクロールバー
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(232, 131, 58, 0.25) transparent",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar": {
    width: "4px",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-track": {
    background: "transparent",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb": {
    background: "rgba(232, 131, 58, 0.3)",
    borderRadius: "2px",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb:hover": {
    background: "rgba(232, 131, 58, 0.5)",
  },
  ".cm-tooltip-autocomplete ul li": {
    padding: `${EDITOR_CONFIG.autocomplete.spacing.itemPadding}`,
    borderRadius: "0",
    transition: "none", // アニメーション完全無効化
    color: `${EDITOR_CONFIG.autocomplete.colors.text}`,
    backgroundColor: "transparent",
    cursor: "pointer",
    border: "none",
    borderLeft: "2px solid transparent",
    position: "relative",
    // 情報密度を高める行間調整
    display: "flex",
    alignItems: "center",
  },
  ".cm-tooltip-autocomplete ul li:hover": {
    backgroundColor: "rgba(232, 131, 58, 0.06)",
    borderLeft: "2px solid rgba(232, 131, 58, 0.25)",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: `${EDITOR_CONFIG.autocomplete.colors.selectedBg}`,
    color: "#ffffff",
    borderLeft: `2px solid ${EDITOR_CONFIG.autocomplete.colors.selectedAccent}`,
    fontWeight: `${EDITOR_CONFIG.autocomplete.typography.selectedFontWeight}`,
    // 選択時の微細なエレベーション効果
    boxShadow: "inset 0 0 0 0.5px rgba(232, 131, 58, 0.1)",
  },
  // Emmet候補の詳細スタイル - 超一流の情報階層
  ".cm-tooltip-autocomplete .cm-completionLabel": {
    color: `${EDITOR_CONFIG.autocomplete.colors.label}`,
    fontWeight: "500",
    fontSize: `${EDITOR_CONFIG.autocomplete.typography.fontSize}`,
    flex: "1",
  },
  ".cm-tooltip-autocomplete .cm-completionDetail": {
    color: `${EDITOR_CONFIG.autocomplete.colors.detail}`,
    fontSize: "10px",
    fontStyle: "normal",
    marginLeft: "8px",
    opacity: "0.75",
    flexShrink: "0",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionLabel": {
    color: "#ffffff",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionDetail": {
    color: "rgba(255, 255, 255, 0.65)",
  },
  // アニメーション完全無効化クラス
  ".cm-tooltip-no-animation": {
    transition: "none",
    animation: "none",
    transform: "none",
  },
  ".cm-tooltip-no-animation *": {
    transition: "none",
    animation: "none",
    transform: "none",
  },
});

// ==============================
// メイン拡張セット取得関数
// ==============================
/**
 * 指定モードに応じたCodeMirror拡張セットを返す（型安全・責務分離・拡張性重視）
 */
export const getEditorExtensions = (mode: EditorMode): any[] => {
  // 各モードごとに独立したhistoryインスタンス
  const modeHistory = history();

  // Emmet abbreviationTracker（モードごとにsyntax明示）
  let emmetExtension;
  if (mode === "html") {
    emmetExtension = abbreviationTracker({
      syntax: EmmetKnownSyntax.html,
      mark: true,
    });
  } else if (mode === "css") {
    emmetExtension = abbreviationTracker({
      syntax: EmmetKnownSyntax.css,
      mark: true,
    });
  } else {
    emmetExtension = abbreviationTracker({
      syntax: EmmetKnownSyntax.jsx,
      mark: false,
    });
  }

  // 拡張セット（優先順位に注意）
  return [
    // Vimキーマップを最優先
    Prec.highest(vim()),
    // その次にVim保護用キーマップ
    vimProtectionKeymap,
    // Emmetキーマップ（acceptCompletionを含む）
    emmetKeymap,
    // 基本的な編集機能
    drawSelection(),
    languageExtensions[mode],
    modeHistory,
    // 自動補完（デフォルトキーマップを有効化）
    advancedAutocompletion,
    // Emmet機能
    emmetExtension,
    // テーマとスタイル
    oneDark,
    subtleActiveLineHighlight,
    autocompleteTheme,
    smartPositioning,
    scrollPastEnd(),
    scrollMargins,
    livecodesScrolling,
  ];
};

// ==============================
// ユーティリティ関数
// ==============================

/**
 * プレビュー用HTMLを生成
 *
 * 機能:
 * - HTMLからbodyタグ内の内容を抽出
 * - CSS/JSを適切に統合
 * - tsParticlesの読み込み完了を待つ
 * - JavaScriptの実行エラーをキャッチ
 *
 * @param htmlCode - HTMLコード
 * @param cssCode - CSSコード
 * @param jsCode - JavaScriptコード
 * @returns 完全なHTMLドキュメント文字列
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
 *
 * 開発環境と本番環境で異なるサンドボックス設定を提供
 * セキュリティとデバッグの両立を図る
 *
 * @returns iframe用のsandbox属性文字列
 */
export const getSandboxAttributes = (): string => {
  return process.env.NODE_ENV === "development"
    ? "allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-downloads"
    : "allow-scripts allow-same-origin allow-modals allow-downloads";
};
