"use client";

import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { oneDark } from "@codemirror/theme-one-dark";
import { vim } from "@replit/codemirror-vim";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
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
      bg="gray.900"
      color="white"
      height="100%"
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
    >
      <HStack justify="flex-end" gap={4} mb={6}>
        <Button
          onClick={handleSave}
          bg="orange.400"
          color="white"
          borderRadius="md"
          px={4}
          py={2}
          fontSize="md"
          fontFamily="mono"
          boxShadow="md"
          _focus={{
            outline: "2px solid",
            outlineColor: "cyan.400",
            outlineOffset: "2px",
          }}
          _hover={{ bg: "orange.500", transform: "scale(1.04)" }}
          transition="all 0.2s"
        >
          <Icon as={FiSave} mr={2} />
          保存
        </Button>
        <Button
          onClick={handleReset}
          bg="transparent"
          border="1px solid"
          borderColor="cyan.400"
          color="cyan.400"
          borderRadius="md"
          px={4}
          py={2}
          fontFamily="mono"
          _focus={{
            outline: "2px solid",
            outlineColor: "cyan.400",
            outlineOffset: "2px",
          }}
          _hover={{ bg: "cyan.400", color: "white" }}
          transition="all 0.2s"
        >
          <Icon as={FiRefreshCw} mr={2} />
          リセット
        </Button>
      </HStack>
      <Box
        flex={1}
        borderRadius="md"
        overflow="hidden"
        boxShadow="inner"
        width="100%"
        overflowX="hidden"
      >
        <CodeMirror
          value={code}
          height="100%"
          extensions={[vim(), oneDark, EditorView.lineWrapping]}
          onChange={onChange}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
          }}
          style={{
            width: "100%",
            background: "#18181b",
            color: "#fff",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        />
      </Box>
    </Box>
  );
}

export default VimEditor;
