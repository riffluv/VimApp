/**
 * アプリケーション定数
 */

import type {
  CategoryInfo,
  Command,
  CommandCategory,
  DocsState,
  StorageKeys,
  VimModeInfo,
} from "@/types/editor";
import { FiCommand, FiCpu, FiEdit2, FiSearch } from "react-icons/fi";

// LocalStorage キー
export const STORAGE_KEYS: StorageKeys = {
  SHARED_DOCS: "vimapp_shared_docs",
};

// Vimモード情報
export const VIM_MODE_INFO: Record<string, VimModeInfo> = {
  normal: {
    text: "NORMAL",
    color: "secondary.400",
    icon: FiCommand,
    hint: "Press i to enter insert mode",
  },
  insert: {
    text: "INSERT",
    color: "green.400",
    icon: FiEdit2,
    hint: "Press Esc to return to normal mode",
  },
  visual: {
    text: "VISUAL",
    color: "purple.400",
    icon: FiCommand,
    hint: "Select text with h,j,k,l or use y to copy",
  },
} as const;

// カテゴリ情報
export const CATEGORY_INFO: Record<CommandCategory, CategoryInfo> = {
  basic: {
    icon: FiEdit2,
    color: "green.400",
    title: "1. 基本の移動（まずはここから！）",
    description:
      "マウスを使わずにカーソルを動かす基本。hjklを覚えればVimの第一歩！",
  },
  movement: {
    icon: FiCommand,
    color: "blue.400",
    title: "2. 文字入力と編集の基本",
    description:
      "文字を入力したり、削除したり。Vimの基本的な編集操作を覚えよう。",
  },
  editing: {
    icon: FiCpu,
    color: "purple.400",
    title: "3. コピー・貼り付け・検索",
    description: "効率的な編集のためのコピペと検索。実用性がぐっと上がります。",
  },
  webdev: {
    icon: FiSearch,
    color: "orange.400",
    title: "4. 実務で使える便利技",
    description: "HTML/CSS/JS編集で威力を発揮する実践的なコマンド集。",
  },
};

// 初心者ウェブ制作者向け厳選コマンド（段階的学習用）
export const CHEAT_SHEET_COMMANDS: Command[] = [
  // 1. 基本の移動（まずはここから！）
  { command: "h", description: "← 左に移動", category: "basic" },
  { command: "j", description: "↓ 下に移動", category: "basic" },
  { command: "k", description: "↑ 上に移動", category: "basic" },
  { command: "l", description: "→ 右に移動", category: "basic" },
  { command: "w", description: "次の単語の先頭へ", category: "basic" },
  { command: "b", description: "前の単語の先頭へ", category: "basic" },
  { command: "0", description: "行の最初へ", category: "basic" },
  { command: "$", description: "行の最後へ", category: "basic" },
  { command: "gg", description: "ファイルの最初へ", category: "basic" },
  { command: "G", description: "ファイルの最後へ", category: "basic" },

  // 2. 文字入力と編集の基本
  { command: "i", description: "カーソル位置で入力開始", category: "movement" },
  { command: "a", description: "カーソルの次で入力開始", category: "movement" },
  {
    command: "o",
    description: "下に新しい行を作って入力",
    category: "movement",
  },
  {
    command: "O",
    description: "上に新しい行を作って入力",
    category: "movement",
  },
  { command: "A", description: "行末で入力開始", category: "movement" },
  { command: "I", description: "行頭で入力開始", category: "movement" },
  { command: "Esc", description: "ノーマルモードに戻る", category: "movement" },
  { command: "x", description: "1文字削除", category: "movement" },
  { command: "dd", description: "1行削除", category: "movement" },
  { command: "u", description: "元に戻す（取り消し）", category: "movement" },
  { command: "Ctrl+r", description: "やり直し", category: "movement" },

  // 3. コピー・貼り付け・検索
  { command: "yy", description: "1行コピー", category: "editing" },
  { command: "yw", description: "単語をコピー", category: "editing" },
  { command: "p", description: "カーソル後に貼り付け", category: "editing" },
  { command: "P", description: "カーソル前に貼り付け", category: "editing" },
  { command: "v", description: "文字選択モード", category: "editing" },
  { command: "V", description: "行選択モード", category: "editing" },
  { command: "y", description: "選択範囲をコピー", category: "editing" },
  { command: "d", description: "選択範囲を削除", category: "editing" },
  { command: "/text", description: "textを検索", category: "editing" },
  { command: "n", description: "次の検索結果へ", category: "editing" },
  { command: "N", description: "前の検索結果へ", category: "editing" },
  { command: ".", description: "直前の操作を繰り返し", category: "editing" },

  // 4. 実務で使える便利技
  {
    command: "ciw",
    description: "単語を変更（クラス名等）",
    category: "webdev",
  },
  { command: 'ci"', description: '"の中身を変更', category: "webdev" },
  { command: "ci'", description: "'の中身を変更", category: "webdev" },
  { command: "ci(", description: "()の中身を変更", category: "webdev" },
  { command: "cit", description: "HTMLタグの中身を変更", category: "webdev" },
  { command: "dit", description: "HTMLタグの中身を削除", category: "webdev" },
  { command: "cc", description: "行全体を変更", category: "webdev" },
  { command: ">>", description: "行を右にインデント", category: "webdev" },
  { command: "<<", description: "行を左にインデント", category: "webdev" },
  {
    command: "Ctrl+v",
    description: "矩形選択（複数行編集）",
    category: "webdev",
  },
  { command: ":%s/old/new/g", description: "全体置換", category: "webdev" },
  { command: "%", description: "対応する括弧へジャンプ", category: "webdev" },
];

