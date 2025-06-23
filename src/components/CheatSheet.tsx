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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'

// Vimコマンドカテゴリーとコマンド、説明
const vimCommands = [
  {
    category: '基本的な移動',
    commands: [
      { key: 'h', description: 'カーソルを左に移動' },
      { key: 'j', description: 'カーソルを下に移動' },
      { key: 'k', description: 'カーソルを上に移動' },
      { key: 'l', description: 'カーソルを右に移動' },
      { key: 'gj', description: '表示行で1行下に移動' },
      { key: 'gk', description: '表示行で1行上に移動' },
      { key: 'w', description: '次の単語の先頭に移動' },
      { key: 'W', description: '次の（区切り文字を含む）単語の先頭に移動' },
      { key: 'e', description: '次の単語の末尾に移動' },
      { key: 'E', description: '次の（区切り文字を含む）単語の末尾に移動' },
      { key: 'b', description: '前の単語の先頭に移動' },
      { key: 'B', description: '前の（区切り文字を含む）単語の先頭に移動' },
      { key: 'ge', description: '前の単語の末尾に移動' },
      { key: 'gE', description: '前の（区切り文字を含む）単語の末尾に移動' },
      { key: '0', description: '行頭に移動' },
      { key: '^', description: 'その行で最初の非空白文字に移動' },
      { key: '$', description: '行末に移動' },
      { key: 'g_', description: 'その行で最後の非空白文字に移動' },
      { key: 'gg', description: 'ドキュメントの先頭行に移動' },
      { key: 'G', description: 'ドキュメントの末尾行に移動' },
      { key: '5G', description: '5行目に移動（行番号の前に数字を付ける）' },
      { key: '%', description: '対応するカッコに移動' },
      { key: 'fx', description: '次にある文字「x」に移動' },
      { key: 'tx', description: '次にある文字「x」の直前に移動' },
      { key: 'Fx', description: '前にある文字「x」に移動' },
      { key: 'Tx', description: '前にある文字「x」の直後に移動' },
      { key: ';', description: '直前の f, t, F, T を繰り返し' },
      { key: ',', description: '直前の f, t, F, T を反対方向に繰り返し' },
    ],
  },
  {
    category: '画面移動',
    commands: [
      { key: 'H', description: '画面上部に移動' },
      { key: 'M', description: '画面中央に移動' },
      { key: 'L', description: '画面下部に移動' },
      { key: 'zz', description: 'カーソル位置を画面中央に' },
      { key: 'zt', description: 'カーソル位置を画面上部に' },
      { key: 'zb', description: 'カーソル位置を画面下部に' },
      { key: 'Ctrl+e', description: '画面を下に1行スクロール（カーソル移動なし）' },
      { key: 'Ctrl+y', description: '画面を上に1行スクロール（カーソル移動なし）' },
      { key: 'Ctrl+d', description: '画面半分だけ下に移動' },
      { key: 'Ctrl+u', description: '画面半分だけ上に移動' },
      { key: 'Ctrl+f', description: '画面全体分だけ下に移動' },
      { key: 'Ctrl+b', description: '画面全体分だけ上に移動' },
      { key: '{', description: '前の段落に移動' },
      { key: '}', description: '次の段落に移動' },
    ],
  },
  {
    category: 'インサートモード（編集）',
    commands: [
      { key: 'i', description: 'カーソル位置で挿入モード' },
      { key: 'I', description: '行頭で挿入モード' },
      { key: 'a', description: 'カーソルの次の位置で挿入モード' },
      { key: 'A', description: '行末で挿入モード' },
      { key: 'o', description: '下に新しい行を作成して挿入モード' },
      { key: 'O', description: '上に新しい行を作成して挿入モード' },
      { key: 'ea', description: '単語の末尾で挿入モード' },
      { key: 'Esc', description: '挿入モードを終了' },
      { key: 'Ctrl+h', description: '挿入モード中に手前の文字を削除' },
      { key: 'Ctrl+w', description: '挿入モード中に手前の単語を削除' },
      { key: 'Ctrl+j', description: '挿入モード中に改行' },
      { key: 'Ctrl+t', description: '挿入モード中にその行を右に字下げ' },
      { key: 'Ctrl+d', description: '挿入モード中にその行を左に字上げ' },
      { key: 'Ctrl+n', description: '挿入モード中に次の候補を表示（自動補完）' },
      { key: 'Ctrl+p', description: '挿入モード中に前の候補を表示（自動補完）' },
    ],
  },
  {
    category: '編集',
    commands: [
      { key: 'r', description: '文字を1つだけ置き換え' },
      { key: 'R', description: 'Escが押されるまで複数文字を置き換え（上書きモード）' },
      { key: 'J', description: 'スペースを1つ加えて下の行を現在の行に連結' },
      { key: 'gJ', description: 'スペースなしで下の行を現在の行に連結' },
      { key: 'cc', description: '現在の行を削除して挿入モード' },
      { key: 'C', description: 'カーソル位置から行末までを削除して挿入モード' },
      { key: 'c$', description: 'カーソル位置から行末までを削除して挿入モード' },
      { key: 'ciw', description: '単語を全て削除して挿入モード' },
      { key: 'cw', description: '単語をカーソル位置から末尾まで削除して挿入モード' },
      { key: 's', description: 'カーソル位置の文字を削除して挿入モード' },
      { key: 'S', description: '行を削除して挿入モード（ccと同じ）' },
      { key: 'xp', description: '2文字を入れ替え（カットしてペースト）' },
      { key: 'u', description: '直前の変更を取り消し（アンドゥ）' },
      { key: 'Ctrl+r', description: '取り消した変更をやり直し（リドゥ）' },
      { key: '.', description: '最後に使ったコマンドを繰り返し' },
      { key: 'dd', description: '行を削除' },
      { key: 'dw', description: '単語を削除' },
      { key: 'x', description: 'カーソル位置の文字を削除' },
      { key: 'D', description: 'カーソル位置から行末までを削除' },
      { key: 'd$', description: 'カーソル位置から行末までを削除' },
      { key: 'diw', description: '単語全体を削除' },
    ],
  },
  {
    category: 'テキスト操作',
    commands: [
      { key: 'guu', description: '行を小文字に変換' },
      { key: 'gUU', description: '行を大文字に変換' },
      { key: 'g~~', description: '行の大文字小文字を反転' },
      { key: 'gu{motion}', description: 'モーション範囲を小文字に変換' },
      { key: 'gU{motion}', description: 'モーション範囲を大文字に変換' },
      { key: 'g~{motion}', description: 'モーション範囲の大文字小文字を反転' },
      { key: '>>', description: '行を右にシフト（インデント）' },
      { key: '<<', description: '行を左にシフト（アウトデント）' },
      { key: '>G', description: 'カーソル位置からファイル末尾までをインデント' },
      { key: '=%', description: 'カッコ内のテキストのインデントを自動調整' },
      { key: '=iB', description: '波カッコ内のテキストのインデントを自動調整' },
      { key: '=i{', description: '波カッコ内のテキストのインデントを自動調整' },
    ],
  },
  {
    category: 'ビジュアルモード',
    commands: [
      { key: 'v', description: '文字単位のビジュアルモード開始' },
      { key: 'V', description: '行単位のビジュアルモード開始' },
      { key: 'Ctrl+v', description: '矩形（ブロック）ビジュアルモード開始' },
      { key: 'o', description: '選択範囲の反対側に移動' },
      { key: 'O', description: '矩形選択時の反対の角に移動' },
      { key: 'aw', description: '単語（空白含む）を選択' },
      { key: 'aW', description: '空白で区切られた単語を選択' },
      { key: 'iw', description: '単語内を選択' },
      { key: 'iW', description: '空白で区切られた単語内を選択' },
      { key: 'as', description: '文を選択（空白含む）' },
      { key: 'is', description: '文内を選択' },
      { key: 'ap', description: '段落を選択（空白含む）' },
      { key: 'ip', description: '段落内を選択' },
      { key: 'ab', description: '丸括弧ブロックを選択（カッコ含む）' },
      { key: 'ib', description: '丸括弧ブロック内を選択' },
      { key: 'aB', description: '波括弧ブロックを選択（カッコ含む）' },
      { key: 'iB', description: '波括弧ブロック内を選択' },
      { key: 'y', description: '選択範囲をヤンク（コピー）' },
      { key: 'd', description: '選択範囲を削除' },
      { key: 'c', description: '選択範囲を削除して挿入モード' },
      { key: '>', description: '選択範囲をインデント' },
      { key: '<', description: '選択範囲をアウトデント' },
      { key: '~', description: '選択範囲の大文字小文字を反転' },
    ],
  },
  {
    category: 'ヤンク（コピー）とペースト',
    commands: [
      { key: 'yy', description: '行をヤンク（コピー）' },
      { key: 'yw', description: '単語をヤンク' },
      { key: 'y$', description: 'カーソル位置から行末までをヤンク' },
      { key: 'p', description: 'カーソルの後にペースト' },
      { key: 'P', description: 'カーソルの前にペースト' },
      { key: '"+y', description: 'システムクリップボードにヤンク' },
      { key: '"+p', description: 'システムクリップボードからペースト' },
    ],
  },
  {
    category: '検索と置換',
    commands: [
      { key: '/', description: '前方検索' },
      { key: '?', description: '後方検索' },
      { key: 'n', description: '次の検索結果へ' },
      { key: 'N', description: '前の検索結果へ' },
      { key: '*', description: 'カーソル位置の単語を前方検索' },
      { key: '#', description: 'カーソル位置の単語を後方検索' },
      { key: 'g*', description: 'カーソル位置の単語を部分一致で前方検索' },
      { key: 'g#', description: 'カーソル位置の単語を部分一致で後方検索' },
      { key: ':%s/foo/bar/g', description: 'fooをbarにグローバルに置換' },
      { key: ':%s/foo/bar/gc', description: 'fooをbarにグローバルに置換（確認あり）' },
      { key: ':s/foo/bar/g', description: '現在行のfooをbarに置換' },
    ],
  },
  {
    category: 'ファイル操作',
    commands: [
      { key: ':w', description: 'ファイルを保存' },
      { key: ':w file', description: 'fileという名前で保存' },
      { key: ':q', description: '終了（未保存の変更がなければ）' },
      { key: ':q!', description: '保存せずに強制終了' },
      { key: ':wq', description: '保存して終了' },
      { key: ':x', description: '保存して終了（:wqと同じ）' },
      { key: 'ZZ', description: '保存して終了（:xと同じ）' },
      { key: 'ZQ', description: '保存せずに終了（:q!と同じ）' },
      { key: ':e file', description: '新しいファイルを開く' },
      { key: ':saveas file', description: '名前を付けて保存' },
    ],
  },
  {
    category: 'マルチファイル',
    commands: [
      { key: ':bn', description: '次のバッファに移動' },
      { key: ':bp', description: '前のバッファに移動' },
      { key: ':bd', description: 'バッファを閉じる' },
      { key: ':sp file', description: '水平分割で新しいファイルを開く' },
      { key: ':vs file', description: '垂直分割で新しいファイルを開く' },
      { key: 'Ctrl+w s', description: '現在のウィンドウを水平分割' },
      { key: 'Ctrl+w v', description: '現在のウィンドウを垂直分割' },
      { key: 'Ctrl+w w', description: 'ウィンドウ間を移動' },
      { key: 'Ctrl+w h', description: '左のウィンドウに移動' },
      { key: 'Ctrl+w j', description: '下のウィンドウに移動' },
      { key: 'Ctrl+w k', description: '上のウィンドウに移動' },
      { key: 'Ctrl+w l', description: '右のウィンドウに移動' },
      { key: 'Ctrl+w q', description: '現在のウィンドウを閉じる' },
      { key: 'Ctrl+w o', description: '現在のウィンドウ以外を全て閉じる' },
    ],
  },
  {
    category: '折りたたみ',
    commands: [
      { key: 'zo', description: 'カーソル下の折りたたみを開く' },
      { key: 'zc', description: 'カーソル下の折りたたみを閉じる' },
      { key: 'za', description: 'カーソル下の折りたたみを切り替え' },
      { key: 'zR', description: '全ての折りたたみを開く' },
      { key: 'zM', description: '全ての折りたたみを閉じる' },
      { key: 'zf{motion}', description: 'モーション範囲に折りたたみを作成' },
    ],
  },
  {
    category: 'マクロ',
    commands: [
      { key: 'qa', description: 'マクロの記録を開始（レジスタaに保存）' },
      { key: 'q', description: 'マクロの記録を終了' },
      { key: '@a', description: 'レジスタaに保存されたマクロを実行' },
      { key: '@@', description: '最後に実行したマクロを再実行' },
      { key: '5@a', description: 'マクロaを5回実行' },
    ],
  },
]

