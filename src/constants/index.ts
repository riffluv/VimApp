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
    title: "基本操作（まずはここから）",
    description:
      "Vimを使うために最低限必要なコマンド。これだけでも十分使えます。",
  },
  movement: {
    icon: FiCommand,
    color: "blue.400",
    title: "移動コマンド（効率アップ）",
    description: "マウスを使わずにカーソルを素早く移動。慣れると手放せません。",
  },
  editing: {
    icon: FiCpu,
    color: "purple.400",
    title: "編集コマンド（削除・コピー・貼り付け）",
    description: "テキストの削除、コピー、貼り付けを効率的に行うコマンド。",
  },
  webdev: {
    icon: FiSearch,
    color: "orange.400",
    title: "ウェブ制作で便利なコマンド",
    description: "HTML/CSS/JS編集で特に役立つ実践的なコマンド。慣れたら挑戦！",
  },
};

// 初心者ウェブ制作者向け厳選コマンド
export const CHEAT_SHEET_COMMANDS: Command[] = [
  // 基本操作（最初に覚える必須コマンド）
  {
    command: "i",
    description: "カーソル位置で文字入力開始",
    category: "basic",
  },
  {
    command: "a",
    description: "カーソルの次で文字入力開始",
    category: "basic",
  },
  {
    command: "o",
    description: "下に新しい行を作って入力開始",
    category: "basic",
  },
  {
    command: "O",
    description: "上に新しい行を作って入力開始",
    category: "basic",
  },
  { command: "Esc", description: "ノーマルモードに戻る", category: "basic" },
  { command: "u", description: "元に戻す（アンドゥ）", category: "basic" },
  { command: "Ctrl+r", description: "やり直し（リドゥ）", category: "basic" },

  // 移動コマンド（効率的なカーソル移動）
  { command: "h", description: "左に移動", category: "movement" },
  { command: "j", description: "下に移動", category: "movement" },
  { command: "k", description: "上に移動", category: "movement" },
  { command: "l", description: "右に移動", category: "movement" },
  { command: "w", description: "次の単語の先頭に移動", category: "movement" },
  { command: "b", description: "前の単語の先頭に移動", category: "movement" },
  { command: "0", description: "行頭に移動", category: "movement" },
  { command: "$", description: "行末に移動", category: "movement" },
  { command: "gg", description: "ファイル先頭に移動", category: "movement" },
  { command: "G", description: "ファイル末尾に移動", category: "movement" },
  { command: "/text", description: "textを検索", category: "movement" },
  { command: "n", description: "次の検索結果に移動", category: "movement" },
  { command: "N", description: "前の検索結果に移動", category: "movement" },

  // 編集コマンド（削除・コピー・貼り付け）
  {
    command: "x",
    description: "カーソル位置の文字を削除",
    category: "editing",
  },
  { command: "dd", description: "現在の行を削除", category: "editing" },
  { command: "dw", description: "次の単語まで削除", category: "editing" },
  { command: "d$", description: "行末まで削除", category: "editing" },
  { command: "yy", description: "現在の行をコピー", category: "editing" },
  { command: "yw", description: "次の単語までコピー", category: "editing" },
  { command: "p", description: "カーソル後に貼り付け", category: "editing" },
  { command: "P", description: "カーソル前に貼り付け", category: "editing" },
  { command: "v", description: "文字単位で選択開始", category: "editing" },
  { command: "V", description: "行単位で選択開始", category: "editing" },
  {
    command: ">",
    description: "選択範囲を右にインデント",
    category: "editing",
  },
  {
    command: "<",
    description: "選択範囲を左にインデント",
    category: "editing",
  },
  { command: ".", description: "直前の操作を繰り返し", category: "editing" },

  // ウェブ制作で特に便利なコマンド
  {
    command: "ciw",
    description: "単語を変更（クラス名・変数名に便利）",
    category: "webdev",
  },
  {
    command: 'ci"',
    description: '"の中身を変更（文字列編集に便利）',
    category: "webdev",
  },
  {
    command: "ci'",
    description: "'の中身を変更（文字列編集に便利）",
    category: "webdev",
  },
  { command: "cit", description: "HTMLタグの中身を変更", category: "webdev" },
  { command: "dit", description: "HTMLタグの中身を削除", category: "webdev" },
  {
    command: "A",
    description: "行末で入力開始（;追加に便利）",
    category: "webdev",
  },
  {
    command: "I",
    description: "行頭で入力開始（コメント追加に便利）",
    category: "webdev",
  },
  { command: "cc", description: "行全体を変更", category: "webdev" },
  {
    command: "Ctrl+v",
    description: "矩形選択（複数行同時編集）",
    category: "webdev",
  },
  {
    command: ":%s/old/new/g",
    description: "全体置換（リファクタリングに便利）",
    category: "webdev",
  },
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
  
  ---
  【Visualモード/検索/置換/実務Tips】
  - v/V/Ctrl+v: 選択開始
  - /pattern: 検索, n/N: 次/前へ
  - :%s/old/new/g: 置換
  - ci": "の中身を変更, ciw: 単語を変更, cit: タグの中身を変更
  - .: 直前の操作を繰り返し
  - gg/G: ファイル先頭/末尾へ
  - :e ファイル名: 別ファイルを開く
  - :split/:vsplit: ウィンドウ分割
  - :tabnew: 新しいタブ
  
  ---
  【段階的に: HTML編集でよく使うVimコマンド例】
  - cit: タグの中身を一発で編集
  - dit: タグの中身を削除
  - >/<: インデント調整
  - %: 対応する括弧やタグにジャンプ
-->
<!DOCTYPE html>
<html lang="ja">

<head>
  <!-- Vimヒント: headタグ内でiやAで挿入、ci"で属性値編集、citでタグ中身編集 -->
  <meta charset="UTF-8" />
  <title>manavim</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"></script>
  <script src="script.js" defer></script>
</head>

<body>
  <!-- Vimヒント: o/Oで新しい行を挿入。タグごとにcit/ditで編集・削除。%でタグ対応ジャンプ。 -->
  <div id="tsparticles"></div>
  <div class="overlay"></div>
  <div class="container">
    <!-- Vimヒント: ciwでクラス名変更、citでタグ中身編集。Visualモードで複数行選択も便利。 -->
    <div class="title-main">VIMQUEST</div>
    <div class="title-sub">III</div>
    <div class="menu">
      <!-- Vimヒント: j/kで上下移動、ciwでテキスト変更、yy/pで複製。 -->
      <div class="menu-item">START GAME</div>
      <div class="menu-item">SELECT MODE</div>
      <div class="menu-item">RANKING</div>
      <div class="menu-item">SYSTEM</div>
    </div>
    <div class="selected-mode" id="selectedMode">Mode: Vim</div>
  </div>
  <div class="copyright">
    <!-- Vimヒント: Aで行末編集、ciwで年号変更、ditでタグ中身削除。 -->
    &copy;2025 manaby Omiya Studio. All rights reserved.
  </div>
  <div class="version">App Ver. 1.01</div>
</body>

</html>`,
  css: `/* Vimヒント: CSSファイルでは、よく移動と編集を繰り返します。ノーマルモードとインサートモードの切り替えに慣れましょう */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Vimヒント: f文字 で現在行の「文字」まで移動できます。例えば fm で m まで移動 */
html,
body {
  width: 100%;
  height: 100%;
  font-family: "Libre Baskerville", serif;
  font-size: 16px;
  line-height: 1.5;
  color: #ccc;
  overflow: hidden;
  background-color: #000;
}

/* Vimヒント: ciw で単語を削除して挿入モードになります (change inner word) - プロパティ名の変更に便利です */
#tsparticles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Vimヒント: ci" で"の中身を削除して挿入モードになります - 値の変更に便利です */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.85)
  );
  z-index: 0;
}

