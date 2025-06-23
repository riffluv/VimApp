'use client'

import { Box, Flex } from '@chakra-ui/react'
import CheatSheet from '../components/CheatSheet'
import Editor from '../components/Editor'
import Header from '../components/Header'

export default function Home() {
  return (
    <Box as="main" h="100vh" display="flex" flexDirection="column">
      <Header />
      <Flex flex="1" overflow="hidden">
        {/* Left side: Cheatsheet */}
        <Box 
          w={{ base: "100%", md: "40%" }} 
          h="100%" 
          overflow="auto"
          display={{ base: 'none', md: 'block' }}
          borderRight="1px solid"
          borderColor="whiteAlpha.300"
        >
          <CheatSheet />
        </Box>
        
        {/* Right side: Editor */}
        <Box flex="1" h="100%" overflow="hidden">
          <Editor />
        </Box>
      </Flex>
    </Box>
  )
} 