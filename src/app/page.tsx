"use client";

import CheatSheet from "@/components/CheatSheet";
import { Tooltip } from "@/components/Tooltip";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FiBook, FiBookOpen, FiExternalLink, FiGithub } from "react-icons/fi";
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
      minH="100vh"
      w="100%"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient:
          "radial-gradient(ellipse at top, rgba(255,140,66,0.04) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 3, md: 8 }}
        py={{ base: 4, md: 6 }}
        borderBottomWidth={1}
        borderColor="primary.700"
        mb={{ base: 4, md: 8 }}
        gap={4}
        position="relative"
        zIndex={1}
        bg="rgba(24, 24, 27, 0.8)"
        backdropFilter="blur(20px)"
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
        <Flex align="center" gap={3}>
          <Image
            src="/manabylogo.png"
            alt="manaby logo"
            h={{ base: 8, md: 10 }}
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
              mt={0.5}
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
            px={3}
            py={2}
            borderRadius="lg"
          >
            <Icon as={FiGithub} mr={2} />
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
            px={3}
            py={2}
            borderRadius="lg"
          >
            <Icon as={FiExternalLink} mr={2} />
            Vimチートシート
          </Link>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        justify={{ base: "flex-start", md: "center" }}
        w="100%"
        px={{ base: 2, md: 6 }}
        py={0}
        gap={{ base: 4, md: 0 }}
        maxW={{ base: "100%", md: "1440px" }}
        mx="auto"
      >
        {/* チートシート切り替えボタン - 常に表示（CodePenモード時以外） */}
        {!isCodePenMode && (
          <Flex
            direction="column"
            align="center"
            mr={{ base: 0, md: 4 }}
            mb={{ base: 2, md: 0 }}
          >
            <Tooltip
              content={
                showCheatSheet
                  ? "チートシートを非表示に！"
                  : "チートシートを表示する！"
              }
              showArrow
              portalled
              openDelay={75}
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
                    ? "rgba(255,140,66,0.25)" // ON: 落ち着いたオレンジ
                    : "rgba(255,140,66,0.08)" // OFF: 薄いオレンジ
                }
                color={showCheatSheet ? "orange.200" : "orange.400"}
                borderRadius="xl"
                p={3}
                width="48px"
                height="48px"
                minW="48px"
                backdropFilter="blur(10px)"
                position="relative"
                boxShadow={
                  showCheatSheet ? "0 0 12px rgba(255,140,66,0.2)" : "none"
                }
                _hover={{
                  bg: showCheatSheet
                    ? "rgba(255,140,66,0.3)"
                    : "rgba(255,140,66,0.12)",
                  color: showCheatSheet ? "orange.100" : "orange.300",
                  transform: "translateY(-1px)",
                  boxShadow: "0 0 16px rgba(255,140,66,0.25)",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: showCheatSheet
                    ? "0 0 8px rgba(255,140,66,0.15)"
                    : "none",
                }}
                _focus={{ outline: "none" }}
                _focusVisible={{ outline: "none" }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                aria-label={
                  showCheatSheet ? "チートシートを非表示" : "チートシートを表示"
                }
              >
                <Icon
                  as={showCheatSheet ? FiBookOpen : FiBook}
                  fontSize="20px"
                  transform={showCheatSheet ? "scale(1.1)" : "scale(1)"}
                  transition="all 0.2s ease"
                />
              </Button>
            </Tooltip>
          </Flex>
        )}

        {/* CheatSheet - CodePenモード時または手動で非表示時は非表示 */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              // コンパクトなサイズに調整（340px → エディターにより多くのスペースを確保）
              flex={{ base: "none", md: "0 0 340px", lg: "0 0 360px" }}
              w={{ base: "100%", md: "340px", lg: "360px" }}
              minH="320px"
              mb={{ base: 4, md: 0 }}
              mr={{ base: 0, md: 8 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CheatSheet />
            </MotionBox>
          )}
        </AnimatePresence>

        {/* VimEditor - CodePenモード時またはチートシート非表示時は幅を拡張 */}
        <MotionBox
          flex="1 1 0%"
          w="100%"
          minH="360px"
          // エディターにより多くのスペースを確保
          maxW={
            isCodePenMode || !showCheatSheet
              ? "100%"
              : { base: "100%", md: "750px", lg: "800px" }
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <VimEditor onCodePenModeChange={handleCodePenModeChange} />
        </MotionBox>
      </Flex>
    </Box>
  );
}
