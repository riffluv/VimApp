'use client'

import { Box, Flex, Heading, Spacer, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('gray.800', 'gray.900')
  const textColor = useColorModeValue('white', 'gray.100')

  return (
    <Box as="header" bg={bgColor} color={textColor} py={4} px={6} borderBottom="1px solid" borderColor="whiteAlpha.300">
      <Flex align="center">
        <Heading size="md" fontWeight="bold">
          Neovim 練習アプリ
        </Heading>
        <Spacer />
        <IconButton
          aria-label="カラーモード切替"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          variant="ghost"
        />
      </Flex>
    </Box>
  )
}

export default Header 