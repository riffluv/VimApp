/**
 * CodeMirror 6 拡張・ユーティリティ集（2025年最新版ベストプラクティス）
 * - 言語/テーマ/補完/Emmet/Vim/スクロール/ユーティリティを厳密に責務分離
 * - 型安全・拡張性・保守性・UI/UX・競合防止を徹底
 */

import {
  acceptCompletion,
  autocompletion,
  completionStatus,
  moveCompletionSelection,
} from "@codemirror/autocomplete";
import { history, indentMore } from "@codemirror/commands";
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
  defaultKeymap: true,
  aboveCursor: false,
  optionClass: () => "cm-completion-option-enhanced",
  activateOnTyping: true,
  closeOnBlur: true,
  tooltipClass: () => "cm-tooltip-no-animation",
  selectOnOpen: true,
});

// ==============================
// 補完UIの位置調整（無駄な空間を排除）
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

        // 基本位置設定（無駄な余白を排除）
        tooltip.style.position = "absolute";
        tooltip.style.transform = "none";
        tooltip.style.margin = "0";
        tooltip.style.padding = "0";

        if (shouldShowAbove) {
          tooltip.style.top = "auto";
          tooltip.style.bottom = "100%";
          tooltip.style.marginBottom = "2px"; // 最小限の間隔（8px -> 2px）
          tooltip.setAttribute("data-position", "above");
        } else {
          tooltip.style.bottom = "auto";
          tooltip.style.top = "100%";
          tooltip.style.marginTop = "2px"; // 最小限の間隔（8px -> 2px）
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
        if (completion === "active") return moveCompletionSelection(true)(view);
        const lang = view.state.facet(language);
        const mode = lang?.name || "";
        const line = view.state.doc.lineAt(view.state.selection.main.head).text;
        const cursorPos =
          view.state.selection.main.head -
          view.state.doc.lineAt(view.state.selection.main.from).from;
        const beforeCursor = line.slice(0, cursorPos).trim();
        const isValidEmmetAbbreviation = (text: string): boolean => {
          if (!text || text.length === 0) return false;
          const htmlElementPattern =
            /^[a-zA-Z][a-zA-Z0-9_-]*(\.[a-zA-Z0-9_-]+)*(\#[a-zA-Z0-9_-]+)*(\[[^\]]*\])*(\{[^}]*\})*(\*[0-9]+)*(\+[a-zA-Z0-9][a-zA-Z0-9]*)*(\>[a-zA-Z0-9][a-zA-Z0-9]*)*$/;
          const cssPropertyPattern = /^[a-zA-Z-]+:[^;]*$/;
          if (mode === "css") return cssPropertyPattern.test(text);
          if (mode === "html") {
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
            const baseTag = text.split(/[.#\[\{*+>]/)[0];
            if (!commonHtmlTags.includes(baseTag.toLowerCase())) return false;
            return htmlElementPattern.test(text);
          }
          if (mode === "javascript" || mode === "jsx")
            return /^\s*<.*/.test(text);
          return false;
        };
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
        if (completion === "active")
          return moveCompletionSelection(false)(view);
        return false;
      },
      preventDefault: true,
    },
    {
      key: "Enter",
      run: (view) => {
        const completion = completionStatus(view.state);
        if (completion === "active") return acceptCompletion(view);
        const lang = view.state.facet(language);
        const mode = lang?.name || "";
        const line = view.state.doc.lineAt(view.state.selection.main.head).text;
        const cursorPos =
          view.state.selection.main.head -
          view.state.doc.lineAt(view.state.selection.main.from).from;
        const beforeCursor = line.slice(0, cursorPos).trim();
        const isValidEmmetAbbreviation = (text: string): boolean => {
          if (!text || text.length === 0) return false;
          const htmlElementPattern =
            /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z0-9_-]+)*(\#[a-zA-Z0-9_-]+)*(\[[^\]]*\])*(\{[^}]*\})*(\*[0-9]+)*(\+[a-zA-Z0-9][a-zA-Z0-9]*)*(\>[a-zA-Z0-9][a-zA-Z0-9]*)*$/;
          const cssPropertyPattern = /^[a-zA-Z-]+:[^;]*$/;
          if (mode === "css") return cssPropertyPattern.test(text);
          if (mode === "html") {
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
            const baseTag = text.split(/[.#\[\{*+>]/)[0];
            if (!commonHtmlTags.includes(baseTag.toLowerCase())) return false;
            return htmlElementPattern.test(text);
          }
          if (mode === "javascript" || mode === "jsx")
            return /^\s*<.*/.test(text);
          return false;
        };
        if (isValidEmmetAbbreviation(beforeCursor)) {
          if (expandAbbreviation(view)) return true;
        }
        return false;
      },
      preventDefault: true,
    },
    { key: "Ctrl-e", run: expandAbbreviation },
    { key: "Cmd-e", run: expandAbbreviation },
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
 * vimapp デザインコンセプト: リッチブラック + オレンジのプロフェッショナルデザイン
 * AI感を排除した自然で実用的なインターフェース
 */
const autocompleteTheme = EditorView.theme({
  ".cm-tooltip-autocomplete": {
    // 基本レイアウト - 無駄な空間を完全に排除
    border: "1px solid rgba(232, 131, 58, 0.2)",
    borderRadius: "4px",
    backgroundColor: "rgba(8, 8, 10, 0.98)", // 深いリッチブラック
    backdropFilter: "blur(12px) saturate(1.1)",
    boxShadow:
      "0 4px 20px rgba(0, 0, 0, 0.85), 0 0 0 0.5px rgba(232, 131, 58, 0.08)",
    maxHeight: "240px", // コンパクトサイズ
    minHeight: "auto", // 自動サイズ（無駄な固定高さを排除）
    overflow: "hidden",
    zIndex: "1000",
    position: "absolute",
    transform: "none",
    margin: "0", // 余計な余白を完全排除
    padding: "0", // パディングも排除
    transition: "none",
    opacity: "1",
    fontFamily: "JetBrains Mono, 'Fira Code', monospace",
  },
  ".cm-tooltip-autocomplete > ul": {
    fontFamily: "JetBrains Mono, 'Fira Code', monospace",
    fontSize: "11px", // 情報密度重視
    lineHeight: "1.2", // タイトな行間
    fontWeight: "400",
    margin: "0",
    padding: "2px 0", // 最小限のパディング
    maxHeight: "240px",
    overflow: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(232, 131, 58, 0.2) transparent",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar": {
    width: "3px", // より細いスクロールバー
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-track": {
    background: "transparent",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb": {
    background: "rgba(232, 131, 58, 0.25)",
    borderRadius: "2px",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb:hover": {
    background: "rgba(232, 131, 58, 0.4)",
  },
  ".cm-tooltip-autocomplete ul li": {
    padding: "4px 8px", // コンパクトなアイテム
    borderRadius: "0",
    transition: "none",
    color: "#e0e0e0", // クリアな白文字
    backgroundColor: "transparent",
    cursor: "pointer",
    border: "none",
    borderLeft: "2px solid transparent",
    position: "relative",
    display: "flex",
    alignItems: "center",
    minHeight: "20px", // 最小高さで統一
  },
  ".cm-tooltip-autocomplete ul li:hover": {
    backgroundColor: "rgba(232, 131, 58, 0.08)", // 控えめなホバー
    borderLeft: "2px solid rgba(232, 131, 58, 0.3)",
    color: "#ffffff",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "rgba(232, 131, 58, 0.15)", // 明確な選択状態
    color: "#ffffff",
    borderLeft: "2px solid #e8833a", // vimappのセカンダリカラー
    fontWeight: "500", // 選択時は少し太く
    boxShadow: "inset 0 0 0 0.5px rgba(232, 131, 58, 0.1)",
  },
  // ラベルとディテールのスタイリング - プロフェッショナルな情報階層
  ".cm-tooltip-autocomplete .cm-completionLabel": {
    color: "#f0f0f0", // 高コントラスト
    fontWeight: "400",
    fontSize: "11px",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  ".cm-tooltip-autocomplete .cm-completionDetail": {
    color: "#999999", // 適度にミュートされたディテール
    fontSize: "9px", // より小さく情報密度アップ
    fontStyle: "normal",
    marginLeft: "6px",
    opacity: "0.8",
    flexShrink: "0",
    maxWidth: "60px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionLabel": {
    color: "#ffffff",
    fontWeight: "500",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionDetail": {
    color: "rgba(255, 255, 255, 0.7)",
    opacity: "1",
  },
  // アニメーション完全無効化 - 実用性重視
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
