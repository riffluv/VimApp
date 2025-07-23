"use client";

import CheatSheet from "@/components/CheatSheet";
import { Box, Flex, Heading, Icon, Image, Link, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { FiExternalLink, FiGithub } from "react-icons/fi";
const VimEditor = dynamic(() => import("@/components/VimEditor"), {
  ssr: false,
});

const MotionBox = motion(Box);

export default function Home() {
  return (
    <Box bg="#18181b" minH="100vh" w="100%">
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
            h={[8, 10]}
            w="auto"
            objectFit="contain"
          />
          <Box>
            <Heading
              as="h1"
              fontSize={["lg", "xl"]}
              color="orange.300"
              fontWeight="bold"
              letterSpacing="tight"
            >
              Vim Practice App
            </Heading>
            <Text fontSize={["xs", "sm"]} color="whiteAlpha.700" mt={0.5}>
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
        justify="flex-start"
        w="100%"
        px={{ base: 2, md: 6 }}
        py={0}
        gap={{ base: 4, md: 8 }}
      >
        <MotionBox
          flex={{ base: "none", md: "0 0 320px" }}
          w={{ base: "100%", md: "320px" }}
          minH="320px"
          mb={{ base: 4, md: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CheatSheet />
        </MotionBox>
        <MotionBox
          flex="1 1 0%"
          w="100%"
          minH="360px"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <VimEditor />
        </MotionBox>
      </Flex>
    </Box>
  );
}
