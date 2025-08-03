"use client";

import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./theme-simple";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
}