// デフォルトドキュメント内容
export const DEFAULT_SAMPLE_CODE: DocsState = {
  html: `<!--
  Vimヒント: Vimは3つのモードを使い分けて編集します。
  - Normalモード: 移動・編集の基本。ESCで入る。hjklで移動、ddで行削除、yyでコピーなど。
  - Insertモード: 文字入力。iやaで入る。ESCでNormalに戻る。
  - Visualモード: 選択。vで文字単位、Vで行単位、Ctrl+vで矩形選択。
  
  まずはNormal/Insert/Visualの切り替えを体で覚えましょう。
  
  ---
  【初心者向け: 最初に覚えるべき操作】
  - i: カーソル位置で挿入開始
  - a: カーソルの次で挿入開始
  - ESC: ノーマルモードに戻る
  - h/j/k/l: 左/下/上/右に移動
  - x: 1文字削除
  - dd: 行削除
  - yy: 行コピー
  - p: 貼り付け
  - u: アンドゥ
  - :w: 保存, :q: 終了, :wq: 保存して終了
-->
<!DOCTYPE html>
<html lang="ja">

<head>
  <!-- Vimヒント: まずは基本移動！ h←, j↓, k↑, l→ でカーソルを動かしてみよう -->
  <meta charset="UTF-8" />
  <!-- Vimヒント: 文字を変更しよう！ i で挿入モード開始、ESC でノーマルモードに戻る -->
  <title>manaVimEditor</title>
  <!-- Vimヒント: この行をコピーしよう！ yy でコピー、p で貼り付け -->
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap" rel="stylesheet" />
  <!-- Vimヒント: 行を削除してみよう！ dd で一発削除。間違えたら u で元に戻す -->
  <link rel="stylesheet" href="styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"></script>
  <!-- Vimヒント: 行末に文字を追加しよう！ A で行末から挿入モード開始 -->
  <script src="script.js" defer></script>
</head>

<body>
  <!-- Vimヒント: 新しい行を作ってみよう！ o で下に新行、O で上に新行を作って挿入モード -->
  <div id="tsparticles"></div>
  <div class="overlay"></div>
  <!-- Vimヒント: クラス名を変更してみよう！ ciw でクラス名だけを変更モード -->
  <div class="container">
    <!-- Vimヒント: タグの中身だけ変更しよう！ cit でタグ内容を変更モード -->
    <div class="title-main">VIMQUEST</div>
    <div class="title-sub">III</div>
    <!-- Vimヒント: 複数行を選択してみよう！ V で行選択モード、j/k で範囲を広げる -->
    <div class="menu">
      <!-- Vimヒント: この行を複製してみよう！ yy でコピー、p で下に貼り付け -->
      <div class="menu-item">START GAME</div>
      <!-- Vimヒント: 単語を検索してみよう！ /GAME と入力、n で次を検索 -->
      <div class="menu-item">SELECT MODE</div>
      <div class="menu-item">RANKING</div>
      <!-- Vimヒント: 文字を1つ削除してみよう！ x で削除。単語全体なら dw -->
      <div class="menu-item">SYSTEM</div>
    </div>
    <!-- Vimヒント: 行頭に移動してみよう！ 0 で行頭、$ で行末にジャンプ -->
    <div class="selected-mode" id="selectedMode">Mode: Vim</div>
  </div>
  <!-- Vimヒント: 対応するタグを見つけてみよう！ % で開始・終了タグ間をジャンプ -->
  <div class="copyright">
    <!-- Vimヒント: 年号だけ変更してみよう！ ciw で単語変更、数字部分にカーソルを合わせて -->
    &copy;2025 manaby Omiya Studio. All rights reserved.
  </div>
  <!-- Vimヒント: ファイルの最初に移動してみよう！ gg で先頭、G で最後にジャンプ -->
  <div class="version">App Ver. 1.01</div>
</body>

</html>`,
  css: `/* Vimヒント: CSSでも基本移動から！ h←, j↓, k↑, l→ でプロパティ間を移動しよう */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  /* Vimヒント: 値を変更しよう！ ci" で"の中身を変更モード */
  box-sizing: border-box;
}

/* Vimヒント: プロパティ名を変更してみよう！ ciw で単語変更モード */
html,
body {
  width: 100%;
  /* Vimヒント: この行をコピーしてみよう！ yy でコピー、p で貼り付け */
  height: 100%;
  font-family: "Libre Baskerville", serif;
  /* Vimヒント: 数値だけ変更してみよう！ 数値にカーソルを合わせて ciw */
  font-size: 16px;
  line-height: 1.5;
  color: #ccc;
  overflow: hidden;
  /* Vimヒント: カラーコードを変更してみよう！ ci# で#以降を変更モード */
  background-color: #000;
}

/* Vimヒント: セレクタを検索してみよう！ /tsparticles で検索、n で次を探す */
#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  /* Vimヒント: 行を削除してみよう！ dd で一発削除。間違えたら u で元に戻す */
  z-index: 0;
}

/* Vimヒント: 複数行を選択してみよう！ V で行選択、j/k で範囲を広げる */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  /* Vimヒント: 括弧の対応を確認してみよう！ % で開始・終了括弧間をジャンプ */
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.85)
  );
  z-index: 0;
}

/* Vimヒント: CSSブロック全体をコピーしてみよう！ { にカーソルを合わせて % で } に移動、V で選択 */
.container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* Vimヒント: 行末に文字を追加してみよう！ A で行末から挿入モード */
  animation: fadeIn 2s ease;
}

/* Vimヒント: 同じ編集を繰り返してみよう！ . で直前の操作を繰り返し */
.title-main {
  font-size: clamp(2.2rem, 7vw, 4.5rem);
  color: #fff;
  letter-spacing: 0.15em;
  /* Vimヒント: 長い値を一括変更してみよう！ 値の最初で ci, で次のカンマまで変更 */
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
    0 0 35px rgba(200, 200, 255, 0.15);
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 35px;
}

/* Vimヒント: クラス名を変更してみよう！ .title-sub の部分で ciw */
.title-sub {
  font-size: clamp(1.5rem, 5.5vw, 4rem);
  color: #ddd;
  letter-spacing: 0.25em;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
  margin: 0 0 45px;
  line-height: 1.1;
  text-align: center;
}

/* Vimヒント: 不要な行を削除してみよう！ dd で行削除 */
.title-sub::before,
.title-sub::after {
  display: none;
}

/* Vimヒント: 特定のプロパティを検索してみよう！ /display で検索 */
.menu {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  align-items: center;
  animation: fadeUp 2s ease-in-out;
}

/* Vimヒント: 複数の値を一度に変更してみよう！ Ctrl+v で矩形選択 */
.menu-item {
  font-size: clamp(1rem, 2.8vw, 1.4rem);
  color: #ccc;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.1em 0.5em;
}

/* Vimヒント: 行を複製してみよう！ yy でコピー、p で貼り付け */
.menu-item:hover,
.menu-item.active {
  color: #ff8800;
  text-shadow: 0 0 8px rgba(255, 136, 0, 0.5);
}

/* Vimヒント: 複数のセレクタを一度に編集してみよう！ V で行選択、複数行選んで一括編集 */
.version,
.copyright {
  position: absolute;
  font-size: 0.7rem;
  color: #777;
  bottom: 15px;
}

/* Vimヒント: ファイルの最初に移動してみよう！ gg で先頭、G で最後 */
.version {
  right: 20px;
}

/* Vimヒント: 置換してみよう！ :%s/old/new/g で全体置換 */
.copyright {
  left: 20px;
}

/* Vimヒント: 画面中央に表示してみよう！ zz でカーソル行を中央に */
.selected-mode {
  margin-top: 1.2em;
  font-size: clamp(0.8rem, 2vw, 1rem);
  color: #ccc;
  font-style: italic;
}

/* Vimヒント: メディアクエリ内を編集してみよう！ { } で段落移動が便利 */
@media (max-width: 600px) {
  .container {
    padding: 0 0.5em;
  }

  /* Vimヒント: インデントを調整してみよう！ >> で右に、<< で左にインデント */
  .title-main {
    font-size: clamp(1.2rem, 10vw, 2.5rem);
    letter-spacing: 0.08em;
    margin-bottom: 25px;
  }

  .title-sub {
    font-size: clamp(1rem, 8vw, 2rem);
    letter-spacing: 0.15em;
    margin: 0 0 30px;
  }

  .title-sub::before,
  .title-sub::after {
    width: 25px;
    left: calc(50% - 40px);
  }

  .title-sub::after {
    right: calc(50% - 40px);
  }

  .menu-item {
    font-size: clamp(0.8rem, 4vw, 1.1rem);
    padding: 0.08em 0.3em;
  }

  .selected-mode {
    font-size: clamp(0.7rem, 2vw, 0.9rem);
    margin-top: 0.7em;
  }

  .version,
  .copyright {
    font-size: 0.6rem;
    bottom: 8px;
  }
}

/* Vimヒント: CSSブロック全体を削除してみよう！ dap で段落削除 */
.mode-select-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.5s ease;
  backdrop-filter: blur(8px);
}

.mode-select-screen.active {
  display: flex;
  opacity: 1;
}

.mode-card {
  font-size: 1.4rem;
  color: #eee;
  margin: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.6rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.04);
}

.mode-card:hover,
.mode-card.selected {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 10px rgba(255, 100, 100, 0.3);
  transform: scale(1.03);
}

.back-button {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
}

/* Vimヒント: アニメーション名を変更してみよう！ fadeIn の部分で ciw */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}`,
  js: `// Vimヒント: JavaScriptでも基本移動から！ h←, j↓, k↑, l→ で関数間を移動しよう

// Vimヒント: 関数名を変更してみよう！ 関数名にカーソルを合わせて ciw で単語変更
window.onload = () => {
  // Vimヒント: 関数呼び出しを複製してみよう！ yy でコピー、p で貼り付け
  initParticles();

  // Vimヒント: 行末にセミコロンを追加してみよう！ A で行末から挿入モード
  setupMenuListeners();

  // Vimヒント: 関数を削除してみよう！ dd で行削除。間違えたら u で元に戻す
  setupKeyboardShortcuts();

  // Vimヒント: コメントを追加してみよう！ I で行頭から挿入モード、// を入力
  initVimTips();
};

// Vimヒント: 文字列を変更してみよう！ ci" で"の中身を変更モード

// パーティクルの初期化関数
function initParticles() {
  // Vimヒント: 変数名を変更してみよう！ 変数名で ciw
  tsParticles.load("tsparticles", {
    // Vimヒント: オブジェクトのプロパティを変更してみよう！ プロパティ名で ciw
    background: { color: { value: "transparent" } },
    particles: {
      // Vimヒント: 数値を変更してみよう！ 数値にカーソルを合わせて ciw
      number: { value: 40 },
      // Vimヒント: 配列の要素を変更してみよう！ 要素にカーソルを合わせて ci"
      color: { value: ["#ff6600", "#ffaa00"] },
      shape: { type: "circle" },
      opacity: { value: 0.6 },
      size: { value: { min: 1, max: 3 } },
      move: {
        // Vimヒント: ブール値を変更してみよう！ true/false で ciw
        enable: true,
        speed: 0.6,
        direction: "top",
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  });
}

// Vimヒント: 関数全体をコピーしてみよう！ 関数の { で % で } に移動、V で行選択

// メニュー項目のイベントリスナー設定
function setupMenuListeners() {
  // Vimヒント: 変数宣言を変更してみよう！ const の部分で ciw で let に変更
  const menuItems = document.querySelectorAll(".menu-item");

  // Vimヒント: 配列の各要素を編集してみよう！ forEach の中で操作
  menuItems.forEach((item, index) => {
    // Vimヒント: イベント名を変更してみよう！ "click" の部分で ci"
    item.addEventListener("click", () => {
      // Vimヒント: 関数の引数を変更してみよう！ 引数名で ciw
      showVimTip(index);
      highlightMenuItem(item);
    });

    // Vimヒント: 新しいイベントリスナーを追加してみよう！ yy でコピー、p で貼り付け後編集
    item.addEventListener("mouseenter", () => {
      // Vimヒント: 関数呼び出しを削除してみよう！ dd で行削除
      playHoverSound();
    });
  });
}

// Vimヒント: 同じ編集を繰り返してみよう！ . で直前の操作を繰り返し

// キーボードショートカットの設定
function setupKeyboardShortcuts() {
  // Vimヒント: 特定の文字列を検索してみよう！ /keydown で検索、n で次を探す
  document.addEventListener("keydown", (e) => {
    // Vimヒント: 条件文を変更してみよう！ >= の部分で ciw で != に変更
    if (e.key >= "1" && e.key <= "4") {
      // Vimヒント: 変数の値を変更してみよう！ 1 の部分で ciw
      const index = parseInt(e.key) - 1;
      // Vimヒント: セレクタを変更してみよう！ ".menu-item" の部分で ci"
      const menuItems = document.querySelectorAll(".menu-item");

      // Vimヒント: 括弧の対応を確認してみよう！ % で開始・終了括弧間をジャンプ
      if (menuItems[index]) {
        highlightMenuItem(menuItems[index]);
        showVimTip(index);
      }
    }

    // Vimヒント: 文字列比較を変更してみよう！ "Escape" の部分で ci"
    if (e.key === "Escape") {
      hideAllTips();
    }
  });
}

// Vimヒント: 複数行を選択してみよう！ V で行選択、j/k で範囲を広げる

// メニュー項目のハイライト
function highlightMenuItem(item) {
  // Vimヒント: メソッド名を変更してみよう！ querySelectorAll の部分で ciw
  const menuItems = document.querySelectorAll(".menu-item");

  // Vimヒント: ループ処理を複製してみよう！ forEach行で yy、p で貼り付け
  menuItems.forEach((menuItem) => {
    // Vimヒント: メソッド呼び出しを変更してみよう！ remove の部分で ciw
    menuItem.classList.remove("active");
  });

  // Vimヒント: クラス名を変更してみよう！ "active" の部分で ci"
  item.classList.add("active");
}

// Vimヒント: 置換してみよう！ :%s/old/new/g で全体置換

// Vimのヒントを表示する関数
function showVimTip(index) {
  // Vimヒント: 配列の要素を編集してみよう！ 各要素で ci"
  const tips = [
    "Vimヒント: hjkl - 左下上右に移動",
    "Vimヒント: i - カーソル位置で文字入力開始",
    "Vimヒント: ESC - ノーマルモードに戻る",
    "Vimヒント: :w - 保存、:q - 終了、:wq - 保存して終了",
  ];

  // Vimヒント: IDセレクタを変更してみよう！ "selectedMode" の部分で ci"
  const selectedMode = document.getElementById("selectedMode");
  // Vimヒント: テンプレートリテラルを変更してみよう！ \`\` の中で編集
  selectedMode.textContent = \`Tip: \${tips[index]}\`;
}

// Vimヒント: 画面中央に表示してみよう！ zz でカーソル行を中央に

// すべてのヒントを非表示にする
function hideAllTips() {
  // Vimヒント: ファイルの最初に移動してみよう！ gg で先頭、G で最後
  const selectedMode = document.getElementById("selectedMode");
  selectedMode.textContent = "Mode: Vim";
}

// Vimヒント: 関数間を移動してみよう！ { } で段落単位移動が便利

// ホバー効果用のサウンド再生（実際のサウンドはありません）
function playHoverSound() {
  // Vimヒント: コメントを削除してみよう！ dd で行削除
  // サウンド再生のコードがここに入ります（現在は実装なし）
}

// Vimヒント: 新しい関数を追加してみよう！ o で新行、function と入力

// Vimのヒントシステムを初期化
function initVimTips() {
  // Vimヒント: 長い文字列を変更してみよう！ 文字列の最初で ci" で全体変更
  console.log(
    "Vimヒントシステムが初期化されました。メニュー項目をクリックしてヒントを表示します。"
  );
}

// Vimヒント: 実務でよく使うコマンド - ciw(単語変更)、ci"(文字列変更)、A(行末に挿入)、/(検索)、%(括弧移動)`,
};

