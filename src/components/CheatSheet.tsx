"use client";

import { Accordion, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiBookOpen, FiChevronDown } from "react-icons/fi";

import {
  CATEGORY_INFO,
  CHEAT_SHEET_COMMANDS,
  DESIGN_SYSTEM,
} from "@/constants";
import type { CheatSheetProps, Command, CommandCategory } from "@/types/editor";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

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
    <MotionBox
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
      borderWidth="1px"
      isolation="isolate"
      className="cheat-sheet-container"
      containerType="inline-size"
      containerName="cheat-sheet"
      contain="layout style paint"
      willChange="transform"
      role="complementary"
      aria-label="Vimコマンドチートシート"
    >
      {/* Header - 高さを適切に調整 */}
      <MotionFlex
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        alignItems="center"
        px={{
          base: DESIGN_SYSTEM.spacing["3"],
          md: DESIGN_SYSTEM.spacing["4"],
        }}
        py={{
          base: DESIGN_SYSTEM.spacing["2"],
          md: DESIGN_SYSTEM.spacing["3"],
        }}
        borderBottomWidth="1px"
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        justifyContent="flex-start"
        position="relative"
        minH="60px" // 固定の高さ
        maxH="60px" // 固定の高さ
        zIndex={1}
        isolation="isolate"
        // 2025年最新：Container Query対応
        containerType="inline-size"
      >
        <Flex
          alignItems="center"
          gap={{
            base: DESIGN_SYSTEM.spacing["2"],
            md: DESIGN_SYSTEM.spacing["3"],
          }}
        >
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
              letterSpacing="tight"
            >
              Vim Cheat Sheet
            </Text>
            <Text
              fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
              color={DESIGN_SYSTEM.colors.text.tertiary}
              mt={0}
              fontWeight={DESIGN_SYSTEM.typography.fontWeight.normal}
            >
              vimコマンド早見表
            </Text>
          </Box>
        </Flex>
      </MotionFlex>

      {/* Command List (Accordion) - VimEditorと統一されたパディング */}
      <Box
        overflowY="auto"
        flex={1}
        px={DESIGN_SYSTEM.spacing["3"]}
        py={DESIGN_SYSTEM.spacing["3"]}
        position="relative"
        zIndex={1}
        isolation="isolate"
        css={{
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": {
            background: DESIGN_SYSTEM.colors.bg.tertiary,
            borderRadius: "4px",
            border: `1px solid ${DESIGN_SYSTEM.borders.colors.subtle}`,
          },
          "&::-webkit-scrollbar-thumb": {
            background: DESIGN_SYSTEM.colors.bg.secondary,
            borderRadius: "4px",
            border: `1px solid ${DESIGN_SYSTEM.borders.colors.primary}`,
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
                    bg: DESIGN_SYSTEM.colors.bg.surface,
                    borderColor: DESIGN_SYSTEM.borders.colors.secondary,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  _active={{
                    bg: DESIGN_SYSTEM.colors.bg.tertiary,
                  }}
                  py={DESIGN_SYSTEM.spacing["3"]}
                  px={DESIGN_SYSTEM.spacing["4"]}
                  transition="all 0.2s cubic-bezier(0.4,0,0.2,1)"
                  position="relative"
                  isolation="isolate"
                >
                  <Flex align="center" flex="1" textAlign="left">
                    <Icon
                      as={catInfo.icon}
                      color={catInfo.color}
                      mr={DESIGN_SYSTEM.spacing["3"]}
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
                      transition={`transform ${DESIGN_SYSTEM.animation.duration.fast}`}
                      _open={{ transform: "rotate(180deg)" }}
                    />
                  </Accordion.ItemIndicator>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody
                    pb={DESIGN_SYSTEM.spacing["2"]}
                    pt={DESIGN_SYSTEM.spacing["2"]}
                    px={DESIGN_SYSTEM.spacing["1"]}
                  >
                    <Stack gap={DESIGN_SYSTEM.spacing["1"]} align="stretch">
                      {commands.map((item, index) => (
                        <Flex
                          key={index}
                          py="6px"
                          px={DESIGN_SYSTEM.spacing["3"]}
                          alignItems="center"
                          borderRadius={DESIGN_SYSTEM.borders.radius.md}
                          _hover={{
                            bg: DESIGN_SYSTEM.colors.bg.surface,
                          }}
                          _active={{
                            bg: DESIGN_SYSTEM.colors.bg.tertiary,
                          }}
                          transition={`all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`}
                          cursor="pointer"
                          position="relative"
                          willChange="transform"
                          isolation="isolate"
                          // 装飾線も廃止
                        >
                          <Box
                            fontFamily={DESIGN_SYSTEM.typography.fonts.mono}
                            fontWeight={
                              DESIGN_SYSTEM.typography.fontWeight.semibold
                            }
                            color={DESIGN_SYSTEM.colors.accent.secondary}
                            fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                            mr={DESIGN_SYSTEM.spacing["4"]}
                            minW={14}
                            textAlign="left"
                          >
                            {item.command}
                          </Box>
                          <Box
                            fontSize={DESIGN_SYSTEM.typography.fontSize.sm}
                            flex={1}
                            color={DESIGN_SYSTEM.colors.text.tertiary}
                            fontWeight={
                              DESIGN_SYSTEM.typography.fontWeight.normal
                            }
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
        px={DESIGN_SYSTEM.spacing["4"]}
        py={DESIGN_SYSTEM.spacing["4"]} // 高さを少し増やす
        borderTopWidth={1}
        borderColor={DESIGN_SYSTEM.borders.colors.subtle}
        bg={DESIGN_SYSTEM.colors.bg.secondary}
        fontSize={DESIGN_SYSTEM.typography.fontSize.xs}
        color={DESIGN_SYSTEM.colors.text.muted}
        align="center"
        justify="center"
        position="relative"
        zIndex={1}
        minH="64px" // 最小高さを設定してキャラクターが見やすく
        isolation="isolate"
        // フッターの装飾線も廃止
      >
        {/* manabydash.pngキャラクター */}
        <Box
          mr={DESIGN_SYSTEM.spacing["3"]}
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
          mr={DESIGN_SYSTEM.spacing["2"]}
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
    </MotionBox>
  );
}
