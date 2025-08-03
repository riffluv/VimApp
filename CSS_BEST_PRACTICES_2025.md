# VimApp CSS Best Practices 2025 📚

## 🎯 核心原則

### 1. **実用的なシンプリシティ**
- 過度な技術的複雑性を避ける
- 実用性とメンテナンス性を最優先
- パフォーマンスと可読性のバランス

### 2. **統一されたデザインシステム**
- design-system.tsによる一元管理
- **!important最小限使用** → 必要な場合のみCodeMirrorテーマで使用
- Chakra UIとの適切な共存

### 3. **レスポンシブデザイン（実用的）**
```css
/* シンプルで実用的なブレークポイント */
@media (max-width: 768px) { /* モバイル */ }
@media (min-width: 769px) and (max-width: 1024px) { /* タブレット */ }
@media (min-width: 1025px) { /* デスクトップ */ }
```

## 🎨 デザインシステム仕様

### **カラーパレット（統一）**
```css
/* Primary: Rich Black + Orange */
--color-bg-primary: #0a0a0a;
--color-bg-secondary: #1a1a1a;
--color-accent-primary: #ff6b35;
--color-text-primary: #ffffff;
--color-text-secondary: #e0e0e0;
```

### **スペーシング（8px Grid）**
```css
--space-xs: 0.5rem;  /* 8px */
--space-sm: 1rem;    /* 16px */
--space-md: 1.5rem;  /* 24px */
--space-lg: 2rem;    /* 32px */
--space-xl: 3rem;    /* 48px */
```

### **Typography（実用的サイズ）**
```css
--font-size-xs: 0.75rem;  /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-md: 1rem;     /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem;  /* 20px */
```

## 🏗️ CSS Architecture

### **Cascade Layers（優先度順）**
```css
@layer vimapp-reset, vimapp-base, vimapp-components, vimapp-utilities;
```

### **コンポーネント分離パターン**
```css
/* ✅ 正しい例 */
@layer vimapp-components {
  .vim-editor {
    contain: layout style;
    isolation: isolate;
  }
}

/* ❌ 間違った例 */
.vim-editor {
  position: absolute !important;
  z-index: 9999 !important;
}
```

## 📱 レスポンシブ・ガイドライン

### **モバイルファースト（シンプル）**
```css
/* Base: モバイル */
.container {
  width: 100%;
  padding: 1rem;
}

/* タブレット */
@media (min-width: 769px) {
  .container {
    max-width: 768px;
    padding: 1.5rem;
  }
}

/* デスクトップ */
@media (min-width: 1025px) {
  .container {
    max-width: 1200px;
    padding: 2rem;
  }
}
```

## ⚡ パフォーマンス・ガイドライン

### **GPU最適化（適度に）**
```css
/* ✅ 適切な使用 */
.interactive-button {
  transform: translateZ(0);
  will-change: transform;
}

/* ❌ 過度な使用 */
.every-element {
  transform: translateZ(0) perspective(1000px) rotateX(1deg);
  will-change: transform, opacity, color, background, box-shadow;
}
```

### **アニメーション（控えめに）**
```css
/* ✅ シンプルなトランジション */
.button {
  transition: all 0.2s ease;
}

/* ❌ 複雑すぎるアニメーション */
.button {
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.4s cubic-bezier(0.15, 0.85, 0.25, 1),
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🚫 避けるべきパターン

### **過度な複雑性**
```css
/* ❌ 複雑すぎ */
.component {
  background: linear-gradient(135deg, 
    rgba(255,255,255,0.02) 0%, 
    transparent 50%, 
    rgba(232,131,58,0.01) 100%);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 
              inset 0 1px 0 rgba(255,255,255,0.04),
              0 0 20px rgba(232,131,58,0.15);
  backdrop-filter: blur(12px) saturate(1.1);
  transform: perspective(1000px) rotateX(1deg) translateZ(0);
}

/* ✅ シンプル */
.component {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}
```

### **Chakra UIとの適切な共存**
```css
/* ❌ Chakra UI上書き */
.chakra-button {
  position: absolute !important;
  z-index: 9999 !important;
}

/* ✅ 独自コンポーネント作成 */
@layer vimapp-components {
  .custom-button {
    /* design-system.tsの値を使用 */
    background: var(--color-accent-primary);
  }
}

/* ✅ 例外: CodeMirrorテーマでの!important使用 */
.cm-cursor {
  border-left: 2px solid #ff6b35 !important;
}
```

## 📏 レイアウト・ベストプラクティス

### **Flexbox（シンプルに）**
```css
/* ✅ 基本的なFlexbox */
.layout {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* ❌ 複雑すぎるFlex */
.layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: stretch;
  gap: clamp(1rem, 2.5vw, 2rem);
}
```

### **Grid（必要な時のみ）**
```css
/* ✅ シンプルなGrid */
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}
```

## 🎯 2025年の現実的なCSS

### **実用的なモダンCSS**
- **framer-motion**: 必要最小限の使用（ページレベルのみ）
- **CSS Cascade Layers**: globals.cssで活用
- **Custom Properties**: design-system.tsで一元管理
- **状態管理**: React stateによるインタラクティブ効果

### **現在使用中の技術**
- framer-motion: ページトランジションとCheatSheet表示/非表示
- React state: ボタンのホバー・プレス状態管理
- Chakra UI: 基本UIコンポーネント
- CodeMirror: エディター機能（!important使用許可）

---

## 💡 まとめ

**シンプルで保守しやすく、実用的なCSSを書く**ことが2025年の真のベストプラクティスです。技術的な複雑性よりも、開発チームの生産性とユーザー体験を重視しましょう。
