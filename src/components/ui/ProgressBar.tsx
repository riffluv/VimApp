"use client";

import { DESIGN_SYSTEM } from "@/constants";
import { motion } from "framer-motion";

export type ProgressVariant = "default" | "gradient" | "striped" | "glow";
export type ProgressSize = "xs" | "sm" | "md" | "lg";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = "default",
  size = "md",
  color = DESIGN_SYSTEM.colors.accent.primary,
  backgroundColor = DESIGN_SYSTEM.colors.bg.tertiary,
  showLabel = false,
  label,
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeStyles = () => {
    const sizes = {
      xs: { height: "4px", fontSize: "10px" },
      sm: { height: "6px", fontSize: "12px" },
      md: { height: "8px", fontSize: "14px" },
      lg: { height: "12px", fontSize: "16px" },
    };
    return sizes[size];
  };

  const sizeStyles = getSizeStyles();

  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return {
          background: `linear-gradient(90deg, ${color} 0%, ${DESIGN_SYSTEM.colors.accent.secondary} 100%)`,
          boxShadow: `0 0 10px ${color}40`,
        };
      case "striped":
        return {
          background: `repeating-linear-gradient(
            45deg,
            ${color},
            ${color} 10px,
            ${color}80 10px,
            ${color}80 20px
          )`,
          backgroundSize: "20px 20px",
          animation: animated ? "moveStripes 1s linear infinite" : "none",
        };
      case "glow":
        return {
          background: color,
          boxShadow: `
            0 0 10px ${color}60,
            0 0 20px ${color}40,
            0 0 30px ${color}20
          `,
          filter: "brightness(1.1)",
        };
      default:
        return {
          background: color,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={className}>
      {/* Label */}
      {(showLabel || label) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            fontSize: sizeStyles.fontSize,
            color: DESIGN_SYSTEM.colors.text.secondary,
            fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
          }}
        >
          {label && <span>{label}</span>}
          {showLabel && <span>{Math.round(percentage)}%</span>}
        </div>
      )}

      {/* Progress container */}
      <div
        style={{
          width: "100%",
          height: sizeStyles.height,
          backgroundColor,
          borderRadius: DESIGN_SYSTEM.borders.radius.lg,
          overflow: "hidden",
          position: "relative",
          boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Progress bar */}
        <motion.div
          style={{
            height: "100%",
            borderRadius: DESIGN_SYSTEM.borders.radius.lg,
            position: "relative",
            overflow: "hidden",
            ...variantStyles,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: "easeOut",
          }}
        >
          {/* Shine effect */}
          {animated && (
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
              }}
              animate={{ left: ["−100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* Pulse effect for glow variant */}
        {variant === "glow" && animated && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${percentage}%`,
              height: "100%",
              background: color,
              borderRadius: DESIGN_SYSTEM.borders.radius.lg,
              opacity: 0.5,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </div>
  );
};

// Specialized progress components
export const GradientProgress: React.FC<Omit<ProgressBarProps, "variant">> = (
  props
) => <ProgressBar variant="gradient" {...props} />;

export const StripedProgress: React.FC<Omit<ProgressBarProps, "variant">> = (
  props
) => <ProgressBar variant="striped" {...props} />;

export const GlowProgress: React.FC<Omit<ProgressBarProps, "variant">> = (
  props
) => <ProgressBar variant="glow" {...props} />;

// Circular progress component
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = DESIGN_SYSTEM.colors.accent.primary,
  backgroundColor = DESIGN_SYSTEM.colors.bg.tertiary,
  showLabel = true,
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: "rotate(-90deg)",
          filter: `drop-shadow(0 0 6px ${color}40)`,
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset,
          }}
          transition={{
            duration: animated ? 1 : 0,
            ease: "easeOut",
          }}
          style={{
            filter: "drop-shadow(0 0 4px currentColor)",
          }}
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <motion.div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size / 6,
            fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
            color: DESIGN_SYSTEM.colors.text.primary,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;
