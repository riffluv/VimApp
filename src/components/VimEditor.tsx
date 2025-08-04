"use client";

import { Box, Flex, HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
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
                  fontWeight={DESIGN_SYSTEM.typography.fontWeight.bold}
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
                label={showPreview ? "プレビューを非表示" : "プレビューを表示"}
                hasArrow
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
                label={showCodePenMode ? "通常モードに戻す" : "分割表示モード"}
                hasArrow
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
                label="現在のコードをクリア"
                hasArrow
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
                label="全てリセット"
                hasArrow
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

            {/* CheatSheet Lamp Toggle */}
            {onCheatSheetToggle && !showCodePenMode && (
              <Box position="relative" ml={4}>
                <Tooltip
                  label={
                    showCheatSheet
                      ? "チートシートを非表示に！"
                      : "チートシートを表示する！"
                  }
                  hasArrow
                  openDelay={500}
                  closeDelay={100}
                >
                  <Box
                    as="button"
                    onClick={() => onCheatSheetToggle(!showCheatSheet)}
                    position="relative"
                    w={{ base: "2.5rem", md: "3rem" }}
                    h={{ base: "2.5rem", md: "3rem" }}
                    cursor="pointer"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    outline="none"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{
                      transform: "translateY(-2px) scale(1.05)",
                    }}
                    _active={{
                      transform: "translateY(0) scale(0.98)",
                    }}
                    aria-label={
                      showCheatSheet
                        ? "チートシートを非表示"
                        : "チートシートを表示"
                    }
                  >
                    {/* Lamp Base */}
                    <Box
                      position="absolute"
                      bottom={{ base: "3px", md: "4px" }}
                      w={{ base: "1.5rem", md: "2rem" }}
                      h={{ base: "4px", md: "6px" }}
                      bg={DESIGN_SYSTEM.colors.bg.tertiary}
                      borderRadius="full"
                      border="1px solid"
                      borderColor={DESIGN_SYSTEM.borders.colors.subtle}
                      transition="all 0.3s ease"
                    />

                    {/* Lamp Stand */}
                    <Box
                      position="absolute"
                      bottom={{ base: "7px", md: "10px" }}
                      w="2px"
                      h={{ base: "6px", md: "8px" }}
                      bg={DESIGN_SYSTEM.colors.text.tertiary}
                      borderRadius="full"
                      transition="all 0.3s ease"
                    />

                    {/* Outer Glow Ring (when ON) */}
                    {showCheatSheet && (
                      <Box
                        position="absolute"
                        w={{ base: "3rem", md: "3.5rem" }}
                        h={{ base: "3rem", md: "3.5rem" }}
                        borderRadius="full"
                        border="1px solid"
                        borderColor={`${DESIGN_SYSTEM.colors.accent.primary}40`}
                        animation="pulse 2.5s ease-in-out infinite"
                        zIndex={0}
                      />
                    )}

                    {/* Lamp Bulb/Icon */}
                    <Box
                      w={{ base: "2rem", md: "2.5rem" }}
                      h={{ base: "2rem", md: "2.5rem" }}
                      borderRadius="full"
                      bg={
                        showCheatSheet
                          ? `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}, ${DESIGN_SYSTEM.colors.accent.secondary})`
                          : DESIGN_SYSTEM.colors.bg.tertiary
                      }
                      border="2px solid"
                      borderColor={
                        showCheatSheet
                          ? DESIGN_SYSTEM.colors.accent.primary
                          : DESIGN_SYSTEM.borders.colors.subtle
                      }
                      boxShadow={
                        showCheatSheet
                          ? `
                          0 0 20px ${DESIGN_SYSTEM.colors.accent.primary}60,
                          0 0 40px ${DESIGN_SYSTEM.colors.accent.primary}30,
                          0 0 60px ${DESIGN_SYSTEM.colors.accent.primary}20,
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `
                          : `inset 0 2px 4px rgba(0, 0, 0, 0.1)`
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      position="relative"
                      overflow="hidden"
                      zIndex={2}
                    >
                      {/* Inner Glow Effect (when ON) */}
                      {showCheatSheet && (
                        <>
                          <Box
                            position="absolute"
                            top="-20%"
                            left="-20%"
                            w="140%"
                            h="140%"
                            bg={`radial-gradient(circle at 30% 30%, ${DESIGN_SYSTEM.colors.accent.primary}30 0%, transparent 60%)`}
                            animation="pulse 3s ease-in-out infinite"
                            zIndex={1}
                          />
                          <Box
                            position="absolute"
                            w="100%"
                            h="100%"
                            bg={`radial-gradient(circle, ${DESIGN_SYSTEM.colors.accent.primary}10 0%, transparent 70%)`}
                            animation="pulse 2s ease-in-out infinite alternate"
                            zIndex={1}
                          />
                        </>
                      )}

                      {/* Icon */}
                      <Box
                        w={{ base: "1.25rem", md: "1.5rem" }}
                        h={{ base: "1.25rem", md: "1.5rem" }}
                        backgroundImage="url('/manabyicon.png')"
                        backgroundSize="contain"
                        backgroundRepeat="no-repeat"
                        backgroundPosition="center"
                        filter={
                          showCheatSheet
                            ? "brightness(1.6) contrast(1.3) saturate(1.2) drop-shadow(0 0 4px rgba(255,255,255,0.8))"
                            : "brightness(0.5) opacity(0.6) grayscale(0.3)"
                        }
                        transition="filter 0.3s ease"
                        position="relative"
                        zIndex={3}
                      />
                    </Box>

                    {/* Status Indicator Light */}
                    <Box
                      position="absolute"
                      top={{ base: "1px", md: "2px" }}
                      right={{ base: "1px", md: "2px" }}
                      w={{ base: "5px", md: "6px" }}
                      h={{ base: "5px", md: "6px" }}
                      borderRadius="full"
                      bg={
                        showCheatSheet
                          ? DESIGN_SYSTEM.colors.status.success
                          : DESIGN_SYSTEM.colors.text.muted
                      }
                      boxShadow={
                        showCheatSheet
                          ? `
                          0 0 8px ${DESIGN_SYSTEM.colors.status.success},
                          0 0 12px ${DESIGN_SYSTEM.colors.status.success}40
                        `
                          : "none"
                      }
                      transition="all 0.3s ease"
                      zIndex={4}
                      animation={
                        showCheatSheet
                          ? "pulse 1.5s ease-in-out infinite"
                          : "none"
                      }
                    />

                    {/* ON/OFF Label */}
                    <Text
                      position="absolute"
                      bottom="-20px"
                      fontSize={{ base: "xs", md: "xs" }}
                      fontWeight="600"
                      color={
                        showCheatSheet
                          ? DESIGN_SYSTEM.colors.accent.primary
                          : DESIGN_SYSTEM.colors.text.muted
                      }
                      letterSpacing="wide"
                      textTransform="uppercase"
                      transition="color 0.3s ease"
                      textShadow={
                        showCheatSheet
                          ? `0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}40`
                          : "none"
                      }
                      fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
                    >
                      {showCheatSheet ? "ON" : "OFF"}
                    </Text>
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
                  fontSize: "var(--font-size-sm)",
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
                fontSize: "var(--font-size-sm)",
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
