"use client";

import {
  Accordion,
  Box,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiBookOpen, FiChevronDown } from "react-icons/fi";

import { CATEGORY_INFO, CHEAT_SHEET_COMMANDS } from "@/constants";
import type { CheatSheetProps, Command, CommandCategory } from "@/types/editor";

// Group commands by category
const groupedCommands = CHEAT_SHEET_COMMANDS.reduce((acc, command) => {
  if (!acc[command.category]) {
    acc[command.category] = [];
  }
  acc[command.category].push(command);
  return acc;
}, {} as Record<CommandCategory, Command[]>);

export default function CheatSheet({}: CheatSheetProps) {
  return (
    <Box
      bg="rgba(23, 25, 35, 0.95)"
      color="white"
      borderRadius="lg"
      boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor="rgba(255, 152, 0, 0.2)"
      position="relative"
      backdropFilter="blur(20px)"
      // VimEditorと統一された高さ設定
      minH={{
        base: "clamp(370px, 38vh, 500px)",
        md: "clamp(480px, 45vh, 650px)",
        lg: "clamp(540px, 50vh, 700px)",
      }}
      maxH={{
        base: "clamp(600px, 62vh, 800px)",
        md: "clamp(780px, 72vh, 1050px)",
        lg: "clamp(900px, 81vh, 1200px)",
      }}
      h={{
        base: "clamp(460px, 42vh, 618px)",
        md: "clamp(618px, 56vh, 1000px)",
        lg: "clamp(700px, 62vh, 1120px)",
      }}
      borderWidth="1px"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "inherit",
        bg: "linear-gradient(135deg, rgba(255,152,0,0.03) 0%, transparent 50%, rgba(255,152,0,0.01) 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Header - VimEditorと統一されたデザイン */}
      <Flex
        alignItems="center"
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
        borderBottomWidth="clamp(1px, 0.0625rem, 2px)"
        borderColor="gray.700"
        bg="gray.800"
        justifyContent="flex-start"
        position="relative"
        minH="clamp(56px, 3.5rem, 64px)"
        zIndex={1}
      >
        <Flex alignItems="center" gap={{ base: 2, md: 3 }}>
          {/* Window Controls - VimEditorと同じスタイル */}
          <HStack gap="clamp(6px, 0.375rem, 8px)">
            <Box
              w="clamp(10px, 0.625rem, 14px)"
              h="clamp(10px, 0.625rem, 14px)"
              borderRadius="full"
              bg="red.400"
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.2s ease"
              cursor="pointer"
              minW="clamp(10px, 0.625rem, 14px)"
              minH="clamp(10px, 0.625rem, 14px)"
            />
            <Box
              w="clamp(10px, 0.625rem, 14px)"
              h="clamp(10px, 0.625rem, 14px)"
              borderRadius="full"
              bg="yellow.400"
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.2s ease"
              cursor="pointer"
              minW="clamp(10px, 0.625rem, 14px)"
              minH="clamp(10px, 0.625rem, 14px)"
            />
            <Box
              w="clamp(10px, 0.625rem, 14px)"
              h="clamp(10px, 0.625rem, 14px)"
              borderRadius="full"
              bg="green.400"
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.2s ease"
              cursor="pointer"
              minW="clamp(10px, 0.625rem, 14px)"
              minH="clamp(10px, 0.625rem, 14px)"
            />
          </HStack>

          {/* アイコンとタイトル - VimEditorのスタイルに合わせる */}
          <Flex alignItems="center" gap={3}>
            <Icon as={FiBookOpen} color="orange.400" fontSize="lg" />
            <Box>
              <Text
                fontSize="md"
                fontWeight="600"
                color="orange.300"
                letterSpacing="tight"
              >
                Vim Cheat Sheet
              </Text>
              <Text fontSize="xs" color="gray.400" mt={0.5} fontWeight="400">
                vimコマンド早見表
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* Command List (Accordion) - VimEditorと統一されたパディング */}
      <Box
        overflowY="auto"
        flex={1}
        px={3}
        py={3}
        position="relative"
        zIndex={1}
        css={{
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": {
            background: "rgba(24, 24, 27, 0.8)",
            borderRadius: "4px",
            border: "1px solid rgba(255, 152, 0, 0.1)",
          },
          "&::-webkit-scrollbar-thumb": {
            background:
              "linear-gradient(180deg, rgba(255, 152, 0, 0.8), rgba(255, 152, 0, 0.6))",
            borderRadius: "4px",
            border: "1px solid rgba(255, 152, 0, 0.3)",
            transition: "all 0.2s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background:
              "linear-gradient(180deg, rgba(255, 152, 0, 0.9), rgba(255, 152, 0, 0.7))",
            borderColor: "rgba(255, 152, 0, 0.5)",
            boxShadow: "0 0 8px rgba(255, 152, 0, 0.3)",
          },
        }}
      >
        <Accordion.Root multiple defaultValue={["basic", "movement"]}>
          {Object.entries(groupedCommands).map(([category, commands]) => {
            const catInfo = CATEGORY_INFO[category as CommandCategory];
            return (
              <Accordion.Item
                key={category}
                value={category}
                border="none"
                mb={2}
              >
                <Accordion.ItemTrigger
                  bg="rgba(45, 55, 72, 0.6)"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.600"
                  _hover={{
                    bg: "rgba(45, 55, 72, 0.8)",
                    borderColor: "orange.400",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.15)",
                  }}
                  py={3}
                  px={4}
                  transition="all 0.3s ease"
                  backdropFilter="blur(10px)"
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "inherit",
                    bg: "linear-gradient(135deg, rgba(255,152,0,0.03), transparent)",
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
                    <Text fontWeight="600" color="gray.100" fontSize="sm">
                      {catInfo.title}
                    </Text>
                  </Flex>
                  <Accordion.ItemIndicator>
                    <Icon
                      as={FiChevronDown}
                      color="gray.300"
                      transition="transform 0.2s"
                      _open={{ transform: "rotate(180deg)" }}
                    />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody pb={2} pt={2} px={1}>
                    <Stack gap={1} align="stretch">
                      {commands.map((item, index) => (
                        <Flex
                          key={index}
                          py={3}
                          px={4}
                          alignItems="center"
                          borderRadius="md"
                          _hover={{
                            bg: "rgba(45, 55, 72, 0.4)",
                            borderLeft: "3px solid",
                            borderLeftColor: "orange.400",
                            transform: "translateX(2px)",
                            boxShadow: "0 2px 8px rgba(255, 152, 0, 0.1)",
                          }}
                          transition="all 0.2s ease"
                          cursor="pointer"
                        >
                          <Box
                            fontFamily="'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
                            fontWeight="500"
                            color="orange.400"
                            fontSize="sm"
                            mr={4}
                            minW={20}
                            textAlign="left"
                            bg="rgba(45, 55, 72, 0.8)" // VimEditorのCodeMirror背景色と統一
                            px={3}
                            py={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.600"
                            backdropFilter="blur(10px)"
                            position="relative"
                            _before={{
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: "inherit",
                              bg: "linear-gradient(135deg, rgba(255,152,0,0.05), transparent)",
                              pointerEvents: "none",
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
                            lineHeight="1.5"
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

      {/* Footer - VimEditorと統一されたスタイル */}
      <Flex
        px={4}
        py={3}
        borderTopWidth={1}
        borderColor="gray.700"
        bg="gray.800"
        fontSize="xs"
        color="gray.400"
        align="center"
        justify="center"
        position="relative"
        zIndex={1}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          bgGradient: "linear(to-r, transparent, orange.500, transparent)",
        }}
      >
        <Icon as={FiBookOpen} mr={2} color="orange.400" boxSize="16px" />
        <Text lineHeight="1.4" fontWeight="500">
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </Flex>
    </Box>
  );
}
