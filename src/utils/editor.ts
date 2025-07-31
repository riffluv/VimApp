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
  emmetConfig,
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

/**
 * HTML/CSS/JS共通Emmet候補生成関数
 * 統一的な候補表示を実現
 */
const createEmmetCompletions = (mode: EditorMode) => {
  const completions: Array<{
    label: string;
    displayLabel?: string;
    type: string;
    detail: string;
    apply: string;
    boost?: number;
  }> = [];

  if (mode === "html") {
    // HTML要素候補
    const htmlElements = [
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

    htmlElements.forEach((tag) => {
      completions.push({
        label: tag,
        displayLabel: tag,
        type: "element",
        detail: "HTML Element",
        apply: `<${tag}></${tag}>`,
        boost: tag.length === 1 ? 10 : 0, // 単文字タグを優先
      });
    });

    // Emmet省略形候補
    const emmetAbbreviations = [
      {
        label: "!",
        detail: "HTML5 doctype",
        apply:
          '<!DOCTYPE html>\n<html lang="ja">\n<head>\n\t<meta charset="UTF-8">\n\t<title>Document</title>\n</head>\n<body>\n\t\n</body>\n</html>',
      },
      {
        label: "div.class",
        detail: "Div with class",
        apply: '<div class="class"></div>',
      },
      { label: "div#id", detail: "Div with ID", apply: '<div id="id"></div>' },
      {
        label: "ul>li*3",
        detail: "UL with 3 LI",
        apply: "<ul>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n</ul>",
      },
    ];

    emmetAbbreviations.forEach((abbr) => {
      completions.push({
        ...abbr,
        type: "emmet",
        boost: 15,
      });
    });
  }

  if (mode === "css") {
    // CSS プロパティ候補
    const cssProperties = [
      "display",
      "position",
      "width",
      "height",
      "margin",
      "padding",
      "color",
      "background",
      "font-size",
      "font-family",
      "text-align",
      "border",
      "border-radius",
      "flex",
      "grid",
      "transform",
      "transition",
      "animation",
      "opacity",
      "z-index",
      "overflow",
    ];

    cssProperties.forEach((prop) => {
      completions.push({
        label: prop,
        type: "property",
        detail: "CSS Property",
        apply: `${prop}:;`, // スペースを削除
        boost: 5,
      });
    });

    // CSS Emmet省略形
    const cssEmmetAbbr = [
      { label: "m", detail: "margin", apply: "margin:;" },
      { label: "p", detail: "padding", apply: "padding:;" },
      { label: "w", detail: "width", apply: "width:;" },
      { label: "h", detail: "height", apply: "height:;" },
      { label: "bg", detail: "background", apply: "background:;" },
      { label: "c", detail: "color", apply: "color:;" },
      { label: "d", detail: "display", apply: "display:;" },
      { label: "pos", detail: "position", apply: "position:;" },
    ];

    cssEmmetAbbr.forEach((abbr) => {
      completions.push({
        ...abbr,
        type: "emmet",
        boost: 15,
      });
    });
  }

  if (mode === "js") {
    // JavaScript候補
    const jsKeywords = [
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "console.log",
      "document.querySelector",
      "addEventListener",
      "setTimeout",
      "setInterval",
    ];

    jsKeywords.forEach((keyword) => {
      completions.push({
        label: keyword,
        type: "keyword",
        detail: "JS Keyword",
        apply: keyword.includes("(") ? keyword : `${keyword} `,
        boost: 5,
      });
    });
  }

  return completions;
};
/**
 * 高度な自動補完拡張（UI/UX・競合防止・情報密度重視）
 * 全モード統一の美しいUI
 */
const advancedAutocompletion = autocompletion({
  maxRenderedOptions: EDITOR_CONFIG.autocomplete.maxItems,
  defaultKeymap: true,
  aboveCursor: false,
  optionClass: () => "cm-completion-option-enhanced",
  activateOnTyping: true,
  closeOnBlur: true,
  tooltipClass: () => "cm-tooltip-no-animation cm-tooltip-unified",
  selectOnOpen: true,
  override: [], // 統一的なcompletionソースを使用
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
 * 統一されたEmmet自動補完スタイル
 * vimapp デザインコンセプト: リッチブラック + オレンジの美しいプロフェッショナルデザイン
 */
const autocompleteTheme = EditorView.theme({
  // 統一されたEmmet自動補完スタイル
  ".cm-autocomplete-tooltip-unified": {
    border: "1px solid rgba(232, 131, 58, 0.3)",
    borderRadius: "6px",
    backgroundColor: "rgba(8, 8, 10, 0.98)",
    backdropFilter: "blur(12px) saturate(1.1)",
    boxShadow:
      "0 8px 32px rgba(0, 0, 0, 0.85), 0 0 0 0.5px rgba(232, 131, 58, 0.15)",
    maxHeight: "280px",
    overflow: "hidden",
    zIndex: "10000",
    fontFamily: "JetBrains Mono, 'Fira Code', monospace",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "1.4",
    margin: "0",
    padding: "6px",
    transition: "opacity 0.2s ease",
  },

  ".cm-autocomplete-tooltip-unified .cm-completions": {
    backgroundColor: "transparent",
    border: "none",
    margin: "0",
    padding: "0",
  },

  ".cm-autocomplete-tooltip-unified .cm-completion": {
    display: "flex",
    alignItems: "center",
    padding: "8px 10px",
    margin: "1px 0",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    color: "#f0f0f0",
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: "rgba(232, 131, 58, 0.12)",
      color: "#ffffff",
      transform: "translateX(2px)",
    },

    "&.cm-completion-selected": {
      backgroundColor: "rgba(232, 131, 58, 0.2)",
      color: "#ffffff",
      fontWeight: "500",
      transform: "translateX(3px)",
      boxShadow: "inset 3px 0 0 #e8833a",
      borderLeft: "none",
    },
  },

  ".cm-autocomplete-tooltip-unified .cm-completion-label": {
    fontFamily: "JetBrains Mono, 'Fira Code', monospace",
    fontSize: "12px",
    fontWeight: "500",
    marginRight: "10px",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  ".cm-autocomplete-tooltip-unified .cm-completion-detail": {
    marginLeft: "auto",
    fontSize: "10px",
    opacity: "0.7",
    color: "#999999",
    fontStyle: "italic",
    flexShrink: "0",
    maxWidth: "80px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // 標準のautocompleteも統一
  ".cm-tooltip-autocomplete": {
    border: "1px solid rgba(232, 131, 58, 0.3)",
    borderRadius: "6px",
    backgroundColor: "rgba(8, 8, 10, 0.98)",
    backdropFilter: "blur(12px) saturate(1.1)",
    boxShadow:
      "0 8px 32px rgba(0, 0, 0, 0.85), 0 0 0 0.5px rgba(232, 131, 58, 0.15)",
    maxHeight: "280px",
    overflow: "hidden",
    zIndex: "10000",
    fontFamily: "JetBrains Mono, 'Fira Code', monospace",
    fontSize: "12px",
    margin: "0",
    padding: "6px",
  },

  ".cm-tooltip-autocomplete > ul": {
    fontFamily: "JetBrains Mono, 'Fira Code', monospace",
    fontSize: "12px",
    lineHeight: "1.4",
    fontWeight: "400",
    color: "#f0f0f0",
    margin: "0",
    padding: "0",
  },

  ".cm-tooltip-autocomplete ul li": {
    padding: "8px 10px",
    margin: "1px 0",
    borderRadius: "4px",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
  },

  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "rgba(232, 131, 58, 0.2)",
    color: "#ffffff",
    fontWeight: "500",
    transform: "translateX(3px)",
    boxShadow: "inset 3px 0 0 #e8833a",
  },

  ".cm-tooltip-autocomplete .cm-completionLabel": {
    color: "#f0f0f0",
    fontWeight: "500",
    fontSize: "12px",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  ".cm-tooltip-autocomplete .cm-completionDetail": {
    color: "#999999",
    fontSize: "10px",
    fontStyle: "italic",
    marginLeft: "10px",
    opacity: "0.7",
    flexShrink: "0",
    maxWidth: "80px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionLabel": {
    color: "#ffffff",
    fontWeight: "500",
  },

  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionDetail": {
    color: "rgba(255, 255, 255, 0.8)",
    opacity: "1",
  },
});

// ==============================
// メイン拡張セット取得関数（型安全・責務分離・競合ゼロ）
// ==============================
/**
 * 指定モードに応じたCodeMirror拡張セットを返す（統一Emmet自動補完版）
 * @param mode EditorMode ("html" | "css" | "js")
 * @returns Extension[]
 */
export const getEditorExtensions = (mode: EditorMode): Extension[] => {
  // 各モードごとに独立したhistoryインスタンス（Undo/Redo競合防止）
  const modeHistory = history();

  // 統一されたEmmet自動補完設定
  const unifiedAutocompletion = autocompletion({
    override: [
      // カスタムEmmet候補（統一美しいUI）
      (context) => {
        const word = context.matchBefore(/\w*/);
        if (!word) return null;

        const customCompletions = createEmmetCompletions(mode);
        const filtered = customCompletions.filter((comp) =>
          comp.label.toLowerCase().startsWith(word.text.toLowerCase())
        );

        if (filtered.length === 0) return null;

        return {
          from: word.from,
          options: filtered.map((comp) => ({
            label: comp.label,
            type: comp.type,
            detail: comp.detail,
            apply: (view: any, completion: any, from: number, to: number) => {
              const text = comp.apply;
              // セミコロンが含まれている場合、セミコロンの前にカーソルを配置
              if (text.includes(":;")) {
                const insertText = text;
                const cursorPos = from + text.indexOf(":;") + 1; // ':' の直後にカーソル配置
                view.dispatch({
                  changes: { from, to, insert: insertText },
                  selection: { anchor: cursorPos },
                });
              } else {
                view.dispatch({
                  changes: { from, to, insert: text },
                  selection: { anchor: from + text.length },
                });
              }
            },
            boost: comp.boost || 0,
          })),
        };
      },
    ],
    tooltipClass: () => "cm-autocomplete-tooltip-unified",
    closeOnBlur: false,
    maxRenderedOptions: 20,
    defaultKeymap: true,
  });

  // Emmet設定（モード別・統一UI）
  const emmetExtension = (() => {
    switch (mode) {
      case "html":
        return [
          abbreviationTracker({
            syntax: EmmetKnownSyntax.html,
            mark: true,
          }),
          emmetConfig.of({ syntax: EmmetKnownSyntax.html }),
        ];
      case "css":
        return [
          abbreviationTracker({
            syntax: EmmetKnownSyntax.css,
            mark: true,
          }),
          emmetConfig.of({ syntax: EmmetKnownSyntax.css }),
        ];
      default:
        return [
          abbreviationTracker({
            syntax: EmmetKnownSyntax.jsx,
            mark: false,
          }),
          emmetConfig.of({ syntax: EmmetKnownSyntax.jsx }),
        ];
    }
  })();

  // 拡張セット（優先順位厳守・統一Emmet）
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
    // 7. 統一自動補完（美しいUI）
    unifiedAutocompletion,
    // 8. Emmet拡張（統一UI）
    ...emmetExtension,
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
