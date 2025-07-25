"use client";

import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={customTheme}>{children}</ChakraProvider>;
}
