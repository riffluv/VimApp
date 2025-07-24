import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { history } from "@codemirror/commands";
import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import {
  abbreviationTracker,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import { getCM, vim } from "@replit/codemirror-vim";
import CodeMirror from "@uiw/react-codemirror";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiCommand,
  FiEdit,
  FiRefreshCw,
  FiTerminal,
} from "react-icons/fi";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

// 共通のキーマップ設定
const commonKeymap = keymap.of([
  { key: "Ctrl-e", run: expandAbbreviation },
  { key: "Cmd-e", run: expandAbbreviation },
]);

// Emmet設定を言語ごとに定義
const emmetConfigs = {
  html: {
    autocompleteTab: true,
    config: {
      markup: {
        options: {
          "markup.attributes": {
            href: "https://",
            src: "/",
          },
        },
      },
    },
  },
  css: {
    autocompleteTab: true,
    config: {
      stylesheet: {
        options: {
          "stylesheet.strictMatch": true,
        },
      },
    },
  },
} as const;

// 言語固有の拡張機能マップ
const languageExtensions = {
  html: htmlLang(),
  css: cssLang(),
  js: jsLang(),
} as const;

// 拡張取得関数（CodeMirror用）- 各モードごとに独立したhistory付き
const getExtensions = (mode: EditorMode) => {
  const baseExtensions = [
    languageExtensions[mode],
    history(), // 各モードが独立したhistoryを持つ
    vim(),
    commonKeymap,
    oneDark,
  ];

  // EmmetサポートがあるモードのみEmmetを追加
  if (mode === "html" || mode === "css") {
    const emmetExtension = Prec.high(abbreviationTracker(emmetConfigs[mode]));
    return [
      languageExtensions[mode],
      history(), // 各モードが独立したhistoryを持つ
      emmetExtension,
      vim(),
      commonKeymap,
      oneDark,
    ];
  }

  return baseExtensions;
};
// アニメーション用のvariants（再定義）
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};
const modeIndicatorVariants = {
  hidden: { opacity: 0, x: -15, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 15,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};
// --- サンプルコード（CodePenモード用：チートシート除去版） ---
const codePenSamples = {
  html: `<div class="container">
  <h1>Hello Vim!</h1>
  <p>これはVim練習用のサンプルです。</p>
</div>
`,
  css: `.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f5f5;
}
`,
  js: `document.querySelector('.container').addEventListener('click', function() {
  alert('Vimで編集してみよう！');
});
`,
};

// --- サンプルコード＋コメント（tips）一体化管理オブジェクト ---
const defaultSamples = {
  html: `<div class="container">
  <h1>Hello Vim!</h1>
  <p>これはVim練習用のサンプルです。</p>
// --- おまけ: よく使うVimコマンド ---
// h / j / k / l : 左右上下にカーソル移動
// w / b / e : 単語単位で移動
// 0 / $ / ^ : 行頭・行末・最初の非空白文字へ
// gg / G : ファイル先頭・末尾へ移動
// i / a / o / O : 挿入モード
// x : 文字削除
// dd : 行削除
// yy : 行コピー
// p / P : 貼り付け
// u / Ctrl+r : アンドゥ・リドゥ
// cw / cc / c$ : 単語・行・行末まで変更
// . : 直前の操作を繰り返し
// /pattern : 検索
// n / N : 次・前の検索結果へ
// :%s/old/new/g : 置換
// v / V : 選択開始
// y / d : コピー・削除
</div>
`,
  css: `.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f5f5;
  // --- おまけ: よく使うVimコマンド ---
  // h / j / k / l : 左右上下にカーソル移動
  // w / b / e : 単語単位で移動
  // 0 / $ / ^ : 行頭・行末・最初の非空白文字へ
  // gg / G : ファイル先頭・末尾へ移動
  // i / a / o / O : 挿入モード
  // x : 文字削除
  // dd : 行削除
  // yy : 行コピー
  // p / P : 貼り付け
  // u / Ctrl+r : アンドゥ・リドゥ
  // cw / cc / c$ : 単語・行・行末まで変更
  // . : 直前の操作を繰り返し
  // /pattern : 検索
  // n / N : 次・前の検索結果へ
  // :%s/old/new/g : 置換
  // v / V : 選択開始
  // y / d : コピー・削除
}
`,
  js: `document.querySelector('.container').addEventListener('click', function() {
  alert('Vimで編集してみよう！');
  // --- おまけ: よく使うVimコマンド ---
  // h / j / k / l : 左右上下にカーソル移動
  // w / b / e : 単語単位で移動
  // 0 / $ / ^ : 行頭・行末・最初の非空白文字へ
  // gg / G : ファイル先頭・末尾へ移動
  // i / a / o / O : 挿入モード
  // x : 文字削除
  // dd : 行削除
  // yy : 行コピー
  // p / P : 貼り付け
  // u / Ctrl+r : アンドゥ・リドゥ
  // cw / cc / c$ : 単語・行・行末まで変更
  // . : 直前の操作を繰り返し
  // /pattern : 検索
  // n / N : 次・前の検索結果へ
  // :%s/old/new/g : 置換
  // v / V : 選択開始
  // y / d : コピー・削除
});
`,
};

// --- 型定義 ---
type EditorMode = "html" | "css" | "js";
type VimMode = keyof typeof modeInfo;

interface DocsState {
  html: string;
  css: string;
  js: string;
}

interface VimEditorProps {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
}

// --- Vimモード情報・型定義 ---
const modeInfo = {
  normal: {
    text: "NORMAL",
    color: "orange.400",
    icon: FiCommand as IconType,
    hint: "Press i to enter insert mode",
  },
  insert: {
    text: "INSERT",
    color: "green.400",
    icon: FiEdit as IconType,
    hint: "Press Esc to return to normal mode",
  },
  visual: {
    text: "VISUAL",
    color: "purple.400",
    icon: FiCommand as IconType,
    hint: "Select text with h,j,k,l or use y to copy",
  },
} as const;
function VimEditor({ onCodePenModeChange }: VimEditorProps) {
  const [mode, setMode] = useState<EditorMode>("html");
  const [vimMode, setVimMode] = useState<VimMode>("normal");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showCodePenMode, setShowCodePenMode] = useState<boolean>(false);

  // 統一されたドキュメント状態 - 通常モードとCodePenモードで共有
  const [docs, setDocs] = useState<DocsState>(() => {
    try {
      // 新しい統一されたキーから読み込み
      const saved = localStorage.getItem("vimapp_shared_docs");
      if (saved) {
        return JSON.parse(saved);
      }

      // 旧データが存在する場合はマイグレーション
      const oldSamples = localStorage.getItem("vimapp_samples");
      if (oldSamples) {
        console.log("Migrating old localStorage data to unified format");
        const oldData = JSON.parse(oldSamples);
        // 新しいキーに保存
        localStorage.setItem("vimapp_shared_docs", JSON.stringify(oldData));
        // 旧キーを削除
        localStorage.removeItem("vimapp_samples");
        localStorage.removeItem("vimapp_codepen_samples");
        return oldData;
      }

      return defaultSamples;
    } catch (error) {
      console.warn("Failed to load saved docs from localStorage:", error);
      return defaultSamples;
    }
  });

  // 各モードの拡張機能を個別にメモ化（独立したhistory付き）
  const htmlExtensions = useMemo(() => getExtensions("html"), []);
  const cssExtensions = useMemo(() => getExtensions("css"), []);
  const jsExtensions = useMemo(() => getExtensions("js"), []);

  // 現在のモードに応じた拡張を返す
  const getCurrentExtensions = useCallback(() => {
    switch (mode) {
      case "html":
        return htmlExtensions;
      case "css":
        return cssExtensions;
      case "js":
        return jsExtensions;
      default:
        return htmlExtensions;
    }
  }, [mode, htmlExtensions, cssExtensions, jsExtensions]);

  // CodePen表示用にコメントを除去したクリーンなコードを生成
  const getCleanCode = useCallback((code: string) => {
    return code
      .split("\n")
      .filter((line: string) => !line.trim().startsWith("//"))
      .join("\n");
  }, []);

  // CodePen表示用のクリーンなドキュメント状態
  const cleanDocs = useMemo(
    () => ({
      html: getCleanCode(docs.html),
      css: getCleanCode(docs.css),
      js: getCleanCode(docs.js),
    }),
    [docs, getCleanCode]
  );

  // 統一されたlocalStorage保存関数
  const saveDocsToStorage = useCallback((updatedDocs: DocsState) => {
    try {
      localStorage.setItem("vimapp_shared_docs", JSON.stringify(updatedDocs));
    } catch (error) {
      console.warn("Failed to save docs to localStorage:", error);
    }
  }, []);

  // モード切り替え - ベストプラクティス: どのモードボタンを押しても必ずエディター画面に戻す
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setShowPreview(false); // プレビュー解除（同じモードでも必ず解除）
    setVimMode("normal");
    setMode(newMode);
  }, []);

  // CodePenモード切り替え - 最適化版
  const handleCodePenToggle = useCallback(() => {
    setShowCodePenMode((prev) => {
      const newValue = !prev;
      // 親コンポーネントに状態を通知
      onCodePenModeChange?.(newValue);
      return newValue;
    });
    setShowPreview(false); // CodePenモード時はPreviewボタンは無効化
  }, [onCodePenModeChange]);

  // Vimモード監視 - エラーハンドリング強化
  const onUpdate = useCallback((viewUpdate: any) => {
    try {
      let nextVimMode: VimMode = "normal";

      if (viewUpdate?.view) {
        const cm = getCM(viewUpdate.view);
        if (cm?.state?.vim?.mode) {
          const vimModeRaw = cm.state.vim.mode;
          switch (vimModeRaw) {
            case "insert":
              nextVimMode = "insert";
              break;
            case "visual":
              nextVimMode = "visual";
              break;
            default:
              nextVimMode = "normal";
              break;
          }
        }
      }

      setVimMode(nextVimMode);
    } catch (error) {
      console.warn("Error updating vim mode:", error);
      setVimMode("normal");
    }
  }, []);

  // リセット - データのみ変更し画面状態は維持
  const handleReset = useCallback(() => {
    const defaultContent = defaultSamples[mode];
    setDocs((prev) => {
      const updated = { ...prev, [mode]: defaultContent };
      saveDocsToStorage(updated);
      return updated;
    });
    setVimMode("normal");
    // 画面状態は維持（setShowPreview, setShowCodePenModeは呼ばない）
  }, [mode, saveDocsToStorage]);

  // 全エディターリセット（画面状態は維持）
  const handleResetAll = useCallback(() => {
    setDocs(defaultSamples);
    saveDocsToStorage(defaultSamples);
    setVimMode("normal");
    // 画面状態は維持（setShowPreview, setShowCodePenModeは呼ばない）
  }, [saveDocsToStorage]);

  // プレビュー用HTML生成 - useMemoで最適化
  const previewSrcDoc = useMemo(() => {
    const cleanHtml = getCleanCode(docs.html);

    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <style>${docs.css}</style>
</head>
<body>
  ${cleanHtml}
  <script>${docs.js}</script>
</body>
</html>`;
  }, [docs.css, docs.html, docs.js, getCleanCode]);

  // CodePenモード用HTML生成 - 統一されたcleanDocsを使用
  const codePenSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CodePen Preview</title>
  <style>${cleanDocs.css}</style>
</head>
<body>
  ${cleanDocs.html}
  <script>${cleanDocs.js}</script>
</body>
</html>`;
  }, [cleanDocs]);

  // プレビュー切り替え - 最適化版
  const handlePreviewToggle = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);
  // SSR/CSR差異による高さ0問題を防ぐ
  return (
    <MotionBox
      bgGradient="gradient.primary"
      color="text.primary"
      p={{ base: 2, md: 4 }}
      borderRadius="2xl"
      boxShadow="glass"
      display="flex"
      flexDirection="column"
      borderWidth={1}
      borderColor="border.primary"
      position="relative"
      overflow="hidden"
      flex={1}
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "gradient.glass",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
      _hover={{
        boxShadow: "glass-hover",
        transform: "translateY(-1px)",
      }}
    >
      {/* --- Editor Header (macOS風ウィンドウコントロール) --- */}
      <MotionFlex
        alignItems="center"
        px={[2, 4]}
        py={[2, 3]}
        borderBottomWidth={1}
        borderColor="primary.700"
        bgGradient="linear(to-r, primary.900, primary.800)"
        justifyContent="space-between"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(255,152,0,0.08) 0%, transparent 50%, rgba(255,152,0,0.03) 100%)",
          pointerEvents: "none",
        }}
      >
        <Flex alignItems="center">
          <HStack gap={2} marginRight={5}>
            <Box w={3} h={3} borderRadius="full" bg="red.400" />
            <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
            <Box w={3} h={3} borderRadius="full" bg="green.400" />
          </HStack>
          <Flex alignItems="center">
            <Icon as={FiTerminal} color="secondary.400" mr={2} />
            <MotionText
              fontFamily="mono"
              fontWeight="medium"
              letterSpacing="tight"
              color="white"
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mode.toUpperCase()} Editor
            </MotionText>
          </Flex>
        </Flex>
        <HStack justifyContent="flex-end" gap={2}>
          {/* CodePenモードボタン */}
          <Button
            onClick={handleCodePenToggle}
            colorScheme={showCodePenMode ? "teal" : "gray"}
            bg={
              showCodePenMode
                ? "linear-gradient(135deg, rgba(56,178,172,0.2), rgba(56,178,172,0.1))"
                : "transparent"
            }
            color={showCodePenMode ? "teal.400" : "gray.400"}
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight={showCodePenMode ? "bold" : "medium"}
            letterSpacing="tight"
            borderWidth={showCodePenMode ? 1 : 0}
            borderColor={showCodePenMode ? "teal.800" : "transparent"}
            _hover={{
              bg: "linear-gradient(135deg, rgba(56,178,172,0.3), rgba(56,178,172,0.15))",
              color: "teal.400",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "blackAlpha.500",
              transform: "translateY(0)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            mr={1}
            aria-label="CodePenモード切り替え"
            aria-pressed={showCodePenMode}
          >
            <Icon as={FiBookOpen} mr={1} /> CodePen
          </Button>

          {/* Previewボタン - CodePenモード時は無効化 */}
          <Button
            onClick={handlePreviewToggle}
            disabled={showCodePenMode}
            colorScheme={showPreview ? "purple" : "gray"}
            bg={
              showPreview
                ? "linear-gradient(135deg, rgba(128,90,213,0.2), rgba(128,90,213,0.1))"
                : "transparent"
            }
            color={showPreview ? "purple.400" : "gray.400"}
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight={showPreview ? "bold" : "medium"}
            letterSpacing="tight"
            borderWidth={showPreview ? 1 : 0}
            borderColor={showPreview ? "purple.800" : "transparent"}
            _hover={{
              bg: showCodePenMode
                ? "transparent"
                : "linear-gradient(135deg, rgba(128,90,213,0.3), rgba(128,90,213,0.15))",
              color: showCodePenMode ? "gray.400" : "purple.400",
              transform: showCodePenMode ? "none" : "translateY(-1px)",
              boxShadow: showCodePenMode ? "none" : "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "blackAlpha.500",
              transform: "translateY(0)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            mr={1}
            aria-label="プレビュー表示切り替え"
            aria-pressed={showPreview}
            opacity={showCodePenMode ? 0.5 : 1}
          >
            Preview
          </Button>
          {(["html", "css", "js"] as const).map((m) => (
            <Button
              key={m}
              onClick={() => handleModeChange(m)}
              colorScheme={mode === m ? "orange" : "gray"}
              bg={
                mode === m
                  ? "linear-gradient(135deg, rgba(255,152,0,0.2), rgba(255,152,0,0.1))"
                  : "transparent"
              }
              color={mode === m ? "secondary.400" : "gray.400"}
              borderRadius="md"
              px={3}
              py={1.5}
              height="auto"
              fontFamily="mono"
              fontWeight={mode === m ? "bold" : "medium"}
              letterSpacing="tight"
              borderWidth={mode === m ? 1 : 0}
              borderColor={mode === m ? "secondary.800" : "transparent"}
              _hover={{
                bg:
                  mode === m
                    ? "linear-gradient(135deg, rgba(255,152,0,0.3), rgba(255,152,0,0.15))"
                    : "blackAlpha.300",
                color: "secondary.400",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
              _active={{
                bg: "blackAlpha.500",
                transform: "translateY(0)",
              }}
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "secondary.400",
                outlineOffset: "2px",
                boxShadow: "0 0 0 2px rgba(255,152,0,0.3)",
                borderColor: mode === m ? "secondary.800" : "transparent",
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              mr={1}
              aria-label={`${m.toUpperCase()}エディターモードに切り替え`}
              aria-pressed={mode === m}
            >
              {m.toUpperCase()}
            </Button>
          ))}
          <Button
            onClick={handleReset}
            colorScheme="gray"
            bg="transparent"
            color="gray.400"
            borderRadius="md"
            px={3}
            py={1.5}
            height="auto"
            fontFamily="mono"
            fontWeight="medium"
            letterSpacing="tight"
            borderWidth={0}
            position="relative"
            _hover={{
              bg: "linear-gradient(135deg, rgba(128,90,213,0.2), rgba(128,90,213,0.1))",
              color: "purple.400",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
            _active={{
              bg: "linear-gradient(135deg, rgba(128,90,213,0.3), rgba(128,90,213,0.2))",
              color: "purple.500",
              transform: "translateY(2px)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.5) inset",
              _after: {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "md",
                background: "rgba(0,0,0,0.1)",
              },
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: "purple.400",
              outlineOffset: "2px",
            }}
            transition="all 0.12s cubic-bezier(0.2, 0, 0.1, 1)"
            ml={2}
            aria-label="エディターの内容をリセット"
          >
            <Icon
              as={FiRefreshCw}
              mr={1}
              transition="transform 0.2s ease"
              _groupHover={{ transform: "rotate(30deg)" }}
            />{" "}
            Reset
          </Button>
        </HStack>
      </MotionFlex>
      {/* --- Vimモード表示ステータスバー --- */}
      <MotionFlex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={4}
        py={1.5}
        bg="linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))"
        borderTopWidth={1}
        borderColor="primary.700"
        zIndex={5}
        fontSize="sm"
        fontFamily="mono"
        justifyContent="space-between"
        alignItems="center"
        backdropFilter="blur(10px)"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${modeInfo[vimMode].color}, transparent)`,
          opacity: 0.6,
        }}
      >
        <AnimatePresence mode="wait">
          <MotionFlex
            alignItems="center"
            key={vimMode}
            variants={modeIndicatorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Icon
              as={modeInfo[vimMode].icon}
              color={modeInfo[vimMode].color}
              mr={2}
            />
            <MotionText
              color={modeInfo[vimMode].color}
              fontWeight="medium"
              fontSize="sm"
              textShadow={`0 0 8px ${modeInfo[vimMode].color}40`}
            >
              {modeInfo[vimMode].text}
            </MotionText>
          </MotionFlex>
        </AnimatePresence>
        <Flex alignItems="center" gap={3}>
          <Text color="gray.500" fontSize="xs">
            {modeInfo[vimMode].hint}
          </Text>
          {!showPreview && (
            <Button
              onClick={handleResetAll}
              colorScheme="red"
              variant="ghost"
              size="xs"
              height="20px"
              width="20px"
              p={0}
              minW="auto"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              _hover={{
                bg: "rgba(255,100,100,0.2)",
                color: "red.300",
              }}
              _active={{
                bg: "rgba(255,100,100,0.3)",
                transform: "scale(0.9)",
              }}
              title="全エディターリセット"
              aria-label="すべてのエディターの内容をリセット"
            >
              <Icon as={FiRefreshCw} boxSize="12px" />
            </Button>
          )}
        </Flex>
      </MotionFlex>
      {/* --- Editor本体エリア or プレビュー or CodePenモード --- */}
      <Box
        flex={1}
        minHeight={0}
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        display="flex"
        position="relative"
        mb={8}
        height="100%"
        maxH="100%"
        justifyContent="center"
      >
        {/* CodePenモード: 左右分割レイアウト */}
        {showCodePenMode ? (
          <Flex
            w="100%"
            h="100%"
            direction={{ base: "column", lg: "row" }}
            gap={2}
          >
            {/* 左側: プレビュー */}
            <Box
              flex={1}
              minH={{ base: "200px", lg: "auto" }}
              borderRadius="md"
              bg="white"
              boxShadow="lg"
              overflow="hidden"
            >
              <iframe
                title="CodePen Preview"
                srcDoc={codePenSrcDoc}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "white",
                }}
                sandbox="allow-scripts allow-same-origin allow-modals"
              />
            </Box>

            {/* 右側: エディター */}
            <Box
              flex={1}
              minH={{ base: "200px", lg: "auto" }}
              borderRadius="md"
              bg="transparent"
              overflow="hidden"
            >
              {/* HTMLモード専用エディタ */}
              {mode === "html" && (
                <CodeMirror
                  key="html-editor-codepen"
                  value={docs.html}
                  height="100%"
                  extensions={htmlExtensions}
                  theme={oneDark}
                  onChange={(value) => {
                    setDocs((prev) => {
                      const updated = { ...prev, html: value };
                      saveDocsToStorage(updated);
                      return updated;
                    });
                  }}
                  onUpdate={onUpdate}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                  }}
                  style={{
                    height: "100%",
                    fontSize: "16px",
                    background: "transparent",
                  }}
                />
              )}

              {/* CSSモード専用エディタ */}
              {mode === "css" && (
                <CodeMirror
                  key="css-editor-codepen"
                  value={docs.css}
                  height="100%"
                  extensions={cssExtensions}
                  theme={oneDark}
                  onChange={(value) => {
                    setDocs((prev) => {
                      const updated = { ...prev, css: value };
                      saveDocsToStorage(updated);
                      return updated;
                    });
                  }}
                  onUpdate={onUpdate}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                  }}
                  style={{
                    height: "100%",
                    fontSize: "16px",
                    background: "transparent",
                  }}
                />
              )}

              {/* JSモード専用エディタ */}
              {mode === "js" && (
                <CodeMirror
                  key="js-editor-codepen"
                  value={docs.js}
                  height="100%"
                  extensions={jsExtensions}
                  theme={oneDark}
                  onChange={(value) => {
                    setDocs((prev) => {
                      const updated = { ...prev, js: value };
                      saveDocsToStorage(updated);
                      return updated;
                    });
                  }}
                  onUpdate={onUpdate}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                  }}
                  style={{
                    height: "100%",
                    fontSize: "16px",
                    background: "transparent",
                  }}
                />
              )}
            </Box>
          </Flex>
        ) : (
          /* 通常モード: Vimエディター or プレビュー */
          <>
            {/* 各モード専用のCodeMirrorインスタンス - 完全に独立したundo履歴 */}
            {!showPreview && (
              <Box
                w="100%"
                h="100%"
                maxH={{ base: "340px", md: "480px", lg: "560px" }}
                minH={{ base: "220px", md: "320px" }}
                overflowY="auto"
                borderRadius="md"
                bg="transparent"
                boxShadow="none"
                style={{
                  height: "100%",
                  fontSize: "16px",
                  outline: "none",
                }}
              >
                {/* HTMLモード専用エディタ */}
                {mode === "html" && (
                  <CodeMirror
                    key="html-editor"
                    value={docs.html}
                    height="100%"
                    extensions={htmlExtensions}
                    theme={oneDark}
                    onChange={(value) => {
                      setDocs((prev) => {
                        const updated = { ...prev, html: value };
                        saveDocsToStorage(updated);
                        return updated;
                      });
                    }}
                    onUpdate={onUpdate}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      dropCursor: false,
                      allowMultipleSelections: false,
                      indentOnInput: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      searchKeymap: true,
                      historyKeymap: true,
                      foldKeymap: true,
                      completionKeymap: true,
                    }}
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      background: "transparent",
                    }}
                  />
                )}

                {/* CSSモード専用エディタ */}
                {mode === "css" && (
                  <CodeMirror
                    key="css-editor"
                    value={docs.css}
                    height="100%"
                    extensions={cssExtensions}
                    theme={oneDark}
                    onChange={(value) => {
                      setDocs((prev) => {
                        const updated = { ...prev, css: value };
                        saveDocsToStorage(updated);
                        return updated;
                      });
                    }}
                    onUpdate={onUpdate}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      dropCursor: false,
                      allowMultipleSelections: false,
                      indentOnInput: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      searchKeymap: true,
                      historyKeymap: true,
                      foldKeymap: true,
                      completionKeymap: true,
                    }}
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      background: "transparent",
                    }}
                  />
                )}

                {/* JSモード専用エディタ */}
                {mode === "js" && (
                  <CodeMirror
                    key="js-editor"
                    value={docs.js}
                    height="100%"
                    extensions={jsExtensions}
                    theme={oneDark}
                    onChange={(value) => {
                      setDocs((prev) => {
                        const updated = { ...prev, js: value };
                        saveDocsToStorage(updated);
                        return updated;
                      });
                    }}
                    onUpdate={onUpdate}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      dropCursor: false,
                      allowMultipleSelections: false,
                      indentOnInput: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      searchKeymap: true,
                      historyKeymap: true,
                      foldKeymap: true,
                      completionKeymap: true,
                    }}
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      background: "transparent",
                    }}
                  />
                )}
              </Box>
            )}
            {showPreview && (
              <Box
                w="100%"
                h="100%"
                maxH={{ base: "340px", md: "480px", lg: "560px" }}
                minH={{ base: "220px", md: "320px" }}
                overflowY="auto"
                borderRadius="md"
                bg="white"
                boxShadow="xl"
                position="relative"
              >
                <iframe
                  title="Preview"
                  srcDoc={previewSrcDoc}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "white",
                  }}
                  sandbox="allow-scripts allow-same-origin allow-modals"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </MotionBox>
  );
}

export default VimEditor;
