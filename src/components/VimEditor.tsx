"use client";

import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useRef, useState } from "react";
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
import type { EditorMode, VimEditorProps } from "@/types/editor";
import { generatePreviewHTML, getSandboxAttributes } from "@/utils/editor";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

// 共通ボタンスタイル（マジックナンバー排除＋2025年トレンド）
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
  py: 2,
  transition: `all ${UI_STYLES.animation.transition.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  fontFamily: EDITOR_CONFIG.fonts.ui,
  position: "relative" as const,
  overflow: "hidden" as const,
  // グラデーション背景
  _before: {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isActive
      ? "linear-gradient(135deg, rgba(232, 131, 58, 0.15), rgba(232, 131, 58, 0.05))"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.02), transparent)",
    opacity: isActive ? 1 : 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
    zIndex: -1,
  },
});

const getButtonHoverStyle = () => ({
  bg: "gray.600",
  color: UI_STYLES.colors.primary,
  borderColor: UI_STYLES.colors.borderAccent,
  transform: "translateY(-1px) scale(1.02)", // 2025年ベストプラクティス: 控えめな上昇（-2px → -1px）
  boxShadow: UI_STYLES.shadow.glow, // シャドウも控えめに（glowMedium → glow）
  isolation: "isolate",
  zIndex: 10,
  _before: {
    opacity: 1,
  },
});

const getButtonActiveStyle = () => ({
  transform: "translateY(0) scale(0.98)",
  boxShadow: UI_STYLES.shadow.pressed,
  transition: "transform 0.1s ease",
});

// モード切り替えタブ専用スタイル（2025年トレンド）
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
  transition: `all ${UI_STYLES.animation.transition.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  position: "relative" as const,
  overflow: "hidden" as const,
  // アクティブ時のアンダーライン
  _before: isActive
    ? {
        content: '""',
        position: "absolute",
        bottom: "-1px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        height: "2px",
        bg: "linear-gradient(90deg, transparent, orange.400, transparent)",
        borderRadius: "1px",
      }
    : undefined,
  // ホバー時のグラデーション背景
  _after: {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(232, 131, 58, 0.1), rgba(232, 131, 58, 0.05))",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
    zIndex: -1,
  },
});

const getModeTabHoverStyle = (isActive: boolean) => ({
  bg: "gray.700",
  color: isActive ? UI_STYLES.colors.primary : "secondary.500",
  borderColor: isActive ? "gray.600" : UI_STYLES.colors.borderAccent,
  transform: "translateY(-2px) scale(1.02)",
  boxShadow: isActive ? UI_STYLES.shadow.glow : UI_STYLES.shadow.subtle,
  isolation: "isolate",
  zIndex: 10,
  _after: {
    opacity: 1,
  },
});

/**
 * VimEditor - 製品化レベルのコードエディタコンポーネント
 *
 * Features:
 * - CodeMirror 6 + Vim拡張
 * - TypeScript型安全
 * - パフォーマンス最適化（memo, useMemo, useCallback）
 * - エラーハンドリング
 * - レスポンシブ対応
 */
