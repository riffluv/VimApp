"use client";

import { Box, Button, Flex, Grid, HStack, Icon, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

import { VIM_MODE_INFO } from "@/constants";
import {
  useDocs,
  useEditorExtensions,
  useUIState,
  useVimMode,
} from "@/hooks/useVimEditor";
import type { VimEditorProps } from "@/types/editor";
import { generatePreviewHTML } from "@/utils/editor";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

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
    <Box
      bg="gray.900"
      color="white"
      borderRadius="lg"
      borderWidth={1}
      borderColor="gray.700"
      overflow="hidden"
      flex={1}
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      display="flex"
      flexDirection="column"
    >
      {/* ヘッダー */}
      <Flex
        alignItems="center"
        px={4}
        py={3}
        borderBottom="1px"
        borderColor="gray.700"
        bg="gray.800"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <Icon as={FiTerminal} color="orange.400" mr={2} />
          <Text fontSize="sm" fontWeight="semibold" color="gray.200">
            Vim Editor
          </Text>
        </Flex>

        {/* Vimモードインジケーター */}
        <Flex align="center" gap={2}>
          <Icon as={currentVimModeInfo.icon} color={currentVimModeInfo.color} />
          <Text
            fontSize="sm"
            color={currentVimModeInfo.color}
            fontWeight="bold"
            textTransform="uppercase"
          >
            {currentVimModeInfo.text}
          </Text>
        </Flex>

        {/* ボタングループ */}
        <HStack gap={2}>
          <Button
            size="sm"
            colorScheme="blue"
            variant="solid"
            onClick={handlePreviewToggle}
            disabled={showCodePenMode}
            opacity={showCodePenMode ? 0.5 : 1}
          >
            <FiTerminal style={{ marginRight: "4px" }} />
            Preview
          </Button>
          <Button
            size="sm"
            colorScheme="purple"
            variant="solid"
            onClick={handleCodePenToggle}
          >
            <FiBookOpen style={{ marginRight: "4px" }} />
            CodePen
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            variant="solid"
            onClick={() => clearDoc(mode)}
          >
            <GiBroom style={{ marginRight: "4px" }} />
            Clear
          </Button>
          <Button
            size="sm"
            colorScheme="orange"
            variant="solid"
            onClick={handleResetAllWithConfirm}
          >
            <FiRefreshCw style={{ marginRight: "4px" }} />
            Reset All
          </Button>
        </HStack>
      </Flex>

      {/* モード切り替えタブ */}
      <HStack
        gap={0}
        px={4}
        py={2}
        borderBottom="1px"
        borderColor="gray.700"
        bg="gray.850"
      >
        {(["html", "css", "js"] as const).map((modeType) => (
          <Button
            key={modeType}
            size="sm"
            variant="solid"
            colorScheme={mode === modeType ? "orange" : undefined}
            bg={mode === modeType ? "orange.500" : "gray.600"}
            color="white"
            _hover={{
              bg: mode === modeType ? "orange.600" : "gray.500",
            }}
            borderRadius="md"
            fontSize="xs"
            px={3}
            py={1}
            mr={1}
            textTransform="uppercase"
            onClick={() => handleModeChange(modeType)}
          >
            {modeType}
          </Button>
        ))}
      </HStack>

      {/* メインコンテンツエリア */}
      <Flex flex={1} overflow="hidden">
        {/* CodePenモード時の分割表示 */}
        {showCodePenMode ? (
          <Grid
            templateColumns="1fr 1fr"
            gap={0}
            width="100%"
            borderColor="gray.700"
          >
            {/* 左側: プレビュー */}
            <Box
              borderRight="1px"
              borderColor="gray.700"
              height="100%"
              overflow="hidden"
            >
              <iframe
                srcDoc={previewSrcDoc}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  backgroundColor: "white",
                }}
                title="Preview"
              />
            </Box>

            {/* 右側: エディター */}
            <Box
              className="editor-container"
              flex={1}
              overflow="auto"
              position="relative"
              style={{
                height: "100%",
              }}
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
          </Grid>
        ) : showPreview ? (
          /* プレビューのみモード */
          <Box width="100%" height="100%" overflow="hidden">
            <iframe
              srcDoc={previewSrcDoc}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                backgroundColor: "white",
              }}
              title="Preview"
            />
          </Box>
        ) : (
          /* 通常のエディターモード */
          <Box
            className="editor-container"
            flex={1}
            overflow="auto"
            position="relative"
            style={{
              height: "100%",
            }}
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
        )}
      </Flex>
    </Box>
  );
}

export default VimEditor;
