"use client";

import CheatSheet from "@/components/CheatSheet";
import Tooltip from "@/components/ui/Tooltip";
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";

// Dynamic import for VimEditor
const VimEditor = dynamic(() => import("@/components/VimEditor"), {
  ssr: false,
  loading: () => (
    <Box
      w="100%"
      h="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.300"
    >
      <Text color="gray.600">Loading Editor...</Text>
    </Box>
  ),
});

export default function Home() {
  // State management - keeping it simple for now
  const [isCodePenMode, setIsCodePenMode] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(true);

  // Event handlers
  const handleCodePenModeChange = useCallback((isCodePenMode: boolean) => {
    setIsCodePenMode(isCodePenMode);
  }, []);

  const handleCheatSheetToggle = useCallback((showCheatSheet: boolean) => {
    setShowCheatSheet(showCheatSheet);
  }, []);

  return (
    <Box bg="gray.50" h="100vh" w="100vw">
      <Flex direction="column" h="100%">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          px={4}
          py={3}
          borderBottomWidth="1px"
          borderColor="gray.200"
          bg="white"
        >
          <Flex align="center" gap={3}>
            <Image
              src="/manabylogo.png"
              alt="manaby logo"
              h={9}
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
                fontSize="2xl"
                fontWeight="700"
                letterSpacing="tight"
                color="orange.500"
              >
                manaVimEditor
              </Heading>
              <Text
                fontSize="md"
                color="gray.600"
                mt={1}
                fontWeight="400"
                letterSpacing="wide"
              >
                コードを書きながらVimを覚える実践的エディタ
              </Text>
            </Box>
          </Flex>

          <Flex gap={6} align="center">
            <Tooltip
              content="Vim公式GitHubを開く"
              showArrow
              openDelay={300}
              closeDelay={100}
            >
              <Link
                href="https://github.com/vim/vim"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-flex"
                alignItems="center"
                gap={2}
                p={2}
                borderRadius="md"
                bg="gray.100"
                borderWidth="1px"
                borderColor="gray.300"
                color="gray.700"
                transition="all 0.2s"
                fontSize="sm"
                fontWeight="500"
                _hover={{
                  borderColor: "orange.500",
                  color: "orange.600",
                  bg: "orange.50",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Box
                  as={FiGithub}
                  color="currentColor"
                  transition="all 0.2s"
                  fontSize="16px"
                />
                GitHub
              </Link>
            </Tooltip>

            <Tooltip
              content="Vimコマンドチートシート（外部サイト）"
              showArrow
              openDelay={300}
              closeDelay={100}
            >
              <Link
                href="https://vim.rtorr.com/lang/ja"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-flex"
                alignItems="center"
                gap={2}
                p={2}
                borderRadius="md"
                bg="gray.100"
                borderWidth="1px"
                borderColor="gray.300"
                color="gray.700"
                transition="all 0.2s"
                fontSize="sm"
                fontWeight="500"
                _hover={{
                  borderColor: "orange.500",
                  color: "orange.600",
                  bg: "orange.50",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Box
                  as={FiExternalLink}
                  color="currentColor"
                  transition="all 0.2s"
                  fontSize="16px"
                />
                チートシート
              </Link>
            </Tooltip>
          </Flex>
        </Flex>

        {/* Main Content */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="flex-start"
          justify="flex-start"
          w="100%"
          h="100%"
          flex="1"
          px={4}
          py={3}
          gap={3}
          maxW="100vw"
          overflow="hidden"
          position="relative"
        >
          {/* CheatSheet */}
          {!isCodePenMode && showCheatSheet && (
            <Box
              key="cheatsheet"
              flex="none"
              w={{
                base: "100%",
                md: "400px",
              }}
              h="100%"
              maxH="100%"
              overflow="hidden"
            >
              <CheatSheet />
            </Box>
          )}

          {/* VimEditor */}
          <Box
            flex="1"
            w="100%"
            h="100%"
            maxH="100%"
            overflow="hidden"
            position="relative"
          >
            <VimEditor
              onCodePenModeChange={handleCodePenModeChange}
              showCheatSheet={showCheatSheet}
              onCheatSheetToggle={handleCheatSheetToggle}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
