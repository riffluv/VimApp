import { Box, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  contentProps?: any;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  placement?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow = false,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      openDelay = 0,
      placement = "top",
      ...rest
    } = props;

    const [isVisible, setIsVisible] = React.useState(false);
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(
      null
    );

    const handleMouseEnter = () => {
      if (disabled) return;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        setIsVisible(true);
      }, openDelay);
      setTimeoutId(id);
    };

    const handleMouseLeave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsVisible(false);
    };

    if (disabled) return <>{children}</>;

    const tooltipContent = (
      <Box
        position="absolute"
        zIndex={1000}
        opacity={isVisible ? 1 : 0}
        visibility={isVisible ? "visible" : "hidden"}
        transition="opacity 0.2s ease, visibility 0.2s ease"
        pointerEvents="none"
        top={placement === "bottom" ? "100%" : "auto"}
        bottom={placement === "top" ? "100%" : "auto"}
        left="50%"
        transform="translateX(-50%)"
        mt={placement === "bottom" ? 2 : 0}
        mb={placement === "top" ? 2 : 0}
        ref={ref}
        {...contentProps}
      >
        {content}
      </Box>
    );

    return (
      <Box
        position="relative"
        display="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
        {portalled ? (
          <Portal containerRef={portalRef}>{tooltipContent}</Portal>
        ) : (
          tooltipContent
        )}
      </Box>
    );
  }
);
