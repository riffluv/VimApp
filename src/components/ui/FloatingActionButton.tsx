"use client";

import { DESIGN_SYSTEM } from "@/constants";
import { motion } from "framer-motion";
import { useState } from "react";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onClick,
  position = "bottom-right",
  size = "md",
  variant = "primary",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getPositionStyles = () => {
    const positions = {
      "bottom-right": { bottom: "24px", right: "24px" },
      "bottom-left": { bottom: "24px", left: "24px" },
      "top-right": { top: "24px", right: "24px" },
      "top-left": { top: "24px", left: "24px" },
    };
    return positions[position];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: { width: "48px", height: "48px", fontSize: "18px" },
      md: { width: "56px", height: "56px", fontSize: "20px" },
      lg: { width: "64px", height: "64px", fontSize: "24px" },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    if (variant === "primary") {
      return {
        background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary} 0%, ${DESIGN_SYSTEM.colors.accent.secondary} 100%)`,
        color: DESIGN_SYSTEM.colors.text.primary,
        boxShadow: `0 8px 25px rgba(255, 107, 53, 0.3)`,
      };
    }
    return {
      background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.bg.quaternary} 0%, ${DESIGN_SYSTEM.colors.bg.tertiary} 100%)`,
      color: DESIGN_SYSTEM.colors.text.secondary,
      boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2)`,
      border: `1px solid ${DESIGN_SYSTEM.colors.border.subtle}`,
    };
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        position: "fixed",
        ...getPositionStyles(),
        ...getSizeStyles(),
        ...getVariantStyles(),
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        outline: "none",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isPressed ? "scale(0.95)" : isHovered ? "scale(1.05)" : "scale(1)",
        boxShadow: isPressed
          ? "inset 0 4px 8px rgba(0, 0, 0, 0.3)"
          : isHovered
            ? variant === "primary"
              ? `0 12px 35px rgba(255, 107, 53, 0.4), 0 0 0 3px rgba(255, 107, 53, 0.2)`
              : `0 12px 35px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.1)`
            : variant === "primary"
              ? `0 8px 25px rgba(255, 107, 53, 0.3)`
              : `0 8px 25px rgba(0, 0, 0, 0.2)`,
      }}
      aria-label={label}
      title={label}
    >
      {/* Ripple effect background */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: variant === "primary"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 107, 53, 0.2)",
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
        animate={{
          scale: isHovered ? [1, 1.2] : 1,
          opacity: isHovered ? [0, 0.3, 0] : 0,
        }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Icon */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{
          rotate: isHovered ? [0, 10, -10, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
};

export default FloatingActionButton;