/* Vimヒント: % で対応する括弧に移動します - CSSの括弧の対応を確認するのに便利です */
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
  animation: fadeIn 2s ease;
}

/* Vimヒント: . で直前のコマンドを繰り返します - 同じ編集を複数箇所に適用するのに便利です */
.title-main {
  font-size: clamp(2.2rem, 7vw, 4.5rem);
  color: #fff;
  letter-spacing: 0.15em;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
    0 0 35px rgba(200, 200, 255, 0.15);
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 35px;
}

/* Vimヒント: cit でタグの中身を変更します (change inner tag) - HTMLタグ内のテキスト変更に便利です */
.title-sub {
  font-size: clamp(1.5rem, 5.5vw, 4rem);
  color: #ddd;
  letter-spacing: 0.25em;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
  margin: 0 0 45px;
  line-height: 1.1;
  text-align: center;
}

/* Vimヒント: A で行末に移動して挿入モードに入ります - セミコロンを追加するのに便利です */
.title-sub::before,
.title-sub::after {
  display: none;
}

/* Vimヒント: /{検索語} で検索できます - 特定のプロパティやセレクタを探すのに便利です */
.menu {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  align-items: center;
  animation: fadeUp 2s ease-in-out;
}

/* Vimヒント: n で次の検索結果に移動、N で前の検索結果に移動します */
.menu-item {
  font-size: clamp(1rem, 2.8vw, 1.4rem);
  color: #ccc;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.1em 0.5em;
}

