"use client";

import { DESIGN_SYSTEM } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  isOpen,
  position,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position if menu would overflow
      if (position.x + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 8;
      }

      // Adjust vertical position if menu would overflow
      if (position.y + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 8;
      }

      setAdjustedPosition({ x: Math.max(8, newX), y: Math.max(8, newY) });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: adjustedPosition.x,
            top: adjustedPosition.y,
            zIndex: 9999,
            minWidth: "200px",
            background: DESIGN_SYSTEM.colors.bg.overlay,
            border: `1px solid ${DESIGN_SYSTEM.colors.border.primary}`,
            borderRadius: DESIGN_SYSTEM.borders.radius.lg,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(16px)",
            padding: "8px",
            overflow: "hidden",
          }}
        >
          {items.map((item, index) => (
            <ContextMenuItem
              key={item.id}
              item={item}
              index={index}
              onClose={onClose}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ContextMenuItemProps {
  item: ContextMenuItem;
  index: number;
  onClose: () => void;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  item,
  index,
  onClose,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!item.disabled) {
      item.onClick();
      onClose();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={item.disabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        margin: "2px 0",
        background: isHovered && !item.disabled
          ? item.danger
            ? "rgba(239, 68, 68, 0.1)"
            : DESIGN_SYSTEM.colors.interactive.hover
          : "transparent",
        color: item.disabled
          ? DESIGN_SYSTEM.colors.text.muted
          : item.danger
            ? "#ef4444"
            : isHovered
              ? DESIGN_SYSTEM.colors.text.primary
              : DESIGN_SYSTEM.colors.text.secondary,
        border: "none",
        borderRadius: DESIGN_SYSTEM.borders.radius.md,
        cursor: item.disabled ? "not-allowed" : "pointer",
        fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
        fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
        textAlign: "left",
        transition: "all 0.15s ease",
        outline: "none",
        opacity: item.disabled ? 0.5 : 1,
        transform: isHovered && !item.disabled ? "translateX(2px)" : "translateX(0)",
      }}
    >
      {/* Icon */}
      {item.icon && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          {item.icon}
        </div>
      )}

      {/* Label */}
      <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>

      {/* Shortcut */}
      {item.shortcut && (
        <span
          style={{
            fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
            color: DESIGN_SYSTEM.colors.text.muted,
            fontFamily: DESIGN_SYSTEM.typography.fonts.mono,
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          {item.shortcut}
        </span>
      )}

      {/* Hover indicator */}
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: item.danger
            ? "#ef4444"
            : DESIGN_SYSTEM.colors.accent.primary,
          borderRadius: "0 2px 2px 0",
          opacity: 0,
        }}
        animate={{
          opacity: isHovered && !item.disabled ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </motion.button>
  );
};

export default ContextMenu;