"use client";

import CheatSheet from "@/components/CheatSheet";
import { Tooltip } from "@/components/Tooltip";
import { DESIGN_SYSTEM } from "@/constants";
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";

// 2025年最新：動的インポート + プリロード最適化
const VimEditor = dynamic(() => import("@/components/VimEditor"), {
  ssr: false,
  loading: () => (
    <Box
      w="100%"
      h="100%"
      bg={DESIGN_SYSTEM.colors.bg.primary}
      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderWidth="1px"
      borderColor={DESIGN_SYSTEM.borders.colors.subtle}
    >
      <Text color={DESIGN_SYSTEM.colors.text.secondary}>Loading Editor...</Text>
    </Box>
  ),
});

// 2025年最新：Motion Components with GPU optimization
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

export default function Home() {
  const [isCodePenMode, setIsCodePenMode] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(true);
  const [isTogglePressed, setIsTogglePressed] = useState(false);

  const handleCodePenModeChange = (isCodePenMode: boolean) => {
    setIsCodePenMode(isCodePenMode);
  };

  const handleCheatSheetToggle = (showCheatSheet: boolean) => {
    setShowCheatSheet(showCheatSheet);
  };

  const handleToggleMouseDown = useCallback(() => {
    setIsTogglePressed(true);
  }, []);

  const handleToggleMouseUp = useCallback(() => {
    setIsTogglePressed(false);
  }, []);

  return (
    <Box
      bg={DESIGN_SYSTEM.colors.bg.primary}
      minH="100dvh" // 2025年最新: 動的ビューポート高度対応
      w="100%"
      position="relative"
      // 2025年最新CSS: カスタムプロパティとアニメーション
      css={{
        containerType: "inline-size",
        containerName: "app-main",
        isolation: "isolate",
        contain: "layout style paint",
        "@keyframes subtleFloat": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-2px) rotate(0.5deg)" },
        },
      }}
      // アクセシビリティ強化
      role="main"
      aria-label="manaVimEditor - Vimコマンドを学ぶためのコードエディタ"
    >
      {/* Header - 2025年レベルコンパクトデザイン */}
      <MotionFlex
        as="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={{ base: 2, md: 3 }}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        mb={{ base: 4, md: 6 }}
        gap={4}
        position="relative"
        zIndex={1}
        minH={{ base: "60px", md: "70px" }}
        maxH={{ base: "60px", md: "70px" }}
        // 2025年最新：CSS最適化 + 人間らしいクラフト感
        isolation="isolate"
        containerType="inline-size"
        willChange="transform"
        transform="translateZ(0)"
        // 微細な背景パターン
        background={`
          linear-gradient(135deg, 
            rgba(255,255,255,0.02) 0%, 
            transparent 50%, 
            rgba(232,131,58,0.01) 100%
          )
        `}
        // ヘッダー全体の微細なボックスシャドウ
        boxShadow="0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
        backdropFilter="blur(8px)"
        // アクセシビリティ強化
        role="banner"
        aria-label="manaVimEditorのヘッダー"
      >
        <Flex align="center" gap={2}>
          <Image
            src="/manabylogo.png"
            alt="manaby logo"
            h={{ base: 6, md: 8 }}
            w="auto"
            objectFit="contain"
          />
          <Box position="relative">
            <Heading
              as="h1"
              fontSize={{ base: "lg", md: "xl" }}
              color="secondary.400"
              fontWeight="600"
              letterSpacing="tight"
              fontFamily="Inter"
              position="relative"
              // 人間らしいテキスト効果 - AIっぽくない微細なグロー
              textShadow="0 0 20px rgba(232,131,58,0.15), 0 2px 8px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08)"
              // 微細な3D効果
              transform="perspective(1000px) rotateX(1deg)"
            >
              manaVimEditor
            </Heading>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mt={1}
              fontWeight="400"
              letterSpacing="wide"
              // 微細なアニメーション効果
              opacity={0.9}
              // 人間らしいテキストレンダリング
              style={{
                fontFeatureSettings: "'liga' 1, 'kern' 1",
                textRendering: "optimizeLegibility",
              }}
            >
              コードを書きながらVimを覚える実践的エディタ
            </Text>
          </Box>
        </Flex>
        <Flex gap={3} align="center" display={{ base: "none", md: "flex" }}>
          <Link
            href="https://github.com/vim/vim"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            color="gray.300"
            fontSize="sm"
            fontWeight="500"
            borderRadius="8px"
            px={3}
            py={2}
            position="relative"
            overflow="hidden"
            // 2025年モダンホバー効果
            transition="all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
            _hover={{
              color: "secondary.400",
              textDecoration: "none",
              transform: "translateY(-2px) scale(1.02)",
              bg: "rgba(255,255,255,0.05)",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            _active={{
              transform: "translateY(0) scale(0.98)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{
              outline: "2px solid rgba(232,131,58,0.6)",
              outlineOffset: "2px",
            }}
            // GPU最適化
            willChange="transform"
            transform="translateZ(0)"
          >
            <FiGithub
              style={{
                marginRight: "8px",
                fontSize: "16px",
                color: "inherit",
                transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
            GitHub
          </Link>
          <Link
            href="https://vim.rtorr.com/lang/ja"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            color="gray.300"
            fontSize="sm"
            fontWeight="500"
            borderRadius="8px"
            px={3}
            py={2}
            position="relative"
            overflow="hidden"
            // 2025年モダンホバー効果
            transition="all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
            _hover={{
              color: "secondary.400",
              textDecoration: "none",
              transform: "translateY(-2px) scale(1.02)",
              bg: "rgba(255,255,255,0.05)",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            _active={{
              transform: "translateY(0) scale(0.98)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{
              outline: "2px solid rgba(232,131,58,0.6)",
              outlineOffset: "2px",
            }}
            // GPU最適化
            willChange="transform"
            transform="translateZ(0)"
          >
            <FiExternalLink
              style={{
                marginRight: "8px",
                fontSize: "16px",
                color: "inherit",
                transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
            Vimチートシート
          </Link>
        </Flex>
      </MotionFlex>

      {/* Main Content - バランスの良いレイアウト */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        justify={{ base: "flex-start", md: "center" }}
        w="100%"
        px={{ base: 4, md: 6 }}
        py={0}
        gap={{ base: 4, md: 6 }}
        maxW={{ base: "100%", md: "7xl" }}
        mx="auto"
      >
        {/* チートシート切り替えボタン - マージン調整 */}
        {!isCodePenMode && (
          <Flex
            direction="column"
            align="center"
            mr={{ base: 0, md: 3 }}
            mb={{ base: 3, md: 0 }}
          >
            <Tooltip
              content={
                showCheatSheet
                  ? "チートシートを非表示に！"
                  : "チートシートを表示する！"
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
              <button
                onClick={() => handleCheatSheetToggle(!showCheatSheet)}
                onMouseDown={handleToggleMouseDown}
                onMouseUp={handleToggleMouseUp}
                onMouseLeave={handleToggleMouseUp}
                style={{
                  background: showCheatSheet
                    ? "linear-gradient(135deg, rgba(232,131,58,0.25), rgba(232,131,58,0.15))"
                    : "linear-gradient(135deg, rgba(45,55,72,0.8), rgba(26,32,44,0.6))",
                  color: showCheatSheet ? "#FED7AA" : "#CBD5E0",
                  borderRadius: "16px",
                  border: `1px solid ${
                    showCheatSheet
                      ? "rgba(232,131,58,0.4)"
                      : "rgba(255,255,255,0.15)"
                  }`,
                  padding: "0",
                  width: "56px",
                  height: "56px",
                  minWidth: "56px",
                  backdropFilter: "blur(12px)",
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: isTogglePressed
                    ? showCheatSheet
                      ? "0 2px 8px rgba(232,131,58,0.3), inset 0 2px 4px rgba(0,0,0,0.2)"
                      : "0 2px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.3)"
                    : showCheatSheet
                    ? "0 8px 24px rgba(232,131,58,0.25), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 20px rgba(232,131,58,0.1)"
                    : "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 rgba(232,131,58,0)",
                  transition: "all 0.08s cubic-bezier(0.4, 0, 0.2, 1)",
                  willChange: "transform, box-shadow, background",
                  transform: isTogglePressed
                    ? "perspective(1000px) translateZ(0) translateY(2px) scale(0.95)"
                    : "perspective(1000px) translateZ(0)",
                  outline: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={
                  showCheatSheet ? "チートシートを非表示" : "チートシートを表示"
                }
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundImage: "url('/manabyicon.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: showCheatSheet
                      ? "none"
                      : "grayscale(0.3) brightness(0.8)",
                    transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                    transform: showCheatSheet ? "scale(1)" : "scale(0.9)",
                  }}
                />
              </button>
            </Tooltip>
          </Flex>
        )}

        {/* CheatSheet - 黄金比に基づく比率とサイズ */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              flex={{
                base: "none",
                md: "0 0 361px", // 黄金比: 585px ÷ 1.618 ≈ 361px
                lg: "0 0 397px", // 黄金比: 643px ÷ 1.618 ≈ 397px
              }}
              w={{
                base: "100%",
                md: "361px", // 黄金比ベース
                lg: "397px", // 黄金比ベース
              }}
              h={{
                base: "min(600px, 70vh)", // モバイルは現状維持
                md: "min(720px, 75vh)", // 黄金比: 1165px ÷ 1.618 ≈ 720px
                lg: "min(794px, 80vh)", // 黄金比: 1285px ÷ 1.618 ≈ 794px
              }}
              mb={{ base: 4, md: 0 }}
              mr={{ base: 0, md: 4 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CheatSheet />
            </MotionBox>
          )}
        </AnimatePresence>

        {/* VimEditor - 黄金比に基づく横幅制限を確実に */}
        <MotionBox
          flex="1 1 0"
          w="100%"
          h={{
            base: "min(600px, 70vh)", // CheatSheetと同じ高さ
            md: "min(720px, 75vh)", // 黄金比ベース
            lg: "min(794px, 80vh)", // 黄金比ベース
          }}
          minW="0" // flexアイテムの最小幅を0に設定
          maxW={
            isCodePenMode || !showCheatSheet
              ? "100%"
              : {
                  base: "100%",
                  md: "calc(100% - 391px)", // ボタン + CheatSheet(361px) + マージン(30px)
                  lg: "calc(100% - 427px)", // ボタン + CheatSheet(397px) + マージン(30px)
                }
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          overflow="hidden" // 確実に内容を制限
        >
          <VimEditor onCodePenModeChange={handleCodePenModeChange} />
        </MotionBox>
      </Flex>
    </Box>
  );
}
