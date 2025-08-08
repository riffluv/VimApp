"use client";

import { DESIGN_SYSTEM } from "@/constants";
import { motion } from "framer-motion";

export type LoadingVariant = "spinner" | "dots" | "pulse" | "skeleton" | "wave";
export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  color = DESIGN_SYSTEM.colors.accent.primary,
  text,
  fullScreen = false,
}) => {
  const getSizeValue = () => {
    const sizes = {
      xs: 16,
      sm: 24,
      md: 32,
      lg: 48,
      xl: 64,
    };
    return sizes[size];
  };

  const sizeValue = getSizeValue();

  const renderSpinner = () => (
    <motion.div
      style={{
        width: sizeValue,
        height: sizeValue,
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const renderDots = () => (
    <div style={{ display: "flex", gap: "4px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: sizeValue / 4,
            height: sizeValue / 4,
            backgroundColor: color,
            borderRadius: "50%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <motion.div
      style={{
        width: sizeValue,
        height: sizeValue,
        backgroundColor: color,
        borderRadius: "50%",
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  const renderSkeleton = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            height: "12px",
            backgroundColor: DESIGN_SYSTEM.colors.bg.tertiary,
            borderRadius: "6px",
            width: i === 2 ? "60%" : "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)`,
            }}
            animate={{ left: ["−100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        </motion.div>
      ))}
    </div>
  );

  const renderWave = () => (
    <div style={{ display: "flex", alignItems: "end", gap: "2px" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          style={{
            width: sizeValue / 8,
            backgroundColor: color,
            borderRadius: "2px",
          }}
          animate={{
            height: [sizeValue / 4, sizeValue, sizeValue / 4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      case "wave":
        return renderWave();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {renderLoading()}
      {text && (
        <motion.p
          style={{
            margin: 0,
            fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
            color: DESIGN_SYSTEM.colors.text.secondary,
            fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
            textAlign: "center",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: DESIGN_SYSTEM.colors.surface.overlay,
          backdropFilter: "blur(8px)",
          zIndex: 9999,
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Specialized loading components
export const SpinnerLoading: React.FC<Omit<LoadingProps, "variant">> = (
  props
) => <Loading variant="spinner" {...props} />;

export const DotsLoading: React.FC<Omit<LoadingProps, "variant">> = (props) => (
  <Loading variant="dots" {...props} />
);

export const PulseLoading: React.FC<Omit<LoadingProps, "variant">> = (
  props
) => <Loading variant="pulse" {...props} />;

export const SkeletonLoading: React.FC<Omit<LoadingProps, "variant">> = (
  props
) => <Loading variant="skeleton" {...props} />;

export const WaveLoading: React.FC<Omit<LoadingProps, "variant">> = (props) => (
  <Loading variant="wave" {...props} />
);

// Loading overlay for specific components
interface LoadingOverlayProps extends LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  ...loadingProps
}) => (
  <div style={{ position: "relative" }}>
    {children}
    {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: DESIGN_SYSTEM.colors.surface.overlay,
          backdropFilter: "blur(4px)",
          borderRadius: DESIGN_SYSTEM.borders.radius.lg,
          zIndex: 10,
        }}
      >
        <Loading {...loadingProps} />
      </motion.div>
    )}
  </div>
);

export default Loading;
