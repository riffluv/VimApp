'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// Define custom theme
const theme = extendTheme({
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#1a202c',
        color: 'white',
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
} 