"use client";

import CheatSheet from "@/components/CheatSheet";
import { DESIGN_SYSTEM } from "@/constants";
import {
  Box,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";

// 動的インポート - パフォーマンス最適化
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

// ページレベルのMotion Components（Framer Motion標準API使用）
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function Home() {
  // 状態管理 - 必要最小限
  const [isCodePenMode, setIsCodePenMode] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // イベントハンドラー
  const handleCodePenModeChange = useCallback((isCodePenMode: boolean) => {
    setIsCodePenMode(isCodePenMode);
  }, []);

  const handleCheatSheetToggle = useCallback((showCheatSheet: boolean) => {
    setShowCheatSheet(showCheatSheet);
  }, []);

  return (
    <Box
      bg={DESIGN_SYSTEM.colors.bg.primary}
      h="100vh" // DPI Scale対応: 固定高さ
      maxH="100vh" // スクロール防止
      w="100vw" // DPI Scale対応: 固定幅
      maxW="100vw" // スクロール防止
      overflow="hidden" // 確実にスクロール防止
      position="fixed" // 位置固定
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      flexDirection="column"
    >
      {/* Header - DPI Scale対応 */}
      <MotionFlex
        as="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        align="center"
        justify="space-between"
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        gap={3}
        position="relative"
        zIndex={1}
        h={{ base: "clamp(3.5rem, 4vh, 4.5rem)", md: "clamp(4rem, 5vh, 5rem)" }} // DPI Scale対応
        minH={{ base: "3.5rem", md: "4rem" }}
        maxH={{ base: "4.5rem", md: "5rem" }}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        flexShrink={0} // フレックス縮小防止
      >
        <Flex align="center" gap={3}>
          <Image
            src="/manabylogo.png"
            alt="manaby logo"
            h={{ base: 7, md: 9 }}
            w="auto"
            objectFit="contain"
            transition="all 0.2s ease"
            _hover={{
              transform: "scale(1.05)",
            }}
          />
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="tight"
              fontFamily={DESIGN_SYSTEM.typography.fonts.sans}
              color={DESIGN_SYSTEM.colors.accent.primary}
            >
              manaVimEditor
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={DESIGN_SYSTEM.colors.text.tertiary}
              mt={1}
              fontWeight="400"
              letterSpacing="wide"
            >
              コードを書きながらVimを覚える実践的エディタ
            </Text>
          </Box>
        </Flex>
        <Flex gap={6} align="center" display={{ base: "none", md: "flex" }}>
          <Tooltip
            label="Vim公式GitHubを開く"
            openDelay={500}
            closeDelay={100}
            hasArrow
          >
            <Link
              href="https://github.com/vim/vim"
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
              color={
                hoveredLink === "github"
                  ? DESIGN_SYSTEM.colors.accent.primary
                  : DESIGN_SYSTEM.colors.text.secondary
              }
              fontSize="sm"
              fontWeight="500"
              px={2}
              py={1}
              transition="all 0.3s ease"
              outline="none"
              textShadow={
                hoveredLink === "github"
                  ? `0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}`
                  : "none"
              }
              textDecoration="none"
              onMouseEnter={() => setHoveredLink("github")}
              onMouseLeave={() => setHoveredLink(null)}
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
            >
              <Box
                as={FiGithub}
                mr={2}
                fontSize="16px"
                transition="all 0.3s ease"
                color={
                  hoveredLink === "github"
                    ? DESIGN_SYSTEM.colors.accent.primary
                    : DESIGN_SYSTEM.colors.text.secondary
                }
                filter={
                  hoveredLink === "github"
                    ? `drop-shadow(0 0 6px ${DESIGN_SYSTEM.colors.accent.primary})`
                    : "none"
                }
              />
              GitHub
            </Link>
          </Tooltip>
          <Tooltip
            label="Vimコマンドチートシート（外部サイト）"
            openDelay={500}
            closeDelay={100}
            hasArrow
          >
            <Link
              href="https://vim.rtorr.com/lang/ja"
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
              color={
                hoveredLink === "cheatsheet"
                  ? DESIGN_SYSTEM.colors.accent.primary
                  : DESIGN_SYSTEM.colors.text.secondary
              }
              fontSize="sm"
              fontWeight="500"
              px={2}
              py={1}
              transition="all 0.3s ease"
              outline="none"
              textShadow={
                hoveredLink === "cheatsheet"
                  ? `0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}`
                  : "none"
              }
              textDecoration="none"
              onMouseEnter={() => setHoveredLink("cheatsheet")}
              onMouseLeave={() => setHoveredLink(null)}
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
            >
              <Box
                as={FiExternalLink}
                mr={2}
                fontSize="16px"
                transition="all 0.3s ease"
                color={
                  hoveredLink === "cheatsheet"
                    ? DESIGN_SYSTEM.colors.accent.primary
                    : DESIGN_SYSTEM.colors.text.secondary
                }
                filter={
                  hoveredLink === "cheatsheet"
                    ? `drop-shadow(0 0 6px ${DESIGN_SYSTEM.colors.accent.primary})`
                    : "none"
                }
              />
              チートシート
            </Link>
          </Tooltip>
        </Flex>
      </MotionFlex>

      {/* Main Content - DPI Scale対応 */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        justify="flex-start"
        w="100%"
        h="100%" // 残り全体を使用
        flex="1" // フレックス拡張
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
        gap={{ base: 2, md: 3 }}
        maxW="100vw"
        overflow="hidden" // スクロール防止
        position="relative"
      >
        {/* CheatSheet - DPI Scale対応 */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              flex="none"
              w={{
                base: "100%",
                md: "clamp(20rem, 25vw, 26.25rem)", // DPI Scale対応: 320px-420px
              }}
              h="100%" // 親コンテナの高さを使用
              maxH="100%"
              position={{ base: "absolute", md: "relative" }}
              top={{ base: 0, md: "auto" }}
              left={{ base: 0, md: "auto" }}
              right={{ base: 0, md: "auto" }}
              bottom={{ base: 0, md: "auto" }}
              zIndex={{ base: 5, md: "auto" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              overflow="hidden"
            >
              <CheatSheet />
            </MotionBox>
          )}
        </AnimatePresence>

        {/* VimEditor - DPI Scale対応 */}
        <MotionBox
          flex="1" // 残りスペースを使用
          w="100%"
          h="100%" // 親コンテナの高さを使用
          maxH="100%"
          ml={{
            base: 0,
            md:
              !isCodePenMode && showCheatSheet ? "clamp(1rem, 2vw, 1.5rem)" : 0,
          }} // CheatSheet表示時のマージン（CodePenモード時は除外）
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          overflow="hidden"
          position="relative"
        >
          <VimEditor
            onCodePenModeChange={handleCodePenModeChange}
            showCheatSheet={showCheatSheet}
            onCheatSheetToggle={handleCheatSheetToggle}
          />
        </MotionBox>
      </Flex>
    </Box>
  );
}