/* Vimヒント: Shift+v で行選択モードになります - 複数行を選択してコピーや削除ができます */
.menu-item:hover,
.menu-item.active {
  color: #ff8800;
  text-shadow: 0 0 8px rgba(255, 136, 0, 0.5);
}

/* Vimヒント: Ctrl+v で矩形選択モードになります - 複数行の同じ位置を一度に編集できます */
.version,
.copyright {
  position: absolute;
  font-size: 0.7rem;
  color: #777;
  bottom: 15px;
}

/* Vimヒント: gg=G でファイル全体のインデントを整形します - コードを綺麗に整えるのに便利です */
.version {
  right: 20px;
}

/* Vimヒント: :s/old/new/ で現在行の最初の「old」を「new」に置換します */
.copyright {
  left: 20px;
}

/* Vimヒント: :%s/old/new/g でファイル全体の「old」をすべて「new」に置換します - 一括置換に便利です */
.selected-mode {
  margin-top: 1.2em;
  font-size: clamp(0.8rem, 2vw, 1rem);
  color: #ccc;
  font-style: italic;
}

/* Vimヒント: zz でカーソル行を画面中央に表示します - 長いCSSファイルを編集するときに便利です */
/* レスポンシブ: 画面幅600px以下でさらに調整 */
@media (max-width: 600px) {
  .container {
    padding: 0 0.5em;
  }

  /* Vimヒント: { } で段落単位で移動できます - CSSのブロック間を素早く移動できます */
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

/* Vimヒント: :split でウィンドウを水平分割、:vsplit で垂直分割できます - 複数のCSSファイルを同時に編集できます */
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

/* Vimヒント: Ctrl+w w でウィンドウ間を移動します - 分割したウィンドウ間を素早く切り替えられます */
.mode-select-screen.active {
  display: flex;
  opacity: 1;
}

/* Vimヒント: dap で段落を削除します (delete around paragraph) - CSSのブロック全体を削除するのに便利です */
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

/* Vimヒント: yap で段落をコピーします (yank around paragraph) - CSSのブロック全体をコピーするのに便利です */
.mode-card:hover,
.mode-card.selected {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 10px rgba(255, 100, 100, 0.3);
  transform: scale(1.03);
}

/* Vimヒント: :set number で行番号を表示します - 大きなCSSファイルでの位置確認に便利です */
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

/* Vimヒント: :set relativenumber で相対行番号を表示します - 現在行からの相対的な行数がわかります */
.back-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
}

/* Vimヒント: :e ファイル名 で別のファイルを開きます - HTMLとCSSを素早く切り替えられます */
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

