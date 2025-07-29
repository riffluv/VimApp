/**
 * CodeMirror関連のユーティリティ関数とエディタ拡張機能
 *
 * このファイルには以下の機能が含まれています：
 * - CodeMirror拡張機能の設定
 * - Vim統合とキーマップ
 * - livecodes風スクロール機能
 * - Emmet自動補完
 * - プレビューHTML生成
 */

import {
  autocompletion,
  completionStatus,
  moveCompletionSelection,
  startCompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  drawSelection,
  EditorView,
  keymap,
  scrollPastEnd,
  Tooltip,
  showTooltip,
} from "@codemirror/view";
import {
  abbreviationTracker,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { vim } from "@replit/codemirror-vim";

import { EDITOR_CONFIG, EMMET_CONFIGS } from "@/constants";
import type { EditorMode } from "@/types/editor";

// ==============================
// 自動補完の設定と位置調整
// ==============================

// ==============================
// 自動補完の設定と位置調整
// ==============================

/**
 * シンプルで確実な自動補完設定
 * CodeMirror 6の標準APIのみを使用
 */
const advancedAutocompletion = autocompletion({
  maxRenderedOptions: EDITOR_CONFIG.autocomplete.maxItems,
  defaultKeymap: true,
  aboveCursor: false, // 基本は下表示
  optionClass: () => "cm-completion-option-enhanced",
  activateOnTyping: true,
  closeOnBlur: true,
});

/**
 * 視覚的位置ベースの補完位置調整
 * 確実で安定した実装
 */
const smartPositioning = EditorView.updateListener.of((update) => {
  if (update.selectionSet || update.docChanged) {
    // 次のフレームで確実にDOM更新後に実行
    requestAnimationFrame(() => {
      const view = update.view;
      const tooltip = view.dom.querySelector('.cm-tooltip-autocomplete') as HTMLElement;
      
      if (!tooltip) return;
      
      try {
        const { main } = view.state.selection;
        const cursorCoords = view.coordsAtPos(main.head);
        
        if (!cursorCoords) return;
        
        const editorRect = view.scrollDOM.getBoundingClientRect();
        
        // シンプルな視覚的位置判定
        const cursorScreenY = cursorCoords.top;
        const editorScreenMiddle = editorRect.top + (editorRect.height / 2);
        
        // カーソルが画面上でエディタの中央より下にある場合は上に表示
        const shouldShowAbove = cursorScreenY > editorScreenMiddle;
        
        console.log('Final positioning logic:', {
          cursorScreenY,
          editorScreenMiddle,
          editorTop: editorRect.top,
          editorHeight: editorRect.height,
          shouldShowAbove
        });
        
        // 確実な位置設定
        tooltip.style.position = 'absolute';
        tooltip.style.transform = 'none';
        tooltip.style.margin = '0';
        
        if (shouldShowAbove) {
          // 上に表示
          tooltip.style.top = 'auto';
          tooltip.style.bottom = '100%';
          tooltip.style.marginBottom = '8px';
          tooltip.setAttribute('data-position', 'above');
        } else {
          // 下に表示
          tooltip.style.bottom = 'auto';
          tooltip.style.top = '100%';
          tooltip.style.marginTop = '8px';
          tooltip.setAttribute('data-position', 'below');
        }
        
      } catch (error) {
        console.warn('Position calculation error:', error);
      }
    });
  }
});

// ==============================
// スクロール関連の拡張機能
// ==============================

/**
 * カーソル周りのスクロールマージンを確保する拡張
 * livecodes風の快適なスクロール体験を実現
 */
const scrollMargins = EditorView.theme({
  "&": {
    scrollMargin: EDITOR_CONFIG.scroll.margins,
  },
  ".cm-scroller": {
    paddingBottom: `${EDITOR_CONFIG.scroll.bottomPadding} !important`,
  },
});

/**
 * カーソル移動時の動的スクロール調整
 * カーソル位置から画面下部まで常に一定の余白を維持
 */
const livecodesScrolling = EditorView.updateListener.of((update) => {
  if (update.selectionSet || update.docChanged) {
    const view = update.view;
    const { main } = view.state.selection;
    const line = view.lineBlockAt(main.head);

    // カーソル位置から画面下部まで最小マージンを確保
    const viewportHeight = view.scrollDOM.clientHeight;
    const targetBottom = line.bottom + EDITOR_CONFIG.scroll.cursorMargin;

    if (targetBottom > view.scrollDOM.scrollTop + viewportHeight) {
      view.scrollDOM.scrollTop = targetBottom - viewportHeight;
    }
  }
});

// ==============================
// キーマップとVim統合
// ==============================

/**
 * Vimキーバインドを保護するための最小限のキーマップ
 * ブラウザのデフォルト動作（Ctrl+A全選択）を防ぐ
 */
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

/**
 * Emmet補完時にTab/Shift-Tabで候補を移動するキーマップ（VSCode風）
 * 自動補完の使いやすさを向上 + 明示的なトリガー
 */
const emmetCompletionKeymap = Prec.highest(
  keymap.of([
    {
      key: "Ctrl-Space",
      run: startCompletion, // 明示的に補完を開始
      preventDefault: true,
    },
    {
      key: "Tab",
      run: (view) => {
        // 補完が表示されている場合は次の候補へ移動
        const completion = completionStatus(view.state);
        if (completion === "active") {
          return moveCompletionSelection(true)(view);
        }
        // そうでなければ補完を開始
        return startCompletion(view);
      },
      preventDefault: true,
    },
    {
      key: "Shift-Tab",
      run: moveCompletionSelection(false), // 前の候補へ
      preventDefault: true,
    },
    // Emmet展開用
    { key: "Ctrl-e", run: expandAbbreviation },
    { key: "Cmd-e", run: expandAbbreviation },
  ])
);

/**
 * 共通のキーマップ設定
 * TabはEmmet補完用にemmetCompletionKeymapで処理されるため除外
 */
const commonKeymap = keymap.of([
  { key: "Ctrl-e", run: expandAbbreviation },
  { key: "Cmd-e", run: expandAbbreviation },
]);

// ==============================
// テーマとスタイリング
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
    border: `1px solid ${EDITOR_CONFIG.autocomplete.colors.border} !important`,
    borderRadius: `${EDITOR_CONFIG.autocomplete.spacing.borderRadius} !important`,
    backgroundColor: `${EDITOR_CONFIG.autocomplete.colors.background} !important`,
    backdropFilter: "blur(20px) saturate(1.2) !important",
    boxShadow: `${EDITOR_CONFIG.autocomplete.colors.shadow} !important`,
    maxHeight: `${EDITOR_CONFIG.autocomplete.maxHeight} !important`,
    minHeight: "140px !important",
    overflow: "hidden !important",
    zIndex: `${EDITOR_CONFIG.autocomplete.zIndex} !important`,
    // 位置調整のための重要なスタイル - 相対位置ベース
    position: "absolute !important", // 相対位置で確実な制御
    transform: "none !important",
    margin: "0 !important",
    // スムーズなアニメーション
    transition: "all 0.18s cubic-bezier(0.2, 0.9, 0.3, 1) !important",
    opacity: "1 !important",
  },
  ".cm-tooltip-autocomplete > ul": {
    fontFamily: EDITOR_CONFIG.fonts.mono,
    fontSize: `${EDITOR_CONFIG.autocomplete.typography.fontSize} !important`,
    lineHeight: `${EDITOR_CONFIG.autocomplete.typography.lineHeight} !important`,
    fontWeight: `${EDITOR_CONFIG.autocomplete.typography.fontWeight} !important`,
    margin: "0 !important",
    padding: `${EDITOR_CONFIG.autocomplete.spacing.listPadding} !important`,
    maxHeight: `${EDITOR_CONFIG.autocomplete.maxHeight} !important`,
    overflow: "auto !important",
    // ミニマルスクロールバー
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(232, 131, 58, 0.25) transparent",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar": {
    width: "4px !important", // より細いスクロールバー
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-track": {
    background: "transparent !important",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb": {
    background: "rgba(232, 131, 58, 0.3) !important",
    borderRadius: "2px !important",
  },
  ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb:hover": {
    background: "rgba(232, 131, 58, 0.5) !important",
  },
  ".cm-tooltip-autocomplete ul li": {
    padding: `${EDITOR_CONFIG.autocomplete.spacing.itemPadding} !important`,
    borderRadius: "0 !important",
    transition: "all 0.12s ease-out !important", // より俊敏な反応
    color: `${EDITOR_CONFIG.autocomplete.colors.text} !important`,
    backgroundColor: "transparent !important",
    cursor: "pointer !important",
    border: "none !important",
    borderLeft: "2px solid transparent !important", // より細いアクセント
    position: "relative !important",
    // 情報密度を高める行間調整
    display: "flex !important",
    alignItems: "center !important",
  },
  ".cm-tooltip-autocomplete ul li:hover": {
    backgroundColor: "rgba(232, 131, 58, 0.06) !important", // 超控えめなホバー
    borderLeft: "2px solid rgba(232, 131, 58, 0.25) !important",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: `${EDITOR_CONFIG.autocomplete.colors.selectedBg} !important`,
    color: "#ffffff !important",
    borderLeft: `2px solid ${EDITOR_CONFIG.autocomplete.colors.selectedAccent} !important`,
    fontWeight: `${EDITOR_CONFIG.autocomplete.typography.selectedFontWeight} !important`,
    // 選択時の微細なエレベーション効果
    boxShadow: "inset 0 0 0 0.5px rgba(232, 131, 58, 0.1) !important",
  },
  // Emmet候補の詳細スタイル - 超一流の情報階層
  ".cm-tooltip-autocomplete .cm-completionLabel": {
    color: `${EDITOR_CONFIG.autocomplete.colors.label} !important`,
    fontWeight: "500 !important",
    fontSize: `${EDITOR_CONFIG.autocomplete.typography.fontSize} !important`,
    flex: "1 !important", // フレックス最適化
  },
  ".cm-tooltip-autocomplete .cm-completionDetail": {
    color: `${EDITOR_CONFIG.autocomplete.colors.detail} !important`,
    fontSize: "10px !important", // よりコンパクトな詳細情報
    fontStyle: "normal !important",
    marginLeft: "8px !important", // 最適な間隔
    opacity: "0.75 !important",
    flexShrink: "0 !important", // 圧縮されないように
  },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionLabel": {
    color: "#ffffff !important",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionDetail": {
    color: "rgba(255, 255, 255, 0.65) !important", // 選択時の詳細情報
  },
});

