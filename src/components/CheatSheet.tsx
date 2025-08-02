"use client";

import { Accordion, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FiBookOpen, FiChevronDown } from "react-icons/fi";

import {
  CATEGORY_INFO,
  CHEAT_SHEET_COMMANDS,
  DESIGN_SYSTEM,
} from "../constants";
import type {
  CheatSheetProps,
  Command,
  CommandCategory,
} from "../types/editor";

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
      bg={DESIGN_SYSTEM.colors.bg.primary}
      color={DESIGN_SYSTEM.colors.text.primary}
      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
      boxShadow="0 2px 8px rgba(0,0,0,0.08)"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor={DESIGN_SYSTEM.borders.colors.secondary}
      position="relative"
      h="100%"
      w="100%"
      className="cheat-sheet-container"
    >
      {/* Header */}
      <Flex
        alignItems="center"
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        justifyContent="flex-start"
        minH="60px"
        maxH="60px"
      >
        <Flex alignItems="center" gap={3}>
          <Icon
            as={FiBookOpen}
            color={DESIGN_SYSTEM.colors.accent.secondary}
            fontSize="md"
          />
          <Box>
            <Text
              fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
              fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
              color={DESIGN_SYSTEM.colors.accent.secondary}
            >
              Vim Cheat Sheet
            </Text>
            <Text
              fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
              color={DESIGN_SYSTEM.colors.text.tertiary}
              mt={0}
            >
              vimコマンド早見表
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Command List (Accordion) */}
      <Box
        overflowY="auto"
        flex={1}
        px={3}
        py={3}
        css={{
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": {
            background: "#1a1a1e",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(232, 131, 58, 0.6)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(232, 131, 58, 0.8)",
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
                  bg={DESIGN_SYSTEM.colors.bg.tertiary}
                  borderRadius={DESIGN_SYSTEM.borders.radius.md}
                  border="1px solid"
                  borderColor={DESIGN_SYSTEM.borders.colors.subtle}
                  _hover={{
                    bg: DESIGN_SYSTEM.colors.bg.secondary,
                    borderColor: DESIGN_SYSTEM.borders.colors.secondary,
                  }}
                  py={3}
                  px={4}
                  transition="all 0.2s ease"
                >
                  <Flex align="center" flex="1" textAlign="left">
                    <Icon
                      as={catInfo.icon}
                      color={catInfo.color}
                      mr={3}
                      fontSize="lg"
                    />
                    <Text
                      fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
                      color={DESIGN_SYSTEM.colors.text.secondary}
                      fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                    >
                      {catInfo.title}
                    </Text>
                  </Flex>
                  <Accordion.ItemIndicator>
                    <Icon
                      as={FiChevronDown}
                      color={DESIGN_SYSTEM.colors.text.tertiary}
                      transition="transform 0.2s ease"
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
                          py="6px"
                          px={3}
                          alignItems="center"
                          borderRadius={DESIGN_SYSTEM.borders.radius.md}
                          _hover={{
                            bg: DESIGN_SYSTEM.colors.bg.secondary,
                          }}
                          transition="all 0.2s ease"
                          cursor="pointer"
                        >
                          <Box
                            fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
                            fontWeight={
                              DESIGN_SYSTEM.typography.fontWeight.semibold
                            }
                            color={DESIGN_SYSTEM.colors.accent.secondary}
                            fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                            mr={4}
                            minW={14}
                            textAlign="left"
                          >
                            {item.command}
                          </Box>
                          <Box
                            fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                            flex={1}
                            color={DESIGN_SYSTEM.colors.text.tertiary}
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

      {/* Footer */}
      <Flex
        px={4}
        py={4}
        borderTopWidth={1}
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
        color={DESIGN_SYSTEM.colors.text.muted}
        align="center"
        justify="center"
        minH="64px"
      >
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
        <Icon
          as={FiBookOpen}
          mr={2}
          color={DESIGN_SYSTEM.colors.accent.secondary}
          boxSize="16px"
        />
        <Text
          lineHeight="1.4"
          fontWeight={DESIGN_SYSTEM.typography.fontWeight.medium}
        >
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </Flex>
    </Box>
  );
}
