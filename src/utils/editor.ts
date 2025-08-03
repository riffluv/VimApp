// ==============================
// 型・定数・言語拡張
// ==============================
import { EDITOR_CONFIG } from "@/constants";
import type { EditorMode } from "@/types/editor";
import {
  acceptCompletion,
  autocompletion,
  completionStatus,
  moveCompletionSelection,
} from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";
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
  emmetConfig,
  EmmetKnownSyntax,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { vim } from "@replit/codemirror-vim";

// 言語拡張セット
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
    apply: string | ((view: any, completion: any, from: number, to: number) => void);
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
        apply: (view: any, completion: any, from: number, to: number) => {
          const openTag = `<${tag}>`;
          const closeTag = `</${tag}>`;
          const fullText = openTag + closeTag;
          const cursorPos = from + openTag.length; // 開始タグの直後にカーソル配置

          view.dispatch({
            changes: { from, to, insert: fullText },
            selection: { anchor: cursorPos },
          });
        },
        boost: tag.length === 1 ? 10 : 0, // 単文字タグを優先
      });
    });

    // Emmet省略形候補
    const emmetAbbreviations = [
      {
        label: "!",
        detail: "HTML5 doctype",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n\t<meta charset="UTF-8">\n\t<title>Document</title>\n</head>\n<body>\n\t\n</body>\n</html>';
          const cursorPos = from + text.indexOf('\t\n') + 1; // body内のタブの後にカーソル配置
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos },
          });
        },
      },
      {
        label: "div.class",
        detail: "Div with class",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = '<div class="class"></div>';
          const cursorPos = from + '<div class="'.length; // class属性値の中にカーソル配置
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos, head: cursorPos + 5 }, // "class"を選択状態に
          });
        },
      },
      {
        label: "div#id",
        detail: "Div with ID",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = '<div id="id"></div>';
          const cursorPos = from + '<div id="'.length; // id属性値の中にカーソル配置
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos, head: cursorPos + 2 }, // "id"を選択状態に
          });
        },
      },
      {
        label: "ul>li*3",
        detail: "UL with 3 LI",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = "<ul>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n</ul>";
          const cursorPos = from + text.indexOf('<li>') + 4; // 最初のli要素の中にカーソル配置
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos },
          });
        },
      },
      {
        label: "ol>li*3",
        detail: "OL with 3 LI",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = "<ol>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n</ol>";
          const cursorPos = from + text.indexOf('<li>') + 4;
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos },
          });
        },
      },
      {
        label: "table>tr*3>td*3",
        detail: "Table 3x3",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = "<table>\n\t<tr>\n\t\t<td></td>\n\t\t<td></td>\n\t\t<td></td>\n\t</tr>\n\t<tr>\n\t\t<td></td>\n\t\t<td></td>\n\t\t<td></td>\n\t</tr>\n\t<tr>\n\t\t<td></td>\n\t\t<td></td>\n\t\t<td></td>\n\t</tr>\n</table>";
          const cursorPos = from + text.indexOf('<td>') + 4;
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos },
          });
        },
      },
      {
        label: "form>input*3",
        detail: "Form with 3 inputs",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = '<form>\n\t<input type="text" name="" id="">\n\t<input type="text" name="" id="">\n\t<input type="submit" value="Submit">\n</form>';
          const cursorPos = from + text.indexOf('type="text"') + 'type="'.length;
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos, head: cursorPos + 4 }, // "text"を選択
          });
        },
      },
      {
        label: "nav>ul>li*5>a",
        detail: "Navigation menu",
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = "<nav>\n\t<ul>\n\t\t<li><a href=\"\"></a></li>\n\t\t<li><a href=\"\"></a></li>\n\t\t<li><a href=\"\"></a></li>\n\t\t<li><a href=\"\"></a></li>\n\t\t<li><a href=\"\"></a></li>\n\t</ul>\n</nav>";
          const cursorPos = from + text.indexOf('href="') + 6;
          view.dispatch({
            changes: { from, to, insert: text },
            selection: { anchor: cursorPos },
          });
        },
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

    // CSS Emmet省略形（実際のEmmet記法に準拠）
    const cssEmmetAbbr = [
      // 基本プロパティ
      { label: "m", detail: "margin", apply: "margin:;" },
      { label: "mt", detail: "margin-top", apply: "margin-top:;" },
      { label: "mr", detail: "margin-right", apply: "margin-right:;" },
      { label: "mb", detail: "margin-bottom", apply: "margin-bottom:;" },
      { label: "ml", detail: "margin-left", apply: "margin-left:;" },
      { label: "p", detail: "padding", apply: "padding:;" },
      { label: "pt", detail: "padding-top", apply: "padding-top:;" },
      { label: "pr", detail: "padding-right", apply: "padding-right:;" },
      { label: "pb", detail: "padding-bottom", apply: "padding-bottom:;" },
      { label: "pl", detail: "padding-left", apply: "padding-left:;" },

      // サイズ
      { label: "w", detail: "width", apply: "width:;" },
      { label: "h", detail: "height", apply: "height:;" },
      { label: "maw", detail: "max-width", apply: "max-width:;" },
      { label: "mah", detail: "max-height", apply: "max-height:;" },
      { label: "miw", detail: "min-width", apply: "min-width:;" },
      { label: "mih", detail: "min-height", apply: "min-height:;" },

      // 表示・位置
      { label: "d", detail: "display", apply: "display:;" },
      { label: "db", detail: "display: block", apply: "display: block;" },
      { label: "di", detail: "display: inline", apply: "display: inline;" },
      { label: "dib", detail: "display: inline-block", apply: "display: inline-block;" },
      { label: "df", detail: "display: flex", apply: "display: flex;" },
      { label: "dg", detail: "display: grid", apply: "display: grid;" },
      { label: "dn", detail: "display: none", apply: "display: none;" },

      { label: "pos", detail: "position", apply: "position:;" },
      { label: "posa", detail: "position: absolute", apply: "position: absolute;" },
      { label: "posr", detail: "position: relative", apply: "position: relative;" },
      { label: "posf", detail: "position: fixed", apply: "position: fixed;" },
      { label: "poss", detail: "position: sticky", apply: "position: sticky;" },

      // Flexbox
      { label: "fxd", detail: "flex-direction", apply: "flex-direction:;" },
      { label: "fxdr", detail: "flex-direction: row", apply: "flex-direction: row;" },
      { label: "fxdc", detail: "flex-direction: column", apply: "flex-direction: column;" },
      { label: "jc", detail: "justify-content", apply: "justify-content:;" },
      { label: "jcc", detail: "justify-content: center", apply: "justify-content: center;" },
      { label: "jcsb", detail: "justify-content: space-between", apply: "justify-content: space-between;" },
      { label: "ai", detail: "align-items", apply: "align-items:;" },
      { label: "aic", detail: "align-items: center", apply: "align-items: center;" },

      // 色・背景
      { label: "c", detail: "color", apply: "color:;" },
      { label: "bg", detail: "background", apply: "background:;" },
      { label: "bgc", detail: "background-color", apply: "background-color:;" },
      { label: "bgi", detail: "background-image", apply: "background-image:;" },
      { label: "bgs", detail: "background-size", apply: "background-size:;" },
      { label: "bgr", detail: "background-repeat", apply: "background-repeat:;" },

      // ボーダー
      { label: "bd", detail: "border", apply: "border:;" },
      { label: "bdt", detail: "border-top", apply: "border-top:;" },
      { label: "bdr", detail: "border-right", apply: "border-right:;" },
      { label: "bdb", detail: "border-bottom", apply: "border-bottom:;" },
      { label: "bdl", detail: "border-left", apply: "border-left:;" },
      { label: "bdrs", detail: "border-radius", apply: "border-radius:;" },

      // フォント・テキスト
      { label: "fz", detail: "font-size", apply: "font-size:;" },
      { label: "fw", detail: "font-weight", apply: "font-weight:;" },
      { label: "ff", detail: "font-family", apply: "font-family:;" },
      { label: "lh", detail: "line-height", apply: "line-height:;" },
      { label: "ta", detail: "text-align", apply: "text-align:;" },
      { label: "tac", detail: "text-align: center", apply: "text-align: center;" },
      { label: "tal", detail: "text-align: left", apply: "text-align: left;" },
      { label: "tar", detail: "text-align: right", apply: "text-align: right;" },
      { label: "td", detail: "text-decoration", apply: "text-decoration:;" },
      { label: "tdn", detail: "text-decoration: none", apply: "text-decoration: none;" },

      // その他
      { label: "op", detail: "opacity", apply: "opacity:;" },
      { label: "zi", detail: "z-index", apply: "z-index:;" },
      { label: "ov", detail: "overflow", apply: "overflow:;" },
      { label: "ovh", detail: "overflow: hidden", apply: "overflow: hidden;" },
      { label: "ova", detail: "overflow: auto", apply: "overflow: auto;" },
      { label: "trf", detail: "transform", apply: "transform:;" },
      { label: "trs", detail: "transition", apply: "transition:;" },
    ];

    cssEmmetAbbr.forEach((abbr) => {
      completions.push({
        label: abbr.label,
        type: "emmet",
        detail: abbr.detail,
        apply: (view: any, completion: any, from: number, to: number) => {
          const text = abbr.apply;
          // セミコロンが含まれている場合、セミコロンの前にカーソルを配置
          if (text.includes(":;")) {
            const cursorPos = from + text.indexOf(":;") + 1; // ':' の直後にカーソル配置
            view.dispatch({
              changes: { from, to, insert: text },
              selection: { anchor: cursorPos },
            });
          } else {
            // 既に値が設定されている場合はそのまま
            view.dispatch({
              changes: { from, to, insert: text },
              selection: { anchor: from + text.length },
            });
          }
        },
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
        apply: (view: any, completion: any, from: number, to: number) => {
          let insertText = keyword;
          let cursorPos = from + keyword.length;

          // 特別な処理が必要なキーワード
          if (keyword === "function") {
            insertText = "function () {}";
            cursorPos = from + "function ".length; // 関数名の位置
          } else if (keyword === "console.log") {
            insertText = "console.log()";
            cursorPos = from + "console.log(".length; // 括弧内
          } else if (keyword === "document.querySelector") {
            insertText = 'document.querySelector("")';
            cursorPos = from + 'document.querySelector("'.length; // セレクター文字列内
          } else if (keyword === "addEventListener") {
            insertText = 'addEventListener("", )';
            cursorPos = from + 'addEventListener("'.length; // イベント名の位置
          } else if (keyword === "setTimeout") {
            insertText = "setTimeout(() => {}, )";
            cursorPos = from + "setTimeout(() => {".length; // 関数内
          } else if (keyword === "setInterval") {
            insertText = "setInterval(() => {}, )";
            cursorPos = from + "setInterval(() => {".length; // 関数内
          } else if (keyword === "if") {
            insertText = "if () {}";
            cursorPos = from + "if (".length; // 条件式内
          } else if (keyword === "for") {
            insertText = "for () {}";
            cursorPos = from + "for (".length; // ループ条件内
          } else if (keyword === "while") {
            insertText = "while () {}";
            cursorPos = from + "while (".length; // 条件式内
          } else if (keyword === "class") {
            insertText = "class  {}";
            cursorPos = from + "class ".length; // クラス名の位置
          }
          // const, let, var, else, return はそのまま（スペースなし）

          view.dispatch({
            changes: { from, to, insert: insertText },
            selection: { anchor: cursorPos },
          });
        },
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
  selectOnOpen: false, // 初期選択状態を未選択に
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
// スクロール・UI拡張（下部余白・カーソル追従）
// ==============================
/**
 * 行数に応じて下部余白を動的に切り替える（Emmet候補が隠れないUX＋空時はバー非表示）
 * - 10行未満: 2vh, 10行以上: 8vh
 * - 初期化時も必ず1回実行
 */
function dynamicScrollMargin(view: EditorView) {
  const lineCount = view.state.doc.lines;
  const padding = lineCount < 10 ? "2vh" : "8vh";
  const scroller = view.scrollDOM.querySelector(".cm-scroller");
  if (scroller && scroller instanceof HTMLElement) {
    scroller.style.setProperty("padding-bottom", padding, "important");
  }
}

const dynamicScrollMarginListener = EditorView.updateListener.of((update) => {
  if (update.docChanged || update.viewportChanged) {
    dynamicScrollMargin(update.view);
  }
});

// 初期化時にも必ず余白をセット
const dynamicScrollMarginInit = EditorView.domEventHandlers({
  focus: (event, view) => dynamicScrollMargin(view),
  blur: (event, view) => dynamicScrollMargin(view),
});

/**
 * カーソル追従スクロール拡張（Emmet候補や入力時にカーソルが下に張り付かない）
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
        // TabでのみEmmet展開（補完がactiveならmoveCompletionSelection、そうでなければEmmet展開）
        const completion = completionStatus(view.state);
        if (completion === "active") return moveCompletionSelection(true)(view);
        return expandAbbreviation(view);
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
        // 補完がactiveかつ選択状態ならaccept、それ以外は通常の改行
        const completion = completionStatus(view.state);
        if (completion === "active") return acceptCompletion(view);
        return false; // 通常の改行
      },
      preventDefault: false, // Enterは通常の改行を許可
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
            apply: typeof comp.apply === 'function'
              ? comp.apply
              : (view: any, completion: any, from: number, to: number) => {
                const text = comp.apply as string;
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
    selectOnOpen: false, // 初期選択状態を未選択に
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
    vimProtectionKeymap,
    emmetKeymap,
    drawSelection(),
    languageExtensions[mode],
    modeHistory,
    unifiedAutocompletion,
    ...emmetExtension,
    oneDark,
    subtleActiveLineHighlight,
    autocompleteTheme,
    smartPositioning,
    scrollPastEnd(),
    dynamicScrollMarginListener,
    dynamicScrollMarginInit,
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
