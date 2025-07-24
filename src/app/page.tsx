"use client";

import CheatSheet from "@/components/CheatSheet";
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
import { FiBook, FiExternalLink, FiGithub } from "react-icons/fi";
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
    <Box bg="gray.900" minH="100vh" w="100%">
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 3, md: 8 }}
        py={{ base: 4, md: 6 }}
        borderBottomWidth={1}
        borderColor="gray.700"
        mb={{ base: 4, md: 8 }}
        gap={4}
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
              color="orange.300"
              fontWeight="bold"
              letterSpacing="tight"
              fontFamily="'Nunito', 'Quicksand', sans-serif"
              style={{
                borderRadius: "0.25rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Vim Practice App
            </Heading>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="whiteAlpha.700"
              mt={0.5}
            >
              ブラウザ上でVimのコマンドを練習できるアプリ
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
            color="whiteAlpha.800"
            fontSize="sm"
            _hover={{ color: "orange.300", textDecoration: "underline" }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            px={3}
            py={2}
            borderRadius="md"
          >
            <Icon as={FiGithub} mr={1} />
            GitHub
          </Link>
          <Link
            href="https://vim.rtorr.com/lang/ja"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            color="whiteAlpha.800"
            fontSize="sm"
            _hover={{ color: "orange.300", textDecoration: "underline" }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            px={3}
            py={2}
            borderRadius="md"
          >
            <Icon as={FiExternalLink} mr={1} />
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
            <Button
              onClick={() => handleCheatSheetToggle(!showCheatSheet)}
              bg={showCheatSheet ? "orange.800" : "orange.900"}
              color={showCheatSheet ? "orange.200" : "orange.400"}
              borderRadius="lg"
              p={3}
              width="48px"
              height="48px"
              minW="48px"
              borderWidth={showCheatSheet ? 2 : 1}
              borderColor={showCheatSheet ? "orange.500" : "orange.600"}
              _hover={{
                bg: "orange.700",
                color: "orange.100",
                transform: "translateY(-2px)",
                boxShadow: "xl",
                borderColor: "orange.400",
              }}
              _active={{
                bg: "orange.800",
                transform: "translateY(0)",
              }}
              _focus={{ outline: "none" }}
              _focusVisible={{ outline: "none" }}
              transition="all 0.2s ease-in-out"
              aria-label={
                showCheatSheet ? "チートシートを非表示" : "チートシートを表示"
              }
              title={
                showCheatSheet
                  ? "チートシートを非表示にしてエディターを広く使う"
                  : "チートシートを表示する"
              }
            >
              <Icon as={FiBook} fontSize="20px" />
            </Button>
          </Flex>
        )}

        {/* CheatSheet - CodePenモード時または手動で非表示時は非表示 */}
        <AnimatePresence>
          {!isCodePenMode && showCheatSheet && (
            <MotionBox
              key="cheatsheet"
              flex={{ base: "none", md: "0 0 320px" }}
              w={{ base: "100%", md: "320px" }}
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
          maxW={
            isCodePenMode || !showCheatSheet
              ? "100%"
              : { base: "100%", md: "700px", lg: "800px" }
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
