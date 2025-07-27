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

export default function CheatSheet({ }: CheatSheetProps) {
  return (
    <Box
      p={0}
      bg="gray.900"
      color="white"
      borderRadius="lg"
      boxShadow="md"
      minH={{ base: "400px", md: "520px", lg: "600px" }}
      maxH={{ base: "520px", md: "640px", lg: "700px" }}
      h={{ base: "440px", md: "600px", lg: "680px" }}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.700"
      position="relative"
    >
      {/* Header */}
      <Flex
        align="center"
        px={4}
        py={3}
        borderBottomWidth={1}
        borderColor="gray.700"
        bg="gray.800"
        position="relative"
      >
        <Flex align="center" gap={3}>
          <Image
            src="/manabyicon.png"
            alt="manaby icon"
            h={8}
            minW={8}
            objectFit="contain"
          />
          <Flex direction="column">
            <Heading
              as="h2"
              size="md"
              color="orange.300"
              fontWeight="600"
              letterSpacing="tight"
            >
              Vim Cheat Sheet
            </Heading>
            <Text color="gray.400" fontSize="xs" mt={0.5} fontWeight="400">
              vimコマンド早見表
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Command List (Accordion) */}
      <Box
        overflowY="auto"
        flex={1}
        p={2}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: "orange",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-track": {
            background: "gray.600",
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
                  bg="gray.700"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.600"
                  _hover={{
                    bg: "gray.600",
                  }}
                  py={2}
                  px={3}
                >
                  <Flex align="center" flex="1" textAlign="left">
                    <Icon
                      as={catInfo.icon}
                      color={catInfo.color}
                      mr={3}
                      fontSize="lg"
                    />
                    <Text fontWeight="600" color="gray.100">
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
                          py={2}
                          px={3}
                          alignItems="center"
                          borderRadius="md"
                          _hover={{
                            bg: "gray.700",
                          }}
                        >
                          <Box
                            fontFamily="monospace"
                            fontWeight="500"
                            color="orange.400"
                            fontSize="sm"
                            mr={4}
                            minW={20}
                            textAlign="left"
                            bg="gray.800"
                            px={2}
                            py={1}
                            borderRadius="sm"
                          >
                            {item.command}
                          </Box>
                          <Box
                            fontSize="sm"
                            flex={1}
                            color="gray.300"
                            fontWeight="400"
                            textAlign="left"
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
        py={2}
        borderTopWidth={1}
        borderColor="gray.700"
        bg="gray.800"
        fontSize="xs"
        color="gray.400"
        align="center"
        justify="center"
      >
        <Icon as={FiBookOpen} mr={2} color="orange.400" boxSize="16px" />
        <Text lineHeight="1.4">
          基本操作から始めて、段階的にスキルアップしよう！
        </Text>
      </Flex>
    </Box>
  );
}
