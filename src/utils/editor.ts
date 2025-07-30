// ==============================
// 型・定数
// ==============================
import { EDITOR_CONFIG } from "@/constants";
import type { EditorMode } from "@/types/editor";

// ==============================
// CodeMirror 本体・コア拡張
// ==============================
import { history } from "@codemirror/commands";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  drawSelection,
  EditorView,
  keymap,
  scrollPastEnd,
} from "@codemirror/view";

// ==============================
// 言語拡張
// ==============================
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { language } from "@codemirror/language";

// ==============================
// 補完・Emmet・Vim
// ==============================
import {
  acceptCompletion,
  autocompletion,
  completionStatus,
  moveCompletionSelection,
} from "@codemirror/autocomplete";
import {
  abbreviationTracker,
  EmmetKnownSyntax,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { vim } from "@replit/codemirror-vim";

/**
 * 各エディタモードに対応するCodeMirror言語拡張セット
 * @type {Record<EditorMode, Extension>}
 */
import type { Extension } from "@codemirror/state";
export const languageExtensions: Record<EditorMode, Extension> = {
  html: html(),
  css: css(),
  js: javascript(),
};

/**
 * CodeMirror 6 拡張・ユーティリティ集（2025年最新版ベストプラクティス）
 * - 言語/テーマ/補完/Emmet/Vim/スクロール/ユーティリティを厳密に責務分離
 * - 型安全・拡張性・保守性・UI/UX・競合防止を徹底
 */
// ...（この壊れたオブジェクトリテラル全体を削除）

// ==============================
// 自動補完拡張（AI感ゼロ・実用重視）
// ==============================
/**
 * 高度な自動補完拡張（UI/UX・競合防止・情報密度重視）
 */
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
// 補完UIの位置調整（無駄な空間を排除・UX最適化）
// ==============================
/**
 * 補完UIのスマートポジショニング（上下自動・余白最小化）
 */
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
// スクロール拡張（下部余白・カーソル追従）
// ==============================
/**
 * スクロールマージン拡張（下部余白を確保）
 */
const scrollMargins = EditorView.theme({
  "&": { scrollMargin: EDITOR_CONFIG.scroll.margins },
  ".cm-scroller": {
    paddingBottom: `${EDITOR_CONFIG.scroll.bottomPadding} !important`,
  },
});
/**
 * カーソル追従スクロール拡張
 */
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
// Vim/Emmet/キーマップ拡張（競合ゼロ・責務分離）
// ==============================
/**
 * Vim保護用キーマップ（Ctrl-a等の競合防止）
 */
const vimProtectionKeymap = Prec.highest(
  keymap.of([
    {
      key: "Ctrl-a",
      run: () => false,
      preventDefault: true,
    },
  ])
);

/**
 * Emmet/補完/インデント競合ゼロのTab/Enter/Shift-Tabキーマップ
 * - Tab: 補完UI→Emmet→false（インデント禁止）
 * - Enter: 補完UI→Emmet→false
 * - Shift-Tab: 補完UIのみ
 * - Ctrl-e/Cmd-e: Emmet強制展開
 */
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
        let beforeCursor = line.slice(0, cursorPos);
        // タグ直後の省略形も検出
        let abbr = beforeCursor.trim();
        // 直前がタグ閉じ > なら、その直後の省略形だけを抽出
        const tagCloseIdx = beforeCursor.lastIndexOf(">");
        if (tagCloseIdx !== -1 && tagCloseIdx < beforeCursor.length - 1) {
          const afterTag = beforeCursor.slice(tagCloseIdx + 1).trim();
          if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(afterTag)) {
            abbr = afterTag;
          }
        }
        const isValidEmmetAbbreviation = (text: string): boolean => {
          if (!text || text.length === 0) return false;
          // html:5展開用の!は特別扱い
          if (mode === "html" && text.trim() === "!") return true;
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
        if (isValidEmmetAbbreviation(abbr)) {
          if (expandAbbreviation(view)) return true;
        }
        return false; // インデントは一切発生させない
      },
      preventDefault: true,
    },
    {
      key: "Shift-Tab",
      run: (view) => {
        const completion = completionStatus(view.state);
        if (completion === "active")
          return moveCompletionSelection(false)(view);
        return false; // インデントは一切発生させない
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
          // html:5展開用の!は特別扱い
          if (mode === "html" && text.trim() === "!") return true;
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
// テーマ/スタイリング拡張（UI/UX・アクセシビリティ）
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
// メイン拡張セット取得関数（型安全・責務分離・競合ゼロ）
// ==============================
/**
 * 指定モードに応じたCodeMirror拡張セットを返す（型安全・責務分離・競合ゼロ・拡張性重視）
 * @param mode EditorMode ("html" | "css" | "js")
 * @returns Extension[]
 */
export const getEditorExtensions = (mode: EditorMode): Extension[] => {
  // 各モードごとに独立したhistoryインスタンス（Undo/Redo競合防止）
  const modeHistory = history();

  // Emmet abbreviationTracker（モードごとにsyntax明示・責務分離）
  const emmetExtension = (() => {
    switch (mode) {
      case "html":
        return abbreviationTracker({
          syntax: EmmetKnownSyntax.html,
          mark: true,
        });
      case "css":
        return abbreviationTracker({
          syntax: EmmetKnownSyntax.css,
          mark: true,
        });
      default:
        return abbreviationTracker({
          syntax: EmmetKnownSyntax.jsx,
          mark: false,
        });
    }
  })();

  // 拡張セット（優先順位厳守・競合ゼロ）
  return [
    // 1. Vimキーマップ（最優先）
    Prec.highest(vim()),
    // 2. Vim保護用キーマップ
    vimProtectionKeymap,
    // 3. Emmet/補完/インデント競合ゼロキーマップ
    emmetKeymap,
    // 4. 基本編集機能
    drawSelection(),
    // 5. 言語拡張
    languageExtensions[mode],
    // 6. 履歴（Undo/Redo）
    modeHistory,
    // 7. 自動補完
    advancedAutocompletion,
    // 8. Emmet abbreviationTracker
    emmetExtension,
    // 9. テーマ・スタイル
    oneDark,
    subtleActiveLineHighlight,
    autocompleteTheme,
    // 10. UI/UX拡張
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
