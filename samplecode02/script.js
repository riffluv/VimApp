// 【JavaScript編集】JSでは関数、オブジェクト、配列の編集が重要
class SimpleRPGMenu {
  constructor() {
    this.currentSelection = 0; // 【プロパティ】this.xxx の xxx 部分を cw で変更
    this.menuItems = []; // 【配列】[] の中身を ci[ で編集
    this.init(); // 【メソッド呼び出し】init を cw で変更
  }

  // 【メソッド名】init を cw で変更、{ } で関数間を移動
  init() {
    this.setupParticles(); // 【ドット記法】. の後の名前を cw で変更
    this.setupMenu(); // 【行の複製】yyp で行をコピーして関数呼び出しを追加
    this.setupKeyboard(); // 【引数追加】A で行末に移動して引数を追加
  }

  // 【関数定義】function名を cw で変更
  setupParticles() {
    // 【オブジェクトメソッド】tsParticles.load の load を cw で変更
    tsParticles.load("tsparticles", { // 【文字列】ci" で文字列内容を変更
      background: { // 【オブジェクト】{ } 内を ci{ で編集
        color: { value: "transparent" } // 【ネストしたオブジェクト】value を cw で変更
      },
      fpsLimit: 60, // 【数値】60 を cw で変更、Ctrl+a で増加
      particles: { // 【プロパティ名】particles を cw で変更
        number: { // 【オブジェクトのネスト】深い階層も同様に編集
          value: 30, // 【数値の変更】30 → 50 → 100 など
          density: { // 【真偽値】true ↔ false を cw で切り替え
            enable: true, // 【boolean】true/false の切り替え
            value_area: 1000 // 【アンダースコア】value_area も cw で一括変更
          }
        },
        color: { // 【配列を含むオブジェクト】
          value: ["#ffd700", "#ff6b35", "#ffffff"] // 【配列】ci[ で配列内容を編集
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            size_min: 0.5,
            sync: false
          }
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "top",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false
          },
          onclick: {
            enable: false
          },
          resize: true
        }
      },
      retina_detect: true
    });
  }

  // 【DOM操作】よく使うDOM関連の編集パターン
  setupMenu() {
    // 【セレクタ文字列】ci' でセレクタを変更
    this.menuItems = document.querySelectorAll('.menu-item');
    
    // 【forEach】配列メソッドの編集
    this.menuItems.forEach((item, index) => { // 【引数】(item, index) を ci( で編集
      // 【イベントリスナー】'mouseenter' を ci' で変更
      item.addEventListener('mouseenter', () => { // 【アロー関数】=> の前後を編集
        this.selectItem(index); // 【引数】index を cw で変更
      });
      
      // 【イベント名】'click' → 'mouseover' など
      item.addEventListener('click', () => { // 【関数の複製】yy で行をコピー
        this.activateItem(index); // 【メソッド名】activateItem を cw で変更
      });
    });
    
    // 【引数の数値】0 → 1 → 2 など
    this.selectItem(0);
  }

  // 【イベントハンドラ】キーボードイベントの編集
  setupKeyboard() {
    // 【イベント名】'keydown' を ci' で変更
    document.addEventListener('keydown', (e) => { // 【引数名】e を cw で変更
      // 【switch文】switch(e.key) の key を cw で変更
      switch(e.key) {
        // 【case文】'ArrowUp' を ci' で変更
        case 'ArrowUp': // 【文字列の編集】ArrowUp → ArrowLeft など
        case 'k': // 【単一文字】k → h など
          e.preventDefault(); // 【メソッド呼び出し】preventDefault を cw で変更
          this.navigateUp(); // 【メソッド名】navigateUp を cw で変更
          break; // 【break文】必要に応じて削除や追加
        case 'ArrowDown': // 【case追加】o で新しい行を作成してcase追加
        case 'j': // 【Vim風キー】j, k, h, l などのVimキー
          e.preventDefault(); // 【共通処理】. で直前の操作を繰り返し
          this.navigateDown(); // 【対応するメソッド】Up ↔ Down
          break;
        case 'Enter': // 【特殊キー】Enter, Space, Escape など
        case ' ': // 【スペース】空白文字も文字列として扱う
          e.preventDefault(); // 【実務】preventDefault は必須パターン
          this.activateItem(this.currentSelection); // 【プロパティアクセス】this.xxx
          break;
        case '1': // 【数字キー】'1' → '2' → '3'
        case '2': // 【連続case】複数のcaseをまとめて処理
        case '3': // 【Visual選択】V で複数行選択して一括編集
        case '4': // 【case複製】yyp でcaseをコピー
          e.preventDefault(); // 【共通処理の複製】
          const index = parseInt(e.key) - 1; // 【変数宣言】const を let に変更
          if (index >= 0 && index < this.menuItems.length) { // 【条件式】>= を > に変更
            this.selectItem(index); // 【メソッドチェーン】連続した処理
            this.activateItem(index); // 【引数の再利用】同じ変数を使用
          }
          break; // 【break忘れ】よくあるバグの原因
      }
    });
  }

  navigateUp() {
    const newSelection = this.currentSelection > 0 
      ? this.currentSelection - 1 
      : this.menuItems.length - 1;
    this.selectItem(newSelection);
  }

  navigateDown() {
    const newSelection = this.currentSelection < this.menuItems.length - 1 
      ? this.currentSelection + 1 
      : 0;
    this.selectItem(newSelection);
  }

  // 【引数】index を cw で変更
  selectItem(index) {
    // 【条件式】< 0 を <= -1 に変更、|| を && に変更
    if (index < 0 || index >= this.menuItems.length) return; // 【early return】
    
    // 【forEach + アロー関数】item => の部分を編集
    this.menuItems.forEach(item => item.classList.remove('active')); // 【メソッドチェーン】
    // 【配列アクセス】[index] の index を変数で変更
    this.menuItems[index].classList.add('active'); // 【クラス名】'active' を ci' で変更
    // 【代入】= の右辺を変更
    this.currentSelection = index; // 【プロパティ代入】
  }

  // 【関数の引数と処理】よく編集するパターン
  activateItem(index) {
    // 【変数宣言】const を let に、selectedItem を item に変更
    const selectedItem = this.menuItems[index]; // 【配列アクセス】
    // 【プロパティアクセス】dataset.mode の mode を cw で変更
    const mode = selectedItem.dataset.mode; // 【DOM プロパティ】
    
    // 【CSS プロパティ】transform の値を ci' で変更
    selectedItem.style.transform = 'translateX(30px) scale(1.05)'; // 【CSS関数】translateX
    // 【色の値】rgba(255, 215, 0, 1) の数値を個別に編集
    selectedItem.style.textShadow = '0 0 20px rgba(255, 215, 0, 1)'; // 【影の設定】
    
    // 【テンプレートリテラル】${} 内の変数を変更
    console.log(`Selected: ${selectedItem.textContent}`); // 【バッククォート】
    
    // 【setTimeout】300 を 500 に変更、アロー関数を編集
    setTimeout(() => { // 【非同期処理】
      selectedItem.style.transform = ''; // 【空文字列】リセット用
      selectedItem.style.textShadow = ''; // 【プロパティのリセット】
    }, 300); // 【ミリ秒】300 → 500 → 1000
    
    // 【メソッド呼び出し】引数を変更
    this.handleMenuSelection(mode); // 【引数渡し】
  }

  // 【switch文の編集】case文の追加・削除・変更
  handleMenuSelection(mode) {
    // 【switch式】mode を cw で変更
    switch(mode) {
      // 【文字列case】'continue' を ci' で変更
      case 'continue': // 【case値】continue → resume など
        console.log('Continue Game - Loading saved progress...'); // 【長い文字列】ci' で編集
        break; // 【break文】削除すると次のcaseも実行される
      case 'new': // 【短いcase】new → start など
        console.log('New Game - Starting fresh adventure...'); // 【メッセージ変更】
        break; // 【Visual選択】V で複数のcaseを選択
      case 'load': // 【case追加】o で新しい行、caseを追加
        console.log('Load Game - Opening save files...'); // 【ファイル操作系】
        break; // 【実務】各caseで異なる処理を実装
      case 'config': // 【設定系】config → settings など
        console.log('Config - Opening settings...'); // 【設定画面】
        break; // 【default case】default: を追加することも
    }
  }
}

// 【DOMContentLoaded】ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => { // 【イベント名】ci' で変更
  new SimpleRPGMenu(); // 【インスタンス生成】クラス名を cw で変更
}); // 【実務】初期化処理の定番パターン