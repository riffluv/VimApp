"use client";

import { DESIGN_SYSTEM } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 100 / (duration / 100)));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [id, duration, onClose]);

  const getTypeStyles = () => {
    const styles = {
      success: {
        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)`,
        borderColor: "rgba(16, 185, 129, 0.3)",
        iconColor: "#ffffff",
        icon: "✓",
      },
      error: {
        background: `linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)`,
        borderColor: "rgba(239, 68, 68, 0.3)",
        iconColor: "#ffffff",
        icon: "✕",
      },
      warning: {
        background: `linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)`,
        borderColor: "rgba(245, 158, 11, 0.3)",
        iconColor: "#ffffff",
        icon: "⚠",
      },
      info: {
        background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent.primary}90 0%, ${DESIGN_SYSTEM.colors.accent.secondary}90 100%)`,
        borderColor: DESIGN_SYSTEM.colors.accent.primary + "30",
        iconColor: "#ffffff",
        icon: "ℹ",
      },
    };
    return styles[type];
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "relative",
            background: typeStyles.background,
            border: `1px solid ${typeStyles.borderColor}`,
            borderRadius: DESIGN_SYSTEM.borders.radius.lg,
            padding: "16px 20px",
            minWidth: "320px",
            maxWidth: "400px",
            boxShadow:
              "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
          }}
        >
          {/* Progress bar */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "0 0 12px 12px",
            }}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />

          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            {/* Icon */}
            <motion.div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: typeStyles.iconColor,
                fontWeight: "bold",
                flexShrink: 0,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            >
              {typeStyles.icon}
            </motion.div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.h4
                style={{
                  margin: 0,
                  fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
                  fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
                  color: "#ffffff",
                  lineHeight: "1.4",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {title}
              </motion.h4>

              {message && (
                <motion.p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
                    color: "rgba(255, 255, 255, 0.9)",
                    lineHeight: "1.4",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {message}
                </motion.p>
              )}
            </div>

            {/* Close button */}
            <motion.div
              whileHover={{
                color: "#ffffff",
                background: "rgba(255, 255, 255, 0.1)",
                scale: 1.1,
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose(id), 300);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = "top-right",
}) => {
  const getPositionStyles = () => {
    const positions = {
      "top-right": { top: "24px", right: "24px" },
      "top-left": { top: "24px", left: "24px" },
      "bottom-right": { bottom: "24px", right: "24px" },
      "bottom-left": { bottom: "24px", left: "24px" },
    };
    return positions[position];
  };

  return (
    <div
      style={{
        position: "fixed",
        ...getPositionStyles(),
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto" }}>
            <Toast
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={onRemove}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
