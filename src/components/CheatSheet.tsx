"use client";

import { Accordion, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
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
      boxShadow="glass-premium"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor="rgba(255, 140, 66, 0.2)"
      position="relative"
      backdropFilter="blur(20px)"
      h="100%" // 親の高さに合わせる
      w="100%" // 親の幅に合わせる
      borderWidth="1px"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "inherit",
        bg: "linear-gradient(135deg, rgba(255,140,66,0.04) 0%, transparent 50%, rgba(255,140,66,0.02) 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Header - 高さを適切に調整 */}
      <Flex
        alignItems="center"
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
        borderBottomWidth="1px"
        borderColor="gray.700"
        bg="gray.800"
        justifyContent="flex-start"
        position="relative"
        minH="60px" // 固定の高さ
        maxH="60px" // 固定の高さ
        zIndex={1}
      >
        <Flex alignItems="center" gap={{ base: 2, md: 3 }}>
          <Icon as={FiBookOpen} color="secondary.500" fontSize="md" />
          <Box>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="secondary.500"
              letterSpacing="tight"
            >
              Vim Cheat Sheet
            </Text>
            <Text fontSize="xs" color="gray.300" mt={0} fontWeight="400">
              vimコマンド早見表
            </Text>
          </Box>
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
                    borderColor: "secondary.400",
                    transform: "translateY(-1px) scale(1.02)",
                    boxShadow:
                      "0 6px 20px rgba(232, 131, 58, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  _active={{
                    transform: "translateY(0) scale(0.98)",
                    transition: "transform 0.1s ease",
                  }}
                  py={3}
                  px={4}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
                    bg: "linear-gradient(135deg, rgba(255,140,66,0.04), transparent)",
                    pointerEvents: "none",
                    opacity: 1,
                    transition: "opacity 0.3s ease",
                  }}
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "inherit",
                    bg: "linear-gradient(135deg, rgba(232,131,58,0.15), rgba(232,131,58,0.05))",
                    pointerEvents: "none",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                  css={{
                    "&:hover::after": {
                      opacity: 1,
                    },
                    "&[data-state=open]": {
                      background: "rgba(232, 131, 58, 0.1)",
                      borderColor: "rgba(232, 131, 58, 0.8)",
                      boxShadow:
                        "0 4px 12px rgba(232, 131, 58, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                    },
                    "&[data-state=open]::after": {
                      opacity: 0.7,
                    },
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
                          py={1.5}
                          px={3}
                          alignItems="center"
                          borderRadius="md"
                          _hover={{
                            bg: "rgba(45, 55, 72, 0.3)",
                            transform: "translateX(4px) scale(1.01)",
                            boxShadow:
                              "0 2px 8px rgba(232, 131, 58, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                          }}
                          _active={{
                            transform: "translateX(2px) scale(0.99)",
                          }}
                          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                          cursor="pointer"
                          position="relative"
                          _before={{
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "2px",
                            height: "0",
                            bg: "secondary.400",
                            borderRadius: "1px",
                            transition: "height 0.2s ease",
                          }}
                          css={{
                            "&:hover::before": {
                              height: "60%",
                            },
                          }}
                        >
                          <Box
                            fontFamily="'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
                            fontWeight="600"
                            color="secondary.500"
                            fontSize="sm"
                            mr={4}
                            minW={14}
                            textAlign="left"
                          >
                            {item.command}
                          </Box>
                          <Box
                            fontSize="sm"
                            flex={1}
                            color="gray.300"
                            fontWeight="400"
                            textAlign="left"
                            lineHeight="1.4"
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

      {/* Footer - manabydash.pngキャラクター付き */}
      <Flex
        px={4}
        py={4} // 高さを少し増やす
        borderTopWidth={1}
        borderColor="gray.700"
        bg="gray.800"
        fontSize="xs"
        color="gray.400"
        align="center"
        justify="center"
        position="relative"
        zIndex={1}
        minH="64px" // 最小高さを設定してキャラクターが見やすく
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
        {/* manabydash.pngキャラクター */}
        <Box
          mr={3}
          width="60px"
          height="60px"
          backgroundImage="url('/manabydash.png')"
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          flexShrink={0}
        />
        <Icon as={FiBookOpen} mr={2} color="secondary.500" boxSize="16px" />
        <Text lineHeight="1.4" fontWeight="500">
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </Flex>
    </Box>
  );
}
