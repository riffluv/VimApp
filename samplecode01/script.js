// //vimtips レベル3: ciw(単語を変更)、ci"(""内を変更)、/(検索)、n/N(次/前の検索結果)
window.onload = () => {
  // //vimtips レベル3: :%s/old/new/g(全置換)、v(文字選択)、V(行選択)、Ctrl+v(矩形選択)
  initParticles();
  setupMenuListeners();
  setupKeyboardShortcuts();
  initVimTips();
};

// //vimtips レベル4: >>(インデント追加)、<<(インデント削除)、=(自動インデント)、%(対応括弧移動)
function initParticles() {
  tsParticles.load("tsparticles", {
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 40 },
      color: { value: ["#ff6600", "#ffaa00"] },
      shape: { type: "circle" },
      opacity: { value: 0.6 },
      size: { value: { min: 1, max: 3 } },
      move: {
        enable: true,
        speed: 0.6,
        direction: "top",
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  });
}

// //vimtips レベル4: cit(タグ内変更)、dit(タグ内削除)、ci{({}内変更)、da{({}含めて削除)
function setupMenuListeners() {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      showVimTip(index);
      highlightMenuItem(item);
    });

    item.addEventListener("mouseenter", () => {
      playHoverSound();
    });
  });
}

// //vimtips レベル5: .(直前操作繰り返し)、qa(マクロ記録開始)、@a(マクロ実行)、:bn/:bp(バッファ切替)
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key >= "1" && e.key <= "4") {
      const index = parseInt(e.key) - 1;
      const menuItems = document.querySelectorAll(".menu-item");

      if (menuItems[index]) {
        highlightMenuItem(menuItems[index]);
        showVimTip(index);
      }
    }

    if (e.key === "Escape") {
      hideAllTips();
    }
  });
}

// //vimtips レベル5: Ctrl+w w(ウィンドウ切替)、:split/:vsplit(画面分割)、:tabnew(新タブ)、gg=G(全体インデント)
function highlightMenuItem(item) {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((menuItem) => {
    menuItem.classList.remove("active");
  });

  item.classList.add("active");
}

function showVimTip(index) {
  const tips = [
    "Vimヒント: hjkl - 左下上右に移動",
    "Vimヒント: i - カーソル位置で文字入力開始",
    "Vimヒント: ESC - ノーマルモードに戻る",
    "Vimヒント: :w - 保存、:q - 終了、:wq - 保存して終了",
  ];

  const selectedMode = document.getElementById("selectedMode");
  selectedMode.textContent = `Tip: ${tips[index]}`;
}

function hideAllTips() {
  const selectedMode = document.getElementById("selectedMode");
  selectedMode.textContent = "Mode: Vim";
}

function playHoverSound() {
  // サウンド再生のコードがここに入ります（現在は実装なし）
}

function initVimTips() {
  console.log(
    "Vimヒントシステムが初期化されました。メニュー項目をクリックしてヒントを表示します。"
  );
}