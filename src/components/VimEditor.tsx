"use client";

import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import { Tooltip } from "./Tooltip";

import { VIM_MODE_INFO } from "@/constants";
import {
  useDocs,
  useEditorExtensions,
  useUIState,
  useVimMode,
} from "@/hooks/useVimEditor";
import type { EditorMode } from "@/types/editor";
import { generatePreviewHTML, getSandboxAttributes } from "@/utils/editor";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

type VimEditorProps = {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
};

function VimEditor({ onCodePenModeChange }: VimEditorProps) {
  // 各モードごとにエディタの状態（EditorView/EditorState）を独立管理
  const editorRefs = {
    html: useRef(null),
    css: useRef(null),
    js: useRef(null),
  };
  // 各モードごとにCodeMirrorの内部stateを保持
  const [editorStates, setEditorStates] = useState<{
    html: EditorState | undefined;
    css: EditorState | undefined;
    js: EditorState | undefined;
  }>({
    html: undefined,
    css: undefined,
    js: undefined,
  });

  // 各モードごとにEditorViewインスタンスを保持
  const editorViews = useRef<{
    html: EditorView | null;
    css: EditorView | null;
    js: EditorView | null;
  }>({
    html: null,
    css: null,
    js: null,
  });

  // onCreateEditorでEditorView/EditorStateを保存
  const handleCreateEditor = useCallback(
    (view: EditorView, state: EditorState, mode: EditorMode) => {
      setEditorStates((prev) => ({ ...prev, [mode]: state }));
      editorViews.current[mode] = view;
    },
    []
  );
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

  // モード切り替え時にエディタの状態を保存
  const handleModeChangeWithStateSave = useCallback(
    (newMode: EditorMode) => {
      // 現在のエディタがあれば状態を保存
      if (editorViews.current[mode]) {
        setEditorStates((prev) => ({
          ...prev,
          [mode]: editorViews.current[mode]!.state,
        }));
      }
      handleModeChange(newMode);
    },
    [mode, handleModeChange]
  );

  const previewSrcDoc = generatePreviewHTML(docs.html, docs.css, docs.js);
  const codePenSrcDoc = generatePreviewHTML(
    cleanDocs.html,
    cleanDocs.css,
    cleanDocs.js
  );

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

  // 現在のモードのstateを取得
  const currentState = editorStates[mode];

  return (
    <MotionBox
      bg="gray.900"
      color="white"
      borderRadius="lg"
      boxShadow="glass-premium"
      display="flex"
      flexDirection="column"
      borderColor="gray.700"
      position="relative"
      overflow="hidden"
      flex={1}
      // CheatSheetと同じ高さに統一（黄金比は横幅の比率のみ適用）
      minH={{
        base: "clamp(370px, 38vh, 500px)",
        md: "clamp(480px, 45vh, 650px)",
        lg: "clamp(540px, 50vh, 700px)",
      }}
      maxH={{
        base: "clamp(600px, 62vh, 800px)",
        md: "clamp(780px, 72vh, 1050px)",
        lg: "clamp(900px, 81vh, 1200px)",
      }}
      h={{
        base: "clamp(460px, 42vh, 618px)",
        md: "clamp(618px, 56vh, 1000px)",
        lg: "clamp(700px, 62vh, 1120px)",
      }}
      initial="hidden"
      animate="visible"
      borderWidth="1px"
    >
      {/* すべての要素を1つの親要素でラップ */}
      <>
        {/* ヘッダー - DPIスケール対応 */}
        <MotionFlex
          alignItems="center"
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 3 }}
          borderBottomWidth="clamp(1px, 0.0625rem, 2px)"
          borderColor="gray.700"
          bg="gray.800"
          justifyContent="space-between"
          position="relative"
          minH="clamp(56px, 3.5rem, 64px)" // タッチターゲット確保
        >
          <Flex alignItems="center" gap={{ base: 2, md: 3 }}>
            {/* Window Controls - DPIスケール対応 */}
            <HStack gap="clamp(6px, 0.375rem, 8px)">
              <Box
                w="clamp(10px, 0.625rem, 14px)"
                h="clamp(10px, 0.625rem, 14px)"
                borderRadius="full"
                bg="red.400"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                // 高DPI対応の最小サイズ確保
                minW="clamp(10px, 0.625rem, 14px)"
                minH="clamp(10px, 0.625rem, 14px)"
              />
              <Box
                w="clamp(10px, 0.625rem, 14px)"
                h="clamp(10px, 0.625rem, 14px)"
                borderRadius="full"
                bg="yellow.400"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                minW="clamp(10px, 0.625rem, 14px)"
                minH="clamp(10px, 0.625rem, 14px)"
              />
              <Box
                w="clamp(10px, 0.625rem, 14px)"
                h="clamp(10px, 0.625rem, 14px)"
                borderRadius="full"
                bg="green.400"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                minW="clamp(10px, 0.625rem, 14px)"
                minH="clamp(10px, 0.625rem, 14px)"
              />
            </HStack>

            {/* Editor Title - チートシートスタイルに合わせる */}
            <Flex alignItems="center" gap={3}>
              <Icon as={FiTerminal} color="orange.400" fontSize="lg" />
              <Box>
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color="orange.300"
                  letterSpacing="tight"
                >
                  manaVimEditor
                </Text>
                <Text fontSize="xs" color="gray.400" mt={0.5} fontWeight="400">
                  {mode === "html"
                    ? "index.html"
                    : mode === "css"
                      ? "style.css"
                      : "script.js"}
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* 右側: ボタングループ - シンプルに */}
          <HStack gap={1}>
            <Button
              size="sm"
              variant="ghost"
              bg={showPreview ? "gray.600" : "gray.700"}
              color={showPreview ? "orange.300" : "gray.300"}
              border="1px solid"
              borderColor="gray.600"
              onClick={handlePreviewToggle}
              disabled={showCodePenMode}
              _hover={{
                bg: "gray.600",
              }}
              _disabled={{
                bg: "gray.700",
                color: "gray.500",
                borderColor: "gray.600",
              }}
              fontSize="xs"
              fontWeight="600"
              px={3}
            >
              Preview
            </Button>
            <Button
              size="sm"
              variant="ghost"
              bg={showCodePenMode ? "gray.600" : "gray.700"}
              color={showCodePenMode ? "orange.300" : "gray.300"}
              border="1px solid"
              borderColor="gray.600"
              onClick={handleCodePenToggle}
              _hover={{
                bg: "gray.600",
              }}
              fontSize="xs"
              fontWeight="600"
              px={3}
            >
              <FiBookOpen style={{ marginRight: "4px" }} />
              CodePen
            </Button>
            <Tooltip
              content="現在のコードをクリア"
              showArrow
              portalled
              openDelay={75}
              contentProps={{
                fontSize: "sm",
                bg: "gray.700",
                color: "white",
                borderRadius: "md",
                px: 3,
                py: 2,
              }}
            >
              <Button
                size="sm"
                variant="ghost"
                bg="gray.700"
                color="gray.300"
                border="1px solid"
                borderColor="gray.600"
                onClick={() => clearDoc(mode)}
                _hover={{
                  bg: "gray.600",
                }}
                fontSize="xs"
                fontWeight="600"
                px={2}
              >
                <GiBroom />
              </Button>
            </Tooltip>
            <Tooltip
              content="全てリセット（初期状態に戻す）"
              showArrow
              portalled
              openDelay={75}
              contentProps={{
                fontSize: "sm",
                bg: "gray.700",
                color: "white",
                borderRadius: "md",
                px: 3,
                py: 2,
              }}
            >
              <Button
                size="sm"
                variant="ghost"
                bg="gray.700"
                color="orange.400"
                border="1px solid"
                borderColor="gray.600"
                onClick={handleResetAllWithConfirm}
                _hover={{
                  bg: "gray.600",
                }}
                fontSize="xs"
                fontWeight="600"
                px={3}
              >
                <FiRefreshCw style={{ marginRight: "4px" }} />
                Reset
              </Button>
            </Tooltip>
          </HStack>
        </MotionFlex>

        {/* モード切り替えタブ - Vimモード表示を右端に追加 */}
        <Flex
          justify="space-between"
          align="center"
          px={4}
          py={2}
          borderBottomWidth={1}
          borderColor="gray.700"
          bg="gray.800"
          position="relative"
        >
          {/* 左側: HTML/CSS/JSタブ */}
          <HStack gap={1}>
            {(["html", "css", "js"] as EditorMode[]).map((modeType) => (
              <Button
                key={modeType}
                size="sm"
                variant="ghost"
                bg={mode === modeType ? "gray.700" : "transparent"}
                color={mode === modeType ? "orange.300" : "gray.400"}
                border="1px solid"
                borderColor={mode === modeType ? "gray.600" : "transparent"}
                _hover={{
                  bg: "gray.700",
                  color: mode === modeType ? "orange.300" : "orange.400",
                }}
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
                px={3}
                py={1}
                h="auto"
                textTransform="uppercase"
                letterSpacing="wide"
                fontFamily="mono"
                onClick={() => handleModeChangeWithStateSave(modeType)}
                transition="all 0.2s ease"
                position="relative"
              >
                {modeType}
              </Button>
            ))}
          </HStack>

          {/* 右側: Vimモードインジケーター */}
          <AnimatePresence mode="wait">
            <MotionFlex
              key={vimMode}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              align="center"
              gap={2}
              bg="gray.700"
              px={2}
              py={1}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.600"
            >
              <Icon
                as={currentVimModeInfo.icon}
                color={currentVimModeInfo.color}
                fontSize="sm"
              />
              <MotionText
                fontSize="xs"
                color={currentVimModeInfo.color}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="wide"
                fontFamily="mono"
              >
                {currentVimModeInfo.text}
              </MotionText>
            </MotionFlex>
          </AnimatePresence>
        </Flex>

        {/* メインコンテンツエリア */}
        {/* Previewモード時はプレビューのみ */}
        {showPreview ? (
          <Box
            flex="1"
            h="100%"
            bg="white"
            overflow="hidden"
            borderRadius="0 0 lg lg"
          >
            <iframe
              srcDoc={previewSrcDoc}
              style={{ width: "100%", height: "100%", border: "none" }}
              sandbox={getSandboxAttributes()}
              title="Preview"
            />
          </Box>
        ) : showCodePenMode ? (
          // CodePenモード時は左プレビュー・右エディタ
          <Flex flex="1" h="100%" overflow="hidden">
            <Box flex="1" bg="white" overflow="hidden">
              <iframe
                srcDoc={codePenSrcDoc}
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox={getSandboxAttributes()}
                title="Preview"
              />
            </Box>
            <Box
              flex="1"
              position="relative"
              overflow="hidden"
              borderLeft="1px solid"
              borderColor="gray.700"
            >
              <CodeMirror
                key={mode} // モードが変わったら新しいインスタンスを作成
                value={docs[mode]}
                onChange={(value) => updateDoc(mode, value)}
                onUpdate={onUpdate}
                extensions={getCurrentExtensions(mode)}
                basicSetup={true}
                theme="dark"
                height="100%"
                style={{
                  fontSize: "14px",
                  height: "100%",
                  backgroundColor: "#2d3748", // gray.800相当 - チートシートのコマンド背景と同じ
                  fontFamily:
                    "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
                }}
                autoFocus
                initialState={
                  currentState
                    ? { json: currentState.toJSON(), fields: undefined }
                    : undefined
                }
                onCreateEditor={(view, state) =>
                  handleCreateEditor(view, state, mode)
                }
              />
            </Box>
          </Flex>
        ) : (
          // 通常時はエディタのみ
          <Box
            flex="1"
            position="relative"
            overflow="hidden"
            bg="gray.900"
            borderRadius="0 0 lg lg"
          >
            <CodeMirror
              key={mode} // モードが変わったら新しいインスタンスを作成
              value={docs[mode]}
              onChange={(value) => updateDoc(mode, value)}
              onUpdate={onUpdate}
              extensions={getCurrentExtensions(mode)}
              basicSetup={true}
              theme="dark"
              height="100%"
              style={{
                fontSize: "14px",
                height: "100%",
                backgroundColor: "#2d3748", // gray.800相当 - チートシートのコマンド背景と同じ
                fontFamily:
                  "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
              }}
              autoFocus
              initialState={
                currentState
                  ? { json: currentState.toJSON(), fields: undefined }
                  : undefined
              }
              onCreateEditor={(view, state) =>
                handleCreateEditor(view, state, mode)
              }
            />
          </Box>
        )}
      </>
    </MotionBox>
  );
}

export default VimEditor;
