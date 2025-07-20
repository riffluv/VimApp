"use client";

import { Badge, Box, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FaCode } from "react-icons/fa";

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
  const cardBg = "gray.800";
  const hoverBg = "gray.700";

  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="gray.900"
      color="textLight"
      borderRadius="xl"
      boxShadow="lg"
      height="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Heading as="h2" size="xl" mb={4} textAlign="center" color="primary.300">
        <Icon as={FaCode} mr={2} /> Vim Cheat Sheet
        <Badge ml={2} colorScheme="primary">
          2025
        </Badge>
      </Heading>
      <VStack gap={3} overflowY="auto" flex={1} pr={2}>
        {cheatSheetList.map((item, index) => (
          <Box
            key={index}
            p={4}
            bg={cardBg}
            borderRadius="md"
            boxShadow="md"
            _hover={{ bg: hoverBg, transform: "scale(1.02)" }}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
          >
            <Badge mr={3} colorScheme="primary">
              #{index + 1}
            </Badge>
            <Text fontWeight="bold" fontFamily="mono" mr={4} color="accent.500">
              {item.command}
            </Text>
            <Text>{item.description}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
