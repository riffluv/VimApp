'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Text, HStack, Select, Badge, useColorModeValue } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { markdown } from '@codemirror/lang-markdown'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { vim } from '@replit/codemirror-vim'
import { keymap } from '@codemirror/view'

// 言語別のサンプルコード
const codeExamples = {
  javascript: `// Neovim実践練習 - JavaScript
// ================================================
// このファイルを使って実務で役立つVimコマンドを練習しましょう
// 初級から上級まで段階的に練習できるようになっています
// ================================================

// ===== 【初級】基本的な移動と編集 =====

// 課題1: カーソル移動の基本
// h,j,k,lでカーソルを移動して、以下の変数名をすべて「user」に変更してください
// ヒント: ceを使うと単語を変更できます
const usr1 = { name: 'Yamada' };
const usrName = 'Tanaka';
const get_usr = () => console.log('Hello');

// 課題2: 単語操作の練習
// 1. 以下の関数名を「calculateTotal」に変更してください (ciw)
// 2. priceをヤンク(yiw)し、amountの位置にペースト(p)してください
function calc(items) {
  return items.map(item => item.price * item.amount)
    .reduce((sum, total) => sum + total, 0);
}

// ===== 【中級】効率的な編集テクニック =====

// 課題3: 括弧内の操作
// 以下の関数でci(を使って括弧内のパラメータを別の内容に置き換えてみましょう
// 次にci{で関数の中身を書き換えてみましょう
function fetchData(url, options, callback) {
  const response = fetch(url, options)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
  
  return response;
}

// 課題4: 行操作の練習
// 1. ddでいずれかの行を削除
// 2. yyで行をコピーし、p で別の場所にペースト
// 3. 5jjで5行下に移動
// 4. Shift+V で行選択モードを開始し、jで複数行選択、> でインデント追加
const items = [
  { id: 1, name: 'Item 1', price: 100 },
  { id: 2, name: 'Item 2', price: 200 },
  { id: 3, name: 'Item 3', price: 300 },
  { id: 4, name: 'Item 4', price: 400 },
  { id: 5, name: 'Item 5', price: 500 },
];

// 課題5: テキスト置換の練習
// 以下の文字列で 'old' を 'new' に置換する方法を練習しましょう
// ヒント: :%s/old/new/g でファイル全体、:s/old/new/ で現在行のみ置換
const oldText1 = 'This is old text';
const oldText2 = 'We need to replace old with new';
const oldText3 = 'One more old string';

// ===== 【上級】実務シナリオでの編集 =====

// 課題6: リファクタリング
// 以下のコードをリファクタリングしてください
// 1. クラス名をUserManagerからUserServiceに変更 (多箇所をまとめて変更)
// 2. メソッド内のコンソールログをすべて削除 (参考: /console.log で検索→dd)
// 3. formatUserメソッドを追加 (o で下に行を作成→コードを追加)
class UserManager {
  constructor(private apiClient) {
    console.log('UserManager initialized');
  }

  async getUsers() {
    console.log('Fetching users...');
    const users = await this.apiClient.get('/users');
    console.log('Users fetched:', users);
    return users;
  }

  async getUserById(id) {
    console.log('Fetching user with ID:', id);
    return this.apiClient.get(\`/users/\${id}\`);
  }

  async updateUser(id, data) {
    console.log('Updating user...');
    return this.apiClient.put(\`/users/\${id}\`, data);
  }
  
  // ここに新しいformatUserメソッドを追加してください
}

// 課題7: バグ修正シナリオ
// 以下のコードには3つのバグがあります。修正してください。
// ヒント: よく使うコマンド - /, n, ciw, cit, f), %
function calculateDiscountPrice(product, discountRules) {
  const { price, category, isSpecial } = products; // バグ1: product変数の誤り
  
  let discount = 0;
  
  if (icSpecial) { // バグ2: 変数名ミスタイプ
    discount = price * 0.2;
  } else if (discount_rules.hasOwnProperty(category)) { // バグ3: 変数名の不一致
    discount = price * discountRules[category];
  }
  
  return price - discount;
}

// 課題8: マクロ活用
// 以下の配列を一度に整形します
// 1. qaでマクロ記録開始→整形操作→qで記録終了
// 2. @aでマクロ実行、繰り返し実行は5@a
const errorMessages = [
  'ERROR_1: Invalid input',
  'ERROR_2: Network failure',
  'ERROR_3: Database error',
  'ERROR_4: Authentication failed',
  'ERROR_5: Permission denied'
];

// 以下のようにエラーコードとメッセージを分離するとします
// 整形後の理想形:
// { code: 'ERROR_1', message: 'Invalid input' },
// { code: 'ERROR_2', message: 'Network failure' },
// ...

// 課題9: 高度な選択と編集
// 以下のJSONデータを次のように変換します:
// 1. データ構造を選択 (vi{ や va{ を駆使)
// 2. キー名を変更 (:%s/"id"/"userId"/g などで置換)
// 3. 不要なデータの削除 (dd)
const userData = {
  "id": 1,
  "name": "Tanaka Taro",
  "username": "ttaro",
  "email": "t.taro@example.com",
  "address": {
    "street": "9-8-7 Roppongi",
    "suite": "Apt. 556",
    "city": "Minato-ku",
    "zipcode": "106-0032",
    "geo": {
      "lat": "35.6604",
      "lng": "139.7292"
    }
  },
  "phone": "090-1234-5678",
  "website": "tanaka.dev",
  "company": {
    "name": "Tech Corp",
    "catchPhrase": "Multi-layered solution",
    "bs": "harness real-time markets"
  }
};

// 課題10: 実践コードナビゲーション
// このコード全体を見渡すための練習をしてみましょう:
// 1. gg (ファイル先頭へ)
// 2. G (ファイル末尾へ)
// 3. {/} (段落単位で移動)
// 4. Ctrl+d/Ctrl+u (半ページ移動)
// 5. /fetchData (特定の関数を検索)
// 6. * (カーソル位置のキーワードを検索)
// 7. % (対応する括弧に移動)

// ===== 【挑戦】実務的なコード編集 =====

// 挑戦1: コンポーネントの作成
// 以下に新しいReactコンポーネントを作成してください
// ヒント: i で挿入モード開始、Esc で戻る
// ここに新しいコンポーネントを作成してください

// 挑戦2: コード整形
// 以下の整形されていないコードを整形してください
// ヒント: vap で段落選択、= で整形
function   messyFunction(a,b,c)
{if(a>b){return a*c}
else if(b>c){return b*a}else
{return c*(a+b)}}

// ※ 練習を進める中で、以下のVimコマンドをぜひ活用してください:
// 
// ノーマルモード:
// . - 最後の編集を繰り返す（超便利！）
// zz - カーソル位置を画面中央に
// u - 元に戻す（アンドゥ）
// Ctrl+r - やり直し（リドゥ）
// 
// テキストオブジェクト:
// diw - 単語を削除
// ciw - 単語を変更
// yi( - 括弧内をコピー
// va{ - 波括弧ブロックを選択（括弧含む）
// vi" - 引用符内を選択
//
// 練習お疲れ様でした！実務でも活用してください！`,

  html: `<!DOCTYPE html>
<!-- 
===========================================
HTMLファイルでのVim実践練習
===========================================
このファイルを使って実務で役立つVimコマンドを練習しましょう！
初級から上級まで段階的に練習できるようになっています。
===========================================
-->
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <!-- 課題1: ci"を使ってviewportの内容を変更してみましょう -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vim実践練習 - HTML</title>
  
  <!-- 課題2: yy でこのstyleタグ全体をコピー(ヤンク)し、p で貼り付けてみましょう -->
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      /* 課題3: A を押して行末で挿入モードを開始し、プロパティを追加しましょう */
    }
    
    .vim-command {
      background-color: #f0f0f0;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-family: monospace;
    }

    /* 課題4: o を押して新しいCSSセレクタを下に追加してみましょう */
    
    /* 課題5: dd で以下のルールを削除してみましょう */
    .delete-me {
      color: red;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <!-- 課題6: vat(タグごと選択)でこのヘッダーを選択してみましょう -->
  <header>
    <h1>Vimの実践的な使い方を学ぶ</h1>
    <p>このHTMLドキュメントを編集して実務で使えるVimスキルを練習しましょう。</p>
  </header>
  
  <main>
    <!-- 課題7: vit(タグ内の選択)でこのセクション内のテキストだけを選択してみましょう -->
    <section>
      <h2>実務で使える基本コマンド</h2>
      <ul>
        <!-- 課題8: } を使って次の段落に移動してみましょう -->
        <li><span class="vim-command">h</span>, <span class="vim-command">j</span>, <span class="vim-command">k</span>, <span class="vim-command">l</span> - 基本的な移動</li>
        <li><span class="vim-command">i</span> - カーソル位置で挿入モード開始</li>
        <li><span class="vim-command">Esc</span> - ノーマルモードに戻る</li>
        <li><span class="vim-command">:w</span> - 保存、<span class="vim-command">:q</span> - 終了</li>
        <!-- 課題9: o を押して新しい項目を追加しましょう -->
      </ul>
    </section>

    <!-- 課題10: テキスト編集の実践練習 -->
    <section>
      <h2>テキスト編集の実践</h2>
      
      <!-- 課題11: ciw でカーソル上の単語を変更してみましょう -->
      <p>これは<em>テキスト</em>編集の練習です。このテキストを編集してみましょう。</p>
      
      <!-- 課題12: V(行選択)で行を選択して d で削除してみましょう -->
      <p>この行を削除してみましょう。とても簡単です。</p>
      
      <!-- 課題13: r で文字置換。カーソルを[の上に置いて r を押し、別の文字に置き換えます -->
      <p>この[括弧]を置き換えて(丸括弧)にしてみましょう。</p>
      
      <!-- 課題14: f> で次の>に移動し、; で次の出現に移動 -->
      <p><span>このspan要素</span>と<span>このspan要素</span>と<span>このspan要素</span>間を素早く移動してみましょう</p>
    </section>
    
    <!-- 課題15: 属性の編集練習 -->
    <section>
      <h2>HTML属性の編集</h2>
      
      <!-- 課題16: cit で次のdivタグ内のテキストを全て置換しましょう -->
      <div id="replace-content">ここの内容を全て置換してみましょう</div>
      
      <!-- 課題17: ci" でクラス名を変更してみましょう -->
      <button class="btn-primary">クリック</button>
      
      <!-- 課題18: ca> で次のタグを丸ごと変更してみましょう -->
      <span>この要素を丸ごと変更</span>
    </section>
  </main>
  
  <footer>
    <!-- 課題19: >> を使って以下の段落をインデントしてみましょう -->
    <p>Vimを使いこなせば、コーディング効率が大幅に向上します。</p>
    <p>日々の練習で少しずつスキルアップしましょう。</p>
    
    <!-- 課題20: マクロの活用練習 -->
    <!-- qa でマクロ記録を開始し、以下の項目に対して操作を行い、q で記録終了、@a で再生してみましょう -->
    <!-- 例：各項目の先頭に"✓ "を追加する処理 -->
    <ul>
      <li>HTMLの基本構造を理解する</li>
      <li>CSSによるスタイリングを学ぶ</li>
      <li>JavaScriptの基礎を学習する</li>
      <li>レスポンシブデザインを実装する</li>
      <li>アクセシビリティに配慮する</li>
    </ul>
  </footer>

  <!-- 課題21: 矩形選択の実践 -->
  <!-- Ctrl+v で矩形選択を行い、複数行を一度に編集してみましょう -->
  <!-- 例えば以下の行の先頭に同じ文字(例：「★ 」)を挿入してみましょう -->
  <div class="multiple-lines">
    フロントエンド開発の基礎
    HTMLの基本構造
    CSSによるスタイリング
    JavaScriptの基本
    モダンフレームワーク入門
  </div>
</body>
</html>`,

  css: `/* 
============================================
Neovim実践練習 - CSS
============================================
このファイルを使って実務で役立つVimコマンドを練習しましょう！
初級から上級まで段階的に練習できるようになっています。
============================================
*/

/* ===== 【初級】基本的な編集 ===== */

/* 課題1: 変数定義の編集練習 */
/* ci' を使って各色の値を変更してみましょう */
:root {
  --primary-color: #6246ea;      /* ci' で色を変更する */
  --secondary-color: #e45858;    /* ci' で色を変更する */
  --dark-color: #2b2c34;         /* ci' で色を変更する */
  --light-color: #fffffe;        /* ci' で色を変更する */
  --background: #d1d1e9;         /* ci' で色を変更する */
}

/* 課題2: 段落のインデント練習 */
/* vap で段落全体を選択し、> でインデントを増やしてみましょう */
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
  color: var(--dark-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

/* 課題3: コピー＆ペースト練習 */
/* 以下の変数名を yw (ヤンク単語) を使ってコピーし、ペーストして使い回してみましょう */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* ===== 【中級】効率的な編集 ===== */

/* 課題4: o によるコード追加練習 */
/* 以下のルールのどこかで o を押して、新しいプロパティを追加してみましょう */
header {
  background-color: var(--dark-color);
  color: var(--light-color);
  padding: 1rem 0;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* 課題5: 不要コードの削除練習 */
/* dd を使って不要なプロパティを削除してみましょう */
.card {
  background-color: var(--light-color);
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem 0;
  /* 以下の行を dd で削除してみましょう */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

/* 課題6: 行結合練習 */
/* 以下の2つのルールで J を使って結合してみましょう */
.card:hover {
  transform: translateY(-5px);
}

/* 課題7: 複製と編集の練習 */
/* yy でこのセレクタをコピーし、p で貼り付けてから編集してみましょう */
.btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--light-color);
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #5034d2;
}

/* ===== 【上級】実務シナリオでの編集 ===== */

/* 課題8: 波括弧内の編集練習 */
/* 以下のメディアクエリに対して操作します */
/* 1. vi{ で波括弧内を選択 */
/* 2. > でインデントを増やす */
/* 3. < でインデントを減らす */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .card {
    padding: 1.5rem;
  }
}

/* 課題9: マクロを使った繰り返し編集 */
/* Vim マクロを使ってこれらのクラスを編集してみましょう */
/* 1. qa でマクロ記録開始 */
/* 2. 何か編集する (例: コメントを追加する) */
/* 3. j で次の行に移動 */
/* 4. q でマクロ記録終了 */
/* 5. 5@a で5回マクロを実行 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* 課題10: 行末までの編集 */
/* C（大文字のC）を使って行末まで削除して挿入モードに入り、新しく書いてみましょう */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* 課題11: 検索と置換の実践 */
/* :%s/primary/main/g を使って、このファイル内のすべての "primary" を "main" に置換してみましょう */
.highlight {
  background-color: var(--primary-color);
  color: var(--light-color);
  font-weight: bold;
  padding: 0.5rem;
}

/* 課題12: 実務的な複雑なCSS編集 */
/* このネストされたセレクタに対して様々な編集操作を試してみましょう */
.complex-component {
  position: relative;
}
.complex-component .header {
  margin-bottom: 1rem;
}
.complex-component .content {
  padding: 1rem;
  border: 1px solid #eee;
}
.complex-component .footer {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
}
.complex-component .button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
}

/* 課題13: アニメーションの編集 */
/* ci{ を使って波括弧の内容を変更してみましょう */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 課題14: コード整形の練習 */
/* 整形されていない以下のCSSを = を使って整形してみましょう */
.messy{margin:0;padding:0;background:#fff;color:#333;font-size:16px;line-height:1.5;}

/* 実務で役立つVimコマンド活用術、お疲れ様でした！ */`,

  markdown: `# Neovim実践ガイド

<!-- 
=======================================
Markdownファイルでの実践的Vim練習
=======================================
このファイルを使って実務で役立つVimコマンドを練習しましょう！
初級から上級まで段階的に練習できるようになっています。
=======================================
-->

## はじめに

**Neovim** 実践練習環境へようこそ！このMarkdownファイルでVimの高度なテクニックを練習しましょう。

<!-- 課題1: gUap で段落全体を大文字に変換してみましょう -->
vim は多くのプログラマーに愛用されているテキストエディタです。初めは学習曲線が急ですが、マスターすれば編集効率が大幅に向上します。このガイドでは基本的なコマンドから応用テクニックまで、実務で本当に使えるテクニックを紹介します。

## 実践的な移動テクニック

Vimでは、以下のキーを使って効率的に移動できます：

<!-- 課題2: >> を使ってこのリストをインデントしてみましょう -->
- **h** - 左へ移動
- **j** - 下へ移動
- **k** - 上へ移動
- **l** - 右へ移動
- **w** - 単語単位で前に移動
- **b** - 単語単位で後ろに移動
- **}** - 段落単位で下に移動
- **{** - 段落単位で上に移動

<!-- 課題3: o を押して新しい行を挿入し、別の移動コマンドを追加してみましょう -->

### テキスト選択の実践

<!-- 課題4: /検索 と入力して「検索」という単語を検索してみましょう -->
検索と置換のテクニックは実務でとても重要です：

1. **/** - 前方検索（例: \`/function\` で関数を検索）
2. **?** - 後方検索
3. **n** - 次の検索結果へジャンプ
4. **N** - 前の検索結果へジャンプ
5. ***** - カーソル位置の単語を検索（変数の参照箇所を素早く見つける）

<!-- 課題5: dd でこの行を削除してください -->
この行は削除練習用です。思い切って削除してみましょう。

## 実践的な編集テクニック

<!-- 課題6: dap でこの段落を削除してみましょう -->
高度な編集テクニックを習得することで、コーディング効率が劇的に向上します。特に「オペレータ + モーション」と「テキストオブジェクト」の概念を理解すると、複雑な編集作業も素早く実行できるようになります。例えば「dap」で段落ごと削除、「ci"」で引用符内のテキストを変更といった操作が可能です。

### コードブロックの操作

以下のコードブロックを使って練習しましょう：

~~~javascript
// 課題7: vi{ で波括弧内を選択し、= でコードを整形してみましょう
function calculateTotal(items) {
  return items.map(item => {
    const { price, quantity } = item;
    return price * quantity;
  })
  .filter(price => price > 0)
  .reduce((sum, price) => {
    return sum + price;
  }, 0);
}
~~~

### テキストオブジェクトの実践

テキストオブジェクトを使うと、構造化されたテキストを効率的に扱えます：

<!-- 課題8: 以下のテキストオブジェクトを使って練習してみましょう -->
- **ciw** - 単語を変更（change in word）
- **ci"** - 引用符内のテキストを変更
- **ci(** - かっこ内のテキストを変更
- **cit** - タグ内のテキストを変更
- **ci{** - 波括弧内のテキストを変更

<!-- 課題9: yi" で次の引用符内の文字列をヤンク(コピー)してみましょう -->
コピーすべき文字列は "テキストオブジェクトの練習" です。

## 実務でよく使う高度なテクニック

Vimには多くの高度な機能があります：

### マクロを使った作業の自動化

<!-- 課題10: 以下の複数行を一括編集するためのマクロを作成してみましょう -->
- タスク1: データベース設計
- タスク2: API実装
- タスク3: フロントエンド開発
- タスク4: テスト作成
- タスク5: デプロイ作業

<!-- マクロの例: qa (マクロ記録開始) → 0 (行頭に移動) → i (挿入モード) → "- 完了: " など挿入 → Esc → j (次の行) → q (マクロ記録終了) → 4@a (4回繰り返し) -->

### テキスト整形と段落操作

<!-- 課題11: gqap でこの段落を整形してみましょう -->
この段落はとても長い一行で書かれていますが、Vimでは gq コマンドを使ってテキストを整形できます。段落を選択して gq を押すか、gqap のようにモーションと組み合わせて使うことで、テキストは自動的に折り返されて読みやすく整形されます。これは長文のコメントやドキュメントを書く際に非常に便利なテクニックです。

### 実務的な置換テクニック

<!-- 課題12: :%s/検索/置換/g でこのファイル内の「検索」をすべて「置換」に置換してみましょう -->

例:
* \`:s/old/new/\` - 現在行の最初の「old」を「new」に置換
* \`:s/old/new/g\` - 現在行のすべての「old」を「new」に置換
* \`:%s/old/new/g\` - ファイル全体のすべての「old」を「new」に置換
* \`:%s/old/new/gc\` - ファイル全体のすべての「old」を「new」に置換（確認あり）

### マークを使った位置のブックマーク

<!-- 課題13: マークの使い方を練習しましょう -->
1. \`ma\` でこの位置を「a」としてマーク
2. 別の場所に移動（例：ファイルの先頭に移動 - gg）
3. \`\`a\` でこの位置に戻ってくる

### 実践的なビジュアルモード操作

<!-- 課題14: ビジュアルモードで範囲選択してから操作する練習 -->
1. \`v\` でビジュアルモードを開始
2. 移動コマンドで範囲を選択（例：jj で3行選択）
3. \`d\` で選択範囲を削除、または \`y\` でコピー

> ヒント: Vimコマンドを組み合わせることで、編集作業が劇的に効率化します！

<!-- 課題15: ZZ と入力して保存して閉じるか、:q! と入力して保存せずに閉じてみましょう -->

*実務的なVim編集、お疲れ様でした！*`
}

