"use client";

import { performanceMonitor } from "@/utils/performance";
import { useEffect, useState } from "react";

/**
 * Performance metrics display component
 */
export function PerformanceDisplay() {
  const [summary, setSummary] = useState(
    performanceMonitor.getPerformanceSummary()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(performanceMonitor.getPerformanceSummary());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true"
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
        📊 Performance
      </div>

      <div>
        <strong>Core Web Vitals:</strong>
        <div>LCP: {summary.coreWebVitals.lcp?.toFixed(1) || "N/A"}ms</div>
        <div>FID: {summary.coreWebVitals.fid?.toFixed(1) || "N/A"}ms</div>
        <div>CLS: {summary.coreWebVitals.cls?.toFixed(3) || "N/A"}</div>
      </div>

      {summary.components.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <strong>Components:</strong>
          {summary.components.slice(0, 3).map((comp) => (
            <div key={comp.name}>
              {comp.name}: {comp.averageRenderTime.toFixed(1)}ms
            </div>
          ))}
        </div>
      )}

      {summary.recommendations.length > 0 && (
        <div style={{ marginTop: "8px", color: "#ffd700" }}>
          <strong>⚠️ Recommendations:</strong>
          {summary.recommendations.slice(0, 2).map((rec, i) => (
            <div key={i} style={{ fontSize: "10px" }}>
              {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
