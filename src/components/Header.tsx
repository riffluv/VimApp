'use client'

import { Box, Flex, Heading, Spacer, IconButton, useColorMode, useColorModeValue, HStack, Link, Text } from '@chakra-ui/react'
import { MoonIcon, SunIcon, ExternalLinkIcon } from '@chakra-ui/icons'

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const textColor = useColorModeValue('white', 'gray.100')

  return (
    <Box as="header" bg={bgColor} color={textColor} py={4} px={6} borderBottom="1px solid" borderColor="whiteAlpha.300">
      <Flex align="center">
        <Heading size="md" fontWeight="bold">
          実践的なVimコマンド練習アプリ
        </Heading>
        <Spacer />
        <HStack spacing={4}>
          <Link 
            href="https://github.com/riffluv/neovim" 
            isExternal 
            color="blue.300"
            fontSize="sm"
            display="flex"
            alignItems="center"
          >
            GitHub <ExternalLinkIcon mx="2px" />
          </Link>
          <IconButton
            aria-label="カラーモード切替"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="sm"
            variant="ghost"
          />
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header 