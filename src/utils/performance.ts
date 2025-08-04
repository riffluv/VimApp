/**
 * パフォーマンス監視とメトリクス収集
 * Core Web Vitals と開発者向けメトリクスを収集
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift

  // カスタムメトリクス
  componentMountTime?: number;
  renderTime?: number;
  memoryUsage?: number;
  bundleSize?: number;
}

export interface ComponentPerformance {
  name: string;
  mountTime: number;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private componentMetrics = new Map<string, ComponentPerformance>();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeCoreWebVitals();
      this.initializeMemoryMonitoring();
    }
  }

  /**
   * Core Web Vitals の監視を開始
   */
  private initializeCoreWebVitals() {
    // LCP (Largest Contentful Paint) 監視
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric("lcp", lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    this.observers.push(lcpObserver);

    // FID (First Input Delay) 監視
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.reportMetric("fid", this.metrics.fid);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
    this.observers.push(fidObserver);

    // CLS (Cumulative Layout Shift) 監視
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
          this.reportMetric("cls", clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
    this.observers.push(clsObserver);
  }

  /**
   * メモリ使用量の監視
   */
  private initializeMemoryMonitoring() {
    // メモリ情報が利用可能な場合のみ
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;

        // メモリリークの検出
        if (memory.usedJSHeapSize > memory.totalJSHeapSize * 0.9) {
          console.warn("⚠️ Memory usage is high:", {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            percentage:
              ((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100).toFixed(
                1
              ) + "%",
          });
        }
      }, 5000);
    }
  }

  /**
   * コンポーネントのマウント時間を記録
   */
  trackComponentMount(componentName: string, startTime: number) {
    const mountTime = performance.now() - startTime;

    const existing = this.componentMetrics.get(componentName);
    if (existing) {
      existing.renderCount += 1;
      existing.lastRenderTime = mountTime;
      existing.averageRenderTime =
        (existing.averageRenderTime * (existing.renderCount - 1) + mountTime) /
        existing.renderCount;
    } else {
      this.componentMetrics.set(componentName, {
        name: componentName,
        mountTime,
        renderCount: 1,
        lastRenderTime: mountTime,
        averageRenderTime: mountTime,
      });
    }

    // 遅いコンポーネントの警告
    if (mountTime > 100) {
      console.warn(
        `⚠️ Slow component mount: ${componentName} took ${mountTime.toFixed(
          2
        )}ms`
      );
    }
  }

  /**
   * レンダリング時間を記録
   */
  trackRender(componentName: string, renderTime: number) {
    this.reportMetric(`render_${componentName}`, renderTime);

    if (renderTime > 16) {
      // 60fps threshold
      console.warn(
        `⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`
      );
    }
  }

  /**
   * メトリクスをレポート
   */
  private reportMetric(name: string, value: number) {
    if (process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true") {
      console.log(
        `📊 Performance Metric: ${name} = ${value.toFixed(2)}${
          name.includes("Time") || name.includes("time") ? "ms" : ""
        }`
      );
    }
  }

  /**
   * パフォーマンスサマリーを取得
   */
  getPerformanceSummary(): {
    coreWebVitals: PerformanceMetrics;
    components: ComponentPerformance[];
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    // Core Web Vitals のチェック
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push(
        "LCP が遅いです。画像の最適化や重要なリソースのプリロードを検討してください。"
      );
    }
    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push(
        "FID が高いです。JavaScript の実行時間を最適化してください。"
      );
    }
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push(
        "CLS が高いです。レイアウトシフトを減らすために要素のサイズを固定してください。"
      );
    }

    // コンポーネントパフォーマンスのチェック
    const slowComponents = Array.from(this.componentMetrics.values()).filter(
      (comp) => comp.averageRenderTime > 50
    );

    if (slowComponents.length > 0) {
      recommendations.push(
        `遅いコンポーネントがあります: ${slowComponents
          .map((c) => c.name)
          .join(", ")}`
      );
    }

    return {
      coreWebVitals: this.metrics,
      components: Array.from(this.componentMetrics.values()),
      recommendations,
    };
  }

  /**
   * 監視を停止
   */
  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// シングルトンインスタンス
export const performanceMonitor = new PerformanceMonitor();
