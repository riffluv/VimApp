"use client";

import CheatSheet from "@/components/CheatSheet";
import VimEditor from "@/components/VimEditor";
import { Box, Flex, Heading, Icon, Image, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCode, FiExternalLink, FiGithub } from "react-icons/fi";

export default function Home() {
  // Handle hydration
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after hydration to prevent layout shifts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Box
      minH="100vh"
      bg="bgDark"
      bgGradient="linear(to-b, #0a0a0b, #18181b)"
      pb={{ base: 4, md: 8 }}
    >
      {/* Header Section */}
      <Box
        as="header"
        borderBottomWidth={1}
        borderColor="whiteAlpha.100"
        position="relative"
        mb={{ base: 6, md: 10 }}
        pb={4}
      >
        {/* Background gradient effect */}
        <Box
          position="absolute"
          top={0}
          left="50%"
          transform="translateX(-50%)"
          w="100%"
          maxW="1200px"
          h="full"
          bgGradient="radial(circle at top center, orange.900 0%, transparent 70%)"
          opacity={0.15}
          pointerEvents="none"
        />

        <Flex
          as="nav"
          align="center"
          justify="space-between"
          maxW="1400px"
          mx="auto"
          px={{ base: 4, md: 8 }}
          py={4}
        >
          <Flex align="center" gap={3}>
            <Image
              src="/manabylogo.png"
              alt="manaby logo"
              h={{ base: 10, md: 12 }}
              objectFit="contain"
              style={{ minWidth: 60 }}
            />
            <Flex direction="column">
              <Heading
                as="h1"
                size={{ base: "lg", md: "xl" }}
                color="orange.400"
                fontWeight="extrabold"
                letterSpacing="tight"
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
            </Flex>
          </Flex>

          <Flex gap={4} align="center" display={{ base: "none", md: "flex" }}>
            <Link
              href="https://github.com/vim/vim"
              isExternal
              display="flex"
              alignItems="center"
              color="whiteAlpha.800"
              fontSize="sm"
              _hover={{ color: "orange.400" }}
              transition="all 0.2s"
            >
              <Icon as={FiGithub} mr={1.5} />
              GitHub
            </Link>
            <Link
              href="https://www.vim.org/docs.php"
              isExternal
              display="flex"
              alignItems="center"
              color="whiteAlpha.800"
              fontSize="sm"
              _hover={{ color: "orange.400" }}
              transition="all 0.2s"
            >
              <Icon as={FiExternalLink} mr={1.5} />
              Documentation
            </Link>
          </Flex>
        </Flex>

        {/* Intro text */}
        <Box maxW="700px" mx="auto" textAlign="center" px={4} mt={4}>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="medium"
            color="whiteAlpha.900"
            lineHeight="tall"
          >
            Vim
            は最も強力なテキストエディタの一つで、効率的なコーディングのために習得する価値があります。
            このアプリで基本的なコマンドを練習しましょう！
          </Text>
        </Box>
      </Box>

      {/* Main content area */}
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6 }}>
        <Flex
          gap={{ base: 6, md: 8 }}
          direction={{ base: "column", lg: "row" }}
          height={{
            base: "auto",
            md: isMounted ? "calc(100vh - 240px)" : "auto",
          }}
          minHeight={{ base: "auto", md: "600px" }}
          alignItems="stretch"
        >
          <Box
            flex={{ base: "auto", lg: "1" }}
            minW={{ lg: "380px" }}
            height={{ base: "450px", lg: "auto" }}
          >
            <CheatSheet />
          </Box>
          <Box
            flex={{ base: "auto", lg: "2" }}
            height={{ base: "600px", lg: "auto" }}
          >
            <VimEditor />
          </Box>
        </Flex>

        {/* Footer */}
        <Flex
          as="footer"
          justify="center"
          align="center"
          py={6}
          mt={6}
          borderTopWidth={1}
          borderColor="whiteAlpha.100"
          color="whiteAlpha.600"
          fontSize="sm"
        >
          <Icon as={FiCode} mr={2} />
          <Text>Created with Chakra UI • © 2025 Vim Practice App</Text>
        </Flex>
      </Box>
    </Box>
  );
}
