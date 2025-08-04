/**
 * VimEditor Enhanced Component - 2025 Production Ready
 *
 * Features:
 * - Complete separation of concerns
 * - Error boundaries and graceful degradation
 * - Performance optimized rendering
 * - Accessibility-first design
 * - Type-safe props and state management
 * - Memory leak prevention
 * - Modern React patterns (hooks, memo, suspense)
 */

"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import dynamic from "next/dynamic";
import { memo, Suspense, useCallback, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

// Internal imports
import { EDITOR_CONFIG, VIM_MODE_INFO } from "../constants";
import {
  useDocs,
  useEditorExtensions,
  useErrorBoundary,
  useKeyboardNavigation,
  usePerformanceMonitor,
  useUIState,
  useVimMode,
} from "../hooks/useVimEditor-enhanced";
import type { EditorMode, VimEditorProps } from "../types/editor";
import { generatePreviewHTML, getSandboxAttributes } from "../utils/editor";
import { Tooltip } from "./Tooltip";
import {
  EditorActionButton,
  EditorPrimaryButton,
  ModeTabButton,
  SecondaryButton,
} from "./ui/Button-enhanced";

// =============================================================================
// DYNAMIC IMPORTS - Performance Optimization
// =============================================================================

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <Box
      w="100%"
      h="100%"
      bg="gray.900"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderWidth="1px"
      borderColor="gray.700"
    >
      <Flex direction="column" align="center" gap={3}>
        <Spinner size="lg" color="brand.500" />
        <Text color="gray.400" fontSize="sm">
          Loading Editor...
        </Text>
      </Flex>
    </Box>
  ),
});

// =============================================================================
// ERROR BOUNDARY COMPONENT
// =============================================================================

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback = memo<ErrorFallbackProps>(({ error, resetError }) => (
  <Alert
    status="error"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="200px"
    borderRadius="lg"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <Text mt={4} mb={1} fontSize="lg" fontWeight="bold">
      エディタでエラーが発生しました
    </Text>
    <Text color="gray.600" fontSize="sm" mb={4}>
      {error.message || "予期しないエラーが発生しました"}
    </Text>
    <SecondaryButton leftIcon={<FiRefreshCw />} onClick={resetError} size="sm">
      再試行
    </SecondaryButton>
  </Alert>
));

ErrorFallback.displayName = "ErrorFallback";

// =============================================================================
// EDITOR HEADER COMPONENT
// =============================================================================

interface EditorHeaderProps {
  mode: EditorMode;
  vimMode: any;
  showPreview: boolean;
  showCodePenMode: boolean;
  showCheatSheet?: boolean;
  onModeChange: (mode: EditorMode) => void;
  onPreviewToggle: () => void;
  onCodePenToggle: () => void;
  onCheatSheetToggle?: (show: boolean) => void;
  onClearDoc: (mode: EditorMode) => void;
  onResetAll: () => void;
}

