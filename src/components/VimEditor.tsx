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

import {
  ANIMATION_VARIANTS,
  EDITOR_CONFIG,
  UI_STYLES,
  VIM_MODE_INFO,
} from "@/constants";
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
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

// 共通ボタンスタイル（マジックナンバー排除）
const getButtonBaseStyle = (isActive = false) => ({
  size: "sm" as const,
  variant: "ghost" as const,
  bg: isActive ? "gray.600" : "gray.700",
  color: isActive ? UI_STYLES.colors.primary : "gray.300",
  borderWidth: "1px",
  borderColor: isActive ? "gray.500" : "gray.600",
  fontSize: "xs",
  fontWeight: "600",
  px: 3,
  transition: `all ${UI_STYLES.animation.transition.duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
  fontFamily: EDITOR_CONFIG.fonts.ui,
});

const getButtonHoverStyle = () => ({
  bg: "gray.600",
  color: UI_STYLES.colors.primary,
  borderColor: "gray.500",
  transform: "translateY(-1px)",
  boxShadow: UI_STYLES.shadow.subtle,
  isolation: "isolate",
  zIndex: 10,
});

const getButtonActiveStyle = () => ({
  transform: "translateY(0)",
  transition: "transform 0.1s ease",
});

// モード切り替えタブ専用スタイル
const getModeTabStyle = (isActive: boolean, modeType: string) => ({
  size: "sm" as const,
  variant: "ghost" as const,
  bg: isActive ? "gray.700" : "transparent",
  color: isActive ? "orange.300" : "gray.400",
  borderWidth: "1px",
  borderColor: isActive ? "gray.600" : "gray.700",
  borderRadius: "md",
  fontSize: "xs",
  fontWeight: "600",
  px: 3,
  py: 1,
  h: "auto",
  textTransform: "uppercase" as const,
  letterSpacing: "wide",
  fontFamily: "mono",
  transition: `all ${UI_STYLES.animation.transition.duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
  position: "relative" as const,
  _before: isActive
    ? {
        content: '""',
        position: "absolute",
        bottom: "-1px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        height: "2px",
        bg: "orange.400",
        borderRadius: "1px",
      }
    : undefined,
});

const getModeTabHoverStyle = (isActive: boolean) => ({
  bg: "gray.700",
  color: isActive ? UI_STYLES.colors.primary : "secondary.500",
  borderColor: isActive ? "gray.600" : "gray.600",
  transform: "translateY(-1px)",
  isolation: "isolate",
  zIndex: 10,
});

type VimEditorProps = {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
};

function VimEditor({ onCodePenModeChange }: VimEditorProps) {
  // 各モードごとにEditorView/EditorStateを独立管理
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
  // EditorView/EditorState保存
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

  // モード切替時に現モードのstateを保存
  const handleModeChangeWithStateSave = useCallback(
    (newMode: EditorMode) => {
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

  // 現在のモードstate
  const currentState = editorStates[mode];

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
      bg="gray.900"
      color="white"
      borderRadius={UI_STYLES.spacing.borderRadius}
      boxShadow="glass-premium"
      display="flex"
      flexDirection="column"
      borderColor="gray.700"
      position="relative"
      overflow="hidden"
      flex={1}
      h="100%" // 親の高さに合わせる
      w="100%" // 親の幅に合わせる
      borderWidth="1px"
    >
      {/* すべての要素を1つの親要素でラップ */}
      <>
        {/* ヘッダー - 高さを適切に調整 */}
        <MotionFlex
          alignItems="center"
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 3 }}
          borderBottomWidth="1px"
          borderColor="gray.700"
          bg="gray.800"
          justifyContent="space-between"
          position="relative"
          minH="60px" // CheatSheetと同じ高さ
          maxH="60px" // CheatSheetと同じ高さ
        >
          <Flex alignItems="center" gap={{ base: 2, md: 3 }}>
            {/* Window Controls - macOSスタイル */}
            <HStack gap="6px">
              <Box
                w="12px"
                h="12px"
                borderRadius="full"
                bg="red.400"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                minW="12px"
                minH="12px"
              />
              <Box
                w="12px"
                h="12px"
                borderRadius="full"
                bg="yellow.400"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                minW="12px"
                minH="12px"
              />
              <Box
                w="12px"
                h="12px"
                borderRadius="full"
                bg="green.400"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                minW="12px"
                minH="12px"
              />
            </HStack>

            {/* Editor Title - 適切なサイズに調整 */}
            <Flex alignItems="center" gap={2}>
              <Icon as={FiTerminal} color="secondary.500" fontSize="md" />
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="secondary.500"
                  letterSpacing="tight"
                >
                  manaVimEditor
                </Text>
                <Text fontSize="xs" color="gray.300" mt={0} fontWeight="400">
                  {mode === "html"
                    ? "index.html"
                    : mode === "css"
                    ? "style.css"
                    : "script.js"}
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* 右側: ボタングループ - ヘッダーボタンとの統一感を保つ */}
          <HStack gap={1}>
            <Tooltip
              content={
                showCodePenMode
                  ? "分割表示モードではプレビューは無効です"
                  : showPreview
                  ? "HTMLプレビューを非表示"
                  : "HTMLプレビューを表示"
              }
              showArrow
              portalled
              openDelay={300}
              contentProps={{
                fontSize: "sm",
                bg: "primary.800",
                color: "white",
                borderRadius: "md",
                px: 3,
                py: 2,
              }}
            >
              <Button
                {...getButtonBaseStyle(showPreview)}
                onClick={handlePreviewToggle}
                disabled={showCodePenMode}
                aria-label={
                  showCodePenMode
                    ? "プレビューボタン（分割表示モードでは無効）"
                    : showPreview
                    ? "HTMLプレビューを非表示にする"
                    : "HTMLプレビューを表示する"
                }
                aria-pressed={showPreview}
                _hover={getButtonHoverStyle()}
                _active={getButtonActiveStyle()}
                _disabled={{
                  bg: "gray.700",
                  color: "gray.500",
                  borderColor: "gray.600",
                  transform: "none",
                  boxShadow: "none",
                }}
              >
                Preview
              </Button>
            </Tooltip>
            <Tooltip
              content={
                showCodePenMode
                  ? "通常モードに戻す"
                  : "エディタとプレビューを並べて表示"
              }
              showArrow
              portalled
              openDelay={300}
              contentProps={{
                fontSize: "sm",
                bg: "primary.800",
                color: "white",
                borderRadius: "md",
                px: 3,
                py: 2,
              }}
            >
              <Button
                {...getButtonBaseStyle(showCodePenMode)}
                onClick={handleCodePenToggle}
                aria-label={
                  showCodePenMode
                    ? "分割表示を終了して通常モードに戻す"
                    : "エディタとプレビューを並べて表示する"
                }
                aria-pressed={showCodePenMode}
                _hover={getButtonHoverStyle()}
                _active={getButtonActiveStyle()}
              >
                <Icon as={FiBookOpen} mr={UI_STYLES.spacing.iconMargin} />
                CodePen
              </Button>
            </Tooltip>
            <Tooltip
              content="現在のコードをクリア"
              showArrow
              portalled
              openDelay={300}
              contentProps={{
                fontSize: "sm",
                bg: "primary.800",
                color: "white",
                borderRadius: "md",
                px: 3,
                py: 2,
              }}
            >
              <Button
                {...getButtonBaseStyle(false)}
                onClick={() => clearDoc(mode)}
                aria-label="現在のエディタのコードをクリアする"
                _hover={getButtonHoverStyle()}
                _active={getButtonActiveStyle()}
                px={2}
              >
                <GiBroom />
              </Button>
            </Tooltip>
            <Tooltip
              content="全てリセット（初期状態に戻す）"
              showArrow
              portalled
              openDelay={300}
              contentProps={{
                fontSize: "sm",
                bg: "primary.800",
                color: "white",
                borderRadius: "md",
                px: 3,
                py: 2,
              }}
            >
              <Button
                {...getButtonBaseStyle(false)}
                color="orange.400"
                onClick={handleResetAllWithConfirm}
                aria-label="全てのエディタをリセットして初期状態に戻す"
                _hover={getButtonHoverStyle()}
                _active={getButtonActiveStyle()}
              >
                <Icon
                  as={FiRefreshCw}
                  mr={UI_STYLES.spacing.iconMargin}
                  className="reset-icon"
                />
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
          {/* 左側: HTML/CSS/JSタブ - ヘッダーボタンとの統一感 */}
          <HStack gap={UI_STYLES.spacing.buttonGap}>
            {EDITOR_CONFIG.modes.map((modeType) => (
              <Button
                key={modeType}
                {...getModeTabStyle(mode === modeType, modeType)}
                onClick={() => handleModeChangeWithStateSave(modeType)}
                _hover={getModeTabHoverStyle(mode === modeType)}
                _active={getButtonActiveStyle()}
              >
                {modeType}
              </Button>
            ))}
          </HStack>

          {/* 右側: Vimモードインジケーター */}
          <AnimatePresence mode="wait">
            <MotionFlex
              key={vimMode}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={ANIMATION_VARIANTS.modeIndicator}
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
            borderRadius={`0 0 ${UI_STYLES.spacing.borderRadius} ${UI_STYLES.spacing.borderRadius}`}
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
              maxW="50%" // 確実に50%以下に制限
              minW="0" // flexアイテムの最小幅を0に設定
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
                  width: "100%", // 親コンテナに合わせる
                  maxWidth: "100%", // 絶対に親を超えない
                  backgroundColor: "#1a1a1e", // 新しいprimary.800に合わせて調整
                  fontFamily: EDITOR_CONFIG.fonts.mono,
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
            borderRadius={`0 0 ${UI_STYLES.spacing.borderRadius} ${UI_STYLES.spacing.borderRadius}`}
            isolation="isolate" // CSS分離を強制してホバー効果の影響を防ぐ
            zIndex={1} // スタッキングコンテキストを作成
            maxW="100%" // 確実に親の幅以下に制限
            minW="0" // flexアイテムの最小幅を0に設定
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
                width: "100%", // 親コンテナに合わせる
                maxWidth: "100%", // 絶対に親を超えない
                backgroundColor: "#1a1a1e", // 新しいprimary.800に合わせて調整
                fontFamily: EDITOR_CONFIG.fonts.mono,
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
