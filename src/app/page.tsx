"use client";

import CheatSheet from "@/components/CheatSheet";
import { Tooltip } from "@/components/Tooltip";
import { DESIGN_SYSTEM } from "@/constants";
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
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
  const [isTogglePressed, setIsTogglePressed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // イベントハンドラー
  const handleCodePenModeChange = useCallback((isCodePenMode: boolean) => {
    setIsCodePenMode(isCodePenMode);
  }, []);

  const handleCheatSheetToggle = useCallback((showCheatSheet: boolean) => {
    setShowCheatSheet(showCheatSheet);
  }, []);

  const handleToggleMouseDown = useCallback(() => {
    setIsTogglePressed(true);
  }, []);

  const handleToggleMouseUp = useCallback(() => {
    setIsTogglePressed(false);
  }, []);

  return (
    <Box
      bg={DESIGN_SYSTEM.colors.bg.primary}
      minH="100dvh" // 2025年標準: Dynamic Viewport Height
      w="100%"
      position="relative"
    >
      {/* Header - シンプルで洗練されたデザイン */}
      <MotionFlex
        as="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={{ base: 3, md: 4 }}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        mb={{ base: 4, md: 6 }}
        gap={4}
        position="relative"
        zIndex={1}
        h={{ base: "70px", md: "80px" }}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
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
        </Flex>
      </MotionFlex>

      {/* Main Content */}
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
        {/* チートシート切り替えボタン - シンプルで実用的 */}
        {!isCodePenMode && (
          <Flex
            direction="column"
            align="center"
            mr={{ base: 0, md: 4 }}
            mb={{ base: 4, md: 0 }}
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
                bg: DESIGN_SYSTEM.colors.bg.quaternary,
                color: DESIGN_SYSTEM.colors.text.primary,
                borderRadius: "lg",
                px: 4,
                py: 3,
              }}
            >
              <Box
                as="button"
                onClick={() => handleCheatSheetToggle(!showCheatSheet)}
                onMouseDown={handleToggleMouseDown}
                onMouseUp={handleToggleMouseUp}
                onMouseLeave={handleToggleMouseUp}
                bg={
                  showCheatSheet
                    ? DESIGN_SYSTEM.colors.bg.quaternary
                    : DESIGN_SYSTEM.colors.bg.tertiary
                }
                borderRadius={DESIGN_SYSTEM.borders.radius.lg}
                border={`2px solid ${
                  showCheatSheet
                    ? DESIGN_SYSTEM.colors.accent.primary
                    : DESIGN_SYSTEM.borders.colors.subtle
                }`}
                w="56px"
                h="56px"
                cursor="pointer"
                transition="all 0.2s ease"
                transform={
                  isTogglePressed ? "translateY(1px)" : "translateY(0)"
                }
                outline="none"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  transform: "translateY(-1px)",
                  boxShadow: DESIGN_SYSTEM.shadows.md,
                }}
                aria-label={
                  showCheatSheet ? "チートシートを非表示" : "チートシートを表示"
                }
              >
                <Box
                  w="28px"
                  h="28px"
                  backgroundImage="url('/manabyicon.png')"
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  backgroundPosition="center"
                  filter={
                    showCheatSheet ? "brightness(1.2)" : "brightness(0.8)"
                  }
                  transition="filter 0.2s ease"
                />
              </Box>
            </Tooltip>
            <Text
              fontSize="xs"
              color={
                showCheatSheet
                  ? DESIGN_SYSTEM.colors.accent.primary
                  : DESIGN_SYSTEM.colors.text.muted
              }
              mt={2}
              fontWeight="500"
              transition="color 0.2s ease"
            >
              {showCheatSheet ? "ON" : "OFF"}
            </Text>
          </Flex>
        )}

        {/* CheatSheet - シンプルなアニメーション */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              flex={{
                base: "none",
                md: "0 0 380px",
                lg: "0 0 420px",
              }}
              w={{
                base: "100%",
                md: "380px",
                lg: "420px",
              }}
              h={{
                base: "600px",
                md: "700px",
                lg: "750px",
              }}
              mb={{ base: 4, md: 0 }}
              mr={{ base: 0, md: 6 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CheatSheet />
            </MotionBox>
          )}
        </AnimatePresence>

        {/* VimEditor - シンプルなレイアウト */}
        <MotionBox
          flex="1"
          w="100%"
          h={{
            base: "600px",
            md: "700px",
            lg: "750px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <VimEditor onCodePenModeChange={handleCodePenModeChange} />
        </MotionBox>
      </Flex>
    </Box>
  );
}
