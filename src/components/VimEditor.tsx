"use client";

import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import {
  EditorActionButton,
  EditorPrimaryButton,
  ModeTabButton,
  SecondaryButton,
} from "./ui/Button";
import Tooltip from "./ui/Tooltip";

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
const VimEditor = memo<VimEditorProps>(
  ({ onCodePenModeChange, showCheatSheet = true, onCheatSheetToggle }) => {
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
        boxShadow={DESIGN_SYSTEM.shadows.md}
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
        {/* Header */}
        <Flex
          alignItems="center"
          px={4}
          py={3}
          borderBottomWidth="1px"
          borderColor={DESIGN_SYSTEM.borders.colors.subtle}
          bg={DESIGN_SYSTEM.colors.bg.secondary}
          justifyContent="space-between"
          minH="var(--header-height)"
          maxH="var(--header-height)"
          position="relative"
        >
          <Flex alignItems="center" gap={3}>
            {/* Window Controls */}
            <HStack gap="var(--space-2xs)">
              <Box
                w="var(--space-md)"
                h="var(--space-md)"
                borderRadius="full"
                bg="#ff6b6b"
                cursor="pointer"
              />
              <Box
                w="var(--space-md)"
                h="var(--space-md)"
                borderRadius="full"
                bg="#ffb74d"
                cursor="pointer"
              />
              <Box
                w="var(--space-md)"
                h="var(--space-md)"
                borderRadius="full"
                bg="#66bb6a"
                cursor="pointer"
              />
            </HStack>

            {/* Editor Title */}
            <Flex alignItems="center" gap={3}>
              <Icon
                as={FiTerminal}
                color={DESIGN_SYSTEM.colors.accent.primary}
                fontSize="xl"
              />
              <Box>
                <Text
                  fontSize={DESIGN_SYSTEM.typography.fontSize.base}
                  fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
                  color={DESIGN_SYSTEM.colors.text.primary}
                  letterSpacing="tight"
                >
                  manaVimEditor
                </Text>
                <Flex alignItems="center" gap={2} mt={1}>
                  <Box
                    w="var(--space-xs)"
                    h="var(--space-xs)"
                    borderRadius="full"
                    bg={DESIGN_SYSTEM.colors.accent.primary}
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

          {/* Action Buttons */}
          <Flex alignItems="center" gap={2} position="relative">
            <HStack gap={2}>
              <Tooltip
                content={
                  showPreview ? "プレビューを非表示" : "プレビューを表示"
                }
                showArrow
                openDelay={500}
                closeDelay={100}
              >
                {showPreview ? (
                  <EditorPrimaryButton
                    onClick={handlePreviewToggle}
                    disabled={showCodePenMode}
                    size="sm"
                    style={{ minWidth: "var(--button-min-width)" }}
                  >
                    Preview
                  </EditorPrimaryButton>
                ) : (
                  <EditorActionButton
                    onClick={handlePreviewToggle}
                    disabled={showCodePenMode}
                    size="sm"
                    style={{ minWidth: "var(--button-min-width)" }}
                  >
                    Preview
                  </EditorActionButton>
                )}
              </Tooltip>

              <Tooltip
                content={
                  showCodePenMode ? "通常モードに戻す" : "分割表示モード"
                }
                showArrow
                openDelay={500}
                closeDelay={100}
              >
                {showCodePenMode ? (
                  <EditorPrimaryButton
                    onClick={handleCodePenToggle}
                    leftIcon={<Icon as={FiBookOpen} />}
                    size="sm"
                    style={{ minWidth: "var(--button-min-width)" }}
                  >
                    CodePen
                  </EditorPrimaryButton>
                ) : (
                  <EditorActionButton
                    onClick={handleCodePenToggle}
                    leftIcon={<Icon as={FiBookOpen} />}
                    size="sm"
                    style={{ minWidth: "var(--button-min-width)" }}
                  >
                    CodePen
                  </EditorActionButton>
                )}
              </Tooltip>

              <Tooltip
                content="現在のコードをクリア"
                showArrow
                openDelay={500}
                closeDelay={100}
              >
                <EditorActionButton
                  onClick={() => clearDoc(mode)}
                  leftIcon={<GiBroom />}
                  size="sm"
                  style={{ minWidth: "var(--button-min-width)" }}
                >
                  Clear
                </EditorActionButton>
              </Tooltip>

              <Tooltip
                content="全てリセット"
                showArrow
                openDelay={500}
                closeDelay={100}
              >
                <EditorPrimaryButton
                  onClick={handleResetAllWithConfirm}
                  leftIcon={<Icon as={FiRefreshCw} />}
                  size="sm"
                  style={{ minWidth: "var(--button-min-width)" }}
                >
                  Reset
                </EditorPrimaryButton>
              </Tooltip>
            </HStack>

            {/* Simple CheatSheet Toggle */}
            {onCheatSheetToggle && !showCodePenMode && (
              <Box position="relative" ml={3}>
                <Tooltip
                  content={
                    showCheatSheet
                      ? "チートシートを非表示"
                      : "チートシートを表示"
                  }
                  showArrow
                  openDelay={500}
                  closeDelay={100}
                >
                  <Box
                    as="button"
                    onClick={() => onCheatSheetToggle(!showCheatSheet)}
                    w="2.5rem"
                    h="2.5rem"
                    cursor="pointer"
                    outline="none"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={
                      showCheatSheet
                        ? DESIGN_SYSTEM.colors.accent.primary
                        : DESIGN_SYSTEM.colors.bg.tertiary
                    }
                    borderRadius={DESIGN_SYSTEM.borders.radius.md}
                    border="1px solid"
                    borderColor={
                      showCheatSheet
                        ? DESIGN_SYSTEM.colors.accent.primary
                        : DESIGN_SYSTEM.borders.colors.subtle
                    }
                    _hover={{
                      bg: showCheatSheet
                        ? DESIGN_SYSTEM.colors.accent.secondary
                        : DESIGN_SYSTEM.colors.bg.quaternary,
                    }}
                    aria-label={
                      showCheatSheet
                        ? "チートシートを非表示"
                        : "チートシートを表示"
                    }
                  >
                    <Box
                      w="1.5rem"
                      h="1.5rem"
                      backgroundImage="url('/manabyicon.png')"
                      backgroundSize="contain"
                      backgroundRepeat="no-repeat"
                      backgroundPosition="center"
                      filter={
                        showCheatSheet
                          ? "brightness(2) contrast(1.2)"
                          : "brightness(0.7) opacity(0.8)"
                      }
                    />
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Flex>
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
                  fontSize: "16px",
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
                fontSize: "16px",
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
  }
);

VimEditor.displayName = "VimEditor";

export default VimEditor;