/* Vimヒント: :tabnew ファイル名 で新しいタブでファイルを開きます - 複数のファイルをタブで管理できます */
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
  js: `// Vimヒント: Vimの基本 - ノーマルモード(ESC)で移動・編集、挿入モード(i)で文字入力

// Vimヒント: 基本的な移動 - h(左) j(下) k(上) l(右)
window.onload = () => {
  // Vimヒント: w で単語単位で前に進む、b で単語単位で後ろに戻る
  initParticles();

  // Vimヒント: 0 で行頭に移動、$ で行末に移動
  setupMenuListeners();

  // Vimヒント: gg でファイル先頭に移動、G でファイル末尾に移動
  setupKeyboardShortcuts();

  // Vimヒント: 数字+移動コマンドで複数回移動 (例: 5j で5行下に移動)
  initVimTips();
};

// Vimヒント: 基本的な編集 - x で1文字削除、dd で1行削除

// パーティクルの初期化関数
function initParticles() {
  // Vimヒント: i でカーソル位置に文字挿入、a でカーソルの次の位置に文字挿入
  tsParticles.load("tsparticles", {
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 40 },
      // Vimヒント: o で現在行の下に新しい行を挿入、O で現在行の上に新しい行を挿入
      color: { value: ["#ff6600", "#ffaa00"] },
      shape: { type: "circle" },
      opacity: { value: 0.6 },
      size: { value: { min: 1, max: 3 } },
      move: {
        // Vimヒント: yy で行をコピー(ヤンク)、p でカーソル位置の後にペースト
        enable: true,
        speed: 0.6,
        direction: "top",
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  });
}

// Vimヒント: u で直前の変更を取り消し、Ctrl+r で取り消しを戻す

// メニュー項目のイベントリスナー設定
function setupMenuListeners() {
  // Vimヒント: ciw でカーソル位置の単語を削除して挿入モード (change inner word)
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item, index) => {
    // Vimヒント: ci" で"の中の文字を削除して挿入モード - 文字列編集に便利
    item.addEventListener("click", () => {
      // Vimヒント: ci( で()の中身を削除して挿入モード - 関数の引数編集に便利
      showVimTip(index);
      highlightMenuItem(item);
    });

    // Vimヒント: cit でタグの中身を削除して挿入モード - HTMLタグ内の編集に便利
    item.addEventListener("mouseenter", () => {
      // Vimヒント: A で行末に移動して挿入モード - セミコロンの追加に便利
      playHoverSound();
    });
  });
}

// Vimヒント: . で直前の編集を繰り返す - 同じ編集を複数箇所に適用するのに便利

// キーボードショートカットの設定
function setupKeyboardShortcuts() {
  // Vimヒント: /検索語 で検索、n で次の検索結果、N で前の検索結果に移動
  document.addEventListener("keydown", (e) => {
    // Vimヒント: * でカーソル位置の単語を検索 - 変数名の検索に便利
    if (e.key >= "1" && e.key <= "4") {
      const index = parseInt(e.key) - 1;
      const menuItems = document.querySelectorAll(".menu-item");

      // Vimヒント: % で対応する括弧に移動 - 括弧の対応関係を確認するのに便利
      if (menuItems[index]) {
        highlightMenuItem(menuItems[index]);
        showVimTip(index);
      }
    }

    // Vimヒント: f文字 で現在行の「文字」まで移動 - 行内の素早い移動に便利
    if (e.key === "Escape") {
      hideAllTips();
    }
  });
}

// Vimヒント: v でビジュアルモード - テキスト選択モード

// メニュー項目のハイライト
function highlightMenuItem(item) {
  // Vimヒント: V で行単位のビジュアルモード - 行単位での選択に便利
  const menuItems = document.querySelectorAll(".menu-item");

  // Vimヒント: Ctrl+v で矩形選択ビジュアルモード - 複数行の同じ位置を編集するのに便利
  menuItems.forEach((menuItem) => {
    menuItem.classList.remove("active");
  });

  item.classList.add("active");
}

// Vimヒント: :s/old/new/ で現在行の「old」を「new」に置換

// Vimのヒントを表示する関数
function showVimTip(index) {
  // Vimヒント: :%s/old/new/g でファイル全体の「old」を「new」に置換
  const tips = [
    "Vimヒント: hjkl - 左下上右に移動",
    "Vimヒント: i - カーソル位置で文字入力開始",
    "Vimヒント: ESC - ノーマルモードに戻る",
    "Vimヒント: :w - 保存、:q - 終了、:wq - 保存して終了",
  ];

  // Vimヒント: { } で段落単位で移動 - 関数間の素早い移動に便利
  const selectedMode = document.getElementById("selectedMode");
  selectedMode.textContent = \`Tip: \${tips[index]}\`;
}

// Vimヒント: zz でカーソル行を画面中央に表示 - コードの確認に便利

// すべてのヒントを非表示にする
function hideAllTips() {
  // Vimヒント: gg=G でファイル全体のインデントを整形 - コードを綺麗に整えるのに便利
  const selectedMode = document.getElementById("selectedMode");
  selectedMode.textContent = "Mode: Vim";
}

// Vimヒント: :split でウィンドウを水平分割、:vsplit で垂直分割 - 複数ファイルの編集に便利

// ホバー効果用のサウンド再生（実際のサウンドはありません）
function playHoverSound() {
  // Vimヒント: Ctrl+w w でウィンドウ間を移動 - 分割したウィンドウ間の移動に便利
  // サウンド再生のコードがここに入ります（現在は実装なし）
}

// Vimヒント: :e ファイル名 で別のファイルを開く - 関連ファイルの素早い切り替えに便利

// Vimのヒントシステムを初期化
function initVimTips() {
  // Vimヒント: :tabnew ファイル名 で新しいタブでファイルを開く - 複数ファイルの管理に便利
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
