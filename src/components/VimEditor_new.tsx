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
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
      p={0}
      h="100vh"
    >
      <Flex direction="column" h="100vh">
        {/* タブバー */}
        <Flex
          bg="gray.900"
          borderBottom="1px"
          borderColor="gray.700"
          px={2}
          py={1}
          align="center"
          justify="space-between"
          flexShrink={0}
        >
          {/* モード切り替えタブ */}
          <HStack gap={0}>
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

          {/* 右側ボタン群 */}
          <HStack gap={1}>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={handlePreviewToggle}
              isDisabled={showCodePenMode}
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
        </Flex>

        {/* メインコンテンツエリア */}
        <Flex flex="1" h="calc(100vh - 60px)">
          {/* エディターエリア */}
          <Box
            flex={showPreview || showCodePenMode ? "1" : "1"}
            bg="gray.900"
            position="relative"
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
      </Flex>
    </MotionBox>
  );
}

export default VimEditor;
