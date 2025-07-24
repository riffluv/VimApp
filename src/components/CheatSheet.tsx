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
  category: "normal" | "insert" | "visual" | "practical";
}

// 初心者・ウェブ制作者向け厳選コマンド
const cheatSheetList: Command[] = [
  // ノーマルモード（基本操作・移動・編集）
  // ノーマルモード（基本操作・移動・編集）
  { command: "h", description: "左に移動", category: "normal" },
  { command: "j", description: "下に移動", category: "normal" },
  { command: "k", description: "上に移動", category: "normal" },
  { command: "l", description: "右に移動", category: "normal" },
  { command: "w", description: "次の単語の先頭に移動", category: "normal" },
  { command: "b", description: "前の単語の先頭に移動", category: "normal" },
  { command: "e", description: "次の単語の末尾に移動", category: "normal" },
  { command: "0", description: "行頭に移動", category: "normal" },
  { command: "$", description: "行末に移動", category: "normal" },
  { command: "^", description: "最初の非空白文字に移動", category: "normal" },
  { command: "gg", description: "ファイル先頭へ移動", category: "normal" },
  { command: "G", description: "ファイル末尾へ移動", category: "normal" },
  { command: ":w", description: "保存", category: "normal" },
  { command: ":q", description: "終了", category: "normal" },
  { command: ":wq", description: "保存して終了", category: "normal" },
  { command: ":q!", description: "強制終了（保存せず）", category: "normal" },
  { command: "x", description: "カーソル位置の文字を削除", category: "normal" },
  { command: "dd", description: "現在の行を削除", category: "normal" },
  { command: "dw", description: "次の単語まで削除", category: "normal" },
  { command: "d$", description: "行末まで削除", category: "normal" },
  {
    command: "yy",
    description: "現在の行をコピー（ヤンク）",
    category: "normal",
  },
  {
    command: "yw",
    description: "次の単語までコピー（ヤンク）",
    category: "normal",
  },
  {
    command: "y$",
    description: "行末までコピー（ヤンク）",
    category: "normal",
  },
  { command: "p", description: "貼り付け（後）", category: "normal" },
  { command: "P", description: "貼り付け（前）", category: "normal" },
  { command: "u", description: "アンドゥ（元に戻す）", category: "normal" },
  { command: "Ctrl+r", description: "リドゥ（やり直し）", category: "normal" },
  { command: ".", description: "直前の操作を繰り返し", category: "normal" },
  { command: "/pattern", description: "パターンを検索", category: "normal" },
  { command: "n", description: "次の検索結果へ", category: "normal" },
  { command: "N", description: "前の検索結果へ", category: "normal" },
  {
    command: ":%s/old/new/g",
    description: "全てのoldをnewに置換",
    category: "normal",
  },
  // インサートモード
  {
    command: "i",
    description: "カーソル位置で挿入モードに入る",
    category: "insert",
  },
  {
    command: "I",
    description: "行頭で挿入モードに入る",
    category: "insert",
  },
  {
    command: "a",
    description: "カーソルの次の位置で挿入モードに入る",
    category: "insert",
  },
  {
    command: "A",
    description: "行末で挿入モードに入る",
    category: "insert",
  },
  {
    command: "o",
    description: "下に新しい行を作って挿入モードに入る",
    category: "insert",
  },
  {
    command: "O",
    description: "上に新しい行を作って挿入モードに入る",
    category: "insert",
  },
  {
    command: "Esc",
    description: "ノーマルモードに戻る",
    category: "insert",
  },
  {
    command: "Ctrl+h / Ctrl+w",
    description: "挿入モード中に文字/単語消去",
    category: "insert",
  },
  // ビジュアルモード
  // ビジュアルモード
  {
    command: "v",
    description: "文字単位で選択開始（ビジュアルモード）",
    category: "visual",
  },
  {
    command: "V",
    description: "行単位で選択開始（ビジュアルモード）",
    category: "visual",
  },
  {
    command: "Ctrl+v",
    description: "矩形選択開始（ビジュアルモード）",
    category: "visual",
  },
  {
    command: "y",
    description: "選択範囲をコピー（ヤンク）",
    category: "visual",
  },
  { command: "d", description: "選択範囲を削除", category: "visual" },
  { command: ">", description: "選択範囲を右にインデント", category: "visual" },
  { command: "<", description: "選択範囲を左にインデント", category: "visual" },
  { command: "Esc", description: "ノーマルモードに戻る", category: "visual" },
  // 実務で役立つコマンド（応用・便利技）
  // 実務で役立つコマンド（応用・便利技）
  {
    command: "ciw",
    description: "単語全体を変更（消去して挿入）",
    category: "practical",
  },
  {
    command: "cw",
    description: "単語末尾まで変更（消去して挿入）",
    category: "practical",
  },
  {
    command: "cc",
    description: "行全体を変更（消去して挿入）",
    category: "practical",
  },
  {
    command: "c$",
    description: "カーソル位置から行末まで変更（消去して挿入）",
    category: "practical",
  },
  {
    command: ":tabnew",
    description: "新しいタブを開く",
    category: "practical",
  },
  { command: "gt", description: "次のタブに移動", category: "practical" },
  { command: "gT", description: "前のタブに移動", category: "practical" },
  {
    command: ":sp",
    description: "ウィンドウを水平分割",
    category: "practical",
  },
  {
    command: ":vs",
    description: "ウィンドウを垂直分割",
    category: "practical",
  },
  { command: "Ctrl+ws", description: "ウィンドウ分割", category: "practical" },
  {
    command: "Ctrl+wv",
    description: "ウィンドウ垂直分割",
    category: "practical",
  },
  {
    command: "Ctrl+ww",
    description: "ウィンドウ切り替え",
    category: "practical",
  },
  {
    command: ":reg",
    description: "レジスタの内容を表示",
    category: "practical",
  },
  {
    command: '"+y',
    description: "選択範囲をクリップボードにコピー",
    category: "practical",
  },
  {
    command: '"+p',
    description: "クリップボードからペースト",
    category: "practical",
  },
];

