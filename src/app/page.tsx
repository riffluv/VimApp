"use client";

import CheatSheet from "@/components/CheatSheet";
import { Tooltip } from "@/components/Tooltip";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
const VimEditor = dynamic(() => import("@/components/VimEditor"), {
  ssr: false,
});

const MotionBox = motion.create(Box);

export default function Home() {
  const [isCodePenMode, setIsCodePenMode] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(true);

  const handleCodePenModeChange = (isCodePenMode: boolean) => {
    setIsCodePenMode(isCodePenMode);
  };

  const handleCheatSheetToggle = (showCheatSheet: boolean) => {
    setShowCheatSheet(showCheatSheet);
  };

  return (
    <Box
      bg="primary.900"
      minH="100dvh" // 2025年最新: 動的ビューポート高度
      w="100%"
      position="relative"
      // 2025年最新: Container Query対応をCSS変数で
      css={{
        containerType: "inline-size",
        containerName: "app-main",
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient:
          "radial-gradient(ellipse at top, rgba(232,131,58,0.04) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Header - コンパクトなデザインに修正 */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={{ base: 2, md: 3 }}
        borderBottomWidth={1}
        borderColor="primary.700"
        mb={{ base: 4, md: 6 }}
        gap={4}
        position="relative"
        zIndex={1}
        minH={{ base: "60px", md: "70px" }}
        maxH={{ base: "60px", md: "70px" }}
        _before={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          bgGradient: "linear(to-r, transparent, secondary.500, transparent)",
        }}
      >
        <Flex align="center" gap={2}>
          <Image
            src="/manabylogo.png"
            alt="manaby logo"
            h={{ base: 6, md: 8 }}
            w="auto"
            objectFit="contain"
          />
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "lg", md: "xl" }}
              color="secondary.400"
              fontWeight="600"
              letterSpacing="tight"
              fontFamily="Inter"
              textShadow="0 2px 4px rgba(0,0,0,0.4)"
            >
              manaVimEditor
            </Heading>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.400"
              mt={0}
              fontWeight="400"
              letterSpacing="wide"
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
            transition="all 0.2s ease"
            _hover={{
              color: "secondary.400",
              textDecoration: "none",
              transform: "translateY(-1px)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            px={2}
            py={1}
            borderRadius="md"
          >
            <FiGithub
              style={{
                marginRight: "8px",
                fontSize: "16px",
                color: "inherit",
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
            transition="all 0.2s ease"
            _hover={{
              color: "secondary.400",
              textDecoration: "none",
              transform: "translateY(-1px)",
            }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            px={2}
            py={1}
            borderRadius="md"
          >
            <FiExternalLink
              style={{
                marginRight: "8px",
                fontSize: "16px",
                color: "inherit",
              }}
            />
            Vimチートシート
          </Link>
        </Flex>
      </Flex>

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
              <Button
                onClick={() => handleCheatSheetToggle(!showCheatSheet)}
                bg={
                  showCheatSheet
                    ? "linear-gradient(135deg, rgba(232,131,58,0.25), rgba(232,131,58,0.15))"
                    : "linear-gradient(135deg, rgba(45,55,72,0.8), rgba(26,32,44,0.6))"
                }
                color={showCheatSheet ? "orange.200" : "gray.300"}
                borderRadius="12px"
                borderWidth="1px"
                borderColor={
                  showCheatSheet
                    ? "rgba(232,131,58,0.4)"
                    : "rgba(255,255,255,0.15)"
                }
                p={0}
                width={{ base: "48px", md: "52px" }}
                height={{ base: "48px", md: "52px" }}
                minW={{ base: "48px", md: "52px" }}
                backdropFilter="blur(10px)"
                position="relative"
                boxShadow={
                  showCheatSheet
                    ? "0 4px 12px rgba(232,131,58,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)"
                }
                _hover={{
                  bg: showCheatSheet
                    ? "linear-gradient(135deg, rgba(232,131,58,0.35), rgba(232,131,58,0.2))"
                    : "linear-gradient(135deg, rgba(55,65,81,0.9), rgba(31,41,55,0.7))",
                  borderColor: showCheatSheet
                    ? "rgba(232,131,58,0.5)"
                    : "rgba(255,255,255,0.25)",
                  transform: "translateY(-2px) scale(1.02)",
                  boxShadow: showCheatSheet
                    ? "0 6px 20px rgba(232,131,58,0.25), inset 0 1px 0 rgba(255,255,255,0.15)"
                    : "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
                _active={{
                  transform: "translateY(0) scale(0.98)",
                  transition: "transform 0.1s ease",
                }}
                _focus={{ outline: "none" }}
                _focusVisible={{
                  outline: "2px solid rgba(232,131,58,0.6)",
                  outlineOffset: "2px",
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                aria-label={
                  showCheatSheet ? "チートシートを非表示" : "チートシートを表示"
                }
              >
                <Box
                  width={{ base: "24px", md: "28px" }}
                  height={{ base: "24px", md: "28px" }}
                  backgroundImage="url('/manabyicon.png')"
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  backgroundPosition="center"
                  filter={
                    showCheatSheet ? "none" : "grayscale(0.3) brightness(0.8)"
                  }
                  transition="all 0.2s ease"
                  transform={showCheatSheet ? "scale(1)" : "scale(0.9)"}
                />
              </Button>
            </Tooltip>
          </Flex>
        )}

        {/* CheatSheet - 適切な比率とサイズ */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              flex={{
                base: "none",
                md: "0 0 340px", // 少し広げる
                lg: "0 0 380px", // lg時も調整
              }}
              w={{
                base: "100%",
                md: "340px",
                lg: "380px",
              }}
              h={{
                base: "min(600px, 70vh)", // モバイルでは画面の70%または600px
                md: "min(700px, 75vh)", // タブレットでは画面の75%または700px
                lg: "min(800px, 80vh)", // デスクトップでは画面の80%または800px
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

        {/* VimEditor - 横幅制限を確実に */}
        <MotionBox
          flex="1 1 0"
          w="100%"
          h={{
            base: "min(600px, 70vh)", // CheatSheetと同じ高さ
            md: "min(700px, 75vh)",
            lg: "min(800px, 80vh)",
          }}
          minW="0" // flexアイテムの最小幅を0に設定
          maxW={
            isCodePenMode || !showCheatSheet
              ? "100%"
              : {
                  base: "100%",
                  md: "calc(100% - 370px)", // ボタン + CheatSheet + マージンを考慮
                  lg: "calc(100% - 410px)",
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
