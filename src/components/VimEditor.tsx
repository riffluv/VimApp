"use client";

import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { oneDark } from "@codemirror/theme-one-dark";
import { vim } from "@replit/codemirror-vim";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useState } from "react";
import { FiRefreshCw, FiSave } from "react-icons/fi";

const sampleCode = `// Vim練習用サンプルコード
// yyでコピー、pで貼り付け、ddで削除、uでアンドゥなど試してみよう！

// --- HTML ---
// tips: <div>タグはWeb制作の基本。下の行をyyでコピーしてみよう！
<div class="container">
  <h1>Hello Vim!</h1>
  <p>これはVim練習用のサンプルです。</p>
</div>

// --- CSS ---
// tips: .containerで中央揃え。下の行をyyでコピーしてみよう！
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f5f5;
}

// --- JavaScript ---
// tips: DOM取得とイベントリスナーの基本。下の行をyyでコピーしてみよう！
document.querySelector('.container').addEventListener('click', function() {
  alert('Vimで編集してみよう！');
});

// --- おまけ: よく使うVimコマンド ---
// h / j / k / l : 左右上下にカーソル移動
// w / b / e : 単語単位で移動
// 0 / $ / ^ : 行頭・行末・最初の非空白文字へ
// gg / G : ファイル先頭・末尾へ移動
// i / a / o / O : 挿入モード
// x : 文字削除
// dd : 行削除
// yy : 行コピー
// p / P : 貼り付け
// u / Ctrl+r : アンドゥ・リドゥ
// cw / cc / c$ : 単語・行・行末まで変更
// . : 直前の操作を繰り返し
// /pattern : 検索
// n / N : 次・前の検索結果へ
// :%s/old/new/g : 置換
// v / V : 選択開始
// y / d : コピー・削除
`;

function VimEditor() {
  const [code, setCode] = useState(sampleCode);

  // 操作パネルのダミー関数
  const handleSave = useCallback(() => {
    alert("保存しました！");
  }, []);

  const handleReset = useCallback(() => {
    setCode(sampleCode);
  }, []);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <Box
      bg="gray.800"
      color="textLight"
      height="100%"
      p={{ base: 4, md: 6 }}
      borderRadius="xl"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
    >
      <HStack justify="flex-end" gap={3} mb={4}>
        <Button colorScheme="primary" size="md" onClick={handleSave}>
          <Icon as={FiSave} mr={2} />
          保存
        </Button>
        <Button variant="outline" size="md" onClick={handleReset}>
          <Icon as={FiRefreshCw} mr={2} />
          リセット
        </Button>
      </HStack>
      <Box flex={1} borderRadius="md" overflow="hidden" boxShadow="inner">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[vim(), oneDark]}
          onChange={onChange}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
          }}
        />
      </Box>
    </Box>
  );
}

export default VimEditor;
