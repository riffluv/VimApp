import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import { motion } from "framer-motion";
import * as React from "react";

// Framer Motion コンポーネント
const MotionTooltipContent = motion.create(ChakraTooltip.Content);

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props;

    if (disabled) return <>{children}</>;

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <MotionTooltipContent
              ref={ref}
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 8,
                transition: {
                  duration: 0.15,
                  ease: [0.55, 0.055, 0.675, 0.19],
                },
              }}
              bg="gray.800"
              color="white"
              borderRadius="md"
              px={3}
              py={2}
              fontSize="sm"
              fontWeight="500"
              border="1px solid"
              borderColor="gray.600"
              boxShadow="0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(232, 131, 58, 0.1)"
              backdropFilter="blur(12px)"
              zIndex={9999}
              maxW="280px"
              {...contentProps}
            >
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </MotionTooltipContent>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  }
);
