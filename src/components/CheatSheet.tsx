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
import { motion } from "framer-motion";
import {
    FiBookOpen,
    FiChevronDown,
    FiCommand,
    FiCpu,
    FiEdit2,
    FiSearch,
} from "react-icons/fi";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

// Command interface and data
interface Command {
  command: string;
  description: string;
  category: "basic" | "movement" | "editing" | "webdev";
}

// 初心者ウェブ制作者向け厳選コマンド - 実際にWebエディタで使えるもののみ
const cheatSheetList: Command[] = [
  // 基本操作（最初に覚える必須コマンド）
  { command: "i", description: "カーソル位置で文字入力開始", category: "basic" },
  { command: "a", description: "カーソルの次で文字入力開始", category: "basic" },
  { command: "o", description: "下に新しい行を作って入力開始", category: "basic" },
  { command: "O", description: "上に新しい行を作って入力開始", category: "basic" },
  { command: "Esc", description: "ノーマルモードに戻る", category: "basic" },
  { command: "u", description: "元に戻す（アンドゥ）", category: "basic" },
  { command: "Ctrl+r", description: "やり直し（リドゥ）", category: "basic" },

  // 移動コマンド（効率的なカーソル移動）
  { command: "h", description: "左に移動", category: "movement" },
  { command: "j", description: "下に移動", category: "movement" },
  { command: "k", description: "上に移動", category: "movement" },
  { command: "l", description: "右に移動", category: "movement" },
  { command: "w", description: "次の単語の先頭に移動", category: "movement" },
  { command: "b", description: "前の単語の先頭に移動", category: "movement" },
  { command: "0", description: "行頭に移動", category: "movement" },
  { command: "$", description: "行末に移動", category: "movement" },
  { command: "gg", description: "ファイル先頭に移動", category: "movement" },
  { command: "G", description: "ファイル末尾に移動", category: "movement" },
  { command: "/text", description: "textを検索", category: "movement" },
  { command: "n", description: "次の検索結果に移動", category: "movement" },
  { command: "N", description: "前の検索結果に移動", category: "movement" },

  // 編集コマンド（削除・コピー・貼り付け）
  { command: "x", description: "カーソル位置の文字を削除", category: "editing" },
  { command: "dd", description: "現在の行を削除", category: "editing" },
  { command: "dw", description: "次の単語まで削除", category: "editing" },
  { command: "d$", description: "行末まで削除", category: "editing" },
  { command: "yy", description: "現在の行をコピー", category: "editing" },
  { command: "yw", description: "次の単語までコピー", category: "editing" },
  { command: "p", description: "カーソル後に貼り付け", category: "editing" },
  { command: "P", description: "カーソル前に貼り付け", category: "editing" },
  { command: "v", description: "文字単位で選択開始", category: "editing" },
  { command: "V", description: "行単位で選択開始", category: "editing" },
  { command: ">", description: "選択範囲を右にインデント", category: "editing" },
  { command: "<", description: "選択範囲を左にインデント", category: "editing" },
  { command: ".", description: "直前の操作を繰り返し", category: "editing" },

  // ウェブ制作で特に便利なコマンド
  { command: "ciw", description: "単語を変更（クラス名・変数名に便利）", category: "webdev" },
  { command: "ci\"", description: "\"の中身を変更（文字列編集に便利）", category: "webdev" },
  { command: "ci'", description: "'の中身を変更（文字列編集に便利）", category: "webdev" },
  { command: "cit", description: "HTMLタグの中身を変更", category: "webdev" },
  { command: "dit", description: "HTMLタグの中身を削除", category: "webdev" },
  { command: "A", description: "行末で入力開始（;追加に便利）", category: "webdev" },
  { command: "I", description: "行頭で入力開始（コメント追加に便利）", category: "webdev" },
  { command: "cc", description: "行全体を変更", category: "webdev" },
  { command: "Ctrl+v", description: "矩形選択（複数行同時編集）", category: "webdev" },
  { command: ":%s/old/new/g", description: "全体置換（リファクタリングに便利）", category: "webdev" },
];