const languageSetup = {
  javascript: {
    extensions: [javascript()],
    name: 'JavaScript'
  },
  html: {
    extensions: [html()],
    name: 'HTML'
  },
  css: {
    extensions: [css()],
    name: 'CSS'
  },
  markdown: {
    extensions: [markdown()],
    name: 'Markdown'
  }
}

const Editor = () => {
  const [language, setLanguage] = useState<'javascript' | 'html' | 'css' | 'markdown'>('javascript')
  const [code, setCode] = useState(codeExamples.javascript)
  const editorRef = useRef<HTMLDivElement>(null)
  
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const headerBgColor = useColorModeValue('gray.700', 'gray.800')

  useEffect(() => {
    // 文字化け解消のためにShift-JISからUTF-8に変換
    try {
      setCode(codeExamples[language])
    } catch (e) {
      console.error('文字コード変換エラー:', e)
    }
  }, [language])

  // ブラウザのデフォルトショートカットを防止
  useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      // Vimコマンドとして使用する特定のキー組み合わせを透過
      if ((e.ctrlKey && ['h', 'd', 'w', 'u', 'f', 'b', 'n', 'p', 'r', 'j', 'k'].includes(e.key)) ||
          (e.ctrlKey && e.key === '[') ||
          (e.ctrlKey && e.key === ']')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const editorElement = editorRef.current
    if (editorElement) {
      // イベントリスナーを追加
      editorElement.addEventListener('keydown', preventDefaultKeys, true)
    }

    // クリーンアップ
    return () => {
      if (editorElement) {
        editorElement.removeEventListener('keydown', preventDefaultKeys, true)
      }
    }
  }, [])

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={bgColor}>
      <HStack
        justifyContent="space-between"
        py={2}
        px={4}
        bg={headerBgColor}
        borderBottom="1px solid"
        borderColor="whiteAlpha.300"
      >
        <HStack spacing={2} align="center">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            w="auto"
            size="sm"
            variant="filled"
            bg="whiteAlpha.200"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            _focus={{ bg: "whiteAlpha.300" }}
            borderColor="whiteAlpha.300"
            sx={{
              option: {
                bg: "gray.700",
                color: "white",
              }
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="markdown">Markdown</option>
          </Select>
          <HStack spacing={1}>
            <Badge colorScheme="green">初級</Badge>
            <Badge colorScheme="yellow">中級</Badge>
            <Badge colorScheme="red">上級</Badge>
          </HStack>
        </HStack>
      </HStack>
      
      <Box flex="1" className="vim-editor" overflow="auto" ref={editorRef}>
        <CodeMirror
          value={code}
          onChange={setCode}
          theme={dracula}
          height="100%"
          extensions={[
            ...languageSetup[language].extensions,
            vim(),
            keymap.of([
              // 追加のカスタムキーマップをここに追加可能
            ])
          ]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
          }}
        />
      </Box>

      <Box
        py={2}
        px={4}
        borderTop="1px solid"
        borderColor="whiteAlpha.300"
        fontSize="sm"
        color="gray.400"
      >
        <Text>Vim実践練習環境 - {languageSetup[language].name}コードをVimコマンドで編集してみましょう</Text>
      </Box>
    </Box>
  )
}

export default Editor 