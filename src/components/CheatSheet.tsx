"use client";

import { Accordion, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FiBookOpen } from "react-icons/fi";

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
      borderRadius={DESIGN_SYSTEM.borders.radius.md}
      border="1px solid"
      borderColor={DESIGN_SYSTEM.borders.colors.secondary}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      h="100%"
      w="100%"
      className="cheat-sheet-container"
    >
      {/* Simple Clean Header */}
      <Flex
        alignItems="center"
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.secondary}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        justifyContent="flex-start"
        minH="var(--header-height)"
        maxH="var(--header-height)"
      >
        <Flex alignItems="center" gap={3}>
          <Icon
            as={FiBookOpen}
            color={DESIGN_SYSTEM.colors.accent.primary}
            fontSize="lg"
          />
          <Box>
            <Text
              fontSize={DESIGN_SYSTEM.typography.fontSize.base}
              fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
              color={DESIGN_SYSTEM.colors.text.primary}
            >
              Vim Cheat Sheet
            </Text>
            <Text
              fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
              color={DESIGN_SYSTEM.colors.text.secondary}
              fontWeight={DESIGN_SYSTEM.typography.fontWeight.medium}
            >
              vimコマンド早見表
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Clean Command List */}
      <Box
        overflowY="auto"
        flex={1}
        px={4}
        py={3}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: DESIGN_SYSTEM.colors.accent.primary,
            borderRadius: "3px",
          },
        }}
      >
        <Accordion.Root
          multiple
          defaultValue={["0", "1", "2", "3"]}
          variant="plain"
        >
          <Stack gap={2}>
            {Object.entries(groupedCommands).map(
              ([category, commands], idx) => {
                const catInfo = CATEGORY_INFO[category as CommandCategory];
                return (
                  <Accordion.Item key={category} value={idx.toString()}>
                    <Box
                      bg={DESIGN_SYSTEM.colors.bg.secondary}
                      borderRadius={DESIGN_SYSTEM.borders.radius.md}
                      border="1px solid"
                      borderColor={DESIGN_SYSTEM.borders.colors.subtle}
                      overflow="hidden"
                    >
                      <Accordion.ItemTrigger
                        bg="transparent"
                        border="none"
                        py={3}
                        px={4}
                        _hover={{
                          bg: DESIGN_SYSTEM.colors.bg.tertiary,
                        }}
                        _focus={{
                          bg: "transparent",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        cursor="pointer"
                        w="100%"
                      >
                        <Flex align="center" flex="1" textAlign="left">
                          <Icon
                            as={catInfo.icon}
                            color={catInfo.color}
                            fontSize="md"
                            mr={3}
                          />
                          <Text
                            fontWeight={
                              DESIGN_SYSTEM.typography.fontWeight.semibold
                            }
                            color={DESIGN_SYSTEM.colors.text.primary}
                            fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                          >
                            {catInfo.title}
                          </Text>
                        </Flex>
                        <Accordion.ItemIndicator
                          color={DESIGN_SYSTEM.colors.text.secondary}
                          fontSize="sm"
                          _open={{
                            transform: "rotate(180deg)",
                          }}
                        />
                      </Accordion.ItemTrigger>

                      <Accordion.ItemContent
                        pb={3}
                        pt={0}
                        px={4}
                        bg="transparent"
                      >
                        <Box
                          pt={2}
                          borderTop="1px solid"
                          borderColor={DESIGN_SYSTEM.borders.colors.subtle}
                        >
                          <Stack gap={2} mt={2}>
                            {commands.map((item, index) => (
                              <Flex
                                key={index}
                                py={2}
                                px={3}
                                alignItems="center"
                                borderRadius={DESIGN_SYSTEM.borders.radius.sm}
                                _hover={{
                                  bg: DESIGN_SYSTEM.colors.bg.tertiary,
                                }}
                                cursor="pointer"
                              >
                                <Box
                                  fontFamily={
                                    DESIGN_SYSTEM.typography.fonts.mono
                                  }
                                  fontWeight={
                                    DESIGN_SYSTEM.typography.fontWeight.semibold
                                  }
                                  color={DESIGN_SYSTEM.colors.accent.primary}
                                  fontSize={
                                    DESIGN_SYSTEM.typography.fontSize.xs
                                  }
                                  mr={4}
                                  minW={14}
                                  textAlign="left"
                                  px={2}
                                  py={1}
                                  bg={DESIGN_SYSTEM.colors.bg.tertiary}
                                  borderRadius={DESIGN_SYSTEM.borders.radius.sm}
                                >
                                  {item.command}
                                </Box>
                                <Box
                                  fontSize={
                                    DESIGN_SYSTEM.typography.fontSize.xs
                                  }
                                  flex={1}
                                  color={DESIGN_SYSTEM.colors.text.secondary}
                                  textAlign="left"
                                  lineHeight="1.4"
                                >
                                  {item.description}
                                </Box>
                              </Flex>
                            ))}
                          </Stack>
                        </Box>
                      </Accordion.ItemContent>
                    </Box>
                  </Accordion.Item>
                );
              }
            )}
          </Stack>
        </Accordion.Root>
      </Box>

      {/* Simple Footer */}
      <Flex
        px={4}
        py={3}
        borderTopWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.secondary}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
        color={DESIGN_SYSTEM.colors.text.secondary}
        align="center"
        justify="center"
        minH="var(--footer-height)"
      >
        <Box
          mr={3}
          width="40px"
          height="40px"
          backgroundImage="url('/manabydash.png')"
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          flexShrink={0}
          borderRadius="50%"
        />
        <Icon
          as={FiBookOpen}
          mr={2}
          color={DESIGN_SYSTEM.colors.accent.primary}
          boxSize="14px"
        />
        <Text lineHeight="1.4">
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </Flex>
    </Box>
  );
}