// Group commands by category
const groupedCommands = cheatSheetList.reduce((acc, command) => {
  if (!acc[command.category]) {
    acc[command.category] = [];
  }
  acc[command.category].push(command);
  return acc;
}, {} as Record<Command["category"], Command[]>);

// Category metadata - 初心者向けに再構成
const CategoryInfo = {
  basic: {
    icon: FiEdit2,
    color: "green.400",
    title: "基本操作（まずはここから）",
    description: "Vimを使うために最低限必要なコマンド。これだけでも十分使えます。",
  },
  movement: {
    icon: FiCommand,
    color: "blue.400",
    title: "移動コマンド（効率アップ）",
    description: "マウスを使わずにカーソルを素早く移動。慣れると手放せません。",
  },
  editing: {
    icon: FiCpu,
    color: "purple.400",
    title: "編集コマンド（削除・コピー・貼り付け）",
    description: "テキストの削除、コピー、貼り付けを効率的に行うコマンド。",
  },
  webdev: {
    icon: FiSearch,
    color: "orange.400",
    title: "ウェブ制作で便利なコマンド",
    description: "HTML/CSS/JS編集で特に役立つ実践的なコマンド。慣れたら挑戦！",
  },
};

export default function CheatSheet() {
  // アニメーション用の variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };
  return (
    <MotionBox
      p={0}
      bg="rgba(24, 24, 27, 0.95)"
      color="white"
      borderRadius="2xl"
      boxShadow="0 20px 40px rgba(0,0,0,0.4)"
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor="rgba(255,152,0,0.2)"
      position="relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      backdropFilter="blur(20px)"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(145deg, rgba(255,152,0,0.08) 0%, rgba(255,152,0,0.02) 50%, rgba(0,0,0,0.3) 100%)",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "1px",
        left: "1px",
        right: "1px",
        bottom: "1px",
        background:
          "linear-gradient(145deg, rgba(0,0,0,0.4), rgba(255,152,0,0.05))",
        borderRadius: "calc(1rem - 1px)",
        pointerEvents: "none",
        zIndex: -1,
      }}
      _hover={{
        boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,152,0,0.3)",
        transform: "translateY(-2px)",
        borderColor: "rgba(255,152,0,0.3)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {/* Header */}
      <MotionFlex
        align="center"
        px={6}
        py={4}
        borderBottomWidth={1}
        borderColor="rgba(255,152,0,0.3)"
        bg="rgba(255,152,0,0.08)"
        position="relative"
        variants={itemVariants}
        backdropFilter="blur(10px)"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(255,152,0,0.12) 0%, rgba(255,152,0,0.06) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,152,0,0.6), transparent)",
        }}
      >
        <Flex align="center" gap={3}>
          <MotionBox
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/manabyicon.png"
              alt="manaby icon"
              h={{ base: 8, md: 8 }}
              minW={8}
              objectFit="contain"
              filter="auto"
              dropShadow="md"
            />
          </MotionBox>
          <Flex direction="column">
            <Heading
              as="h2"
              size="md"
              color="secondary.300"
              fontWeight="600"
              letterSpacing="tight"
              fontFamily="Inter"
              style={{
                textShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
            >
              Vim Cheat Sheet
            </Heading>
            <Text color="gray.400" fontSize="xs" mt={0.5} fontWeight="400">
              vimコマンド早見表
            </Text>
          </Flex>
        </Flex>
      </MotionFlex>

      {/* Command List (Accordion) */}
      <MotionBox
        overflowY="auto"
        flex={1}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(to bottom, #F6AD55, #DD6B20)",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.2)",
          },
        }}
        p={2}
        variants={itemVariants}
        role="region"
        aria-label="Vim コマンドリスト"
      >
        <Accordion.Root
          multiple
          defaultValue={["basic", "movement"]}
          aria-label="Vim コマンドカテゴリー"
        >
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
                  bg="rgba(0,0,0,0.3)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  _hover={{
                    bg: "rgba(255,152,0,0.08)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    borderColor: "rgba(255,152,0,0.3)",
                  }}
                  _focus={{
                    outline: "2px solid",
                    outlineColor: "secondary.400",
                    outlineOffset: "2px",
                  }}
                  py={3}
                  px={4}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  position="relative"
                  role="button"
                  aria-expanded="false"
                  aria-describedby={`commands-${category}`}
                  backdropFilter="blur(10px)"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${catInfo.color}08 0%, transparent 50%)`,
                    borderRadius: "inherit",
                    pointerEvents: "none",
                  }}
                >
                  <Flex align="center" flex="1" textAlign="left">
                    <Icon
                      as={catInfo.icon}
                      color={catInfo.color}
                      mr={3}
                      fontSize="lg"
                    />
                    <Text fontWeight="600" color="gray.100" fontFamily="Inter">
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
                  <Accordion.ItemBody
                    pb={2}
                    pt={2}
                    px={1}
                    id={`commands-${category}`}
                  >
                    <Stack gap={0} align="stretch" role="list">
                      {commands.map((item, index) => (
                        <Flex
                          key={index}
                          py={2}
                          px={3}
                          alignItems="center"
                          borderRadius="lg"
                          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                          _hover={{ 
                            bg: "rgba(255,152,0,0.08)",
                            transform: "translateX(4px)",
                            borderLeft: "2px solid",
                            borderColor: "secondary.500",
                          }}
                          role="group"
                          tabIndex={0}
                          _focus={{
                            outline: "2px solid",
                            outlineColor: "secondary.400",
                            outlineOffset: "1px",
                          }}
                          cursor="pointer"
                          aria-label={`コマンド: ${item.command} - ${item.description}`}
                          position="relative"
                        >
                          <Box
                            fontFamily="Fira Code"
                            fontWeight="500"
                            color="secondary.400"
                            fontSize="sm"
                            mr={4}
                            letterSpacing="tight"
                            minW={{ base: "auto", md: 28 }}
                            textAlign="left"
                            bg="rgba(255,152,0,0.1)"
                            px={2}
                            py={1}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="rgba(255,152,0,0.2)"
                            _groupHover={{ 
                              color: "secondary.300",
                              bg: "rgba(255,152,0,0.15)",
                              borderColor: "rgba(255,152,0,0.3)",
                            }}
                          >
                            {item.command}
                          </Box>
                          <Box
                            fontSize="sm"
                            flex={1}
                            color="gray.300"
                            fontWeight="400"
                            textAlign="left"
                            fontFamily="Inter"
                            _groupHover={{ color: "gray.100" }}
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
      </MotionBox>

      {/* Footer */}
      <MotionFlex
        px={4}
        py={3}
        borderTopWidth={1}
        borderColor="rgba(255,152,0,0.3)"
        bg="rgba(0,0,0,0.3)"
        fontSize="xs"
        color="gray.400"
        align="center"
        justify="center"
        variants={itemVariants}
        position="relative"
        backdropFilter="blur(10px)"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,152,0,0.6), transparent)",
        }}
      >
        <Icon
          as={FiBookOpen}
          mr={2}
          color="secondary.400"
          boxSize="16px"
          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
          transition="transform 0.2s ease, color 0.2s ease"
          _hover={{
            color: "secondary.300",
            transform: "scale(1.1)",
          }}
        />
        <Text fontFamily="Inter" lineHeight="1.4">
          基本操作から始めて、段階的にスキルアップしよう！
          <br />
          <Box as="span" color="secondary.300" fontWeight="500">
            慣れてきたらvscodeの拡張機能でvscodevimを使ってね！
          </Box>
        </Text>
      </MotionFlex>
    </MotionBox>
  );
}
