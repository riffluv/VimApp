"use client";

import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { oneDark } from "@codemirror/theme-one-dark";
import { vim } from "@replit/codemirror-vim";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useCallback, useState } from "react";
import { FiCommand, FiRefreshCw, FiTerminal } from "react-icons/fi";

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
      p={{ base: 4, md: 8 }}
      borderRadius="2xl"
      boxShadow="0 8px 32px 0 rgba(0,0,0,0.7)"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="gray.700"
      transition="all 0.3s"
      _hover={{ boxShadow: "0 12px 48px 0 rgba(0,0,0,0.8)" }}
      position="relative"
      overflow="hidden"
    >
      {/* Editor Header with macOS-style window controls */}
      <Flex
        align="center"
        px={4}
        py={3}
        borderBottomWidth={1}
        borderColor="gray.800"
        bgGradient="linear(to-r, #101012, #1a1a1c)"
        justify="space-between"
      >
        <Flex align="center">
          <Flex gap={2} mr={5}>
            <Box w="12px" h="12px" borderRadius="full" bg="#FF5F56" />
            <Box w="12px" h="12px" borderRadius="full" bg="#FFBD2E" />
            <Box w="12px" h="12px" borderRadius="full" bg="#27C93F" />
          </Flex>
          <Flex align="center">
            <Icon as={FiTerminal} color="orange.400" mr={2} />
            <Text fontFamily="mono" fontWeight="medium" letterSpacing="tight">
              {mode.toUpperCase()} Editor
            </Text>
          </Flex>
        </Flex>

        <HStack justify="flex-end" gap={2} spacing={0}>
          {["html", "css", "js"].map((m) => (
            <Button
              key={m}
              onClick={() => handleModeChange(m as "html" | "css" | "js")}
              variant={mode === m ? "solid" : "ghost"}
              bg={mode === m ? "blackAlpha.400" : "transparent"}
              color={mode === m ? "orange.400" : "gray.400"}
              borderRadius="md"
              px={3}
              py={1.5}
              size="sm"
              fontFamily="mono"
              fontWeight={mode === m ? "bold" : "medium"}
              letterSpacing="tight"
              borderWidth={0}
              _hover={{
                bg: mode === m ? "blackAlpha.500" : "blackAlpha.300",
                color: "orange.400",
              }}
              _active={{
                bg: "blackAlpha.500",
              }}
              transition="all 0.15s"
              mr={1}
            >
              {m.toUpperCase()}
            </Button>
          ))}
          <Button
            onClick={handleReset}
            variant="ghost"
            bg="transparent"
            color="gray.400"
            borderRadius="md"
            px={3}
            py={1.5}
            size="sm"
            fontFamily="mono"
            fontWeight="medium"
            letterSpacing="tight"
            borderWidth={0}
            _hover={{
              bg: "blackAlpha.300",
              color: "orange.400",
            }}
            _active={{
              bg: "blackAlpha.500",
            }}
            transition="all 0.15s"
            ml={2}
          >
            <Icon as={FiRefreshCw} mr={1} /> Reset
          </Button>
        </HStack>
      </Flex>

      {/* Status bar showing vim mode */}
      <Flex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={4}
        py={1.5}
        bg="blackAlpha.600"
        borderTopWidth={1}
        borderColor="gray.800"
        zIndex={5}
        fontSize="sm"
        fontFamily="mono"
        justify="space-between"
        align="center"
      >
        <Flex align="center">
          <Icon as={FiCommand} color="orange.400" mr={2} />
          <Text color="orange.400" fontWeight="medium">
            NORMAL
          </Text>
        </Flex>
        <Text color="gray.500" fontSize="xs">
          Press i to enter insert mode
        </Text>
      </Flex>

      {/* Editor Area */}
      <Box
        flex={1}
        minHeight={0}
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        display="flex"
        position="relative"
        mb={8} // Space for the status bar
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
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: true,
            indentOnInput: true,
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
