// --- サンプルコード・VimTips定数 ---
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

// --- Vimモード情報・型定義 ---
import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { oneDark } from "@codemirror/theme-one-dark";
import { vim } from "@replit/codemirror-vim";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FiCommand, FiEdit, FiRefreshCw, FiTerminal } from "react-icons/fi";
const modeInfo = {
  normal: {
    text: "NORMAL",
    color: "orange.400",
    icon: FiCommand as IconType,
    hint: "Press i to enter insert mode",
  },
  insert: {
    text: "INSERT",
    color: "green.400",
    icon: FiEdit as IconType,
    hint: "Press Esc to return to normal mode",
  },
  visual: {
    text: "VISUAL",
    color: "purple.400",
    icon: FiCommand as IconType,
    hint: "Select text with h,j,k,l or use y to copy",
  },
} as const;
type VimMode = keyof typeof modeInfo;
function VimEditor() {
  const [mode, setMode] = useState<"html" | "css" | "js">("html");
  const [vimMode, setVimMode] = useState<VimMode>("normal");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateEditor = useCallback((view: EditorView) => {
    editorViewRef.current = view;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const { getCM } = require("@replit/codemirror-vim");
        const view = editorViewRef.current;
        if (view) {
          const cm = getCM(view);
          if (cm && cm.state && cm.state.vim) {
            const vimState = cm.state.vim;
            let mode: VimMode = "normal";
            if (vimState.insertMode) {
              mode = "insert";
            } else if (vimState.visualMode) {
              mode = "visual";
            }
            setVimMode(mode);
          }
        }
      } catch (e) {}
    }, 200);
    return () => clearInterval(interval);
  }, [editorViewRef]);

  const getSample = useCallback(() => {
    if (mode === "html") return htmlSample + vimTips;
    if (mode === "css") return cssSample + vimTips;
    return jsSample + vimTips;
  }, [mode]);

  const [code, setCode] = useState<string>(() => getSample());

  const handleReset = useCallback(() => {
    setCode(getSample());
    setVimMode("normal");
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
  // SSR/CSR差異による高さ0問題を防ぐ
  return (
    <Box
      bgGradient="linear(to-br, #18181b, #222)"
      color="white"
      h="100%"
      p={[2, 3, 4]}
      borderRadius="2xl"
      boxShadow="0 8px 32px 0 rgba(0,0,0,0.7)"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="gray.700"
      transition="box-shadow 0.3s"
      _hover={{ boxShadow: "0 12px 48px 0 rgba(0,0,0,0.8)" }}
      position="relative"
      overflow="hidden"
      flex={1}
      minH="400px"
      maxH="100%"
    >
      {/* --- Editor Header (macOS風ウィンドウコントロール) --- */}
      <Flex
        alignItems="center"
        px={[2, 4]}
        py={[2, 3]}
        borderBottomWidth={1}
        borderColor="primary.700"
        bgGradient="linear(to-r, primary.900, primary.800)"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <HStack gap={2} marginRight={5}>
            <Box w="12px" h="12px" borderRadius="full" bg="#FF5F56" />
            <Box w="12px" h="12px" borderRadius="full" bg="#FFBD2E" />
            <Box w="12px" h="12px" borderRadius="full" bg="#27C93F" />
          </HStack>
          <Flex alignItems="center">
            <Icon as={FiTerminal} color="secondary.400" mr={2} />
            <Text fontFamily="mono" fontWeight="medium" letterSpacing="tight">
              {mode.toUpperCase()} Editor
            </Text>
          </Flex>
        </Flex>
        <HStack justifyContent="flex-end" gap={2}>
          {(["html", "css", "js"] as const).map((m) => (
            <Button
              key={m}
              onClick={() => handleModeChange(m)}
              colorScheme={mode === m ? "orange" : "gray"}
              bg={mode === m ? "blackAlpha.400" : "transparent"}
              color={mode === m ? "secondary.400" : "gray.400"}
              borderRadius="md"
              px={3}
              py={1.5}
              height="auto"
              fontFamily="mono"
              fontWeight={mode === m ? "bold" : "medium"}
              letterSpacing="tight"
              borderWidth={0}
              _hover={{
                bg: mode === m ? "blackAlpha.500" : "blackAlpha.300",
                color: "secondary.400",
              }}
              _active={{
                bg: "blackAlpha.500",
              }}
              transition="background 0.15s, color 0.15s"
              mr={1}
            >
              {m.toUpperCase()}
            </Button>
          ))}
          <Button
            onClick={handleReset}
            colorScheme="gray"
            bg="transparent"
            color="gray.400"
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight="medium"
            letterSpacing="tight"
            borderWidth={0}
            _hover={{
              bg: "blackAlpha.300",
              color: "secondary.400",
            }}
            _active={{
              bg: "blackAlpha.500",
            }}
            transition="background 0.15s, color 0.15s"
            ml={2}
          >
            <Icon as={FiRefreshCw} mr={1} /> Reset
          </Button>
        </HStack>
      </Flex>
      {/* --- Vimモード表示ステータスバー --- */}
      <Flex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={4}
        py={1.5}
        bg="blackAlpha.600"
        borderTopWidth={1}
        borderColor="primary.700"
        zIndex={5}
        fontSize="sm"
        fontFamily="mono"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex alignItems="center">
          <Icon
            as={modeInfo[vimMode].icon}
            color={modeInfo[vimMode].color}
            mr={2}
          />
          <Text color={modeInfo[vimMode].color} fontWeight="medium">
            {modeInfo[vimMode].text}
          </Text>
        </Flex>
        <Text color="gray.500" fontSize="xs">
          {modeInfo[vimMode].hint}
        </Text>
      </Flex>
      {/* --- Editor本体エリア --- */}
      <Box
        flex={1}
        minHeight={0}
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        display="flex"
        position="relative"
        mb={8}
        height="100%"
        maxH="100%"
      >
        {/* SSR/CSR差異による高さ0問題を防ぐため、マウント後のみ描画 */}
        {isMounted && (
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
            /* Chakra UIで表現できないCodeMirror固有のstyleのみstyle属性で指定 */
            style={{
              width: "100%", // Chakra UI Boxでwidth="100%"指定済み
              height: "100%", // Chakra UI Boxでheight="100%"指定済み
              minHeight: "300px", // Chakra UI BoxでminH="300px"指定済み
              background: "#18181b", // Chakra UI bgGradientで近似指定済み
              color: "#fff", // Chakra UI colorで指定済み
              whiteSpace: "pre-wrap", // CodeMirrorの折返し用
              wordBreak: "break-word", // CodeMirrorの折返し用
              fontSize: "1.1rem", // CodeMirrorのフォントサイズ
              fontFamily: "Fira Mono, Menlo, Monaco, Consolas, monospace", // CodeMirrorのフォント
            }}
            onCreateEditor={handleCreateEditor}
          />
        )}
      </Box>
    </Box>
  );
}

export default VimEditor;
