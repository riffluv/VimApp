"use client";

import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

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

  // 現在のモードのref/stateを取得
  const currentRef = editorRefs[mode];
  const currentState = editorStates[mode];

  return (
    <MotionBox
      bgGradient="linear(to-br, gray.900, gray.800)"
      color="white"
      p={{ base: 2, md: 4 }}
      borderRadius="2xl"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="gray.700"
      position="relative"
      overflow="hidden"
      flex={1}
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      initial="hidden"
      animate="visible"
    >
      {/* ヘッダー */}
      <MotionFlex
        alignItems="center"
        px={[2, 4]}
        py={[2, 3]}
        borderBottomWidth={1}
        borderColor="gray.700"
        bgGradient="linear(to-r, gray.900, gray.800)"
        justifyContent="space-between"
        position="relative"
      >
        <Flex alignItems="center">
          <HStack gap={2} marginRight={5}>
            <Box w={3} h={3} borderRadius="full" bg="red.400" />
            <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
            <Box w={3} h={3} borderRadius="full" bg="green.400" />
          </HStack>
          <Flex alignItems="center">
            <Icon as={FiTerminal} color="orange.400" mr={2} />
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.200"
              userSelect="none"
            >
              Vim Editor
            </Text>
          </Flex>
        </Flex>

        {/* Vimモードインジケーター */}
        <AnimatePresence mode="wait">
          <MotionFlex
            key={vimMode}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
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
            variant="solid"
            colorScheme="blue"
            bg={showPreview ? "blue.500" : "blue.600"}
            color="white"
            onClick={handlePreviewToggle}
            disabled={showCodePenMode}
            _hover={{ bg: "blue.400" }}
            _disabled={{ bg: "gray.600", color: "gray.400" }}
          >
            Preview
          </Button>
          <Button
            size="sm"
            variant="solid"
            colorScheme="purple"
            bg={showCodePenMode ? "purple.500" : "purple.600"}
            color="white"
            onClick={handleCodePenToggle}
            _hover={{ bg: "purple.400" }}
          >
            <FiBookOpen style={{ marginRight: "8px" }} />
            CodePen
          </Button>
          <Button
            size="sm"
            variant="solid"
            colorScheme="red"
            bg="red.600"
            color="white"
            onClick={() => clearDoc(mode)}
            _hover={{ bg: "red.400" }}
          >
            <GiBroom />
          </Button>
          <Button
            size="sm"
            variant="solid"
            colorScheme="orange"
            bg="orange.600"
            color="white"
            onClick={handleResetAllWithConfirm}
            _hover={{ bg: "orange.400" }}
          >
            <FiRefreshCw style={{ marginRight: "8px" }} />
            Reset
          </Button>
        </HStack>
      </MotionFlex>

      {/* モード切り替えタブ */}
      <HStack
        gap={0}
        px={[2, 4]}
        py={2}
        borderBottomWidth={1}
        borderColor="gray.700"
      >
        {(["html", "css", "js"] as EditorMode[]).map((modeType) => (
          <Button
            key={modeType}
            size="sm"
            variant="solid"
            colorScheme={mode === modeType ? "orange" : "gray"}
            bg={mode === modeType ? "orange.500" : "gray.600"}
            color={mode === modeType ? "white" : "gray.200"}
            _hover={{
              bg: mode === modeType ? "orange.400" : "gray.500",
            }}
            borderRadius="none"
            fontSize="xs"
            px={3}
            py={1}
            h="auto"
            textTransform="uppercase"
            onClick={() => handleModeChangeWithStateSave(modeType)}
          >
            {modeType}
          </Button>
        ))}
      </HStack>

      {/* メインコンテンツエリア */}
      {/* Previewモード時はプレビューのみ */}
      {showPreview ? (
        <Box flex="1" h="100%" bg="white" overflow="hidden">
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
          <Box flex="1" position="relative" overflow="hidden">
            <CodeMirror
              key={mode} // モードが変わったら新しいインスタンスを作成
              ref={currentRef}
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
                backgroundColor: "#1a1a1a",
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
        <Box flex="1" position="relative" overflow="hidden">
          <CodeMirror
            key={mode} // モードが変わったら新しいインスタンスを作成
            ref={currentRef}
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
              backgroundColor: "#1a1a1a",
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
    </MotionBox>
  );
}

export default VimEditor;
