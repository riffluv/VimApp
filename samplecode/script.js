// Vimヒント: Vimの基本 - ノーマルモード(ESC)で移動・編集、挿入モード(i)で文字入力

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
  selectedMode.textContent = `Tip: ${tips[index]}`;
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

// Vimヒント: 実務でよく使うコマンド - ciw(単語変更)、ci"(文字列変更)、A(行末に挿入)、/(検索)、%(括弧移動)