const EditorHeader = memo<EditorHeaderProps>(
  ({
    mode,
    vimMode,
    showPreview,
    showCodePenMode,
    showCheatSheet = true,
    onModeChange,
    onPreviewToggle,
    onCodePenToggle,
    onCheatSheetToggle,
    onClearDoc,
    onResetAll,
  }) => {
    const currentVimModeInfo = VIM_MODE_INFO[vimMode];

    const handleResetWithConfirm = useCallback(() => {
      if (
        window.confirm(
          "本当に全てのサンプルを初期状態に戻しますか？\nこの操作は元に戻せません。"
        )
      ) {
        onResetAll();
      }
    }, [onResetAll]);

    return (
      <>
        {/* Window Controls & Title */}
        <Flex
          alignItems="center"
          px={4}
          py={3}
          borderBottomWidth="1px"
          borderColor="gray.700"
          bg="gray.800"
          justifyContent="space-between"
          minH="60px"
        >
          <Flex alignItems="center" gap={3}>
            {/* Window Controls */}
            <HStack gap={1}>
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="red.500"
                cursor="pointer"
              />
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="amber.500"
                cursor="pointer"
              />
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="green.500"
                cursor="pointer"
              />
            </HStack>

            {/* Editor Title */}
            <Flex alignItems="center" gap={3}>
              <Icon as={FiTerminal} color="brand.500" fontSize="xl" />
              <Box>
                <Text fontSize="md" fontWeight="bold" color="gray.100">
                  manaVimEditor
                </Text>
                <Flex alignItems="center" gap={2} mt={1}>
                  <Box w={2} h={2} borderRadius="full" bg="brand.500" />
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    fontFamily="mono"
                    fontWeight="medium"
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
          <Flex alignItems="center" gap={2}>
            <HStack gap={2}>
              <Tooltip
                content={
                  showPreview ? "プレビューを非表示" : "プレビューを表示"
                }
              >
                {showPreview ? (
                  <EditorPrimaryButton
                    onClick={onPreviewToggle}
                    disabled={showCodePenMode}
                    size="sm"
                  >
                    Preview
                  </EditorPrimaryButton>
                ) : (
                  <EditorActionButton
                    onClick={onPreviewToggle}
                    disabled={showCodePenMode}
                    size="sm"
                  >
                    Preview
                  </EditorActionButton>
                )}
              </Tooltip>

              <Tooltip
                content={
                  showCodePenMode ? "通常モードに戻す" : "分割表示モード"
                }
              >
                {showCodePenMode ? (
                  <EditorPrimaryButton
                    onClick={onCodePenToggle}
                    leftIcon={<Icon as={FiBookOpen} />}
                    size="sm"
                  >
                    CodePen
                  </EditorPrimaryButton>
                ) : (
                  <EditorActionButton
                    onClick={onCodePenToggle}
                    leftIcon={<Icon as={FiBookOpen} />}
                    size="sm"
                  >
                    CodePen
                  </EditorActionButton>
                )}
              </Tooltip>

              <Tooltip content="現在のコードをクリア">
                <EditorActionButton
                  onClick={() => onClearDoc(mode)}
                  leftIcon={<GiBroom />}
                  size="sm"
                >
                  Clear
                </EditorActionButton>
              </Tooltip>

              <Tooltip content="全てリセット">
                <EditorPrimaryButton
                  onClick={handleResetWithConfirm}
                  leftIcon={<Icon as={FiRefreshCw} />}
                  size="sm"
                >
                  Reset
                </EditorPrimaryButton>
              </Tooltip>
            </HStack>

            {/* CheatSheet Toggle */}
            {onCheatSheetToggle && !showCodePenMode && (
              <Box position="relative" ml={4}>
                <Tooltip
                  content={
                    showCheatSheet
                      ? "チートシートを非表示に！"
                      : "チートシートを表示する！"
                  }
                  showArrow
                  openDelay={300}
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
                    _hover={{ transform: "translateY(-2px) scale(1.05)" }}
                    _active={{ transform: "translateY(0) scale(0.98)" }}
                    aria-label={
                      showCheatSheet
                        ? "チートシートを非表示"
                        : "チートシートを表示"
                    }
                  >
                    {/* Lamp Implementation */}
                    <Box
                      w={{ base: "2rem", md: "2.5rem" }}
                      h={{ base: "2rem", md: "2.5rem" }}
                      borderRadius="full"
                      bg={
                        showCheatSheet
                          ? "linear-gradient(135deg, #ff6b35, #ff8757)"
                          : "gray.700"
                      }
                      border="2px solid"
                      borderColor={showCheatSheet ? "brand.500" : "gray.600"}
                      boxShadow={
                        showCheatSheet
                          ? "0 0 20px rgba(255, 107, 53, 0.6), 0 0 40px rgba(255, 107, 53, 0.3)"
                          : "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      <Box
                        w={{ base: "1.25rem", md: "1.5rem" }}
                        h={{ base: "1.25rem", md: "1.5rem" }}
                        backgroundImage="url('/manabyicon.png')"
                        backgroundSize="contain"
                        backgroundRepeat="no-repeat"
                        backgroundPosition="center"
                        filter={
                          showCheatSheet
                            ? "brightness(1.6) contrast(1.3) saturate(1.2)"
                            : "brightness(0.5) opacity(0.6) grayscale(0.3)"
                        }
                        transition="filter 0.3s ease"
                      />
                    </Box>
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
          borderColor="gray.700"
          bg="gray.800"
        >
          <HStack gap={1}>
            {EDITOR_CONFIG.modes.map((modeType) => (
              <ModeTabButton
                key={modeType}
                isActive={mode === modeType}
                onClick={() => onModeChange(modeType)}
              >
                {modeType}
              </ModeTabButton>
            ))}
          </HStack>

          {/* Vim Mode Indicator */}
          <Flex
            align="center"
            gap={2}
            bg="gray.700"
            px={2}
            py={1}
            borderRadius="md"
          >
            <Icon
              as={currentVimModeInfo.icon}
              color={currentVimModeInfo.color}
              fontSize="sm"
            />
            <Text
              fontSize="xs"
              color={currentVimModeInfo.color}
              fontWeight="semibold"
              textTransform="uppercase"
              fontFamily="mono"
            >
              {currentVimModeInfo.text}
            </Text>
          </Flex>
        </Flex>
      </>
    );
  }
);

EditorHeader.displayName = "EditorHeader";

// =============================================================================
// MAIN EDITOR COMPONENT
// =============================================================================

const VimEditor = memo<VimEditorProps>(
  ({ onCodePenModeChange, showCheatSheet = true, onCheatSheetToggle }) => {
    // State management
    const [editorStates, setEditorStates] = useState<{
      html: EditorState | undefined;
      css: EditorState | undefined;
      js: EditorState | undefined;
    }>({ html: undefined, css: undefined, js: undefined });

    const editorViews = useRef<{
      html: EditorView | null;
      css: EditorView | null;
      js: EditorView | null;
    }>({ html: null, css: null, js: null });

    // Custom hooks
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

    const { error, reportError, clearError } = useErrorBoundary();
    const performanceMetrics = usePerformanceMonitor();

    // Keyboard navigation
    useKeyboardNavigation(
      handleModeChange,
      handlePreviewToggle,
      handleCodePenToggle
    );

    // Editor creation handler
    const handleCreateEditor = useCallback(
      (view: EditorView, state: EditorState, mode: EditorMode) => {
        try {
          setEditorStates((prev) => ({ ...prev, [mode]: state }));
          editorViews.current[mode] = view;
        } catch (error) {
          reportError(error as Error, "medium");
        }
      },
      [reportError]
    );

    // Mode change with state preservation
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
          reportError(error as Error, "medium");
        }
      },
      [mode, handleModeChange, reportError]
    );

    // Preview HTML generation
    const previewSrcDoc = useMemo(
      () => generatePreviewHTML(docs.html, docs.css, docs.js),
      [docs.html, docs.css, docs.js]
    );

    const codePenSrcDoc = useMemo(
      () => generatePreviewHTML(cleanDocs.html, cleanDocs.css, cleanDocs.js),
      [cleanDocs.html, cleanDocs.css, cleanDocs.js]
    );

    const currentState = editorStates[mode];

    // Error boundary fallback
    if (error) {
      return (
        <ErrorFallback
          error={new Error(error.error.message)}
          resetError={clearError}
        />
      );
    }

    return (
      <Box
        bg="gray.900"
        color="gray.100"
        borderRadius="lg"
        boxShadow="0 8px 16px rgba(0, 0, 0, 0.25)"
        display="flex"
        flexDirection="column"
        borderColor="gray.700"
        position="relative"
        overflow="hidden"
        flex={1}
        h="100%"
        w="100%"
        borderWidth="1px"
        className="vim-editor-container"
      >
        <EditorHeader
          mode={mode}
          vimMode={vimMode}
          showPreview={showPreview}
          showCodePenMode={showCodePenMode}
          showCheatSheet={showCheatSheet}
          onModeChange={handleModeChangeWithStateSave}
          onPreviewToggle={handlePreviewToggle}
          onCodePenToggle={handleCodePenToggle}
          onCheatSheetToggle={onCheatSheetToggle}
          onClearDoc={clearDoc}
          onResetAll={resetAllDocs}
        />

        {/* Main Content */}
        {showPreview ? (
          // Preview Mode
          <Box flex="1" h="100%" bg="white" overflow="hidden">
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
              bg="gray.900"
              borderLeft="1px solid"
              borderColor="gray.700"
              className="codemirror-isolated-container"
            >
              <Suspense
                fallback={
                  <Box
                    w="100%"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Spinner color="brand.500" />
                  </Box>
                }
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
                    backgroundColor: "#111827",
                    fontFamily: "JetBrains Mono, Fira Code, monospace",
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
              </Suspense>
            </Box>
          </Flex>
        ) : (
          // Editor Only Mode
          <Box
            flex="1"
            position="relative"
            overflow="hidden"
            bg="gray.900"
            className="codemirror-isolated-container"
          >
            <Suspense
              fallback={
                <Box
                  w="100%"
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner color="brand.500" />
                </Box>
              }
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
                  backgroundColor: "#111827",
                  fontFamily: "JetBrains Mono, Fira Code, monospace",
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
            </Suspense>
          </Box>
        )}

        {/* Performance Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <Box
            position="absolute"
            bottom={2}
            right={2}
            bg="blackAlpha.700"
            color="white"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="sm"
            fontFamily="mono"
          >
            Renders: {performanceMetrics.renderCount} | Avg:{" "}
            {performanceMetrics.averageRenderTime.toFixed(1)}ms
          </Box>
        )}
      </Box>
    );
  }
);

VimEditor.displayName = "VimEditor";

export default VimEditor;
