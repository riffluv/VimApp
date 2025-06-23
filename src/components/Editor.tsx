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
  javascript: `// Neovim練習 - JavaScript例
// =======================================
// このファイルを使ってVimコマンドを練習しましょう！
// コメントの指示に従って操作してみてください。
// =======================================

// === 基本的な移動コマンド ===
// h, j, k, l - 左、下、上、右に移動
// w - 単語の先頭に進む
// b - 単語の先頭に戻る
// e - 単語の末尾に進む
// 0 - 行の先頭に移動
// $ - 行の末尾に移動

// === 練習1: 関数定義 ===
// 1. 以下の関数にカーソルを合わせる
// 2. 'yy' でこの行をコピー（ヤンク）
// 3. 'p' でカーソル下に貼り付け
function fibonacci(n) {
  // 'ciw'（単語を変更）を使って「fibonacci」を「calcFib」に変更してみよう
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  // 'dd'（行を削除）を使ってこの行を削除してみよう
  console.log('計算を開始します...');
  
  for (let i = 2; i <= n; i++) {
    // '/next' と入力して「next」を検索してみよう
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr; // 'A'（行末で挿入）を使って、この行の末尾に ' // 結果を返す' と追加してみよう
}

// === 練習2: 配列操作 ===
// 1. 'G' でファイルの末尾に移動
// 2. 'gg' でファイルの先頭に移動
// 3. '{' と '}' で段落間を移動

// 'o'（下に行を挿入）を使って新しいコードを追加してみよう
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 'f['（[ の位置に移動）と'%'（対応する括弧に移動）を使ってみよう
const evenNumbers = numbers.filter(num => num % 2 === 0);
const oddNumbers = numbers.filter(num => num % 2 === 1);

// === 練習3: オブジェクト操作 ===
// 'vi{'（括弧内を選択）を試してみよう、その後 'y' でコピー
const user = {
  name: '山田太郎',
  age: 30,
  email: 'yamada@example.com',
  address: {
    city: '東京',
    // 'o'（下に行を挿入）を使って新しいプロパティを追加してみよう
    postalCode: '100-0001'
  }
};

// === 練習4: テキスト編集 ===
// 'ct,'（カンマまでを変更）を使って、以下の文字列を編集してみよう
const fruits = ['りんご', 'バナナ', 'オレンジ', 'ぶどう', 'メロン'];

function displayFruits() {
  // 'V'（行選択）でこのコメントブロックを選択し、'>>'（インデント追加）を試してみよう
  console.log('果物一覧:');
  for (const fruit of fruits) {
    // 'J'（行を連結）を試してみよう（この行と次の行を連結）
    console.log(
      \`- \${fruit}\`);
  }
}

// === 練習5: 複数行の編集 ===
// 1. 'Vjj'（3行選択）
// 2. '>'（インデント追加）
// 3. 'u'（元に戻す）
function calculateTotal(items) {
  return items
    .map(item => item.price)
    .reduce((total, price) => total + price, 0);
}

// === 練習6: マクロの使用 ===
// 1. 'qa'（マクロ記録開始、レジスタaに保存）
// 2. コードを編集（例: 先頭にコメントを追加）
// 3. 'q'（マクロ記録終了）
// 4. '@a'（マクロを実行）
const day1 = { name: '月曜日', value: 1 };
const day2 = { name: '火曜日', value: 2 };
const day3 = { name: '水曜日', value: 3 };
const day4 = { name: '木曜日', value: 4 };
const day5 = { name: '金曜日', value: 5 };

// === 便利なヒント ===
// * 'u' - 変更を元に戻す
// * 'Ctrl+r' - やり直し
// * 'diw' - 単語を削除
// * 'ciw' - 単語を変更
// * 'yiw' - 単語をコピー
// * '.' - 最後の編集を繰り返す

// === チャレンジ ===
// 次の関数のコード内をすべて選択して削除し、新しいコードを書いてみましょう。
// ヒント: 'vi{' で波括弧内を選択、'd' で削除
function challenge() {
  // この関数の中身を全て削除して新しいコードを書いてみよう
  // 1. カーソルを関数の中に配置
  // 2. 'vi{' で波括弧内を選択
  // 3. 'd' で削除
  // 4. 'i' で挿入モード開始
  console.log('This is a challenge!');
  return 'Good job!';
}

// Vim練習お疲れ様でした！
`,

  html: `<!DOCTYPE html>
<!-- 
===========================================
HTMLファイルでのVim練習
===========================================
このファイルを使って様々なVimコマンドを練習しましょう！
コメント内の指示に従って操作してください。

基本操作：
- h, j, k, l: カーソル移動（左、下、上、右）
- i: カーソル位置で挿入モード開始
- a: カーソルの後ろで挿入モード開始
- Esc: ノーマルモードに戻る
- v: ビジュアルモード開始
- :w: 保存
- :q: 終了
- :wq: 保存して終了
===========================================
-->
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <!-- ヒント: ci" を使ってviewportの内容を変更してみましょう -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vim練習 - HTML</title>
  <!-- yy でこのstyleタグ全体をコピー(ヤンク)し、p で貼り付けてみましょう -->
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      /* A を押して行末で挿入モードを開始し、プロパティを追加しましょう */
    }
    
    .vim-command {
      background-color: #f0f0f0;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-family: monospace;
    }

    /* 練習: o を押して新しいCSSセレクタを下に追加してみましょう */
    
    /* 練習: dd で以下のルールを削除してみましょう */
    .delete-me {
      color: red;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <!-- ヒント: vatでタグごと全体を選択 -->
  <header>
    <h1>Vimキーバインドを学ぶ</h1>
    <p>このHTMLドキュメントを編集してVimのスキルを練習しましょう。</p>
  </header>
  
  <main>
    <!-- 練習: vit で以下のセクション内のテキストだけを選択してみましょう -->
    <section>
      <h2>基本コマンド</h2>
      <ul>
        <!-- 練習: } を使って次の段落に移動します -->
        <li><span class="vim-command">h</span>, <span class="vim-command">j</span>, <span class="vim-command">k</span>, <span class="vim-command">l</span> で移動</li>
        <li><span class="vim-command">i</span> でインサートモードに入る</li>
        <li><span class="vim-command">Esc</span> でノーマルモードに戻る</li>
        <li><span class="vim-command">:w</span> で保存、<span class="vim-command">:q</span> で終了</li>
        <!-- 練習: o を押して新しい項目を追加しましょう -->
      </ul>
    </section>

    <!-- 練習: この下の2つの段落に対して操作します -->
    <!-- 1. gg でファイルの先頭に移動 -->
    <!-- 2. /練習: を使って検索 -->
    <!-- 3. n で次の検索結果へ -->
    <section>
      <h2>テキスト編集</h2>
      <!-- 練習: ciw でカーソル上の単語を変更 -->
      <p>これは<em>テキスト</em>編集の練習です。このテキストを編集してみましょう。</p>
      
      <!-- 練習: V で行選択して d で削除 -->
      <p>この行を削除してみましょう。</p>
      
      <!-- 練習: r で文字置換。カーソルを[の上に置いて r を押し、別の文字に置き換えます -->
      <p>この[角括弧]を置き換えてみましょう。</p>
      
      <!-- 練習: f> で次の>に移動し、; で次の出現に移動 -->
      <p><span>このspan要素</span>と<span>このspan要素</span>間を素早く移動してみましょう</p>
    </section>
  </main>
  
  <footer>
    <!-- 練習: >> を使って以下の段落をインデントしてみましょう -->
    <p>楽しいVim練習を！</p>
    <p>ぜひ他のサンプルコードも試してみましょう。</p>
    
    <!-- 練習: qa でマクロ記録を開始し、以下の項目に対して操作を行い、q で記録終了、@a で再生してみましょう -->
    <ul>
      <li>項目1</li>
      <li>項目2</li>
      <li>項目3</li>
    </ul>
  </footer>

  <!-- 練習: Ctrl+v で矩形選択を行い、複数行を一度に編集してみましょう -->
  <!-- 例えば以下の行の先頭に同じ文字を挿入してみましょう -->
  <div class="multiple-lines">
    最初の行です
    次の行です
    最後の行です
  </div>
</body>
</html>`,

  css: `/* 
============================================
Neovim練習 - CSS例
============================================
このファイルを使って様々なVimコマンドを練習しましょう！
コメント内の指示に従って操作してください。

基本操作：
- h, j, k, l: カーソル移動（左、下、上、右）
- w, b, e: 単語単位で移動
- 0, $: 行頭、行末に移動
- i, a: 挿入モード開始
- v: ビジュアルモード開始
- d, y, p: 削除、コピー、貼り付け
============================================
*/

/* === 変数定義 === */
/* 練習: ci' を使って各色の値を変更してみましょう */
:root {
  --primary-color: #6246ea;      /* ci' で色を変更する */
  --secondary-color: #e45858;    /* ci' で色を変更する */
  --dark-color: #2b2c34;         /* ci' で色を変更する */
  --light-color: #fffffe;        /* ci' で色を変更する */
  --background: #d1d1e9;         /* ci' で色を変更する */
}

/* === ベーススタイル === */
/* 練習: vap で段落全体を選択し、> でインデントを増やしてみましょう */
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
  color: var(--dark-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

/* 練習: 以下の変数名を yw (ヤンク単語) を使ってコピーし、
   ペーストして使い回してみましょう */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 練習: 以下のルールのどこかで o を押して、新しいプロパティを追加してみましょう */
header {
  background-color: var(--dark-color);
  color: var(--light-color);
  padding: 1rem 0;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* === カードコンポーネント === */
/* 練習: dd を使って不要なプロパティを削除してみましょう */
.card {
  background-color: var(--light-color);
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem 0;
  /* 以下の行を dd で削除してみましょう */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

/* 練習: 以下の2つのルールで J を使って結合してみましょう */
.card:hover {
  transform: translateY(-5px);
}

/* === ボタンコンポーネント === */
/* 練習: yy でこのセレクタをコピーし、p で貼り付けてから編集してみましょう */
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

/* === レスポンシブスタイル === */
/* 練習: 以下のメディアクエリに対して操作します */
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

/* === フレックスボックスのユーティリティクラス === */
/* 練習: Vim マクロを使ってこれらのクラスを編集してみましょう */
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

/* === グリッドレイアウト === */
/* 練習: C（大文字のC）を使って行末まで削除して挿入モードに入り、新しく書いてみましょう */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* === 色の変更チャレンジ === */
/* 練習: :%s/primary/main/g を使って、このファイル内のすべての "primary" を "main" に置換してみましょう */
.highlight {
  background-color: var(--primary-color);
  color: var(--light-color);
  font-weight: bold;
  padding: 0.5rem;
}

/* Vim練習お疲れ様でした！*/`,

  markdown: `# Neovim練習ガイド

<!-- 
=======================================
Markdown ファイルでの Vim 練習
=======================================
このファイルを使って様々な Vim コマンドを練習しましょう！
以下のコマンドと練習課題を試してみてください。
=======================================
-->

## はじめに

**Neovim** 練習環境へようこそ！このMarkdownファイルでVimのキーバインディングを練習しましょう。

<!-- 練習: gUap で段落全体を大文字に変換してみましょう -->
vim は多くのプログラマーに愛用されているテキストエディタです。最初は学習曲線が急ですが、マスターすれば編集効率が大幅に向上します。このガイドでは基本的なコマンドから応用テクニックまで紹介します。

## 基本的な移動

Vimでは、以下のキーを使って移動します：

<!-- 練習: >> を使ってこのリストをインデントしてみましょう -->
- **h** - 左へ移動
- **j** - 下へ移動
- **k** - 上へ移動
- **l** - 右へ移動

<!-- 練習: o を押して新しい行を挿入し、別の移動コマンドを追加してみましょう -->

### 単語単位の移動

<!-- 練習: /単語 と入力して「単語」を検索してみましょう -->
単語単位で素早く移動するには:

1. **w** - 次の単語の先頭に移動
2. **b** - 前の単語の先頭に移動
3. **e** - 次の単語の末尾に移動
4. **ge** - 前の単語の末尾に移動

<!-- 練習: dd でこの行を削除してください -->
この行は削除してもかまいません。

## モード

Vimには複数のモードがあります：

<!-- 練習: dap でこの段落を削除してみましょう -->
1. **ノーマルモード** - デフォルトの、コマンドや移動のためのモード
2. **インサートモード** - テキストを入力するモード（\`i\`で開始）
3. **ビジュアルモード** - テキスト選択のためのモード（\`v\`で開始）
4. **コマンドモード** - コマンド実行のためのモード（\`:\`で開始）

## 練習問題

### 問題1: 移動

<!-- 練習: G でファイルの末尾に移動し、gg で先頭に戻ってみましょう -->
1. ファイルの先頭へ移動（\`gg\`）
2. ファイルの末尾へ移動（\`G\`）
3. 10行目へ移動（\`10G\`）

### 問題2: 編集

<!-- 練習: c2w で2単語を変更してみましょう -->
この単語と単語を一度に変更できます。

1. 単語を削除（\`dw\`）
2. 行を削除（\`dd\`）
3. 単語を変更（\`cw\`）
4. 変更を元に戻す（\`u\`）
5. やり直し（\`Ctrl+r\`）

### 問題3: コピーと貼り付け

<!-- 練習: この段落全体を選択してコピーしてみましょう -->
1. 行をコピー（\`yy\`）
2. カーソル後に貼り付け（\`p\`）
3. カーソル前に貼り付け（\`P\`）
4. 単語をコピー（\`yiw\`）

### 問題4: 複数行の編集

<!-- 練習: 
1. V3j で4行選択
2. > でインデント
3. u で元に戻す
-->
これは1行目です
これは2行目です
これは3行目です
これは4行目です

## 高度なトピック

<!-- 練習: 各項目を * から - に置換してみましょう（:%s/\* /-/g を使う） -->
* マクロ - 繰り返しの操作を記録して再生
* レジスタ - 複数のコピーバッファを使い分ける
* ウィンドウ分割 - 画面を分割して複数のファイルを表示
* プラグイン - 機能を拡張する

### テキスト整形

<!-- 練習: gqap でこの段落を整形してみましょう -->
この段落はとても長い一行で書かれています。Vimでは gq コマンドを使ってテキストを整形できます。段落を選択して gq を押すか、gqap のようにモーションと組み合わせて使います。テキストは自動的に折り返されて読みやすくなります。

### 置換コマンド

<!-- 練習: :%s/Vim/Neovim/g でこのファイル内の「Vim」をすべて「Neovim」に置き換えてみましょう -->

例:
* \`:s/old/new/\` - 現在行の最初の「old」を「new」に置換
* \`:s/old/new/g\` - 現在行のすべての「old」を「new」に置換
* \`:%s/old/new/g\` - ファイル全体のすべての「old」を「new」に置換
* \`:%s/old/new/gc\` - ファイル全体のすべての「old」を「new」に置換（確認あり）

> ヒント: Vimをマスターするには練習あるのみです！

<!-- 練習: ZZ と入力して保存して閉じるか、:q! と入力して保存せずに閉じてみましょう -->

*編集を楽しんでください！*
`
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
    setCode(codeExamples[language])
  }, [language])

  // ブラウザのデフォルトショートカットを防止
  useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      // Vimコマンドとして使用する特定のキー組み合わせを捕捉
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
        <Text>Vim練習環境 - {languageSetup[language].name}コードをVimコマンドで編集してみましょう</Text>
      </Box>
    </Box>
  )
}

export default Editor 