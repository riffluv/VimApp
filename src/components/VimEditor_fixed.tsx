"use client";

import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

import { ANIMATION_VARIANTS, VIM_MODE_INFO } from "@/constants";
import {
  useDocs,
  useEditorExtensions,
  useUIState,
  useVimMode,
} from "@/hooks/useVimEditor";
import type { VimEditorProps } from "@/types/editor";
import { generatePreviewHTML, getSandboxAttributes } from "@/utils/editor";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

function VimEditor({ onCodePenModeChange }: VimEditorProps) {
  const editorRef = useRef<any>(null);

  // カスタムフックを使用して状態管理をカプセル化
  const { docs, cleanDocs, updateDoc, clearDoc, resetAllDocs } = useDocs();
  const { vimMode, onUpdate } = useVimMode();
  const { getCurrentExtensions } = useEditorExtensions();
  const {
    mode,
    showPreview,
    showCodePenMode,
    handleModeChange,
    handlePreviewToggle,
    handleCodePenToggle,
  } = useUIState(onCodePenModeChange);

  // プレビュー用HTML生成
  const previewSrcDoc = generatePreviewHTML(docs.html, docs.css, docs.js);
  const codePenSrcDoc = generatePreviewHTML(
    cleanDocs.html,
    cleanDocs.css,
    cleanDocs.js
  );

  // リセット処理（確認ダイアログ付き）
  const handleResetAllWithConfirm = () => {
    if (
      window.confirm(
        "本当に全てのサンプルを初期状態に戻しますか？\nこの操作は元に戻せません。"
      )
    ) {
      resetAllDocs();
    }
  };

  const currentVimModeInfo = VIM_MODE_INFO[vimMode];

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
      variants={ANIMATION_VARIANTS.container}
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
      {/* Editor Header (macOS風ウィンドウコントロール) */}
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
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.300"
              userSelect="none"
            >
              manavim
            </Text>
          </Flex>
        </Flex>

        {/* Vimモードインジケーター */}
        <AnimatePresence mode="wait">
          <MotionFlex
            key={vimMode}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={ANIMATION_VARIANTS.modeIndicator}
            align="center"
            gap={2}
          >
            <Icon
              as={currentVimModeInfo.icon}
              color={currentVimModeInfo.color}
            />
            <MotionText
              fontSize="sm"
              color={currentVimModeInfo.color}
              fontWeight="bold"
              textTransform="uppercase"
            >
              {currentVimModeInfo.text}
            </MotionText>
          </MotionFlex>
        </AnimatePresence>

        {/* 右側: ボタングループ */}
        <HStack gap={1}>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={handlePreviewToggle}
            disabled={showCodePenMode}
            _hover={{ bg: "blue.700" }}
          >
            <FiTerminal style={{ marginRight: "8px" }} />
            Preview
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            onClick={handleCodePenToggle}
            _hover={{ bg: "purple.700" }}
          >
            <FiBookOpen style={{ marginRight: "8px" }} />
            CodePen
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => clearDoc(mode)}
            _hover={{ bg: "red.700" }}
          >
            <GiBroom style={{ marginRight: "8px" }} />
            Clear
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="orange"
            onClick={handleResetAllWithConfirm}
            _hover={{ bg: "orange.700" }}
          >
            <FiRefreshCw style={{ marginRight: "8px" }} />
            Reset All
          </Button>
        </HStack>
      </MotionFlex>

      {/* モード切り替えタブ */}
      <HStack
        gap={0}
        px={[2, 4]}
        py={2}
        borderBottomWidth={1}
        borderColor="primary.700"
      >
        {(["html", "css", "js"] as const).map((modeType) => (
          <Button
            key={modeType}
            size="sm"
            variant="ghost"
            colorScheme={mode === modeType ? "orange" : "gray"}
            bg={mode === modeType ? "orange.500" : "transparent"}
            color={mode === modeType ? "white" : "gray.400"}
            _hover={{
              bg: mode === modeType ? "orange.600" : "gray.700",
            }}
            borderRadius="none"
            fontSize="xs"
            px={3}
            py={1}
            h="auto"
            textTransform="uppercase"
            onClick={() => handleModeChange(modeType)}
          >
            {modeType}
          </Button>
        ))}
      </HStack>

      {/* メインコンテンツエリア */}
      <Flex flex="1" h="100%" overflow="hidden">
        {/* エディターエリア */}
        <Box
          flex={showPreview || showCodePenMode ? "1" : "1"}
          position="relative"
          overflow="hidden"
        >
          <CodeMirror
            ref={editorRef}
            value={docs[mode]}
            onChange={(value) => updateDoc(mode, value)}
            onUpdate={onUpdate}
            extensions={getCurrentExtensions(mode)}
            basicSetup={false}
            theme="dark"
            style={{
              fontSize: "14px",
              height: "100%",
              backgroundColor: "#1a1a1a",
            }}
          />
        </Box>

        {/* プレビューエリア */}
        {(showPreview || showCodePenMode) && (
          <Box
            flex="1"
            bg="white"
            borderLeft="1px"
            borderColor="gray.700"
            overflow="hidden"
          >
            <iframe
              srcDoc={showCodePenMode ? codePenSrcDoc : previewSrcDoc}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              sandbox={getSandboxAttributes()}
              title="Preview"
            />
          </Box>
        )}
      </Flex>
    </MotionBox>
  );
}

export default VimEditor;
