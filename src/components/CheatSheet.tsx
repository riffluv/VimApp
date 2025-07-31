"use client";

import { Accordion, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBookOpen, FiChevronDown } from "react-icons/fi";

import {
  ANIMATION_VARIANTS,
  CATEGORY_INFO,
  CHEAT_SHEET_COMMANDS,
  UI_STYLES,
} from "@/constants";
import type { CheatSheetProps, Command, CommandCategory } from "@/types/editor";

// Framer Motion コンポーネント
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

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
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={ANIMATION_VARIANTS.cheatSheet}
      bg="rgba(23, 25, 35, 0.95)"
      color="white"
      borderRadius="lg"
      boxShadow={UI_STYLES.shadow.glass}
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
      // 温かみのあるグラデーション背景
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
      // 2025年ベストプラクティス: スケール変更も削除、色変化のみで反応性を表現
      // 視認性を保ち、気が散らない設計
      whileHover={{
        transition: { duration: 0.15, ease: "easeOut" },
      }}
    >
      {/* Header - 高さを適切に調整 */}
      <MotionFlex
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.1,
            ...UI_STYLES.animation.easeNatural,
          },
        }}
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
        // 微細なホバー効果
        _hover={{
          bg: "rgba(45, 55, 72, 0.8)",
          transition: `background-color ${UI_STYLES.animation.transition.duration}s ease`,
        }}
      >
        <Flex alignItems="center" gap={{ base: 2, md: 3 }}>
          <MotionBox
            whileHover={{ rotate: 5, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={UI_STYLES.animation.hover}
          >
            <Icon as={FiBookOpen} color="secondary.500" fontSize="md" />
          </MotionBox>
          <Box>
            <MotionText
              fontSize="sm"
              fontWeight="600"
              color="secondary.500"
              letterSpacing="tight"
              whileHover={{
                scale: 1.02,
                transition: UI_STYLES.animation.hover,
              }}
            >
              Vim Cheat Sheet
            </MotionText>
            <Text fontSize="xs" color="gray.300" mt={0} fontWeight="400">
              vimコマンド早見表
            </Text>
          </Box>
        </Flex>
      </MotionFlex>

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
          <AnimatePresence>
            {Object.entries(groupedCommands).map(
              ([category, commands], index) => {
                const catInfo = CATEGORY_INFO[category as CommandCategory];
                return (
                  <MotionBox
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        ...UI_STYLES.animation.easeNatural,
                      },
                    }}
                    // カテゴリコンテナのスケール効果を削除（視認性重視）
                    whileHover={{
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                  >
                    <Accordion.Item value={category} border="none" mb={2}>
                      <MotionBox
                        as={Accordion.ItemTrigger}
                        bg="rgba(45, 55, 72, 0.6)"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.600"
                        py={3}
                        px={4}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        backdropFilter="blur(10px)"
                        position="relative"
                        cursor="pointer"
                        // アニメーション状態 - 最小限のフィードバック（スケール変更なし）
                        whileHover={{
                          backgroundColor: "rgba(45, 55, 72, 0.8)",
                          borderColor: UI_STYLES.colors.borderAccent,
                          boxShadow: UI_STYLES.shadow.glow,
                          transition: { duration: 0.15, ease: "easeOut" },
                        }}
                        whileTap={{
                          scale: 0.98,
                          transition: UI_STYLES.animation.tap,
                        }}
                        // グラデーション背景
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
                            boxShadow: UI_STYLES.shadow.glowMedium,
                          },
                          "&[data-state=open]::after": {
                            opacity: 0.7,
                          },
                        }}
                      >
                        <Flex align="center" flex="1" textAlign="left">
                          <MotionBox
                            whileHover={{
                              rotate: 5,
                              scale: 1.1,
                              transition: UI_STYLES.animation.hover,
                            }}
                          >
                            <Icon
                              as={catInfo.icon}
                              color={catInfo.color}
                              mr={3}
                              fontSize="lg"
                            />
                          </MotionBox>
                          <MotionText
                            fontWeight="600"
                            color="gray.100"
                            fontSize="sm"
                            whileHover={{
                              x: 2,
                              transition: UI_STYLES.animation.hover,
                            }}
                          >
                            {catInfo.title}
                          </MotionText>
                        </Flex>
                        <Accordion.ItemIndicator>
                          <MotionBox
                            whileHover={{ scale: 1.2 }}
                            transition={UI_STYLES.animation.hover}
                          >
                            <Icon
                              as={FiChevronDown}
                              color="gray.300"
                              transition="transform 0.2s"
                              _open={{ transform: "rotate(180deg)" }}
                            />
                          </MotionBox>
                        </Accordion.ItemIndicator>
                      </MotionBox>
                      <Accordion.ItemContent>
                        <Accordion.ItemBody pb={2} pt={2} px={1}>
                          <Stack gap={1} align="stretch">
                            {commands.map((item, itemIndex) => (
                              <MotionFlex
                                key={itemIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                  transition: {
                                    delay: itemIndex * 0.03,
                                    ...UI_STYLES.animation.easeNatural,
                                  },
                                }}
                                py={1.5}
                                px={3}
                                alignItems="center"
                                borderRadius="md"
                                cursor="pointer"
                                position="relative"
                                // ホバー時のマイクロインタラクション
                                whileHover={{
                                  x: 6,
                                  scale: 1.02,
                                  backgroundColor: "rgba(45, 55, 72, 0.4)",
                                  boxShadow: UI_STYLES.shadow.glow,
                                  transition: UI_STYLES.animation.hover,
                                }}
                                whileTap={{
                                  scale: 0.98,
                                  x: 3,
                                  transition: UI_STYLES.animation.tap,
                                }}
                                // 左側のアクセントライン
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
                                  transition: "height 0.3s ease",
                                }}
                                css={{
                                  "&:hover::before": {
                                    height: "60%",
                                  },
                                }}
                              >
                                <MotionBox
                                  fontFamily="'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
                                  fontWeight="600"
                                  color="secondary.500"
                                  fontSize="sm"
                                  mr={4}
                                  minW={14}
                                  textAlign="left"
                                  whileHover={{
                                    scale: 1.05,
                                    color: "#f39c3d",
                                    transition: UI_STYLES.animation.hover,
                                  }}
                                >
                                  {item.command}
                                </MotionBox>
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
                              </MotionFlex>
                            ))}
                          </Stack>
                        </Accordion.ItemBody>
                      </Accordion.ItemContent>
                    </Accordion.Item>
                  </MotionBox>
                );
              }
            )}
          </AnimatePresence>
        </Accordion.Root>
      </Box>

      {/* Footer - manabydash.pngキャラクター付き */}
      <MotionFlex
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3,
            ...UI_STYLES.animation.easeNatural,
          },
        }}
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
        // 微細なホバー効果
        whileHover={{
          backgroundColor: "rgba(45, 55, 72, 0.8)",
          transition: UI_STYLES.animation.hover,
        }}
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
        <MotionBox
          mr={3}
          width="60px"
          height="60px"
          backgroundImage="url('/manabydash.png')"
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          backgroundPosition="center"
          flexShrink={0}
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: UI_STYLES.animation.hover,
          }}
          whileTap={{
            scale: 0.9,
            transition: UI_STYLES.animation.tap,
          }}
        />
        <MotionBox
          whileHover={{ scale: 1.02 }}
          transition={UI_STYLES.animation.hover}
        >
          <Icon as={FiBookOpen} mr={2} color="secondary.500" boxSize="16px" />
        </MotionBox>
        <Text lineHeight="1.4" fontWeight="500">
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </MotionFlex>
    </MotionBox>
  );
}
