"use client";

import { Box, Flex, Heading, Image, Stack } from "@chakra-ui/react";

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
      p={{ base: 4, md: 6 }}
      bgGradient="linear(to-br, #18181b, #222)"
      color="white"
      borderRadius="xl"
      boxShadow="0 4px 16px 0 rgba(0,0,0,0.5)"
      height="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      borderWidth={1}
      borderColor="gray.700"
      transition="all 0.2s"
    >
      <Flex align="center" justify="center" mb={4} gap={2}>
        <Image
          src="/manabyicon.png"
          alt="manaby icon"
          h={{ base: 8, md: 10 }}
          minW={8}
          objectFit="contain"
        />
        <Heading
          as="h2"
          size="lg"
          color="orange.400"
          m={0}
          fontWeight="bold"
          letterSpacing="wide"
        >
          Vim Cheat Sheet
        </Heading>
      </Flex>
      <Stack gap={2} overflowY="auto" flex={1} pr={1} align="stretch">
        {cheatSheetList.map((item, index) => (
          <Box
            key={index}
            py={2}
            px={3}
            display="flex"
            alignItems="center"
            borderRadius="md"
            borderWidth={0}
            boxShadow="none"
            bg="transparent"
            transition="none"
            mb={0}
          >
            <Box
              color="orange.400"
              fontWeight="bold"
              fontSize="sm"
              mr={3}
              fontFamily="mono"
              minW={10}
              textAlign="left"
            >
              #{index + 1}
            </Box>
            <Box
              fontFamily="mono"
              fontWeight="bold"
              color="orange.300"
              fontSize="sm"
              mr={4}
              letterSpacing="wide"
              minW={28}
              textAlign="left"
            >
              {item.command}
            </Box>
            <Box
              fontSize="sm"
              flex={1}
              color="white"
              fontWeight="normal"
              textAlign="left"
            >
              {item.description}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
