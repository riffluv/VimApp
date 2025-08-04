"use client";

import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  label?: string; // For backward compatibility
  hasArrow?: boolean; // For backward compatibility
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    showArrow,
    hasArrow, // backward compatibility
    children,
    disabled,
    portalled = true,
    content,
    label, // backward compatibility
    contentProps,
    portalRef,
    openDelay = 500,
    closeDelay = 100,
    ...rest
  } = props;

  // Use label prop if content is not provided (backward compatibility)
  const tooltipContent = content || label;

  if (disabled || !tooltipContent) return <>{children}</>;

  const shouldShowArrow = showArrow || hasArrow;

  return (
    <ChakraTooltip.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      positioning={{
        placement: "top",
        gutter: 8,
        offset: { mainAxis: 0, crossAxis: 0 },
        strategy: "absolute",
        flip: true,
        slide: true,
        shift: 8,
      }}
      lazyMount={true}
      unmountOnExit={true}
      {...rest}
    >
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content
            bg="gray.900"
            color="white"
            fontSize="sm"
            px={3}
            py={2}
            borderRadius="md"
            maxW="xs"
            fontWeight="medium"
            boxShadow="lg"
            zIndex={1500}
            {...contentProps}
          >
            {shouldShowArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {tooltipContent}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
