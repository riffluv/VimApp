"use client";

import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import { Tooltip } from "./Tooltip";
import {
  EditorActionButton,
  EditorPrimaryButton,
  ModeTabButton,
  SecondaryButton,
} from "./ui/Button";

import { DESIGN_SYSTEM, EDITOR_CONFIG, VIM_MODE_INFO } from "../constants";
import {
  useDocs,
  useEditorExtensions,
  useUIState,
  useVimMode,
} from "../hooks/useVimEditor";
import type { EditorMode, VimEditorProps } from "../types/editor";
import { generatePreviewHTML, getSandboxAttributes } from "../utils/editor";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

/**
 * VimEditor - Simplified, maintainable code editor component
 */
const VimEditor = memo<VimEditorProps>(({ onCodePenModeChange }) => {
  const [editorStates, setEditorStates] = useState<{
    html: EditorState | undefined;
    css: EditorState | undefined;
    js: EditorState | undefined;
  }>({ html: undefined, css: undefined, js: undefined });

  const [hasError, setHasError] = useState(false);

  const editorViews = useRef<{
    html: EditorView | null;
    css: EditorView | null;
    js: EditorView | null;
  }>({ html: null, css: null, js: null });

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

  const handleCreateEditor = useCallback(
    (view: EditorView, state: EditorState, mode: EditorMode) => {
      try {
        setEditorStates((prev) => ({ ...prev, [mode]: state }));
        editorViews.current[mode] = view;
        setHasError(false);
      } catch (error) {
        console.error("Editor creation error:", error);
        setHasError(true);
      }
    },
    []
  );

  const handleModeChangeWithStateSave = useCallback(
    (newMode: EditorMode) => {
      try {
        if (editorViews.current[mode]) {
          setEditorStates((prev) => ({
            ...prev,
            [mode]: editorViews.current[mode]!.state,
          }));
        }
        handleModeChange(newMode);
      } catch (error) {
        console.error("Mode change error:", error);
        setHasError(true);
      }
    },
    [mode, handleModeChange]
  );

  const previewSrcDoc = useMemo(
    () => generatePreviewHTML(docs.html, docs.css, docs.js),
    [docs.html, docs.css, docs.js]
  );

  const codePenSrcDoc = useMemo(
    () => generatePreviewHTML(cleanDocs.html, cleanDocs.css, cleanDocs.js),
    [cleanDocs.html, cleanDocs.css, cleanDocs.js]
  );

  const handleResetAllWithConfirm = useCallback(() => {
    if (
      window.confirm(
        "本当に全てのサンプルを初期状態に戻しますか？\\nこの操作は元に戻せません。"
      )
    ) {
      resetAllDocs();
    }
  }, [resetAllDocs]);

  if (hasError) {
    return (
      <Box
        p={4}
        bg={DESIGN_SYSTEM.colors.status.error}
        borderRadius={DESIGN_SYSTEM.borders.radius.md}
        maxW="800px"
        mx="auto"
        border={`1px solid ${DESIGN_SYSTEM.borders.colors.primary}`}
        boxShadow={DESIGN_SYSTEM.shadows.lg}
      >
        <Text
          color={DESIGN_SYSTEM.colors.text.primary}
          fontWeight="bold"
          mb={2}
          fontSize={DESIGN_SYSTEM.typography.fontSize.lg}
        >
          エディタでエラーが発生しました
        </Text>
        <Text
          color={DESIGN_SYSTEM.colors.text.secondary}
          fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
          mb={3}
          lineHeight="1.5"
        >
          ページをリロードして再度お試しください。
        </Text>
        <SecondaryButton
          onClick={() => window.location.reload()}
          aria-label="ページをリロード"
        >
          リロード
        </SecondaryButton>
      </Box>
    );
  }

  const currentVimModeInfo = VIM_MODE_INFO[vimMode];
  const currentState = editorStates[mode];

  return (
    <Box
      bg={DESIGN_SYSTEM.colors.bg.primary}
      color={DESIGN_SYSTEM.colors.text.primary}
      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
      boxShadow={DESIGN_SYSTEM.shadows.premium.overlay}
      display="flex"
      flexDirection="column"
      borderColor={DESIGN_SYSTEM.borders.colors.subtle}
      position="relative"
      overflow="hidden"
      flex={1}
      h="100%"
      w="100%"
      borderWidth="1px"
      className="vim-editor-container"
    >
      {/* Premium Header */}
      <Flex
        alignItems="center"
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        bg={`linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.secondary}, ${DESIGN_SYSTEM.colors.bg.tertiary})`}
        justifyContent="space-between"
        minH="60px"
        maxH="60px"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${DESIGN_SYSTEM.colors.accent.primary}, transparent)`,
          opacity: 0.6,
        }}
      >
        <Flex alignItems="center" gap={3}>
          {/* Professional Window Controls */}
          <HStack gap="8px">
            <Box
              w="14px"
              h="14px"
              borderRadius="full"
              bg="linear-gradient(135deg, #ff6b6b, #ff5252)"
              cursor="pointer"
              boxShadow="0 2px 4px rgba(255, 107, 107, 0.3)"
              transition="all 0.2s ease"
              _hover={{
                transform: "scale(1.1)",
                boxShadow: "0 4px 8px rgba(255, 107, 107, 0.4)",
              }}
            />
            <Box
              w="14px"
              h="14px"
              borderRadius="full"
              bg="linear-gradient(135deg, #ffb74d, #ffa726)"
              cursor="pointer"
              boxShadow="0 2px 4px rgba(255, 183, 77, 0.3)"
              transition="all 0.2s ease"
              _hover={{
                transform: "scale(1.1)",
                boxShadow: "0 4px 8px rgba(255, 183, 77, 0.4)",
              }}
            />
            <Box
              w="14px"
              h="14px"
              borderRadius="full"
              bg="linear-gradient(135deg, #66bb6a, #4caf50)"
              cursor="pointer"
              boxShadow="0 2px 4px rgba(102, 187, 106, 0.3)"
              transition="all 0.2s ease"
              _hover={{
                transform: "scale(1.1)",
                boxShadow: "0 4px 8px rgba(102, 187, 106, 0.4)",
              }}
            />
          </HStack>

          {/* Professional Editor Title */}
          <Flex alignItems="center" gap={3}>
            <Icon
              as={FiTerminal}
              color={DESIGN_SYSTEM.colors.accent.primary}
              fontSize="xl"
            />
            <Box>
              <Text
                fontSize={DESIGN_SYSTEM.typography.fontSize.base}
                fontWeight={DESIGN_SYSTEM.typography.fontWeight.bold}
                color={DESIGN_SYSTEM.colors.text.primary}
                letterSpacing="tight"
              >
                manaVimEditor
              </Text>
              <Flex alignItems="center" gap={2} mt={1}>
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  bg={DESIGN_SYSTEM.colors.accent.primary}
                  boxShadow={`0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}`}
                />
                <Text
                  fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
                  color={DESIGN_SYSTEM.colors.text.secondary}
                  fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
                  fontWeight={DESIGN_SYSTEM.typography.fontWeight.medium}
                >
                  {mode === "html"
                    ? "index.html"
                    : mode === "css"
                      ? "style.css"
                      : "script.js"}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>

        {/* Premium Action Buttons */}
        <HStack gap={2}>
          <Tooltip
            content={showPreview ? "プレビューを非表示" : "プレビューを表示"}
          >
            {showPreview ? (
              <EditorPrimaryButton
                onClick={handlePreviewToggle}
                disabled={showCodePenMode}
                size="sm"
                style={{ minWidth: "88px" }}
              >
                Preview
              </EditorPrimaryButton>
            ) : (
              <EditorActionButton
                onClick={handlePreviewToggle}
                disabled={showCodePenMode}
                size="sm"
                style={{ minWidth: "88px" }}
              >
                Preview
              </EditorActionButton>
            )}
          </Tooltip>

          <Tooltip
            content={showCodePenMode ? "通常モードに戻す" : "分割表示モード"}
          >
            {showCodePenMode ? (
              <EditorPrimaryButton
                onClick={handleCodePenToggle}
                leftIcon={<Icon as={FiBookOpen} />}
                size="sm"
                style={{ minWidth: "88px" }}
              >
                CodePen
              </EditorPrimaryButton>
            ) : (
              <EditorActionButton
                onClick={handleCodePenToggle}
                leftIcon={<Icon as={FiBookOpen} />}
                size="sm"
                style={{ minWidth: "88px" }}
              >
                CodePen
              </EditorActionButton>
            )}
          </Tooltip>

          <Tooltip content="現在のコードをクリア">
            <EditorActionButton
              onClick={() => clearDoc(mode)}
              leftIcon={<GiBroom />}
              size="sm"
              style={{ minWidth: "88px" }}
            >
              Clear
            </EditorActionButton>
          </Tooltip>

          <Tooltip content="全てリセット">
            <EditorPrimaryButton
              onClick={handleResetAllWithConfirm}
              leftIcon={<Icon as={FiRefreshCw} />}
              size="sm"
              style={{ minWidth: "88px" }}
            >
              Reset
            </EditorPrimaryButton>
          </Tooltip>
        </HStack>
      </Flex>

      {/* Mode Tabs */}
      <Flex
        justify="space-between"
        align="center"
        px={4}
        py={2}
        borderBottomWidth={1}
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
      >
        {/* Mode Tabs */}
        <HStack gap={1}>
          {EDITOR_CONFIG.modes.map((modeType) => (
            <ModeTabButton
              key={modeType}
              isActive={mode === modeType}
              onClick={() => handleModeChangeWithStateSave(modeType)}
            >
              {modeType}
            </ModeTabButton>
          ))}
        </HStack>

        {/* Vim Mode Indicator */}
        <Flex
          align="center"
          gap={2}
          bg={DESIGN_SYSTEM.colors.bg.tertiary}
          px={2}
          py={1}
          borderRadius={DESIGN_SYSTEM.borders.radius.md}
        >
          <Icon
            as={currentVimModeInfo.icon}
            color={currentVimModeInfo.color}
            fontSize="sm"
          />
          <Text
            fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
            color={currentVimModeInfo.color}
            fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
            textTransform="uppercase"
            fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
          >
            {currentVimModeInfo.text}
          </Text>
        </Flex>
      </Flex>

      {/* Main Content */}
      {showPreview ? (
        // Preview Mode
        <Box
          flex="1"
          h="100%"
          bg={DESIGN_SYSTEM.colors.text.primary}
          overflow="hidden"
        >
          <iframe
            srcDoc={previewSrcDoc}
            style={{ width: "100%", height: "100%", border: "none" }}
            sandbox={getSandboxAttributes()}
            title="Preview"
          />
        </Box>
      ) : showCodePenMode ? (
        // CodePen Mode (Split View)
        <Flex flex="1" h="100%" overflow="hidden">
          <Box
            flex="1"
            bg={DESIGN_SYSTEM.colors.text.primary}
            overflow="hidden"
          >
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
            bg={DESIGN_SYSTEM.colors.bg.editor}
            borderLeft="1px solid"
            borderColor={DESIGN_SYSTEM.borders.colors.subtle}
            className="codemirror-isolated-container"
          >
            <CodeMirror
              key={mode}
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
                width: "100%",
                backgroundColor: DESIGN_SYSTEM.colors.bg.editor,
                fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: 0,
                border: 0,
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
        // Editor Only Mode
        <Box
          flex="1"
          position="relative"
          overflow="hidden"
          bg={DESIGN_SYSTEM.colors.bg.editor}
          className="codemirror-isolated-container"
        >
          <CodeMirror
            key={mode}
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
              width: "100%",
              backgroundColor: DESIGN_SYSTEM.colors.bg.editor,
              fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 0,
              padding: 0,
              border: 0,
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
    </Box>
  );
});

VimEditor.displayName = "VimEditor";

export default VimEditor;
