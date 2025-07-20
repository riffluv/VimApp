"use client";

import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { oneDark } from "@codemirror/theme-one-dark";
import { vim } from "@replit/codemirror-vim";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useCallback, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

const htmlSample = `<div class="container">
  <h1>Hello Vim!</h1>
  <p>これはVim練習用のサンプルです。</p>
</div>
`;
const cssSample = `.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f5f5;
}
`;
const jsSample = `document.querySelector('.container').addEventListener('click', function() {
  alert('Vimで編集してみよう！');
});
`;
const vimTips = `// --- おまけ: よく使うVimコマンド ---
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
  const [mode, setMode] = useState<"html" | "css" | "js">("html");
  const getSample = useCallback(() => {
    if (mode === "html") return htmlSample + vimTips;
    if (mode === "css") return cssSample + vimTips;
    return jsSample + vimTips;
  }, [mode]);
  const [code, setCode] = useState(() => getSample());

  const handleReset = useCallback(() => {
    setCode(getSample());
  }, [getSample]);

  const handleModeChange = useCallback((m: "html" | "css" | "js") => {
    setMode(m);
    setCode(
      m === "html"
        ? htmlSample + vimTips
        : m === "css"
        ? cssSample + vimTips
        : jsSample + vimTips
    );
  }, []);

  const onChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <Box
      bgGradient="linear(to-br, #18181b, #222)"
      color="white"
      height="100%"
      minHeight="0"
      p={{ base: 8, md: 12 }}
      borderRadius="2xl"
      boxShadow="0 8px 32px 0 rgba(0,0,0,0.7)"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="gray.700"
      transition="all 0.3s"
      _hover={{ borderColor: "orange.400" }}
    >
      <HStack justify="flex-end" gap={2} mb={8}>
        {["html", "css", "js"].map((m) => (
          <Button
            key={m}
            onClick={() => handleModeChange(m as "html" | "css" | "js")}
            variant={mode === m ? "solid" : "outline"}
            bg={mode === m ? "orange.400" : "transparent"}
            color={mode === m ? "white" : "orange.400"}
            borderRadius="full"
            px={5}
            py={2}
            fontSize="md"
            fontFamily="mono"
            fontWeight="bold"
            borderWidth={1}
            borderColor={mode === m ? "orange.400" : "gray.700"}
            boxShadow="none"
            _hover={{
              bg: "orange.400",
              color: "white",
              borderColor: "orange.400",
            }}
            transition="all 0.2s"
          >
            {m.toUpperCase()}
          </Button>
        ))}
        <Button
          onClick={handleReset}
          variant="outline"
          bg="transparent"
          color="orange.400"
          borderRadius="full"
          px={5}
          py={2}
          fontSize="md"
          fontFamily="mono"
          fontWeight="bold"
          borderWidth={1}
          borderColor="gray.700"
          boxShadow="none"
          _hover={{
            bg: "orange.400",
            color: "white",
            borderColor: "orange.400",
          }}
          transition="all 0.2s"
        >
          <Icon as={FiRefreshCw} mr={2} fontSize="lg" />
          リセット
        </Button>
      </HStack>
      <Box
        flex={1}
        minHeight={0}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 4px 24px 0 rgba(0,0,0,0.5)"
        width="100%"
        overflowX="hidden"
        display="flex"
        borderWidth={2}
        borderColor="gray.700"
        bgGradient="linear(to-br, #222, #18181b)"
        transition="all 0.3s"
        _hover={{
          boxShadow: "0 8px 32px 0 rgba(255,152,0,0.2)",
          borderColor: "orange.400",
        }}
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
            height: "100%",
            background: "#18181b",
            color: "#fff",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "1.1rem",
            fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace",
          }}
        />
      </Box>
    </Box>
  );
}

export default VimEditor;
