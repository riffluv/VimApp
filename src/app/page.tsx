"use client";

import CheatSheet from "@/components/CheatSheet";
import VimEditor from "@/components/VimEditor";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box minH="100vh" bg="bgDark" p={{ base: 4, md: 6, lg: 8 }}>
      <Heading as="h1" size="2xl" textAlign="center" mb={6} color="textLight">
        Vim Practice App
      </Heading>
      <Flex
        gap={{ base: 4, md: 6 }}
        direction={{ base: "column", lg: "row" }}
        height="calc(100vh - 120px)"
        alignItems="stretch"
      >
        <Box flex="1" minW={{ lg: "400px" }}>
          <CheatSheet />
        </Box>
        <Box flex="2">
          <VimEditor />
        </Box>
      </Flex>
    </Box>
  );
}