const CheatSheet = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const panelBgColor = useColorModeValue('gray.700', 'gray.800')
  
  // 検索条件でコマンドをフィルタリング
  const filteredCommands = searchTerm
    ? vimCommands
      .map((category) => ({
        ...category,
        commands: category.commands.filter(
          (cmd) =>
            cmd.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.commands.length > 0)
    : vimCommands

  return (
    <Box p={4} bg={bgColor} h="100%" overflowY="auto">
      <VStack spacing={4} align="stretch">
        <Heading size="md" mb={2}>
          Neovimチートシート
        </Heading>
        
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="コマンドを検索..."
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="filled"
            bg="whiteAlpha.100"
            _focus={{ bg: 'whiteAlpha.200' }}
          />
        </InputGroup>

        <Accordion allowMultiple defaultIndex={[0]} mt={4}>
          {filteredCommands.map((category, idx) => (
            <AccordionItem key={idx} border="none" mb={2}>
              <h2>
                <AccordionButton 
                  bg="whiteAlpha.100" 
                  _hover={{ bg: 'whiteAlpha.200' }} 
                  borderRadius="md"
                >
                  <Box flex="1" textAlign="left" fontWeight="medium">
                    {category.category}
                    <Badge ml={2} colorScheme="purple">
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
                        <Th width="30%">コマンド</Th>
                        <Th>説明</Th>
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
          ヒント: Vimでは、ほとんどのコマンドの前に数字を付けると繰り返し実行できます。例えば <Text as="kbd" fontWeight="bold">5j</Text> で5行下に移動します。
        </Text>
      </VStack>
    </Box>
  )
}

export default CheatSheet 