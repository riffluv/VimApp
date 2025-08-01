"use client";

import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import type { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import { Tooltip } from "./Tooltip";
import {
  EditorActionButton,
  ModeTabButton,
  SecondaryButton,
} from "./ui/Button";

import { DESIGN_SYSTEM, EDITOR_CONFIG, VIM_MODE_INFO } from "@/constants";
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

/**
 * VimEditor - 2025年製品化レベルのコードエディタコンポーネント
 *
 * Features:
 * - CodeMirror 6 + Vim拡張
 * - TypeScript完全型安全
 * - パフォーマンス最適化（memo, useMemo, useCallback）
 * - エラーハンドリング + グレースフルデグラデーション
 * - レスポンシブ対応 + Container Query
 * - CSS Isolation + GPU最適化
 * - 2025年最新CSS技術（Cascade Layers, Container Queries）
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

  // エラー状態の場合のレンダリング（2025年レベル - グレースフルデグラデーション）
  if (hasError) {
    return (
      <Box
        p={DESIGN_SYSTEM.spacing["4"]}
        bg={DESIGN_SYSTEM.colors.status.error}
        borderRadius={DESIGN_SYSTEM.borders.radius.md}
        maxW="800px"
        mx="auto"
        border={`1px solid ${DESIGN_SYSTEM.borders.colors.strong}`}
        boxShadow={DESIGN_SYSTEM.shadows.lg}
        // 2025年最新：CSS Isolation + アクセシビリティ
        isolation="isolate"
        role="alert"
        aria-live="polite"
        // Container Query対応
        containerType="inline-size"
      >
        <Text
          color={DESIGN_SYSTEM.colors.text.primary}
          fontWeight="bold"
          mb={DESIGN_SYSTEM.spacing["2"]}
          fontSize={DESIGN_SYSTEM.typography.fontSize.lg}
        >
          エディタでエラーが発生しました
        </Text>
        <Text
          color={DESIGN_SYSTEM.colors.text.secondary}
          fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
          mb={DESIGN_SYSTEM.spacing["3"]}
          lineHeight="1.5"
        >
          ページをリロードして再度お試しください。問題が続く場合は、ブラウザのキャッシュをクリアしてください。
        </Text>
        <SecondaryButton
          onClick={() => window.location.reload()}
          aria-label="ページをリロードしてエラーを解決する"
          style={{
            marginTop: DESIGN_SYSTEM.spacing["3"],
            backgroundColor: DESIGN_SYSTEM.colors.bg.primary,
            color: DESIGN_SYSTEM.colors.text.primary,
            borderColor: DESIGN_SYSTEM.borders.colors.primary,
          }}
        >
          リロード
        </SecondaryButton>
      </Box>
    );
  }

  const currentVimModeInfo = VIM_MODE_INFO[vimMode];

  // 現在のモードstate
  const currentState = editorStates[mode];

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      bg={DESIGN_SYSTEM.colors.bg.primary}
      color={DESIGN_SYSTEM.colors.text.primary}
      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
      boxShadow={DESIGN_SYSTEM.shadows.glass.strong}
      display="flex"
      flexDirection="column"
      borderColor={DESIGN_SYSTEM.borders.colors.subtle}
      position="relative"
      overflow="hidden"
      flex={1}
      h="100%" // 親の高さに合わせる
      w="100%" // 親の幅に合わせる
      borderWidth="1px"
      // 2025年最新：CSS分離とパフォーマンス最適化
      isolation="isolate"
      willChange="transform"
      transform="translateZ(0)"
      className="vim-editor-container"
      // Container Query対応
      containerType="inline-size"
      containerName="vim-editor"
      // CSS Containment（2025年新機能）
      contain="layout style paint"
      // アクセシビリティ強化
      role="application"
      aria-label="Vimエディタ - コードエディタとプレビュー"
    >
      {/* すべての要素を1つの親要素でラップ */}
      <>
        {/* ヘッダー - 高さを適切に調整 */}
        <MotionFlex
          alignItems="center"
          px={{
            base: DESIGN_SYSTEM.spacing["3"],
            md: DESIGN_SYSTEM.spacing["4"],
          }}
          py={{
            base: DESIGN_SYSTEM.spacing["2"],
            md: DESIGN_SYSTEM.spacing["3"],
          }}
          borderBottomWidth="1px"
          borderColor={DESIGN_SYSTEM.borders.colors.subtle}
          bg={DESIGN_SYSTEM.colors.bg.secondary}
          justifyContent="space-between"
          position="relative"
          minH="60px" // CheatSheetと同じ高さ
          maxH="60px" // CheatSheetと同じ高さ
          // CSS分離とパフォーマンス最適化
          isolation="isolate"
          zIndex={2}
        >
          <Flex
            alignItems="center"
            gap={{
              base: DESIGN_SYSTEM.spacing["2"],
              md: DESIGN_SYSTEM.spacing["3"],
            }}
          >
            {/* Window Controls - macOSスタイル */}
            <HStack gap="6px">
              <Box
                w="12px"
                h="12px"
                borderRadius="full"
                bg="#ff5f57"
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
                bg="#ffbd2e"
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
                bg="#28ca42"
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                minW="12px"
                minH="12px"
              />
            </HStack>

            {/* Editor Title - 適切なサイズに調整 */}
            <Flex alignItems="center" gap={DESIGN_SYSTEM.spacing["2"]}>
              <Icon
                as={FiTerminal}
                color={DESIGN_SYSTEM.colors.accent.secondary}
                fontSize="md"
              />
              <Box>
                <Text
                  fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                  fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
                  color={DESIGN_SYSTEM.colors.accent.secondary}
                  letterSpacing="tight"
                >
                  manaVimEditor
                </Text>
                <Text
                  fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
                  color={DESIGN_SYSTEM.colors.text.tertiary}
                  mt={0}
                  fontWeight={DESIGN_SYSTEM.typography.fontWeight.normal}
                >
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
                fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
                bg: DESIGN_SYSTEM.colors.bg.overlay,
                color: DESIGN_SYSTEM.colors.text.primary,
                borderRadius: DESIGN_SYSTEM.borders.radius.md,
                px: DESIGN_SYSTEM.spacing["3"],
                py: DESIGN_SYSTEM.spacing["2"],
                border: `1px solid ${DESIGN_SYSTEM.borders.colors.subtle}`,
                boxShadow: DESIGN_SYSTEM.shadows.lg,
              }}
            >
              <EditorActionButton
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
                variant="ghost"
                size="sm"
                // Chakra UI v3 対応 - styleではなくpropsで設定
                bg={
                  showPreview
                    ? DESIGN_SYSTEM.colors.bg.surface
                    : DESIGN_SYSTEM.colors.bg.tertiary
                }
                color={
                  showPreview
                    ? DESIGN_SYSTEM.colors.accent.primary
                    : DESIGN_SYSTEM.colors.text.tertiary
                }
                borderColor={
                  showPreview
                    ? DESIGN_SYSTEM.borders.colors.primary
                    : DESIGN_SYSTEM.borders.colors.subtle
                }
                borderWidth="1px"
                // 確実にサイズを確保
                minH="2.25rem"
                px="0.75rem"
                py="0.5rem"
              >
                Preview
              </EditorActionButton>
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
                fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
                bg: DESIGN_SYSTEM.colors.bg.overlay,
                color: DESIGN_SYSTEM.colors.text.primary,
                borderRadius: DESIGN_SYSTEM.borders.radius.md,
                px: DESIGN_SYSTEM.spacing["3"],
                py: DESIGN_SYSTEM.spacing["2"],
                border: `1px solid ${DESIGN_SYSTEM.borders.colors.subtle}`,
                boxShadow: DESIGN_SYSTEM.shadows.lg,
              }}
            >
              <EditorActionButton
                onClick={handleCodePenToggle}
                aria-label={
                  showCodePenMode
                    ? "分割表示を終了して通常モードに戻す"
                    : "エディタとプレビューを並べて表示する"
                }
                aria-pressed={showCodePenMode}
                leftIcon={<Icon as={FiBookOpen} />}
                variant="ghost"
                size="sm"
                // Chakra UI v3 対応
                bg={
                  showCodePenMode
                    ? DESIGN_SYSTEM.colors.bg.surface
                    : DESIGN_SYSTEM.colors.bg.tertiary
                }
                color={
                  showCodePenMode
                    ? DESIGN_SYSTEM.colors.accent.primary
                    : DESIGN_SYSTEM.colors.text.tertiary
                }
                borderColor={
                  showCodePenMode
                    ? DESIGN_SYSTEM.borders.colors.primary
                    : DESIGN_SYSTEM.borders.colors.subtle
                }
                borderWidth="1px"
                minH="2.25rem"
                px="0.75rem"
                py="0.5rem"
              >
                CodePen
              </EditorActionButton>
            </Tooltip>
            <Tooltip
              content="現在のコードをクリア"
              showArrow
              portalled
              openDelay={300}
              contentProps={{
                fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
                bg: DESIGN_SYSTEM.colors.bg.overlay,
                color: DESIGN_SYSTEM.colors.text.primary,
                borderRadius: DESIGN_SYSTEM.borders.radius.md,
                px: DESIGN_SYSTEM.spacing["3"],
                py: DESIGN_SYSTEM.spacing["2"],
                border: `1px solid ${DESIGN_SYSTEM.borders.colors.subtle}`,
                boxShadow: DESIGN_SYSTEM.shadows.lg,
              }}
            >
              <EditorActionButton
                onClick={() => clearDoc(mode)}
                aria-label="現在のエディタのコードをクリアする"
                leftIcon={<GiBroom />}
                variant="ghost"
                size="xs"
                minH="2rem"
                px="0.5rem"
                py="0.375rem"
              >
                Clear
              </EditorActionButton>
            </Tooltip>
            <Tooltip
              content="全てリセット（初期状態に戻す）"
              showArrow
              portalled
              openDelay={300}
              contentProps={{
                fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
                bg: DESIGN_SYSTEM.colors.bg.overlay,
                color: DESIGN_SYSTEM.colors.text.primary,
                borderRadius: DESIGN_SYSTEM.borders.radius.md,
                px: DESIGN_SYSTEM.spacing["3"],
                py: DESIGN_SYSTEM.spacing["2"],
                border: `1px solid ${DESIGN_SYSTEM.borders.colors.subtle}`,
                boxShadow: DESIGN_SYSTEM.shadows.lg,
              }}
            >
              <EditorActionButton
                onClick={handleResetAllWithConfirm}
                aria-label="全てのエディタをリセットして初期状態に戻す"
                leftIcon={<Icon as={FiRefreshCw} className="reset-icon" />}
                variant="ghost"
                size="sm"
                color={DESIGN_SYSTEM.colors.accent.secondary}
                minH="2.25rem"
                px="0.75rem"
                py="0.5rem"
              >
                Reset
              </EditorActionButton>
            </Tooltip>
          </HStack>
        </MotionFlex>

        {/* モード切り替えタブ - Vimモード表示を右端に追加 */}
        <Flex
          justify="space-between"
          align="center"
          px={DESIGN_SYSTEM.spacing["4"]}
          py={DESIGN_SYSTEM.spacing["2"]}
          borderBottomWidth={1}
          borderColor={DESIGN_SYSTEM.borders.colors.subtle}
          bg={DESIGN_SYSTEM.colors.bg.secondary}
          position="relative"
          // CSS分離とパフォーマンス最適化
          isolation="isolate"
          zIndex={2}
        >
          {/* 左側: HTML/CSS/JSタブ */}
          <HStack gap={DESIGN_SYSTEM.spacing["1"]}>
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

          {/* 右側: Vimモードインジケーター */}
          <AnimatePresence mode="wait">
            <MotionFlex
              key={vimMode}
              initial={{ opacity: 0, x: -15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.9 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              align="center"
              gap={DESIGN_SYSTEM.spacing["2"]}
              bg={DESIGN_SYSTEM.colors.bg.surface}
              px={DESIGN_SYSTEM.spacing["2"]}
              py={DESIGN_SYSTEM.spacing["1"]}
              borderRadius={DESIGN_SYSTEM.borders.radius.md}
              // レイアウトスラッシング防止
              willChange="transform, opacity"
              transform="translateZ(0)"
            >
              <Icon
                as={currentVimModeInfo.icon}
                color={currentVimModeInfo.color}
                fontSize="sm"
              />
              <MotionText
                fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
                color={currentVimModeInfo.color}
                fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
                textTransform="uppercase"
                letterSpacing="wide"
                fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
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
            bg={DESIGN_SYSTEM.colors.text.primary}
            overflow="hidden"
            borderRadius={`0 0 ${DESIGN_SYSTEM.borders.radius.lg} ${DESIGN_SYSTEM.borders.radius.lg}`}
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
              borderLeft="1px solid"
              borderColor={DESIGN_SYSTEM.borders.colors.subtle}
              maxW="50%" // 確実に50%以下に制限
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
                  backgroundColor: DESIGN_SYSTEM.colors.bg.secondary, // 新しいデザインシステムに合わせて調整
                  fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
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
            bg={DESIGN_SYSTEM.colors.bg.primary}
            borderRadius={`0 0 ${DESIGN_SYSTEM.borders.radius.lg} ${DESIGN_SYSTEM.borders.radius.lg}`}
            isolation="isolate" // CSS分離を強制してホバー効果の影響を防ぐ
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
                backgroundColor: DESIGN_SYSTEM.colors.bg.secondary, // 新しいデザインシステムに合わせて調整
                fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
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
});

// 開発環境での表示名設定
VimEditor.displayName = "VimEditor";

export default VimEditor;
