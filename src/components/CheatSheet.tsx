'use client'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  useColorModeValue,
  Tooltip,
  HStack,
  Tag,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'

// Vimコマンドカテゴリーとコマンド、説明
const vimCommands = [
  {
    category: '基本的な移動（頻出）',
    level: '初級',
    commands: [
      { key: 'h', description: '左に移動', tip: '左手の人差し指の位置。基本のカーソル移動。' },
      { key: 'j', description: '下に移動', tip: '下向き矢印のように見える。最も頻繁に使用。' },
      { key: 'k', description: '上に移動', tip: 'jの隣にあり、上向きに移動。' },
      { key: 'l', description: '右に移動', tip: '右手の人差し指の位置。基本のカーソル移動。' },
      { key: 'w', description: '次の単語の先頭に移動', tip: 'word（単語）の頭文字。コード編集で頻出。' },
      { key: 'b', description: '前の単語の先頭に移動', tip: 'back（戻る）の頭文字。wの反対操作。' },
      { key: 'e', description: '次の単語の末尾に移動', tip: 'end（末尾）の頭文字。単語の末尾に素早く移動。' },
      { key: '0', description: '行頭に移動', tip: '数字の0。行の最初の文字に移動。' },
      { key: '$', description: '行末に移動', tip: 'シェルの変数記号$。行の最後に移動。' },
      { key: 'gg', description: 'ファイルの先頭行に移動', tip: '二回gを押す。ファイルの一番上に素早くジャンプ。' },
      { key: 'G', description: 'ファイルの末尾行に移動', tip: 'シフト+g。ファイルの一番下にジャンプ。' },
      { key: '{', description: '前の段落に移動', tip: '波括弧。関数間を素早く移動可能。' },
      { key: '}', description: '次の段落に移動', tip: '波括弧。関数間を素早く移動可能。' },
      { key: '/', description: '前方検索', tip: '検索からのn/Nの組み合わせで素早く移動。' },
      { key: 'n', description: '次の検索結果へ', tip: 'next（次）の頭文字。検索結果を次々と探索。' },
      { key: 'N', description: '前の検索結果へ', tip: 'シフト+n。逆方向に検索結果を探索。' },
    ],
  },
  {
    category: '効率的な編集（必須）',
    level: '初級',
    commands: [
      { key: 'i', description: 'カーソル位置で挿入モード', tip: 'insert（挿入）の頭文字。最も基本的な編集開始。' },
      { key: 'a', description: 'カーソルの次の位置で挿入モード', tip: 'append（追加）の頭文字。iの隣のキーで覚えやすい。' },
      { key: 'A', description: '行末で挿入モード', tip: 'シフト+a。行末に素早く移動して編集開始。' },
      { key: 'o', description: '下に新しい行を作成して挿入モード', tip: 'open（開く）の頭文字。新しい行を素早く作成。' },
      { key: 'O', description: '上に新しい行を作成して挿入モード', tip: 'シフト+o。上に行を挿入。oの対となる操作。' },
      { key: 'x', description: 'カーソル位置の文字を削除', tip: '一文字だけ素早く削除したい時に便利。' },
      { key: 'dd', description: '行を削除', tip: 'delete（削除）を二回。行削除の基本コマンド。' },
      { key: 'yy', description: '行をヤンク（コピー）', tip: 'yank（引っ張る）を二回。行コピーの基本コマンド。' },
      { key: 'p', description: 'カーソルの後にペースト', tip: 'paste（貼り付け）の頭文字。コピーと組み合わせて使用。' },
      { key: 'u', description: '直前の変更を取り消し（アンドゥ）', tip: 'undo（元に戻す）の頭文字。ミスをした時の救世主。' },
      { key: 'Ctrl+r', description: '取り消した変更をやり直し（リドゥ）', tip: 'redo（やり直し）の頭文字。uの逆操作。' },
      { key: '.', description: '最後に使ったコマンドを繰り返し', tip: '編集の繰り返しに最強。同じ編集を複数箇所に適用する時に。' },
    ],
  },
  {
    category: '高速移動テクニック',
    level: '中級',
    commands: [
      { key: 'f{char}', description: '行内で次の{char}に移動', tip: 'find（見つける）の頭文字。行内を素早く移動。' },
      { key: 'F{char}', description: '行内で前の{char}に移動', tip: 'シフト+f。fの逆方向版。' },
      { key: 't{char}', description: '行内で次の{char}の手前に移動', tip: 'till（〜まで）の頭文字。fの少し手前に止まる版。' },
      { key: 'T{char}', description: '行内で前の{char}の後ろに移動', tip: 'シフト+t。tの逆方向版。' },
      { key: ';', description: '直前のf/t/F/Tを繰り返し', tip: 'セミコロン。同じ文字に次々と移動する時に便利。' },
      { key: '%', description: '対応する括弧に移動', tip: '括弧間を素早くジャンプ。コードの構造を把握する時に重宝。' },
      { key: '*', description: 'カーソル位置の単語を前方検索', tip: 'カーソル下の単語を即座に検索。変数の使用箇所を追跡するのに便利。' },
      { key: '#', description: 'カーソル位置の単語を後方検索', tip: '*の逆方向版。変数の定義場所を見つけるのに便利。' },
      { key: 'Ctrl+d', description: '画面半分だけ下に移動', tip: 'down（下）の頭文字。ページ移動の基本。' },
      { key: 'Ctrl+u', description: '画面半分だけ上に移動', tip: 'up（上）の頭文字。Ctrl+dとペアで覚える。' },
      { key: 'H', description: '画面上部に移動', tip: 'high（高い）の頭文字。画面の一番上の行に移動。' },
      { key: 'M', description: '画面中央に移動', tip: 'middle（中央）の頭文字。画面の中央行に移動。' },
      { key: 'L', description: '画面下部に移動', tip: 'low（低い）の頭文字。画面の一番下の行に移動。' },
    ],
  },
  {
    category: '効率的なテキスト編集',
    level: '中級',
    commands: [
      { key: 'ciw', description: '単語を変更', tip: 'change in word。単語全体を一発で変更できる魔法のコマンド。' },
      { key: 'ci"', description: '引用符内のテキストを変更', tip: 'change in quotes。文字列を一発で変更。プログラミングで超便利。' },
      { key: 'ci(', description: '括弧内のテキストを変更', tip: 'change in parentheses。関数の引数などを一発で変更。' },
      { key: 'ci{', description: '波括弧内のテキストを変更', tip: 'change in braces。ブロック内のコードを一発で変更。' },
      { key: 'cit', description: 'タグ内のテキストを変更', tip: 'change in tag。HTMLタグ内のコンテンツを一発で変更。' },
      { key: 'diw', description: '単語を削除', tip: 'delete in word。単語全体を削除。ciwの削除版。' },
      { key: 'yi"', description: '引用符内のテキストをヤンク', tip: 'yank in quotes。文字列をコピー。ciやdiと同じパターン。' },
      { key: 'yiw', description: '単語をヤンク', tip: 'yank in word。単語全体をコピー。' },
      { key: 'vib', description: '括弧内を選択', tip: 'visual in brackets。括弧内を視覚的に選択。' },
      { key: 'va{', description: '波括弧ブロックを選択（括弧含む）', tip: 'visual around braces。括弧自体も含めて選択。viとの違いを覚える。' },
      { key: 'gU', description: '大文字に変換', tip: 'gU{motion}の形で使用。例：gUiwで単語を大文字に。' },
      { key: 'gu', description: '小文字に変換', tip: 'gu{motion}の形で使用。例：guiwで単語を小文字に。' },
    ],
  },
  {
    category: '複数行の操作',
    level: '中級',
    commands: [
      { key: '>>',  description: '行を右にシフト（インデント）', tip: '右向きの矢印のイメージ。コードのインデントに使用。' },
      { key: '<<',  description: '行を左にシフト（アウトデント）', tip: '左向きの矢印のイメージ。インデントを戻す時に使用。' },
      { key: '>}',  description: '段落を右にシフト', tip: '段落全体をインデント。コードブロック全体を整形。' },
      { key: 'V',   description: '行単位のビジュアルモード', tip: 'シフト+v。行単位で選択。複数行の操作の基本。' },
      { key: 'Vjj', description: '3行選択', tip: '行選択後に下に移動。数を調整して必要な行数を選択可能。' },
      { key: 'Vap', description: '段落を選択', tip: '段落全体（空行で区切られた部分）を選択。' },
      { key: 'J',   description: '行を連結', tip: '下の行を現在の行に連結。改行を取り除く時に便利。' },
      { key: '5dd', description: '5行削除', tip: '数字+dd。指定した行数をまとめて削除。' },
      { key: '3yy', description: '3行ヤンク', tip: '数字+yy。指定した行数をまとめてコピー。' },
    ],
  },
  {
    category: '検索と置換（実務必須）',
    level: '中級',
    commands: [
      { key: ':%s/old/new/g', description: 'ファイル全体でoldをnewに置換', tip: '最も強力な置換コマンド。リファクタリングの強い味方。' },
      { key: ':%s/old/new/gc', description: '確認しながら置換', tip: '確認（confirm）オプション付き。安全に置換したい時に。' },
      { key: ':s/old/new/g', description: '現在行のみ置換', tip: '範囲指定なしの置換。一行だけ変更したい時に。' },
      { key: ':#,#s/old/new/g', description: '指定行範囲内で置換', tip: '#,#に行番号を指定。特定範囲だけ置換したい時に。' },
      { key: ':g/pattern/d', description: 'パターンにマッチする行を削除', tip: 'global command。特定パターンの行を一括削除。' },
      { key: ':g/pattern/s/old/new/g', description: 'パターンにマッチする行内でのみ置換', tip: '条件付き置換。特定条件下でのみ置換を実行。' },
      { key: ':%s/\\s\\+$//g', description: '行末の空白を削除', tip: '行末の不要な空白を一括削除。コードの整形に便利。' },
    ],
  },
  {
    category: 'マクロ（作業効率化）',
    level: '上級',
    commands: [
      { key: 'qa', description: 'マクロの記録開始（レジスタaに保存）', tip: 'q(record)+レジスタ名。繰り返し作業を自動化する第一歩。' },
      { key: 'q', description: 'マクロの記録終了', tip: '再度qを押してマクロ記録を終了。' },
      { key: '@a', description: 'マクロの再生', tip: '@+レジスタ名。記録したマクロを実行。' },
      { key: '@@', description: '最後のマクロを再実行', tip: '直前のマクロを素早く再実行したい時に便利。' },
      { key: '5@a', description: 'マクロを5回実行', tip: '数字+@+レジスタ名。マクロを指定回数実行。' },
    ],
  },
  {
    category: 'ビジュアルモード（選択操作）',
    level: '中級',
    commands: [
      { key: 'v', description: '文字単位のビジュアルモード', tip: '文字単位で選択を開始。基本の選択操作。' },
      { key: 'V', description: '行単位のビジュアルモード', tip: 'シフト+v。行単位で選択を開始。複数行の操作に便利。' },
      { key: 'Ctrl+v', description: '矩形ビジュアルモード', tip: '列（矩形）選択。表のような構造の編集に威力を発揮。' },
      { key: 'o', description: 'ビジュアルモードで選択範囲の端に移動', tip: '選択範囲の反対側に移動。選択範囲を調整する時に便利。' },
      { key: 'gv', description: '前回の選択範囲を再選択', tip: '以前選んだ範囲を素早く再選択。選択ミスの修正に便利。' },
    ],
  },
  {
    category: '分割ウィンドウ',
    level: '上級',
    commands: [
      { key: ':sp', description: '水平分割', tip: 'split（分割）の略。画面を上下に分割して複数ファイルを表示。' },
      { key: ':vs', description: '垂直分割', tip: 'vertical split。画面を左右に分割して複数ファイルを表示。' },
      { key: 'Ctrl+w w', description: 'ウィンドウ間を移動', tip: 'window + window。分割したウィンドウ間を循環移動。' },
      { key: 'Ctrl+w h', description: '左のウィンドウに移動', tip: 'hjklの移動と同じパターン。特定方向のウィンドウに直接移動。' },
      { key: 'Ctrl+w j', description: '下のウィンドウに移動', tip: 'ウィンドウ間の移動。hjklの法則に従う。' },
      { key: 'Ctrl+w k', description: '上のウィンドウに移動', tip: 'ウィンドウ間の移動。hjklの法則に従う。' },
      { key: 'Ctrl+w l', description: '右のウィンドウに移動', tip: 'ウィンドウ間の移動。hjklの法則に従う。' },
      { key: 'Ctrl+w =', description: 'ウィンドウサイズを均等に', tip: '分割ウィンドウのサイズを均等に調整。' },
      { key: 'Ctrl+w _', description: '現在のウィンドウを最大高さに', tip: 'アンダースコア。現在のウィンドウを縦に最大化。' },
      { key: 'Ctrl+w |', description: '現在のウィンドウを最大幅に', tip: 'パイプ記号。現在のウィンドウを横に最大化。' },
    ],
  },
  {
    category: 'プログラミング支援',
    level: '上級',
    commands: [
      { key: 'gd', description: 'ローカル定義にジャンプ', tip: 'go to definition。関数や変数の定義箇所にジャンプ。' },
      { key: 'gf', description: 'カーソル位置のファイル名を開く', tip: 'go to file。インクルードファイルなどにジャンプ。' },
      { key: '=', description: 'コードを自動整形', tip: '={motion}の形で使用。例：=apで段落を整形。コードを綺麗に。' },
      { key: '==', description: '現在行のコードを自動整形', tip: '現在行のインデントを修正。=を二回押すだけで簡単。' },
      { key: '=%', description: '対応する括弧内のコードを整形', tip: '現在の括弧ブロック内を自動整形。コードの見た目を整える。' },
      { key: 'K', description: 'カーソル下のキーワードのマニュアル', tip: '組み込み関数やコマンドのヘルプを素早く参照。' },
      { key: '[{', description: '現在のブロックの開始に移動', tip: '波括弧の開始位置に素早くジャンプ。コードの構造把握に便利。' },
      { key: ']}', description: '現在のブロックの終了に移動', tip: '波括弧の終了位置に素早くジャンプ。対応する開き括弧を探す。' },
    ],
  },
  {
    category: 'ファイル操作（基本）',
    level: '初級',
    commands: [
      { key: ':w', description: 'ファイルを保存', tip: 'write（書き込み）の頭文字。基本的な保存操作。' },
      { key: ':q', description: '終了（変更がなければ）', tip: 'quit（終了）の頭文字。エディタを閉じる基本操作。' },
      { key: ':q!', description: '強制終了（変更を破棄）', tip: '感嘆符付きで強制。変更を保存したくない時に使用。' },
      { key: ':wq', description: '保存して終了', tip: 'write + quit。最もよく使う終了コマンド。' },
      { key: ':e filename', description: 'ファイルを開く', tip: 'edit（編集）の頭文字。新しいファイルを開く。' },
      { key: 'ZZ', description: '保存して終了（:wqのショートカット）', tip: 'シフト+z二回。素早く保存して終了するショートカット。' },
      { key: 'ZQ', description: '保存せずに終了（:q!のショートカット）', tip: 'Z+Q。素早く保存せずに終了するショートカット。' },
    ],
  },
  {
    category: '実践的なテクニック（実務向け）',
    level: '上級',
    commands: [
      { key: 'zz', description: 'カーソル行を画面中央に', tip: 'カーソル位置を中央に表示。コードを読む時に見やすくする。' },
      { key: 'zt', description: 'カーソル行を画面上部に', tip: 'カーソル位置を画面上部に表示。コードのコンテキスト把握に便利。' },
      { key: 'zb', description: 'カーソル行を画面下部に', tip: 'カーソル位置を画面下部に表示。コードを続きを見やすくする。' },
      { key: '.', description: '最後の編集を繰り返す', tip: '同じ編集を繰り返す最強コマンド。編集の効率化に必須。' },
      { key: 'gi', description: '最後の挿入モード位置に戻り挿入開始', tip: 'go insert。最後に編集していた箇所に素早く戻る。' },
      { key: 'gJ', description: '行を連結（スペースなし）', tip: 'Join without space。行を連結するがスペースを追加しない。' },
      { key: 'xp', description: '2文字を入れ替え', tip: '削除してペーストの組み合わせ。隣り合う文字を素早く入れ替え。' },
      { key: '"0p', description: 'ヤンクしたテキストを貼り付け', tip: '0レジスタの内容を貼り付け。削除せずにコピーしたテキストの貼り付けに。' },
      { key: '"_d', description: '削除してレジスタに保存しない', tip: 'ブラックホールレジスタに削除。削除内容をヤンク履歴に残さない。' },
    ],
  },
  {
    category: '効率的なファイル管理',
    level: '上級',
    commands: [
      { key: ':bn', description: '次のバッファに移動', tip: 'buffer next。開いている次のファイルに移動。' },
      { key: ':bp', description: '前のバッファに移動', tip: 'buffer previous。開いている前のファイルに移動。' },
      { key: ':b filename', description: '特定のバッファに移動', tip: 'buffer + ファイル名。名前で素早くファイル切替。' },
      { key: ':ls', description: 'バッファリストを表示', tip: 'list。開いているファイル一覧を表示。' },
      { key: ':cd path', description: '作業ディレクトリを変更', tip: 'change directory。ファイルオープンの基準ディレクトリを変更。' },
      { key: ':find filename', description: 'ファイルパスで検索して開く', tip: 'パスを指定してファイルを素早く開く。' },
      { key: ':grep pattern files', description: 'ファイル内をgrep検索', tip: 'grepでファイル内容を検索。検索結果間を:cn/:cpで移動。' },
    ],
  },
]

