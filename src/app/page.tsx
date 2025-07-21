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
      pb={[4, 8]}
    >
      {/* Header Section */}
      <Box
        as="header"
        borderBottomWidth={1}
        borderColor="whiteAlpha.100"
        position="relative"
        mb={[6, 10]}
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
          px={[4, 8]}
          py={4}
        >
          <Flex align="center" gap={3}>
            <Image
              src="/manabylogo.png"
              alt="manaby logo"
              h={[10, 12]}
              objectFit="contain"
              style={{ minWidth: 60 }}
            />
            <Flex direction="column">
              <Heading
                as="h1"
                fontSize={["lg", "xl"]}
                color="orange.400"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                Vim Practice App
              </Heading>
              <Text fontSize={["xs", "sm"]} color="whiteAlpha.700" mt={0.5}>
                ブラウザ上でVimのコマンドを練習できるアプリ
              </Text>
            </Flex>
          </Flex>

          <Flex gap={4} align="center" display={["none", "flex"]}>
            <Link
              href="https://github.com/vim/vim"
              target="_blank"
              rel="noopener noreferrer"
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
              target="_blank"
              rel="noopener noreferrer"
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
            fontSize={["md", "lg"]}
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
      <Box maxW="1400px" mx="auto" px={[4, 6]}>
        <Flex
          gap={[6, 8]}
          direction={["column", null, "row"]}
          height={["auto", null, "calc(100vh - 240px)"]}
          minHeight={["auto", null, "600px"]}
          alignItems="stretch"
        >
          <Box
            flex={["auto", null, "1"]}
            minW={["0", null, "380px"]}
            maxW={["100%", null, "700px"]}
            height={["450px", null, "100%"]}
            w={["100%", null, "auto"]}
            alignSelf="flex-start"
            transition="max-width 0.2s"
            display="flex"
            flexDir="column"
          >
            <Box
              flex={1}
              height={["auto", null, "100%"]}
              overflowY={["visible", null, "auto"]}
            >
              <CheatSheet />
            </Box>
          </Box>
          <Box flex={["auto", null, "2"]} height={["600px", null, "100%"]}>
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
