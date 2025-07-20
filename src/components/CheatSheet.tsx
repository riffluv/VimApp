"use client";

import { Box, Flex, Heading, Image, VStack } from "@chakra-ui/react";

const cheatSheetList: { command: string; description: string }[] = [
  { command: "h / j / k / l", description: "左右上下にカーソル移動" },
  { command: "w / b / e", description: "単語単位で移動（次/前/末尾）" },
  { command: "0 / $ / ^", description: "行頭・行末・最初の非空白文字へ" },
  { command: "gg / G", description: "ファイル先頭・末尾へ移動" },
  { command: "i / a / o / O", description: "挿入モード（位置/新規行）" },
  { command: "x", description: "カーソル位置の文字を削除" },
  { command: "dd", description: "現在の行を削除" },
  { command: "yy", description: "現在の行をコピー（ヤンク）" },
  { command: "p / P", description: "貼り付け（後/前）" },
  { command: "u / Ctrl+r", description: "アンドゥ・リドゥ" },
  { command: "cw / cc / c$", description: "単語・行・行末まで変更" },
  { command: ".", description: "直前の操作を繰り返し" },
  { command: "/pattern", description: "パターンを検索" },
  { command: "n / N", description: "次・前の検索結果へ" },
  { command: ":%s/old/new/g", description: "全てのoldをnewに置換" },
  { command: "v / V", description: "選択開始（文字/行）" },
  { command: "y / d", description: "コピー・削除" },
];

export default function CheatSheet() {
  return (
    <Box
      p={{ base: 6, md: 8 }}
      bg="gray.900"
      color="white"
      borderRadius="xl"
      boxShadow="lg"
      height="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Flex align="center" justify="center" mb={6} gap={2}>
        <Image
          src="/manabyicon.png"
          alt="manaby icon"
          h={{ base: 8, md: 10 }}
          minW={6}
          objectFit="contain"
        />
        <Heading as="h2" size="xl" color="cyan.400" m={0}>
          Vim Cheat Sheet
        </Heading>
      </Flex>
      <VStack gap={4} overflowY="auto" flex={1} pr={2}>
        {cheatSheetList.map((item, index) => (
          <Box
            key={index}
            p={5}
            display="flex"
            alignItems="center"
            mb={2}
            borderRadius="xl"
            boxShadow="lg"
            bg="gray.800"
            borderWidth={1}
            borderColor="gray.700"
            transition="all 0.2s"
            _hover={{ transform: "scale(1.04)", borderColor: "cyan.400" }}
          >
            <Box
              bg="orange.400"
              color="white"
              borderRadius="md"
              fontWeight="bold"
              px={2}
              py={1}
              fontSize="xs"
              mr={3}
              boxShadow="md"
              tabIndex={0}
              _focus={{
                outline: "2px solid",
                outlineColor: "cyan.400",
                outlineOffset: "2px",
              }}
              fontFamily="mono"
            >
              #{index + 1}
            </Box>
            <Box
              fontFamily="mono"
              fontWeight="bold"
              color="cyan.300"
              fontSize={{ base: "md", md: "lg" }}
              mr={4}
              letterSpacing="wide"
            >
              {item.command}
            </Box>
            <Box fontSize={{ base: "sm", md: "md" }} flex={1}>
              {item.description}
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
