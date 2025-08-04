"use client";

import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./theme-simple";
import enhancedTheme from "./theme-v3";

// 環境変数またはfeature flagで制御可能
const USE_ENHANCED_THEME =
  process.env.NEXT_PUBLIC_USE_ENHANCED_THEME === "true";

export function Providers({ children }: { children: React.ReactNode }) {
  const activeSystem = USE_ENHANCED_THEME ? enhancedTheme : customTheme;

  return <ChakraProvider value={activeSystem}>{children}</ChakraProvider>;
}
