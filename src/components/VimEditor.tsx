import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { history } from "@codemirror/commands";
import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { drawSelection, keymap } from "@codemirror/view";
import {
  abbreviationTracker,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { getCM, vim } from "@replit/codemirror-vim";
import CodeMirror from "@uiw/react-codemirror";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiCommand,
  FiEdit,
  FiRefreshCw,
  FiTerminal,
} from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

// 共通のキーマップ設定
const commonKeymap = keymap.of([
  { key: "Ctrl-e", run: expandAbbreviation },
  { key: "Cmd-e", run: expandAbbreviation },
]);

// Emmet設定を言語ごとに定義
const emmetConfigs = {
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

// 言語固有の拡張機能マップ
const languageExtensions = {
  html: htmlLang(),
  css: cssLang(),
  js: jsLang(),
} as const;

// 拡張取得関数（CodeMirror用）- 各モードごとに独立したhistory付き
// ベストプラクティス: Vim拡張を必ず先頭に、drawSelectionも追加。他のkeymapやbasicSetupは使わない。
const getExtensions = (mode: EditorMode) => {
  if (mode === "html" || mode === "css") {
    const emmetExtension = Prec.high(abbreviationTracker(emmetConfigs[mode]));
    return [
      vim(),
      drawSelection(),
      languageExtensions[mode],
      history(),
      emmetExtension,
      oneDark,
    ];
  }
  return [vim(), drawSelection(), languageExtensions[mode], history(), oneDark];
};
// アニメーション用のvariants（再定義）
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};
const modeIndicatorVariants = {
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
};
// samplecode01のサンプルコードを初期値として設定
const codePenSamples = {
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

// samplecode01の内容を初期値として設定
const emptyDocs = {
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

// --- 型定義 ---
type EditorMode = "html" | "css" | "js";
type VimMode = keyof typeof modeInfo;

interface DocsState {
  html: string;
  css: string;
  js: string;
}

interface VimEditorProps {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
}

// --- Vimモード情報・型定義 ---
const modeInfo = {
  normal: {
    text: "NORMAL",
    color: "orange.400",
    icon: FiCommand as IconType,
    hint: "Press i to enter insert mode",
  },
  insert: {
    text: "INSERT",
    color: "green.400",
    icon: FiEdit as IconType,
    hint: "Press Esc to return to normal mode",
  },
  visual: {
    text: "VISUAL",
    color: "purple.400",
    icon: FiCommand as IconType,
    hint: "Select text with h,j,k,l or use y to copy",
  },
} as const;

function VimEditor({ onCodePenModeChange }: VimEditorProps) {
  // CodeMirrorエディタへのref
  const editorRef = useRef<any>(null);
  const [mode, setMode] = useState<EditorMode>("html");
  const [vimMode, setVimMode] = useState<VimMode>("normal");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showCodePenMode, setShowCodePenMode] = useState<boolean>(false);
  const [docs, setDocs] = useState<DocsState>(emptyDocs);

  // localStorageからの初期化・マイグレーションはuseEffectで行う
  useEffect(() => {
    try {
      // 既存のデータをクリア（新しいサンプルコード受け入れ準備）
      localStorage.removeItem("vimapp_shared_docs");
      localStorage.removeItem("vimapp_samples");
      localStorage.removeItem("vimapp_codepen_samples");

      // 完全に空の状態で初期化
      setDocs(emptyDocs);
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
      setDocs(emptyDocs);
    }
  }, []);

  // 各モードの拡張機能を個別にメモ化（独立したhistory付き）
  const htmlExtensions = useMemo(() => getExtensions("html"), []);
  const cssExtensions = useMemo(() => getExtensions("css"), []);
  const jsExtensions = useMemo(() => getExtensions("js"), []);

  // 現在のモードに応じた拡張を返す
  const getCurrentExtensions = useCallback(() => {
    switch (mode) {
      case "html":
        return htmlExtensions;
      case "css":
        return cssExtensions;
      case "js":
        return jsExtensions;
      default:
        return htmlExtensions;
    }
  }, [mode, htmlExtensions, cssExtensions, jsExtensions]);

  // CodePen表示用にコメントを除去したクリーンなコードを生成
  const getCleanCode = useCallback((code: string) => {
    return code
      .split("\n")
      .filter((line: string) => !line.trim().startsWith("//"))
      .join("\n");
  }, []);

  // CodePen表示用のクリーンなドキュメント状態
  const cleanDocs = useMemo(
    () => ({
      html: getCleanCode(docs.html),
      css: getCleanCode(docs.css),
      js: getCleanCode(docs.js),
    }),
    [docs, getCleanCode]
  );

  // 統一されたlocalStorage保存関数
  const saveDocsToStorage = useCallback((updatedDocs: DocsState) => {
    try {
      localStorage.setItem("vimapp_shared_docs", JSON.stringify(updatedDocs));
    } catch (error) {
      console.warn("Failed to save docs to localStorage:", error);
    }
  }, []);

  // モード切り替え - ベストプラクティス: どのモードボタンを押しても必ずエディター画面に戻す
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setShowPreview(false); // プレビュー解除（同じモードでも必ず解除）
    setVimMode("normal");
    setMode(newMode);
    // 少し遅延してエディタにフォーカス（Reactの再描画後）
    setTimeout(() => {
      if (editorRef.current && editorRef.current.view) {
        editorRef.current.view.focus();
      }
    }, 0);
  }, []);

  // CodePenモード切り替え - 最適化版
  const handleCodePenToggle = useCallback(() => {
    setShowCodePenMode((prev) => {
      const newValue = !prev;
      // 親コンポーネントに状態を通知
      onCodePenModeChange?.(newValue);
      return newValue;
    });
    setShowPreview(false); // CodePenモード時はPreviewボタンは無効化
  }, [onCodePenModeChange]);

  // Vimモード監視 - エラーハンドリング強化
  const onUpdate = useCallback((viewUpdate: any) => {
    try {
      let nextVimMode: VimMode = "normal";

      if (viewUpdate?.view) {
        const cm = getCM(viewUpdate.view);
        if (cm?.state?.vim?.mode) {
          const vimModeRaw = cm.state.vim.mode;
          switch (vimModeRaw) {
            case "insert":
              nextVimMode = "insert";
              break;
            case "visual":
              nextVimMode = "visual";
              break;
            default:
              nextVimMode = "normal";
              break;
          }
        }
      }

      setVimMode(nextVimMode);
    } catch (error) {
      console.warn("Error updating vim mode:", error);
      setVimMode("normal");
    }
  }, []);

  // リセット - データのみ変更し画面状態は維持（空に戻す）

  // 現在のエディタのみクリア
  const handleClear = useCallback(() => {
    setDocs((prev) => {
      const updated = { ...prev, [mode]: "" };
      saveDocsToStorage(updated);
      return updated;
    });
    setVimMode("normal");
  }, [mode, saveDocsToStorage]);

  // 全エディターリセット（空に戻す）

  // 全サンプル初期化（確認ダイアログ付き）
  const handleResetAll = useCallback(() => {
    if (
      window.confirm(
        "本当に全てのサンプルを初期状態に戻しますか？\nこの操作は元に戻せません。"
      )
    ) {
      setDocs(emptyDocs);
      saveDocsToStorage(emptyDocs);
      setVimMode("normal");
    }
  }, [saveDocsToStorage]);

  // プレビュー用HTML生成 - useMemoで最適化
  const previewSrcDoc = useMemo(() => {
    const cleanHtml = getCleanCode(docs.html);

    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>${docs.css}</style>
</head>
<body>
  ${cleanHtml}
  <script>${docs.js}</script>
</body>
</html>`;
  }, [docs.css, docs.html, docs.js, getCleanCode]);

  // CodePenモード用HTML生成 - 統一されたcleanDocsを使用
  const codePenSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CodePen Preview</title>
  <style>${cleanDocs.css}</style>
</head>
<body>
  ${cleanDocs.html}
  <script>${cleanDocs.js}</script>
</body>
</html>`;
  }, [cleanDocs]);

  // プレビュー切り替え - 最適化版
  const handlePreviewToggle = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);
  // SSR/CSR差異による高さ0問題を防ぐ
  return (
    <MotionBox
      bgGradient="gradient.primary"
      color="text.primary"
      p={{ base: 2, md: 4 }}
      borderRadius="2xl"
      boxShadow="glass"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="border.primary"
      position="relative"
      overflow="hidden"
      flex={1}
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "gradient.glass",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
      _hover={{
        boxShadow: "glass-hover",
        transform: "translateY(-1px)",
      }}
    >
      {/* --- Editor Header (macOS風ウィンドウコントロール) --- */}
      <MotionFlex
        alignItems="center"
        px={[2, 4]}
        py={[2, 3]}
        borderBottomWidth={1}
        borderColor="primary.700"
        bgGradient="linear(to-r, primary.900, primary.800)"
        justifyContent="space-between"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(255,152,0,0.08) 0%, transparent 50%, rgba(255,152,0,0.03) 100%)",
          pointerEvents: "none",
        }}
      >
        <Flex alignItems="center">
          <HStack gap={2} marginRight={5}>
            <Box w={3} h={3} borderRadius="full" bg="red.400" />
            <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
            <Box w={3} h={3} borderRadius="full" bg="green.400" />
          </HStack>
          <Flex alignItems="center">
            <Icon as={FiTerminal} color="secondary.400" mr={2} />
            <MotionText
              fontFamily="mono"
              fontWeight="medium"
              letterSpacing="tight"
              color="white"
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mode.toUpperCase()} Editor
            </MotionText>
          </Flex>
        </Flex>
        <HStack justifyContent="flex-end" gap={2}>
          {/* CodePenモードボタン */}
          <Button
            onClick={handleCodePenToggle}
            colorScheme={showCodePenMode ? "teal" : "gray"}
            bg={
              showCodePenMode
                ? "linear-gradient(135deg, rgba(56,178,172,0.2), rgba(56,178,172,0.1))"
                : "transparent"
            }
            color={showCodePenMode ? "teal.400" : "gray.400"}
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight={showCodePenMode ? "bold" : "medium"}
            letterSpacing="tight"
            borderWidth={showCodePenMode ? 1 : 0}
            borderColor={showCodePenMode ? "teal.800" : "transparent"}
            _hover={{
              bg: "linear-gradient(135deg, rgba(56,178,172,0.3), rgba(56,178,172,0.15))",
              color: "teal.400",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "blackAlpha.500",
              transform: "translateY(0)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            mr={1}
            aria-label="CodePenモード切り替え"
            aria-pressed={showCodePenMode}
          >
            <Icon as={FiBookOpen} mr={1} /> CodePen
          </Button>

          {/* Previewボタン - CodePenモード時は無効化 */}
          <Button
            onClick={handlePreviewToggle}
            disabled={showCodePenMode}
            colorScheme={showPreview ? "purple" : "gray"}
            bg={
              showPreview
                ? "linear-gradient(135deg, rgba(128,90,213,0.2), rgba(128,90,213,0.1))"
                : "transparent"
            }
            color={showPreview ? "purple.400" : "gray.400"}
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight={showPreview ? "bold" : "medium"}
            letterSpacing="tight"
            borderWidth={showPreview ? 1 : 0}
            borderColor={showPreview ? "purple.800" : "transparent"}
            _hover={{
              bg: showCodePenMode
                ? "transparent"
                : "linear-gradient(135deg, rgba(128,90,213,0.3), rgba(128,90,213,0.15))",
              color: showCodePenMode ? "gray.400" : "purple.400",
              transform: showCodePenMode ? "none" : "translateY(-1px)",
              boxShadow: showCodePenMode ? "none" : "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "blackAlpha.500",
              transform: "translateY(0)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            mr={1}
            aria-label="プレビュー表示切り替え"
            aria-pressed={showPreview}
            opacity={showCodePenMode ? 0.5 : 1}
          >
            Preview
          </Button>
          {(["html", "css", "js"] as const).map((m) => (
            <Button
              key={m}
              onClick={() => handleModeChange(m)}
              colorScheme={mode === m ? "orange" : "gray"}
              bg={
                mode === m
                  ? "linear-gradient(135deg, rgba(255,152,0,0.2), rgba(255,152,0,0.1))"
                  : "transparent"
              }
              color={mode === m ? "secondary.400" : "gray.400"}
              borderRadius="md"
              px={3}
              py={1.5}
              height="auto"
              fontFamily="mono"
              fontWeight={mode === m ? "bold" : "medium"}
              letterSpacing="tight"
              borderWidth={mode === m ? 1 : 0}
              borderColor={mode === m ? "secondary.800" : "transparent"}
              _hover={{
                bg:
                  mode === m
                    ? "linear-gradient(135deg, rgba(255,152,0,0.3), rgba(255,152,0,0.15))"
                    : "blackAlpha.300",
                color: "secondary.400",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
              _active={{
                bg: "blackAlpha.500",
                transform: "translateY(0)",
              }}
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "secondary.400",
                outlineOffset: "2px",
                boxShadow: "0 0 0 2px rgba(255,152,0,0.3)",
                borderColor: mode === m ? "secondary.800" : "transparent",
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              mr={1}
              aria-label={`${m.toUpperCase()}エディターモードに切り替え`}
              aria-pressed={mode === m}
            >
              {m.toUpperCase()}
            </Button>
          ))}
          <Button
            onClick={handleClear}
            colorScheme="gray"
            bg="transparent"
            color="gray.400"
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight="medium"
            letterSpacing="tight"
            borderWidth={0}
            position="relative"
            _hover={{
              bg: "linear-gradient(135deg, rgba(128,90,213,0.2), rgba(128,90,213,0.1))",
              color: "purple.400",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "linear-gradient(135deg, rgba(128,90,213,0.3), rgba(128,90,213,0.2))",
              color: "purple.500",
              transform: "translateY(2px)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.5) inset",
              _after: {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "md",
                background: "rgba(0,0,0,0.1)",
              },
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: "purple.400",
              outlineOffset: "2px",
            }}
            transition="all 0.12s cubic-bezier(0.2, 0, 0.1, 1)"
            ml={2}
            aria-label="このエディタの内容をクリア"
            title="このエディタの内容だけを消去します"
          >
            <Icon as={GiBroom} mr={1} />
            Clear
          </Button>
        </HStack>
      </MotionFlex>
      {/* --- Vimモード表示ステータスバー --- */}
      <MotionFlex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={4}
        py={1.5}
        bg="linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))"
        borderTopWidth={1}
        borderColor="primary.700"
        zIndex={5}
        fontSize="sm"
        fontFamily="mono"
        justifyContent="space-between"
        alignItems="center"
        backdropFilter="blur(10px)"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${modeInfo[vimMode].color}, transparent)`,
          opacity: 0.6,
        }}
      >
        <AnimatePresence mode="wait">
          <MotionFlex
            alignItems="center"
            key={vimMode}
            variants={modeIndicatorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Icon
              as={modeInfo[vimMode].icon}
              color={modeInfo[vimMode].color}
              mr={2}
            />
            <MotionText
              color={modeInfo[vimMode].color}
              fontWeight="medium"
              fontSize="sm"
              textShadow={`0 0 8px ${modeInfo[vimMode].color}40`}
            >
              {modeInfo[vimMode].text}
            </MotionText>
          </MotionFlex>
        </AnimatePresence>
        <Flex alignItems="center" gap={3}>
          <Text color="gray.500" fontSize="xs">
            {modeInfo[vimMode].hint}
          </Text>
          {!showPreview && (
            <Button
              onClick={handleResetAll}
              colorScheme="red"
              variant="solid"
              size="sm"
              height="28px"
              minW="auto"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              px={3}
              py={1.5}
              fontFamily="mono"
              fontWeight="bold"
              letterSpacing="tight"
              _hover={{
                bg: "red.400",
                color: "white",
                boxShadow: "0 4px 8px rgba(255,0,0,0.15)",
              }}
              _active={{
                bg: "red.600",
                color: "white",
                transform: "scale(0.98)",
              }}
              _focus={{ outline: "none" }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "red.400",
                outlineOffset: "2px",
              }}
              transition="all 0.12s cubic-bezier(0.2, 0, 0.1, 1)"
              ml={2}
              aria-label="全てのサンプルを初期状態に戻す"
              title="全てのサンプルを初期状態に戻します"
            >
              <Icon as={FiRefreshCw} boxSize="16px" mr={1} />
              Reset All
            </Button>
          )}
        </Flex>
      </MotionFlex>
      {/* --- Editor本体エリア or プレビュー or CodePenモード --- */}
      <Box
        flex={1}
        minHeight={0}
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        display="flex"
        position="relative"
        mb={8}
        height="100%"
        maxH="100%"
        justifyContent="center"
      >
        {/* CodePenモード: 左右分割レイアウト */}
        {showCodePenMode ? (
          <Flex
            w="100%"
            h="100%"
            direction={{ base: "column", lg: "row" }}
            gap={2}
          >
            {/* 左側: プレビュー */}
            <Box
              flex={1}
              minH={{ base: "200px", lg: "auto" }}
              borderRadius="md"
              bg="white"
              boxShadow="lg"
              overflow="hidden"
            >
              <iframe
                title="CodePen Preview"
                srcDoc={codePenSrcDoc}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "white",
                }}
                sandbox={
                  process.env.NODE_ENV === "development"
                    ? "allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
                    : "allow-scripts allow-same-origin allow-modals"
                }
              />
            </Box>

            {/* 右側: エディター */}
            <Box
              flex={1}
              minH={{ base: "200px", lg: "auto" }}
              borderRadius="md"
              bg="transparent"
              overflow="hidden"
            >
              {/* HTMLモード専用エディタ */}
              {mode === "html" && (
                <CodeMirror
                  key="html-editor-codepen"
                  value={docs.html}
                  height="100%"
                  extensions={htmlExtensions}
                  theme={oneDark}
                  onChange={(value) => {
                    setDocs((prev) => {
                      const updated = { ...prev, html: value };
                      saveDocsToStorage(updated);
                      return updated;
                    });
                  }}
                  onUpdate={onUpdate}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                  }}
                  style={{
                    height: "100%",
                    fontSize: "16px",
                    background: "transparent",
                  }}
                />
              )}

              {/* CSSモード専用エディタ */}
              {mode === "css" && (
                <CodeMirror
                  key="css-editor-codepen"
                  value={docs.css}
                  height="100%"
                  extensions={cssExtensions}
                  theme={oneDark}
                  onChange={(value) => {
                    setDocs((prev) => {
                      const updated = { ...prev, css: value };
                      saveDocsToStorage(updated);
                      return updated;
                    });
                  }}
                  onUpdate={onUpdate}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                  }}
                  style={{
                    height: "100%",
                    fontSize: "16px",
                    background: "transparent",
                  }}
                />
              )}

              {/* JSモード専用エディタ */}
              {mode === "js" && (
                <CodeMirror
                  key="js-editor-codepen"
                  value={docs.js}
                  height="100%"
                  extensions={jsExtensions}
                  theme={oneDark}
                  onChange={(value) => {
                    setDocs((prev) => {
                      const updated = { ...prev, js: value };
                      saveDocsToStorage(updated);
                      return updated;
                    });
                  }}
                  onUpdate={onUpdate}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                  }}
                  style={{
                    height: "100%",
                    fontSize: "16px",
                    background: "transparent",
                  }}
                />
              )}
            </Box>
          </Flex>
        ) : (
          /* 通常モード: Vimエディター or プレビュー */
          <>
            {/* 各モード専用のCodeMirrorインスタンス - 完全に独立したundo履歴 */}
            {!showPreview && (
              <Box
                w="100%"
                h="100%"
                maxH={{ base: "340px", md: "480px", lg: "560px" }}
                minH={{ base: "220px", md: "320px" }}
                overflowY="auto"
                borderRadius="md"
                bg="transparent"
                boxShadow="none"
                style={{
                  height: "100%",
                  fontSize: "16px",
                  outline: "none",
                }}
              >
                {/* HTMLモード専用エディタ */}
                {mode === "html" && (
                  <CodeMirror
                    key="html-editor"
                    ref={editorRef}
                    value={docs.html}
                    height="100%"
                    extensions={htmlExtensions}
                    theme={oneDark}
                    onChange={(value) => {
                      setDocs((prev) => {
                        const updated = { ...prev, html: value };
                        saveDocsToStorage(updated);
                        return updated;
                      });
                    }}
                    onUpdate={onUpdate}
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      background: "transparent",
                    }}
                  />
                )}

                {/* CSSモード専用エディタ */}
                {mode === "css" && (
                  <CodeMirror
                    key="css-editor"
                    ref={editorRef}
                    value={docs.css}
                    height="100%"
                    extensions={cssExtensions}
                    theme={oneDark}
                    onChange={(value) => {
                      setDocs((prev) => {
                        const updated = { ...prev, css: value };
                        saveDocsToStorage(updated);
                        return updated;
                      });
                    }}
                    onUpdate={onUpdate}
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      background: "transparent",
                    }}
                  />
                )}

                {/* JSモード専用エディタ */}
                {mode === "js" && (
                  <CodeMirror
                    key="js-editor"
                    ref={editorRef}
                    value={docs.js}
                    height="100%"
                    extensions={jsExtensions}
                    theme={oneDark}
                    onChange={(value) => {
                      setDocs((prev) => {
                        const updated = { ...prev, js: value };
                        saveDocsToStorage(updated);
                        return updated;
                      });
                    }}
                    onUpdate={onUpdate}
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      background: "transparent",
                    }}
                  />
                )}
              </Box>
            )}
            {/* モード切替ボタン群は本来ヘッダー内HStackでmapしているので、ここは削除して閉じタグを正しくする */}
          </>
        )}
      </Box>
    </MotionBox>
  );
}

export default VimEditor;