const VimEditor = memo<VimEditorProps>(({ onCodePenModeChange }) => {
  // 各モードごとにEditorView/EditorStateを独立管理
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

  // フックからの状態とメソッド
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

  // EditorView/EditorState保存 - メモ化
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

  // モード切替時に現モードのstateを保存 - メモ化
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

  // プレビューHTML生成 - メモ化
  const previewSrcDoc = useMemo(
    () => generatePreviewHTML(docs.html, docs.css, docs.js),
    [docs.html, docs.css, docs.js]
  );

  const codePenSrcDoc = useMemo(
    () => generatePreviewHTML(cleanDocs.html, cleanDocs.css, cleanDocs.js),
    [cleanDocs.html, cleanDocs.css, cleanDocs.js]
  );

  // リセット確認ダイアログ - メモ化
  const handleResetAllWithConfirm = useCallback(() => {
    if (
      window.confirm(
        "本当に全てのサンプルを初期状態に戻しますか？\nこの操作は元に戻せません。"
      )
    ) {
      resetAllDocs();
    }
  }, [resetAllDocs]);

  // エラー状態の場合のレンダリング
  if (hasError) {
    return (
      <Box p={4} bg="red.100" borderRadius="md" maxW="800px" mx="auto">
        <Text color="red.700" fontWeight="bold" mb={2}>
          エディタでエラーが発生しました
        </Text>
        <Text color="red.600" fontSize="sm">
          ページをリロードして再度お試しください。
        </Text>
        <Button
          mt={3}
          size="sm"
          colorScheme="red"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          リロード
        </Button>
      </Box>
    );
  }

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
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.1,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          }}
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
          // 微細なホバー効果
          whileHover={{
            backgroundColor: "rgba(45, 55, 72, 0.85)",
            transition: UI_STYLES.animation.hover,
          }}
        >
          <Flex alignItems="center" gap={{ base: 2, md: 3 }}>
            {/* Window Controls - macOSスタイル */}
            <HStack gap="6px">
              {[
                { color: "red.400", delay: 0 },
                { color: "yellow.400", delay: 0.05 },
                { color: "green.400", delay: 0.1 },
              ].map((control, index) => (
                <MotionBox
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: control.delay,
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }}
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={control.color}
                  cursor="pointer"
                  minW="12px"
                  minH="12px"
                  variants={ANIMATION_VARIANTS.windowControls}
                  whileHover="hover"
                  whileTap="tap"
                />
              ))}
            </HStack>

            {/* Editor Title - 適切なサイズに調整 */}
            <Flex alignItems="center" gap={2}>
              <MotionBox
                whileHover={{
                  rotate: 5,
                  scale: 1.1,
                  transition: UI_STYLES.animation.hover,
                }}
                whileTap={{
                  scale: 0.95,
                  transition: UI_STYLES.animation.tap,
                }}
              >
                <Icon as={FiTerminal} color="secondary.500" fontSize="md" />
              </MotionBox>
              <Box>
                <MotionText
                  fontSize="sm"
                  fontWeight="600"
                  color="secondary.500"
                  letterSpacing="tight"
                  whileHover={{
                    scale: 1.02,
                    transition: UI_STYLES.animation.hover,
                  }}
                >
                  manaVimEditor
                </MotionText>
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
          <HStack gap={UI_STYLES.spacing.buttonGap}>
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
              <MotionBox
                variants={ANIMATION_VARIANTS.button}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
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
              </MotionBox>
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
              <MotionBox
                variants={ANIMATION_VARIANTS.button}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
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
              </MotionBox>
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
              <MotionBox
                variants={ANIMATION_VARIANTS.button}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
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
              </MotionBox>
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
              <MotionBox
                variants={ANIMATION_VARIANTS.button}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  {...getButtonBaseStyle(false)}
                  color="orange.400"
                  onClick={handleResetAllWithConfirm}
                  aria-label="全てのエディタをリセットして初期状態に戻す"
                  _hover={getButtonHoverStyle()}
                  _active={getButtonActiveStyle()}
                >
                  <MotionBox
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Icon
                      as={FiRefreshCw}
                      mr={UI_STYLES.spacing.iconMargin}
                      className="reset-icon"
                    />
                  </MotionBox>
                  Reset
                </Button>
              </MotionBox>
            </Tooltip>
          </HStack>
        </MotionFlex>

        {/* モード切り替えタブ - Vimモード表示を右端に追加 */}
        <MotionFlex
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.2,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          }}
          justify="space-between"
          align="center"
          px={4}
          py={2}
          borderBottomWidth={1}
          borderColor="gray.700"
          bg="gray.800"
          position="relative"
          // 微細なホバー効果
          whileHover={{
            backgroundColor: "rgba(45, 55, 72, 0.85)",
            transition: UI_STYLES.animation.hover,
          }}
        >
          {/* 左側: HTML/CSS/JSタブ - ヘッダーボタンとの統一感 */}
          <HStack gap={UI_STYLES.spacing.buttonGap}>
            {EDITOR_CONFIG.modes.map((modeType, index) => (
              <MotionBox
                key={modeType}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: 0.1 + index * 0.05,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
                variants={ANIMATION_VARIANTS.item}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  {...getModeTabStyle(mode === modeType, modeType)}
                  onClick={() => handleModeChangeWithStateSave(modeType)}
                  _hover={getModeTabHoverStyle(mode === modeType)}
                  _active={getButtonActiveStyle()}
                >
                  {modeType}
                </Button>
              </MotionBox>
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
              px={3}
              py={2}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.600"
              // ホバー時のエフェクト
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(55, 65, 81, 0.9)",
                borderColor: UI_STYLES.colors.borderAccent,
                boxShadow: UI_STYLES.shadow.glow,
                transition: UI_STYLES.animation.hover,
              }}
              whileTap={{
                scale: 0.98,
                transition: UI_STYLES.animation.tap,
              }}
            >
              <MotionBox
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                  transition: UI_STYLES.animation.hover,
                }}
              >
                <Icon
                  as={currentVimModeInfo.icon}
                  color={currentVimModeInfo.color}
                  fontSize="sm"
                />
              </MotionBox>
              <MotionText
                fontSize="xs"
                color={currentVimModeInfo.color}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="wide"
                fontFamily="mono"
                whileHover={{
                  scale: 1.05,
                  transition: UI_STYLES.animation.hover,
                }}
              >
                {currentVimModeInfo.text}
              </MotionText>
            </MotionFlex>
          </AnimatePresence>
        </MotionFlex>

        {/* メインコンテンツエリア - 洗練されたレイアウト */}
        {/* Previewモード時はプレビューのみ */}
        {showPreview ? (
          <MotionBox
            flex="1"
            h="100%"
            bg="white"
            overflow="hidden"
            borderRadius={`0 0 ${UI_STYLES.spacing.borderRadius} ${UI_STYLES.spacing.borderRadius}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: {
                duration: 0.2,
                ease: [0.55, 0.055, 0.675, 0.19],
              },
            }}
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bg: "linear-gradient(90deg, transparent, orange.400, transparent)",
              opacity: 0.6,
            }}
          >
            <iframe
              srcDoc={previewSrcDoc}
              style={{ width: "100%", height: "100%", border: "none" }}
              sandbox={getSandboxAttributes()}
              title="Preview"
            />
          </MotionBox>
        ) : showCodePenMode ? (
          // CodePenモード時は左プレビュー・右エディタ - 高度なレイアウト
          <MotionFlex
            flex="1"
            h="100%"
            overflow="hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
            exit={{
              opacity: 0,
              y: 10,
              transition: {
                duration: 0.3,
                ease: [0.55, 0.055, 0.675, 0.19],
              },
            }}
          >
            {/* プレビューペイン - 洗練された境界線 */}
            <MotionBox
              flex="1"
              bg="white"
              overflow="hidden"
              position="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.1,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                bg: "linear-gradient(90deg, orange.400, yellow.300, orange.400)",
                opacity: 0.5,
              }}
            >
              <iframe
                srcDoc={codePenSrcDoc}
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox={getSandboxAttributes()}
                title="Preview"
              />
            </MotionBox>

            {/* 分割バー - 視覚的強化 */}
            <MotionBox
              w="4px"
              bg="gray.700"
              position="relative"
              cursor="col-resize"
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{
                opacity: 1,
                scaleY: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              whileHover={{
                scale: 1.2,
                transition: UI_STYLES.animation.hover,
              }}
              _before={{
                content: '""',
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "2px",
                height: "20px",
                bg: "gray.500",
                borderRadius: "1px",
              }}
              _hover={{
                _before: {
                  bg: "white",
                  boxShadow: "0 0 8px rgba(232, 131, 58, 0.6)",
                },
              }}
            />

            {/* エディタペイン - 高度なインタラクション */}
            <MotionBox
              flex="1"
              position="relative"
              overflow="hidden"
              maxW="50%" // 確実に50%以下に制限
              minW="0" // flexアイテムの最小幅を0に設定
              className="codemirror-isolated-container" // CodeMirror専用の分離クラス
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.15,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              whileHover={{
                boxShadow: "inset 0 0 0 1px rgba(232, 131, 58, 0.3)",
                transition: UI_STYLES.animation.hover,
              }}
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                bg: "linear-gradient(90deg, orange.400, red.400, orange.400)",
                opacity: 0.4,
                zIndex: 10,
              }}
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
            </MotionBox>
          </MotionFlex>
        ) : (
          // 通常時はエディタのみ - 洗練されたシングルエディタビュー
          <MotionBox
            flex="1"
            position="relative"
            overflow="hidden"
            bg="gray.900"
            borderRadius={`0 0 ${UI_STYLES.spacing.borderRadius} ${UI_STYLES.spacing.borderRadius}`}
            isolation="isolate" // CSS分離を強制してホバー効果の影響を防ぐ
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.3,
                ease: [0.55, 0.055, 0.675, 0.19],
              },
            }}
            whileHover={{
              boxShadow: "inset 0 0 0 1px rgba(232, 131, 58, 0.2)",
              transition: UI_STYLES.animation.hover,
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bg: (() => {
                switch (mode) {
                  case "html":
                    return "linear-gradient(90deg, transparent, red.400, transparent)";
                  case "css":
                    return "linear-gradient(90deg, transparent, blue.400, transparent)";
                  case "js":
                    return "linear-gradient(90deg, transparent, yellow.400, transparent)";
                  default:
                    return "linear-gradient(90deg, transparent, orange.400, transparent)";
                }
              })(),
              opacity: 0.6,
              zIndex: 10,
            }}
            _after={{
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "2px",
              bg: "linear-gradient(90deg, transparent, gray.600, transparent)",
              opacity: 0.4,
            }}
          >
            {/* CodeMirrorコンテナ - 高度なエディタ体験 */}
            <MotionBox
              h="100%"
              w="100%"
              position="relative"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.1,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              zIndex={1} // スタッキングコンテキストを作成
              maxW="100%" // 確実に親の幅以下に制限
              minW="0" // flexアイテムの最小幅を0に設定
              className="codemirror-isolated-container" // CodeMirror専用の分離クラス
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
            </MotionBox>
          </MotionBox>
        )}
      </>
    </MotionBox>
  );
});

// 開発環境での表示名設定
VimEditor.displayName = "VimEditor";

export default VimEditor;