const CheatSheet = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const panelBgColor = useColorModeValue('gray.700', 'gray.800')
  
  // レベルと検索条件でコマンドをフィルタリング
  const filteredCommands = vimCommands
    .filter(category => levelFilter === 'all' || category.level === levelFilter)
    .map((category) => ({
      ...category,
      commands: category.commands.filter(
        (cmd) =>
          !searchTerm || 
          cmd.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cmd.tip && cmd.tip.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }))
    .filter((category) => category.commands.length > 0)

  return (
    <Box p={4} bg={bgColor} h="100%" overflowY="auto">
      <VStack spacing={4} align="stretch">
        <Heading size="md" mb={2}>
          Neovim実践チートシート
        </Heading>
        
        <HStack>
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="コマンドを検索..."
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="filled"
              bg="whiteAlpha.100"
              _focus={{ bg: "whiteAlpha.200" }}
            />
          </InputGroup>
          
          <Box>
            <HStack spacing={2}>
              <Text fontSize="sm" whiteSpace="nowrap">レベル:</Text>
              <Tag 
                size="sm" 
                variant={levelFilter === 'all' ? 'solid' : 'outline'} 
                colorScheme="blue"
                cursor="pointer"
                onClick={() => setLevelFilter('all')}
              >
                全て
              </Tag>
              <Tag 
                size="sm" 
                variant={levelFilter === '初級' ? 'solid' : 'outline'} 
                colorScheme="green"
                cursor="pointer"
                onClick={() => setLevelFilter('初級')}
              >
                初級
              </Tag>
              <Tag 
                size="sm" 
                variant={levelFilter === '中級' ? 'solid' : 'outline'} 
                colorScheme="orange"
                cursor="pointer"
                onClick={() => setLevelFilter('中級')}
              >
                中級
              </Tag>
              <Tag 
                size="sm" 
                variant={levelFilter === '上級' ? 'solid' : 'outline'} 
                colorScheme="purple"
                cursor="pointer"
                onClick={() => setLevelFilter('上級')}
              >
                上級
              </Tag>
            </HStack>
          </Box>
        </HStack>

        <Accordion allowMultiple defaultIndex={[0]} mt={4}>
          {filteredCommands.map((category, idx) => (
            <AccordionItem key={idx} border="none" mb={2}>
              <h2>
                <AccordionButton 
                  bg="whiteAlpha.100" 
                  _hover={{ bg: "whiteAlpha.200" }} 
                  borderRadius="md"
                >
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    {category.category}
                    <Badge ml={2} colorScheme={
                      category.level === '初級' ? 'green' : 
                      category.level === '中級' ? 'orange' : 
                      'purple'
                    } mr={2}>
                      {category.level}
                    </Badge>
                    <Badge colorScheme="blue">
                      {category.commands.length}
                    </Badge>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} bg={panelBgColor} mt={1} borderRadius="md">
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th width="20%">コマンド</Th>
                        <Th width="35%">説明</Th>
                        <Th>実践ヒント</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {category.commands.map((cmd, cmdIdx) => (
                        <Tr key={cmdIdx}>
                          <Td>
                            <Text as="kbd" fontFamily="mono" fontWeight="bold">
                              {cmd.key}
                            </Text>
                          </Td>
                          <Td>{cmd.description}</Td>
                          <Td fontSize="sm" color="gray.300">{cmd.tip}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Text fontSize="sm" color="gray.400" mt={4}>
          ヒント: Vimでは多くのコマンドを数字と組み合わせることができます。例えば <Text as="kbd" fontWeight="bold">3j</Text> で3行下に移動、
          <Text as="kbd" fontWeight="bold">2dw</Text> で2単語を削除できます。
        </Text>
        <Text fontSize="sm" color="gray.400">
          多くのコマンドは「オペレータ+モーション」の形で組み合わせることができます。例えば <Text as="kbd" fontWeight="bold">d$</Text> は「行末まで削除」、
          <Text as="kbd" fontWeight="bold">c2w</Text> は「2単語を変更」を意味します。
        </Text>
      </VStack>
    </Box>
  )
}

export default CheatSheet 