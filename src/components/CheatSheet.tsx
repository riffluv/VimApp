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
      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
      boxShadow={DESIGN_SYSTEM.shadows.xl}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor={DESIGN_SYSTEM.borders.colors.primary}
      position="relative"
      h="100%"
      w="100%"
      className="cheat-sheet-container"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.primary} 0%, ${DESIGN_SYSTEM.colors.bg.secondary} 100%)`,
        zIndex: -1,
        borderRadius: DESIGN_SYSTEM.borders.radius.lg,
      }}
    >
      {/* Elegant Header with gradient and glow */}
      <Flex
        alignItems="center"
        px={5}
        py={4}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.primary}
        bg={`linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.secondary} 0%, ${DESIGN_SYSTEM.colors.bg.tertiary} 100%)`}
        justifyContent="flex-start"
        minH="var(--header-height)"
        maxH="var(--header-height)"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${DESIGN_SYSTEM.colors.accent.primary} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${DESIGN_SYSTEM.colors.accent.primary} 50%, transparent 100%)`,
          opacity: 0.4,
        }}
      >
        <Flex alignItems="center" gap={4}>
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: "-4px",
              left: "-4px",
              right: "-4px",
              bottom: "-4px",
              background: `radial-gradient(circle, ${DESIGN_SYSTEM.colors.accent.primary}40 0%, transparent 70%)`,
              borderRadius: "50%",
            }}
          >
            <Icon
              as={FiBookOpen}
              color={DESIGN_SYSTEM.colors.accent.primary}
              fontSize="2xl"
              filter={`drop-shadow(0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}40)`}
            />
          </Box>
          <Box>
            <Text
              fontSize={DESIGN_SYSTEM.typography.fontSize.lg}
              fontWeight={DESIGN_SYSTEM.typography.fontWeight.bold}
              color={DESIGN_SYSTEM.colors.text.primary}
              letterSpacing="-0.02em"
              textShadow={`0 0 20px ${DESIGN_SYSTEM.colors.accent.primary}40`}
            >
              Vim Cheat Sheet
            </Text>
            <Flex alignItems="center" gap={2} mt={1}>
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={DESIGN_SYSTEM.colors.accent.primary}
                boxShadow={`0 0 12px ${DESIGN_SYSTEM.colors.accent.primary}, 0 0 24px ${DESIGN_SYSTEM.colors.accent.primary}40`}
                animation="pulse 2s ease-in-out infinite"
              />
              <Text
                fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                color={DESIGN_SYSTEM.colors.text.secondary}
                fontWeight={DESIGN_SYSTEM.typography.fontWeight.medium}
                letterSpacing="0.02em"
              >
                vimコマンド早見表
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      {/* Premium Command List with Seamless Accordion */}
      <Box
        overflowY="auto"
        flex={1}
        px={4}
        py={4}
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}60, ${DESIGN_SYSTEM.colors.accent.secondary}60)`,
            borderRadius: "4px",
            border: "none",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}, ${DESIGN_SYSTEM.colors.accent.secondary})`,
          },
        }}
      >
        <Accordion.Root
          multiple
          defaultValue={["0", "1", "2", "3"]}
          variant="plain"
        >
          <Stack gap={3}>
            {Object.entries(groupedCommands).map(
              ([category, commands], idx) => {
                const catInfo = CATEGORY_INFO[category as CommandCategory];
                return (
                  <Accordion.Item key={category} value={idx.toString()}>
                    <Box
                      bg={`linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.tertiary} 0%, ${DESIGN_SYSTEM.colors.bg.quaternary} 100%)`}
                      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
                      border="1px solid"
                      borderColor={DESIGN_SYSTEM.borders.colors.subtle}
                      position="relative"
                      overflow="hidden"
                      _hover={{
                        borderColor: DESIGN_SYSTEM.borders.colors.primary,
                        transform: "translateY(-1px)",
                        boxShadow: DESIGN_SYSTEM.shadows.orange,
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: `linear-gradient(90deg, transparent 0%, ${DESIGN_SYSTEM.colors.accent.primary}20 50%, transparent 100%)`,
                      }}
                    >
                      <Accordion.ItemTrigger
                        bg="transparent"
                        border="none"
                        py={4}
                        px={5}
                        _hover={{
                          bg: "transparent",
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
                          <Box
                            position="relative"
                            mr={4}
                            _before={{
                              content: '""',
                              position: "absolute",
                              top: "-3px",
                              left: "-3px",
                              right: "-3px",
                              bottom: "-3px",
                              background: `radial-gradient(circle, ${catInfo.color}30 0%, transparent 70%)`,
                              borderRadius: "50%",
                              opacity: 0.6,
                            }}
                          >
                            <Icon
                              as={catInfo.icon}
                              color={catInfo.color}
                              fontSize="xl"
                              filter={`drop-shadow(0 0 6px ${catInfo.color}40)`}
                            />
                          </Box>
                          <Text
                            fontWeight={
                              DESIGN_SYSTEM.typography.fontWeight.bold
                            }
                            color={DESIGN_SYSTEM.colors.text.primary}
                            fontSize={DESIGN_SYSTEM.typography.fontSize.base}
                            letterSpacing="-0.01em"
                          >
                            {catInfo.title}
                          </Text>
                        </Flex>
                        <Accordion.ItemIndicator
                          color={DESIGN_SYSTEM.colors.accent.primary}
                          fontSize="lg"
                          transition="transform 0.3s ease"
                          _open={{
                            transform: "rotate(180deg)",
                          }}
                        />
                      </Accordion.ItemTrigger>

                      <Accordion.ItemContent
                        pb={4}
                        pt={0}
                        px={5}
                        bg="transparent"
                      >
                        <Box
                          pt={2}
                          borderTop="1px solid"
                          borderColor={DESIGN_SYSTEM.borders.colors.subtle}
                          position="relative"
                          _before={{
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "20%",
                            right: "20%",
                            height: "1px",
                            background: `linear-gradient(90deg, transparent 0%, ${DESIGN_SYSTEM.colors.accent.primary}40 50%, transparent 100%)`,
                          }}
                        >
                          <Stack gap={2} mt={3}>
                            {commands.map((item, index) => (
                              <Flex
                                key={index}
                                py={3}
                                px={4}
                                alignItems="center"
                                borderRadius={DESIGN_SYSTEM.borders.radius.md}
                                bg={`linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.secondary}60 0%, ${DESIGN_SYSTEM.colors.bg.primary}60 100%)`}
                                border="1px solid"
                                borderColor="transparent"
                                _hover={{
                                  bg: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.secondary} 0%, ${DESIGN_SYSTEM.colors.bg.tertiary} 100%)`,
                                  borderColor:
                                    DESIGN_SYSTEM.borders.colors.primary,
                                  transform: "translateX(4px)",
                                  boxShadow: `0 4px 12px ${DESIGN_SYSTEM.colors.accent.primary}20`,
                                  _before: {
                                    opacity: 1,
                                  },
                                }}
                                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                cursor="pointer"
                                position="relative"
                                overflow="hidden"
                                _before={{
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: "3px",
                                  background: `linear-gradient(180deg, ${DESIGN_SYSTEM.colors.accent.primary} 0%, ${DESIGN_SYSTEM.colors.accent.secondary} 100%)`,
                                  opacity: 0,
                                  transition: "opacity 0.2s ease",
                                }}
                              >
                                <Box
                                  fontFamily={
                                    DESIGN_SYSTEM.typography.fonts.mono
                                  }
                                  fontWeight={
                                    DESIGN_SYSTEM.typography.fontWeight.bold
                                  }
                                  color={DESIGN_SYSTEM.colors.accent.primary}
                                  fontSize={
                                    DESIGN_SYSTEM.typography.fontSize.sm
                                  }
                                  mr={5}
                                  minW={16}
                                  textAlign="left"
                                  px={2}
                                  py={1}
                                  bg={`${DESIGN_SYSTEM.colors.accent.primary}10`}
                                  borderRadius={DESIGN_SYSTEM.borders.radius.sm}
                                  border="1px solid"
                                  borderColor={`${DESIGN_SYSTEM.colors.accent.primary}30`}
                                  textShadow={`0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}40`}
                                >
                                  {item.command}
                                </Box>
                                <Box
                                  fontSize={
                                    DESIGN_SYSTEM.typography.fontSize.sm
                                  }
                                  flex={1}
                                  color={DESIGN_SYSTEM.colors.text.secondary}
                                  textAlign="left"
                                  lineHeight="1.5"
                                  fontWeight={
                                    DESIGN_SYSTEM.typography.fontWeight.medium
                                  }
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

      {/* Elegant Footer */}
      <Flex
        px={5}
        py={4}
        borderTopWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.primary}
        bg={`linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.secondary} 0%, ${DESIGN_SYSTEM.colors.bg.tertiary} 100%)`}
        fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
        color={DESIGN_SYSTEM.colors.text.secondary}
        align="center"
        justify="center"
        minH="var(--footer-height)"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${DESIGN_SYSTEM.colors.accent.primary} 50%, transparent 100%)`,
          opacity: 0.4,
        }}
      >
        <Box
          mr={4}
          width="50px"
          height="50px"
          backgroundImage="url('/manabydash.png')"
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          flexShrink={0}
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
          borderRadius="50%"
        />
        <Icon
          as={FiBookOpen}
          mr={3}
          color={DESIGN_SYSTEM.colors.accent.primary}
          boxSize="18px"
          filter={`drop-shadow(0 0 6px ${DESIGN_SYSTEM.colors.accent.primary}40)`}
        />
        <Text
          lineHeight="1.5"
          fontWeight={DESIGN_SYSTEM.typography.fontWeight.semibold}
          letterSpacing="0.01em"
        >
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </Flex>
    </Box>
  );
}
