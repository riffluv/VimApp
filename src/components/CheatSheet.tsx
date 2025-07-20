"use client";

import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiCommand,
  FiCornerDownRight,
  FiCpu,
  FiEdit2,
  FiSearch,
} from "react-icons/fi";

interface Command {
  command: string;
  description: string;
  category: "navigation" | "editing" | "search" | "basic" | "advanced";
}

const cheatSheetList: Command[] = [
  {
    command: "h / j / k / l",
    description: "左右上下にカーソル移動",
    category: "navigation",
  },
  {
    command: "w / b / e",
    description: "単語単位で移動（次/前/末尾）",
    category: "navigation",
  },
  {
    command: "0 / $ / ^",
    description: "行頭・行末・最初の非空白文字へ",
    category: "navigation",
  },
  {
    command: "gg / G",
    description: "ファイル先頭・末尾へ移動",
    category: "navigation",
  },
  {
    command: "i / a / o / O",
    description: "挿入モード（位置/新規行）",
    category: "basic",
  },
  {
    command: "x",
    description: "カーソル位置の文字を削除",
    category: "editing",
  },
  { command: "dd", description: "現在の行を削除", category: "editing" },
  {
    command: "yy",
    description: "現在の行をコピー（ヤンク）",
    category: "editing",
  },
  { command: "p / P", description: "貼り付け（後/前）", category: "editing" },
  { command: "u / Ctrl+r", description: "アンドゥ・リドゥ", category: "basic" },
  {
    command: "cw / cc / c$",
    description: "単語・行・行末まで変更",
    category: "advanced",
  },
  { command: ".", description: "直前の操作を繰り返し", category: "advanced" },
  { command: "/pattern", description: "パターンを検索", category: "search" },
  { command: "n / N", description: "次・前の検索結果へ", category: "search" },
  {
    command: ":%s/old/new/g",
    description: "全てのoldをnewに置換",
    category: "search",
  },
  { command: "v / V", description: "選択開始（文字/行）", category: "basic" },
  { command: "y / d", description: "コピー・削除", category: "editing" },
];

const CategoryIcons = {
  navigation: FiCornerDownRight,
  editing: FiEdit2,
  search: FiSearch,
  basic: FiCommand,
  advanced: FiCpu,
};

const CategoryColors = {
  navigation: "blue.400",
  editing: "green.400",
  search: "purple.400",
  basic: "orange.400",
  advanced: "pink.400",
};

export default function CheatSheet() {
  return (
    <Box
      p={{ base: 0, md: 0 }}
      bgGradient="linear(to-br, #18181b, #222)"
      color="white"
      borderRadius="2xl"
      boxShadow="0 8px 32px 0 rgba(0,0,0,0.7)"
      height="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      borderWidth={1}
      borderColor="gray.700"
      transition="all 0.3s"
      _hover={{ boxShadow: "0 12px 48px 0 rgba(0,0,0,0.8)" }}
    >
      {/* Header */}
      <Flex
        align="center"
        px={6}
        py={4}
        borderBottomWidth={1}
        borderColor="gray.800"
        bgGradient="linear(to-r, #101012, #1a1a1c)"
        mb={0}
      >
        <Flex align="center" gap={3}>
          <Image
            src="/manabyicon.png"
            alt="manaby icon"
            h={{ base: 8, md: 8 }}
            minW={8}
            objectFit="contain"
          />
          <Flex direction="column">
            <Heading
              as="h2"
              size="md"
              color="orange.400"
              m={0}
              fontWeight="bold"
              letterSpacing="tight"
              lineHeight="1.2"
            >
              Vim Cheat Sheet
            </Heading>
            <Text color="gray.400" fontSize="xs" mt={0.5}>
              基本コマンド早見表
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Categories */}
      <Flex
        px={4}
        py={3}
        borderBottomWidth={1}
        borderColor="gray.800"
        bg="blackAlpha.300"
        overflowX="auto"
        flexWrap="nowrap"
        gap={2}
        css={{
          "&::-webkit-scrollbar": { height: "4px" },
          "&::-webkit-scrollbar-thumb": { background: "#333" },
        }}
      >
        {Object.entries(CategoryIcons).map(([category, IconComponent]) => (
          <Badge
            key={category}
            bg={`${
              category === "basic"
                ? CategoryColors[category as keyof typeof CategoryColors]
                : "blackAlpha.400"
            }`}
            color={`${
              category === "basic"
                ? "white"
                : CategoryColors[category as keyof typeof CategoryColors]
            }`}
            borderRadius="md"
            px={2.5}
            py={1}
            display="flex"
            alignItems="center"
            fontSize="xs"
            fontWeight="medium"
          >
            <Icon as={IconComponent} mr={1} fontSize="11px" />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        ))}
      </Flex>

      {/* Command List */}
      <Box
        overflowY="auto"
        flex={1}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { background: "#333" },
        }}
        p={2}
      >
        <Stack gap={0} align="stretch">
          {cheatSheetList.map((item, index) => (
            <Flex
              key={index}
              py={2}
              px={3}
              alignItems="center"
              borderRadius="md"
              transition="all 0.15s"
              _hover={{
                bg: "blackAlpha.400",
              }}
              my={0.5}
              role="group"
            >
              <Box
                color="whiteAlpha.600"
                fontWeight="medium"
                fontSize="xs"
                mr={2}
                fontFamily="mono"
                minW={5}
                textAlign="center"
              >
                {index + 1}
              </Box>

              <Icon
                as={CategoryIcons[item.category]}
                color={CategoryColors[item.category]}
                mr={2}
                fontSize="sm"
              />

              <Box
                fontFamily="mono"
                fontWeight="semibold"
                color="orange.300"
                fontSize="sm"
                mr={3}
                letterSpacing="tight"
                minW={{ base: "auto", md: 28 }}
                textAlign="left"
                _groupHover={{ color: "orange.400" }}
              >
                {item.command}
              </Box>

              <Box
                fontSize="sm"
                flex={1}
                color="whiteAlpha.800"
                fontWeight="normal"
                textAlign="left"
                _groupHover={{ color: "white" }}
              >
                {item.description}
              </Box>
            </Flex>
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Flex
        px={4}
        py={2}
        borderTopWidth={1}
        borderColor="gray.800"
        bg="blackAlpha.400"
        fontSize="xs"
        color="gray.500"
        align="center"
        justify="center"
      >
        <Icon as={FiBookOpen} mr={1.5} />
        <Text>Vim を練習して速度と効率を向上させよう</Text>
      </Flex>
    </Box>
  );
}
