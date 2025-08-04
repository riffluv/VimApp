"use client";

import { performanceMonitor } from "@/utils/performance";
import { useCallback, useEffect } from "react";

/**
 * React Hook for performance monitoring
 */
export function usePerformanceMonitoring(componentName: string) {
  const startTime = performance.now();

  // マウント時の計測
  useEffect(() => {
    performanceMonitor.trackComponentMount(componentName, startTime);
  }, [componentName, startTime]);

  // レンダリング時間の計測
  const trackRender = useCallback(() => {
    const renderTime = performance.now() - startTime;
    performanceMonitor.trackRender(componentName, renderTime);
  }, [componentName, startTime]);

  return { trackRender };
}