// アニメーション設定
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  },
  modeIndicator: {
    hidden: { opacity: 0, x: -15, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: 15,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  },
};

// Emmet設定
export const EMMET_CONFIGS = {
  html: {
    autocompleteTab: true,
    config: {
      markup: {
        options: {
          "markup.attributes": {
            href: "https://",
            src: "/",
          },
        },
      },
    },
  },
  css: {
    autocompleteTab: true,
    config: {
      stylesheet: {
        options: {
          "stylesheet.strictMatch": true,
        },
      },
    },
  },
} as const;

// UI スタイリング定数
export const UI_STYLES = {
  animation: {
    // Framer Motion のイージング設定
    spring: { type: "spring", damping: 25, stiffness: 300 },
    easeOut: { type: "tween", ease: "easeOut", duration: 0.2 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  spacing: {
    // 統一されたスペーシング
    buttonGap: 1,
    containerPadding: 4,
    borderRadius: "lg",
    iconMargin: 1.5,
  },
  shadow: {
    // ホバー効果のシャドウ
    subtle: "0 4px 12px rgba(232,131,58,0.15)",
    medium: "0 6px 20px rgba(232,131,58,0.2)",
  },
  colors: {
    // アクセントカラー（オレンジ系）
    primary: "secondary.400", // オレンジ
    accent: "#e8833a", // 直接的なオレンジ
    transparent: "rgba(232,131,58,0.15)",
  },
} as const;

// エディタ設定
export const EDITOR_CONFIG = {
  modes: ["html", "css", "js"] as const,
  defaultMode: "html" as const,
  fonts: {
    mono: "JetBrains Mono, 'Fira Code', 'SF Mono', 'Monaco', Menlo, 'Ubuntu Mono', monospace",
    ui: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif",
  },
  cursor: {
    // カーソルの色とサイズ
    color: "#e8833a",
    width: "2px",
    blockWidth: "8px",
    height: "1.2em",
  },
} as const;
