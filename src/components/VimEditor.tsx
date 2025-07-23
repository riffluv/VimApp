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
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FiCommand, FiEdit, FiRefreshCw, FiTerminal } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
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

  // アニメーション用のvariants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const modeIndicatorVariants = {
    hidden: { opacity: 0, x: -15, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: 15,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

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

  const [html, setHtml] = useState<string>(htmlSample);
  const [css, setCss] = useState<string>(cssSample);
  const [js, setJs] = useState<string>(jsSample);
  const [code, setCode] = useState<string>(htmlSample + vimTips);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    setHtml(htmlSample);
    setCss(cssSample);
    setJs(jsSample);
    setCode(
      mode === "html"
        ? htmlSample + vimTips
        : mode === "css"
        ? cssSample + vimTips
        : jsSample + vimTips
    );
    setVimMode("normal");
    setShowPreview(false);
  }, [mode]);

  const handleModeChange = useCallback(
    (m: "html" | "css" | "js") => {
      // 現在の内容を保存
      if (mode === "html") setHtml(code.replace(vimTips, ""));
      if (mode === "css") setCss(code.replace(vimTips, ""));
      if (mode === "js") setJs(code.replace(vimTips, ""));
      // モード切り替え
      setMode(m);
      // 切り替え先の内容を表示
      if (m === "html") setCode(html + vimTips);
      else if (m === "css") setCode(css + vimTips);
      else setCode(js + vimTips);
      setShowPreview(false);
    },
    [mode, code, html, css, js]
  );
  // プレビュー用HTML生成（最新のhtml, css, js内容を合成）
  const previewSrcDoc = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Preview</title>
      <style>
      ${css}
      </style>
    </head>
    <body>
      ${html}
      <script>
      ${js}
      </script>
    </body>
    </html>
  `;

  const onChange = useCallback(
    (value: string) => {
      setCode(value);
      // 編集内容を保存
      if (mode === "html") setHtml(value.replace(vimTips, ""));
      if (mode === "css") setCss(value.replace(vimTips, ""));
      if (mode === "js") setJs(value.replace(vimTips, ""));
    },
    [mode]
  );
  // SSR/CSR差異による高さ0問題を防ぐ
  return (
    <MotionBox
      bgGradient="gradient.primary"
      color="text.primary"
      p={{ base: 2, md: 4 }}
      borderRadius="2xl"
      boxShadow="glass"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="border.primary"
      position="relative"
      overflow="hidden"
      flex={1}
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "gradient.glass",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
      _hover={{
        boxShadow: "glass-hover",
        transform: "translateY(-1px)",
      }}
    >
      {/* --- Editor Header (macOS風ウィンドウコントロール) --- */}
      <MotionFlex
        alignItems="center"
        px={[2, 4]}
        py={[2, 3]}
        borderBottomWidth={1}
        borderColor="primary.700"
        bgGradient="linear(to-r, primary.900, primary.800)"
        justifyContent="space-between"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(255,152,0,0.08) 0%, transparent 50%, rgba(255,152,0,0.03) 100%)",
          pointerEvents: "none",
        }}
      >
        <Flex alignItems="center">
          <HStack gap={2} marginRight={5}>
            <Box w={3} h={3} borderRadius="full" bg="red.400" />
            <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
            <Box w={3} h={3} borderRadius="full" bg="green.400" />
          </HStack>
          <Flex alignItems="center">
            <Icon as={FiTerminal} color="secondary.400" mr={2} />
            <MotionText
              fontFamily="mono"
              fontWeight="medium"
              letterSpacing="tight"
              color="white"
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mode.toUpperCase()} Editor
            </MotionText>
          </Flex>
        </Flex>
        <HStack justifyContent="flex-end" gap={2}>
          <Button
            onClick={() => setShowPreview((prev) => !prev)}
            colorScheme={showPreview ? "purple" : "gray"}
            bg={
              showPreview
                ? "linear-gradient(135deg, rgba(128,90,213,0.2), rgba(128,90,213,0.1))"
                : "transparent"
            }
            color={showPreview ? "purple.400" : "gray.400"}
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight={showPreview ? "bold" : "medium"}
            letterSpacing="tight"
            borderWidth={showPreview ? 1 : 0}
            borderColor={showPreview ? "purple.800" : "transparent"}
            _hover={{
              bg: "linear-gradient(135deg, rgba(128,90,213,0.3), rgba(128,90,213,0.15))",
              color: "purple.400",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "blackAlpha.500",
              transform: "translateY(0)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            mr={1}
            aria-label="プレビュー表示切り替え"
            aria-pressed={showPreview}
          >
            Preview
          </Button>
          {(["html", "css", "js"] as const).map((m) => (
            <Button
              key={m}
              onClick={() => handleModeChange(m)}
              colorScheme={mode === m ? "orange" : "gray"}
              bg={
                mode === m
                  ? "linear-gradient(135deg, rgba(255,152,0,0.2), rgba(255,152,0,0.1))"
                  : "transparent"
              }
              color={mode === m ? "secondary.400" : "gray.400"}
              borderRadius="md"
              px={3}
              py={1.5}
              height="auto"
              fontFamily="mono"
              fontWeight={mode === m ? "bold" : "medium"}
              letterSpacing="tight"
              borderWidth={mode === m ? 1 : 0}
              borderColor={mode === m ? "secondary.800" : "transparent"}
              _hover={{
                bg:
                  mode === m
                    ? "linear-gradient(135deg, rgba(255,152,0,0.3), rgba(255,152,0,0.15))"
                    : "blackAlpha.300",
                color: "secondary.400",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
              _active={{
                bg: "blackAlpha.500",
                transform: "translateY(0)",
              }}
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "secondary.400",
                outlineOffset: "2px",
                boxShadow: "0 0 0 2px rgba(255,152,0,0.3)",
                borderColor: mode === m ? "secondary.800" : "transparent",
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              mr={1}
              aria-label={`${m.toUpperCase()}エディターモードに切り替え`}
              aria-pressed={mode === m}
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
              bg: "linear-gradient(135deg, rgba(128,90,213,0.2), rgba(128,90,213,0.1))",
              color: "purple.400",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "blackAlpha.500",
              transform: "translateY(0)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            ml={2}
            aria-label="エディターの内容をリセット"
          >
            <Icon as={FiRefreshCw} mr={1} /> Reset
          </Button>
        </HStack>
      </MotionFlex>
      {/* --- Vimモード表示ステータスバー --- */}
      <MotionFlex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={4}
        py={1.5}
        bg="linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))"
        borderTopWidth={1}
        borderColor="primary.700"
        zIndex={5}
        fontSize="sm"
        fontFamily="mono"
        justifyContent="space-between"
        alignItems="center"
        backdropFilter="blur(10px)"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${modeInfo[vimMode].color}, transparent)`,
          opacity: 0.6,
        }}
      >
        <AnimatePresence mode="wait">
          <MotionFlex
            alignItems="center"
            key={vimMode}
            variants={modeIndicatorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Icon
              as={modeInfo[vimMode].icon}
              color={modeInfo[vimMode].color}
              mr={2}
            />
            <MotionText
              color={modeInfo[vimMode].color}
              fontWeight="medium"
              fontSize="sm"
              textShadow={`0 0 8px ${modeInfo[vimMode].color}40`}
            >
              {modeInfo[vimMode].text}
            </MotionText>
          </MotionFlex>
        </AnimatePresence>
        <Text color="gray.500" fontSize="xs">
          {modeInfo[vimMode].hint}
        </Text>
      </MotionFlex>
      {/* --- Editor本体エリア or プレビュー --- */}
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
        {isMounted && !showPreview && (
          <Box
            w="100%"
            h="100%"
            maxH={{ base: "340px", md: "480px", lg: "560px" }}
            minH={{ base: "220px", md: "320px" }}
            overflowY="auto"
            borderRadius="md"
            bg="transparent"
            boxShadow="none"
          >
            <CodeMirror
              value={code}
              height="100%"
              extensions={[
                vim(),
                oneDark,
                EditorView.lineWrapping,
                EditorView.domEventHandlers({
                  keydown: (event: KeyboardEvent, view: EditorView) => {
                    // Vimモード時のみ標準ショートカットを無効化
                    if (vimMode === "normal" || vimMode === "visual") {
                      if (
                        (event.ctrlKey || event.metaKey) &&
                        ["a", "z", "x", "c", "v", "f", "s"].includes(
                          event.key.toLowerCase()
                        )
                      ) {
                        event.preventDefault();
                        return true;
                      }
                    }
                    return false;
                  },
                }),
              ]}
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
                minHeight: "220px",
                maxHeight: "560px",
                background: "#18181b", // CodeMirror本体はChakra UIで制御不可のため最小限残す
                color: "#fff",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "1.1rem",
                fontFamily:
                  "Fira Code, SF Mono, Monaco, Inconsolata, Roboto Mono, monospace",
                overflowY: "auto",
              }}
              onCreateEditor={handleCreateEditor}
            />
          </Box>
        )}
        {isMounted && showPreview && (
          <Box
            w="100%"
            h="100%"
            maxH={{ base: "340px", md: "480px", lg: "560px" }}
            minH={{ base: "220px", md: "320px" }}
            overflowY="auto"
            borderRadius="md"
            bg="white"
            boxShadow="md"
            position="relative"
          >
            <iframe
              title="Preview"
              srcDoc={previewSrcDoc}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "white",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}

export default VimEditor;