// Group commands by category
const groupedCommands = cheatSheetList.reduce((acc, command) => {
  if (!acc[command.category]) {
    acc[command.category] = [];
  }
  acc[command.category].push(command);
  return acc;
}, {} as Record<Command["category"], Command[]>);

// Category metadata（見た目・アイコンは現状維持）
const CategoryInfo = {
  normal: {
    icon: FiCommand,
    color: "orange.400",
    title: "ノーマルモード（基本操作）",
    description:
      "Escで入る。移動・編集・コマンド実行の基本。Vimの中心となるモードです。",
  },
  insert: {
    icon: FiEdit2,
    color: "green.400",
    title: "インサートモード（テキスト入力）",
    description:
      "i/a/o等で入る。テキスト入力専用。Escでノーマルモードに戻ります。",
  },
  visual: {
    icon: FiCpu,
    color: "pink.400",
    title: "ビジュアルモード（範囲選択）",
    description:
      "v/V/Ctrl+vで入る。範囲選択・コピー・削除・インデント等に使います。Escで終了。",
  },
  practical: {
    icon: FiSearch,
    color: "purple.400",
    title: "実務で役立つコマンド（応用）",
    description: "現場でよく使う便利技。慣れてきたら活用しましょう。",
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
      bgGradient="linear(to-br, gray.900, gray.800)"
      color="white"
      borderRadius="2xl"
      boxShadow="lg"
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      borderWidth={1}
      borderColor="gray.700"
      position="relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.1) 100%)",
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
          "linear-gradient(145deg, rgba(0,0,0,0.2), rgba(255,255,255,0.05))",
        borderRadius: "calc(1rem - 1px)",
        pointerEvents: "none",
        zIndex: -1,
      }}
      _hover={{
        boxShadow: "2xl",
        transform: "translateY(-2px)",
      }}
    >
      {/* Header */}
      <MotionFlex
        align="center"
        px={6}
        py={4}
        borderBottomWidth={1}
        borderColor="orange.700"
        bgGradient="linear(to-r, orange.900, orange.800)"
        position="relative"
        variants={itemVariants}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0.05) 50%, transparent 100%)",
          pointerEvents: "none",
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
              color="orange.400"
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
          defaultValue={["basic", "navigation"]}
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
                  bgGradient={`linear(to-r, blackAlpha.700, ${catInfo.color}10)`}
                  borderRadius="lg"
                  _hover={{
                    bgGradient: `linear(to-r, blackAlpha.800, ${catInfo.color}20)`,
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  _focus={{
                    outline: "2px solid",
                    outlineColor: "secondary.400",
                    outlineOffset: "2px",
                  }}
                  py={3}
                  px={4}
                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  position="relative"
                  role="button"
                  aria-expanded="false"
                  aria-describedby={`commands-${category}`}
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${catInfo.color}10 0%, transparent 50%)`,
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
                          borderRadius="md"
                          transition="all 0.15s"
                          _hover={{ bg: "blackAlpha.400" }}
                          role="group"
                          tabIndex={0}
                          _focus={{
                            outline: "2px solid",
                            outlineColor: "secondary.400",
                            outlineOffset: "1px",
                          }}
                          cursor="pointer"
                          aria-label={`コマンド: ${item.command} - ${item.description}`}
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
      </MotionBox>

      {/* Footer */}
      <MotionFlex
        px={4}
        py={2}
        borderTopWidth={1}
        borderColor="orange.700"
        bg="blackAlpha.400"
        fontSize="xs"
        color="gray.500"
        align="center"
        justify="center"
        variants={itemVariants}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, orange.400, transparent)",
        }}
      >
        <Icon as={FiBookOpen} mr={1.5} />
        <Text>
          Vim を練習して速度と効率を向上させよう
          <br />
          <Box as="span" color="orange.300" fontWeight="bold">
            ※一部コマンドはWebエディタの仕様上未対応です、ごめんね。
          </Box>
        </Text>
      </MotionFlex>
    </MotionBox>
  );
}
