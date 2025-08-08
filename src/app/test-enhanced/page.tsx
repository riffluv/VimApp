"use client";

import { PerformanceDisplay } from "@/components/PerformanceDisplay";
import VimEditorEnhanced from "@/components/VimEditor-enhanced";
import { Loading } from "@/components/ui/Loading";
import { Alert, Badge, Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Suspense } from "react";

// 強化されたコンポーネントのテストページ
export default function TestEnhancedPage() {
  return (
    <Box minH="100vh" bg="gray.900" color="gray.100" p={6}>
      {/* パフォーマンス監視ディスプレイ */}
      <PerformanceDisplay />

      <VStack gap={6} maxW="1400px" mx="auto">
        {/* ヘッダー */}
        <Box textAlign="center" w="full">
          <Heading size="lg" mb={2}>
            🚀 Enhanced Components Test Page
          </Heading>
          <Text fontSize="md" color="gray.400">
            強化されたコンポーネントのテスト環境
          </Text>
          <Badge colorPalette="green" mt={2}>
            Enhanced Theme Active
          </Badge>
        </Box>

        {/* 注意事項 */}
        <Alert.Root status="info" borderRadius="lg">
          <Alert.Indicator />
          <Box>
            <Alert.Title>テストモード</Alert.Title>
            <Alert.Description>
              このページは強化されたコンポーネントのテスト用です。
              エラー境界、パフォーマンス監視、アクセシビリティ機能が有効になっています。
            </Alert.Description>
          </Box>
        </Alert.Root>

        {/* 強化されたVimエディタ */}
        <Box w="full">
          <Heading size="md" mb={4} color="accent.500">
            Enhanced Vim Editor
          </Heading>
          <Suspense fallback={<Loading />}>
            <VimEditorEnhanced
              onCodePenModeChange={(mode) => {
                console.log("CodePen mode changed:", mode);
              }}
            />
          </Suspense>
        </Box>

        {/* フッター */}
        <Box textAlign="center" pt={8}>
          <Text fontSize="sm" color="gray.500">
            Enhanced by VimApp Design System 2025
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
