"use client";

import CheatSheet from "@/components/CheatSheet";
import { Tooltip } from "@/components/Tooltip";
import { DESIGN_SYSTEM } from "@/constants";
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";

// 動的インポート
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

// Motion Components
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


    >
      {/* Header */}
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
        h={{ base: "60px", md: "70px" }}
        // シンプルで自然な背景
        bg={DESIGN_SYSTEM.colors.bg.secondary}

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
              // シンプルで読みやすいテキスト
              color={DESIGN_SYSTEM.colors.accent.primary}
            >
              manaVimEditor
            </Heading>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mt={1}
              fontWeight="400"
              letterSpacing="wide"
              opacity={0.8}
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
            // シンプルなホバー効果
            transition="all 0.2s ease"
            _hover={{
              color: DESIGN_SYSTEM.colors.accent.primary,
              textDecoration: "none",
            }}
          >
            <FiGithub style={{ marginRight: "8px", fontSize: "16px" }} />
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
            // シンプルなホバー効果
            transition="all 0.2s ease"
            _hover={{
              color: DESIGN_SYSTEM.colors.accent.primary,
              textDecoration: "none",
            }}
          >
            <FiExternalLink style={{ marginRight: "8px", fontSize: "16px" }} />
            Vimチートシート
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
        {/* チートシート切り替えボタン */}
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
                    ? DESIGN_SYSTEM.colors.bg.quaternary
                    : DESIGN_SYSTEM.colors.bg.tertiary,
                  borderRadius: "12px",
                  border: `2px solid ${showCheatSheet
                    ? DESIGN_SYSTEM.colors.accent.primary
                    : DESIGN_SYSTEM.colors.border.subtle
                    }`,
                  padding: "0",
                  width: "48px",
                  height: "48px",
                  cursor: "pointer",
                  boxShadow: isTogglePressed
                    ? "inset 0 2px 4px rgba(0,0,0,0.2)"
                    : showCheatSheet
                      ? `0 0 0 2px ${DESIGN_SYSTEM.colors.accent.primary}40, 0 4px 12px rgba(0,0,0,0.3)`
                      : "0 2px 8px rgba(0,0,0,0.3)",
                  transition: "all 0.2s ease",
                  transform: isTogglePressed ? "translateY(1px)" : "translateY(0)",
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
                    width: "24px",
                    height: "24px",
                    backgroundImage: "url('/manabyicon.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: showCheatSheet
                      ? "brightness(1.2) saturate(1.1)"
                      : "brightness(0.8) saturate(0.7)",
                    transition: "filter 0.2s ease",
                  }}
                />
              </button>
            </Tooltip>
          </Flex>
        )}

        {/* CheatSheet - シンプルなサイズ設定 */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              flex={{
                base: "none",
                md: "0 0 360px",
                lg: "0 0 400px",
              }}
              w={{
                base: "100%",
                md: "360px",
                lg: "400px",
              }}
              h={{
                base: "600px",
                md: "700px",
                lg: "750px",
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