// ==============================
// 言語サポート
// ==============================

/**
 * 言語固有の拡張機能マップ
 * HTML, CSS, JavaScriptの各言語サポートを提供
 */
const languageExtensions = {
  html: htmlLang(),
  css: cssLang(),
  js: jsLang(),
} as const;

// ==============================
// メイン拡張機能統合
// ==============================

/**
 * エディターモードに応じた拡張機能を取得
 *
 * 機能:
 * - 各モードごとに独立したhistoryインスタンスを作成
 * - HTML/CSSモードではEmmet自動補完を有効化
 * - 全モードでVim統合、livecodes風スクロール、自動補完UIを提供
 *
 * @param mode - エディターモード ('html' | 'css' | 'js')
 * @returns CodeMirror拡張機能の配列
 */
export const getEditorExtensions = (mode: EditorMode) => {
  // 各モードごとに独立したhistoryインスタンスを作成
  const modeHistory = history();

  // 共通拡張機能（全モードで使用）
  const commonExtensions = [
    vimProtectionKeymap, // Ctrl+Aのブラウザデフォルト動作を防ぐ
    Prec.highest(vim()), // Vim拡張を最高優先度で設定
    drawSelection(),
    languageExtensions[mode],
    modeHistory, // 独立したhistoryインスタンス
    advancedAutocompletion, // 高度な自動補完設定
    emmetCompletionKeymap, // Tab/Shift-Tabで候補移動
    commonKeymap, // Emmet用キーマップ
    oneDark,
    subtleActiveLineHighlight, // 控えめなアクティブライン（カーソル行）のハイライト
    autocompleteTheme, // 自動補完候補のスタイリング
    smartPositioning, // 視覚的位置ベースの補完位置調整
    scrollPastEnd(), // エディタの下部に余白を追加
    scrollMargins, // カーソル周りのスクロールマージンを確保
    livecodesScrolling, // livecodesスタイルのスクロール動作
  ];

  // Emmet対応モード（HTML/CSS）の場合は専用拡張を追加
  if (mode === "html" || mode === "css") {
    const emmetExtension = Prec.high(abbreviationTracker(EMMET_CONFIGS[mode]));
    return [
      ...commonExtensions.slice(0, 5),
      emmetExtension,
      ...commonExtensions.slice(5),
    ];
  }

  return commonExtensions;
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
