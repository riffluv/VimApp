"use client";

import {
  Accordion,
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
  FiChevronDown,
  FiCommand,
  FiCornerDownRight,
  FiCpu,
  FiEdit2,
  FiSearch,
} from "react-icons/fi";

// Command interface and data
interface Command {
  command: string;
  description: string;
  category: "navigation" | "editing" | "search" | "basic" | "advanced";
}

const cheatSheetList: Command[] = [
  // (The command list remains the same)
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

// Group commands by category
const groupedCommands = cheatSheetList.reduce((acc, command) => {
  if (!acc[command.category]) {
    acc[command.category] = [];
  }
  acc[command.category].push(command);
  return acc;
}, {} as Record<Command["category"], Command[]>);

// Category metadata
const CategoryInfo = {
  basic: {
    icon: FiCommand,
    color: "orange.400",
    title: "基本操作",
  },
  navigation: {
    icon: FiCornerDownRight,
    color: "blue.400",
    title: "カーソル移動",
  },
  editing: {
    icon: FiEdit2,
    color: "green.400",
    title: "編集",
  },
  search: {
    icon: FiSearch,
    color: "purple.400",
    title: "検索と置換",
  },
  advanced: {
    icon: FiCpu,
    color: "pink.400",
    title: "高度なコマンド",
  },
};

export default function CheatSheet() {
  return (
    <Box
      p={0}
      bgGradient="to-br"
      gradientFrom="#18181b"
      gradientTo="#222"
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
        borderColor="primary.700"
        bgGradient="to-r"
        gradientFrom="primary.900"
        gradientTo="primary.800"
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
              color="secondary.400"
              fontWeight="bold"
              letterSpacing="tight"
            >
              Vim Cheat Sheet
            </Heading>
            <Text color="gray.400" fontSize="xs" mt={0.5}>
              基本コマンド早見表
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Command List (Accordion) */}
      <Box
        overflowY="auto"
        flex={1}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { background: "#333" },
        }}
        p={2}
      >
        <Accordion.Root multiple defaultValue={["basic", "navigation"]}>
          {Object.entries(groupedCommands).map(([category, commands]) => {
            const catInfo = CategoryInfo[category as keyof typeof CategoryInfo];
            return (
              <Accordion.Item
                key={category}
                value={category}
                border="none"
                mb={2}
              >
                <Accordion.ItemTrigger
                  bg="blackAlpha.300"
                  borderRadius="lg"
                  _hover={{ bg: "blackAlpha.400" }}
                  py={3}
                  px={4}
                >
                  <Flex align="center" flex="1" textAlign="left">
                    <Icon
                      as={catInfo.icon}
                      color={catInfo.color}
                      mr={3}
                      fontSize="lg"
                    />
                    <Text fontWeight="bold" color="whiteAlpha.900">
                      {catInfo.title}
                    </Text>
                  </Flex>
                  <Accordion.ItemIndicator>
                    <Icon
                      as={FiChevronDown}
                      color="whiteAlpha.700"
                      transition="transform 0.2s"
                      _open={{ transform: "rotate(180deg)" }}
                    />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody pb={2} pt={2} px={1}>
                    <Stack gap={0} align="stretch">
                      {commands.map((item, index) => (
                        <Flex
                          key={index}
                          py={2}
                          px={3}
                          alignItems="center"
                          borderRadius="md"
                          transition="all 0.15s"
                          _hover={{ bg: "blackAlpha.400" }}
                          role="group"
                        >
                          <Box
                            fontFamily="mono"
                            fontWeight="semibold"
                            color="secondary.300"
                            fontSize="sm"
                            mr={4}
                            letterSpacing="tight"
                            minW={{ base: "auto", md: 28 }}
                            textAlign="left"
                            _groupHover={{ color: "secondary.400" }}
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
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </Box>

      {/* Footer */}
      <Flex
        px={4}
        py={2}
        borderTopWidth={1}
        borderColor="primary.700"
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
