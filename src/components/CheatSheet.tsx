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
      // 2025年最新：Framer Motion最適化
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      bg={DESIGN_SYSTEM.colors.bg.primary}
      color={DESIGN_SYSTEM.colors.text.primary}
      borderRadius={DESIGN_SYSTEM.borders.radius.lg}
      boxShadow={DESIGN_SYSTEM.shadows.glass.strong}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor={DESIGN_SYSTEM.borders.colors.secondary}
      position="relative"
      backdropFilter="blur(20px)"
      h="100%" // 親の高さに合わせる
      w="100%" // 親の幅に合わせる
      borderWidth="1px"
      // 2025年最新：CSS Isolation + Container Query + GPU最適化
      isolation="isolate"
      className="cheat-sheet-container"
      containerType="inline-size"
      containerName="cheat-sheet"
      contain="layout style paint"
      willChange="transform"
      transform="translateZ(0)"
      // アクセシビリティ強化
      role="complementary"
      aria-label="Vimコマンドチートシート"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "inherit",
        bg: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}04 0%, transparent 50%, ${DESIGN_SYSTEM.colors.accent.primary}02 100%)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
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
            background: `linear-gradient(180deg, ${DESIGN_SYSTEM.colors.accent.primary}80, ${DESIGN_SYSTEM.colors.accent.primary}60)`,
            borderRadius: "4px",
            border: `1px solid ${DESIGN_SYSTEM.borders.colors.primary}`,
            transition: `all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: `linear-gradient(180deg, ${DESIGN_SYSTEM.colors.accent.primary}90, ${DESIGN_SYSTEM.colors.accent.primary}70)`,
            borderColor: DESIGN_SYSTEM.borders.colors.strong,
            boxShadow: `0 0 8px ${DESIGN_SYSTEM.colors.accent.primary}30`,
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
                    transform: "translateY(-1px) scale(1.02)",
                    boxShadow: `0 6px 20px ${DESIGN_SYSTEM.colors.accent.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                  _active={{
                    transform: "translateY(0) scale(0.98)",
                    transition: `transform ${DESIGN_SYSTEM.animation.duration.fastest} ${DESIGN_SYSTEM.animation.easing.easeIn}`,
                  }}
                  py={DESIGN_SYSTEM.spacing["3"]}
                  px={DESIGN_SYSTEM.spacing["4"]}
                  transition={`all ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easing.easeInOut}`}
                  backdropFilter="blur(10px)"
                  position="relative"
                  isolation="isolate"
                  willChange="transform, opacity, background-color"
                  transform="translateZ(0)"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "inherit",
                    bg: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}04, transparent)`,
                    pointerEvents: "none",
                    opacity: 1,
                    transition: `opacity ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
                  }}
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "inherit",
                    bg: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}15, ${DESIGN_SYSTEM.colors.accent.primary}05)`,
                    pointerEvents: "none",
                    opacity: 0,
                    transition: `opacity ${DESIGN_SYSTEM.animation.duration.normal} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
                  }}
                  css={{
                    "&:hover::after": {
                      opacity: 1,
                    },
                    "&[data-state=open]": {
                      background: `${DESIGN_SYSTEM.colors.accent.primary}10`,
                      borderColor: `${DESIGN_SYSTEM.colors.accent.primary}80`,
                      boxShadow: `0 4px 12px ${DESIGN_SYSTEM.colors.accent.primary}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
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
                            transform: "translateX(4px) scale(1.01)",
                            boxShadow: `0 2px 8px ${DESIGN_SYSTEM.colors.accent.primary}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                          }}
                          _active={{
                            transform: "translateX(2px) scale(0.99)",
                          }}
                          transition={`all ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeInOut}`}
                          cursor="pointer"
                          position="relative"
                          willChange="transform"
                          isolation="isolate"
                          _before={{
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "2px",
                            height: "0",
                            bg: DESIGN_SYSTEM.colors.accent.secondary,
                            borderRadius: "1px",
                            transition: `height ${DESIGN_SYSTEM.animation.duration.fast} ${DESIGN_SYSTEM.animation.easing.easeOut}`,
                          }}
                          css={{
                            "&:hover::before": {
                              height: "60%",
                            },
                          }}
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
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          bgGradient: `linear(to-r, transparent, ${DESIGN_SYSTEM.colors.accent.secondary}, transparent)`,
        }}
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
