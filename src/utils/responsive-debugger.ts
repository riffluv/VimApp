// 2025年最新: DPIスケーリング検出とデバッグ用JavaScript

class ResponsiveDebugger {
  constructor() {
    this.init();
  }

  init() {
    this.createDebugInfo();
    this.detectDPI();
    this.detectViewport();
    this.setupEventListeners();
    this.updateCSSVariables();
  }

  createDebugInfo() {
    if (process.env.NODE_ENV === "development") {
      const debugElement = document.createElement("div");
      debugElement.id = "responsive-debug";
      debugElement.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem;
        font-family: monospace;
        font-size: 0.75rem;
        border-radius: 0.25rem;
        z-index: 9999;
        pointer-events: none;
        line-height: 1.4;
      `;
      document.body.appendChild(debugElement);
    }
  }

  detectDPI() {
    const dpr = window.devicePixelRatio || 1;
    const dpi = dpr * 96; // 基準DPI 96

    // DPIに基づいてCSS変数を動的設定
    document.documentElement.style.setProperty(
      "--device-pixel-ratio",
      dpr.toString()
    );
    document.documentElement.style.setProperty("--device-dpi", `${dpi}dpi`);

    // DPIスケール係数の計算
    let scaleFactor = 1;
    if (dpr >= 2) scaleFactor = 1.1;
    else if (dpr >= 1.75) scaleFactor = 1.08;
    else if (dpr >= 1.5) scaleFactor = 1.06;
    else if (dpr >= 1.25) scaleFactor = 1.04;

    document.documentElement.style.setProperty(
      "--dpi-scale-factor",
      scaleFactor.toString()
    );

    return { dpr, dpi, scaleFactor };
  }

  detectViewport() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const vmax = Math.max(vw, vh);
    const vmin = Math.min(vw, vh);

    // ビューポート情報をCSS変数に設定
    document.documentElement.style.setProperty(
      "--viewport-width-px",
      `${vw}px`
    );
    document.documentElement.style.setProperty(
      "--viewport-height-px",
      `${vh}px`
    );
    document.documentElement.style.setProperty("--viewport-max", `${vmax}px`);
    document.documentElement.style.setProperty("--viewport-min", `${vmin}px`);

    // アスペクト比計算
    const aspectRatio = vw / vh;
    document.documentElement.style.setProperty(
      "--viewport-aspect-ratio",
      aspectRatio.toString()
    );

    return { vw, vh, vmax, vmin, aspectRatio };
  }

  updateCSSVariables() {
    const dpiInfo = this.detectDPI();
    const viewportInfo = this.detectViewport();

    // コンテナクエリブレークポイントの動的調整
    const baseBreakpoints = {
      xs: 320,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    };

    Object.entries(baseBreakpoints).forEach(([key, value]) => {
      const adjustedValue = value / dpiInfo.dpr;
      document.documentElement.style.setProperty(
        `--breakpoint-${key}`,
        `${adjustedValue}px`
      );
    });

    // フォントサイズの動的調整
    const baseFontSize = 16; // 16px
    const adjustedFontSize = baseFontSize * dpiInfo.scaleFactor;
    document.documentElement.style.setProperty(
      "--base-font-size-adjusted",
      `${adjustedFontSize}px`
    );
  }

  setupEventListeners() {
    let resizeTimer: NodeJS.Timeout;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateCSSVariables();
        this.updateDebugInfo();
      }, 100);
    });

    // 向き変更の検出
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.updateCSSVariables();
        this.updateDebugInfo();
      }, 200);
    });

    // DPIの変更検出（ブラウザズーム等）
    let lastDPR = window.devicePixelRatio;
    const checkDPR = () => {
      if (window.devicePixelRatio !== lastDPR) {
        lastDPR = window.devicePixelRatio;
        this.updateCSSVariables();
        this.updateDebugInfo();
      }
    };

    setInterval(checkDPR, 1000);
  }

  updateDebugInfo() {
    const debugElement = document.getElementById("responsive-debug");
    if (!debugElement) return;

    const dpiInfo = this.detectDPI();
    const viewportInfo = this.detectViewport();

    debugElement.innerHTML = `
      <div>DPR: ${dpiInfo.dpr}</div>
      <div>DPI: ${dpiInfo.dpi}</div>
      <div>Scale: ${dpiInfo.scaleFactor}</div>
      <div>VW: ${viewportInfo.vw}px</div>
      <div>VH: ${viewportInfo.vh}px</div>
      <div>Ratio: ${viewportInfo.aspectRatio.toFixed(2)}</div>
      <div>Orientation: ${
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      }</div>
    `;
  }

  // Container Queriesサポート検出
  supportsContainerQueries() {
    return CSS.supports("container-type", "inline-size");
  }

  // ダイナミックビューポート単位サポート検出
  supportsDynamicViewport() {
    return CSS.supports("height", "100dvh");
  }

  // 機能検出結果をCSS変数に設定
  setFeatureFlags() {
    document.documentElement.style.setProperty(
      "--supports-container-queries",
      this.supportsContainerQueries() ? "1" : "0"
    );

    document.documentElement.style.setProperty(
      "--supports-dynamic-viewport",
      this.supportsDynamicViewport() ? "1" : "0"
    );
  }

  // パフォーマンス監視
  monitorPerformance() {
    if ("performance" in window && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "layout-shift") {
            console.log("Layout Shift detected:", entry);
          }
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });
    }
  }
}

// DOMContentLoaded後に実行
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const responsiveDebugger = new ResponsiveDebugger();
    responsiveDebugger.setFeatureFlags();
    responsiveDebugger.monitorPerformance();

    // グローバルにアクセス可能にする（デバッグ用）
    (window as any).responsiveDebugger = responsiveDebugger;
  });
}

export default ResponsiveDebugger;
