# VimApp CSS Best Practices 2025 📚

## 🎯 核心原則

### 1. **人の手によるクラフト感重視**
- **AI感を排除** → 自然で温かみのあるデザイン
- **リッチブラック×オレンジ** → 高級感と親しみやすさの両立
- **手作り感のある細部** → 過度な完璧さを避け、人間らしい温かさを演出
- 実用性とメンテナンス性を最優先

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

## 🎨 デザインシステム仕様（リッチブラック×オレンジ）

### **デザインコンセプト**
- **プライマリーカラー**: リッチブラック - 深み、高級感、落ち着き
- **セカンダリーカラー**: オレンジ - 温かみ、活力、親しみやすさ
- **AI感を排除**: 機械的な完璧さではなく、人の手による自然な美しさ
- **製品レベル品質**: プロフェッショナルでありながら親しみやすい

### **カラーパレット（リッチブラック×オレンジ）**
```css
/* プライマリーカラー: リッチブラック - 深みと高級感 */
--color-bg-primary: #0a0a0a;      /* Pure rich black */
--color-bg-secondary: #141414;    /* Slightly lighter rich black */
--color-bg-tertiary: #1e1e1e;     /* Card/component background */
--color-bg-quaternary: #2a2a2a;   /* Elevated surfaces */

/* セカンダリーカラー: オレンジ - 温かみと活力 */
--color-accent-primary: #ff6b35;  /* Main orange - vibrant but professional */
--color-accent-secondary: #ff8757; /* Lighter orange for hover states */
--color-accent-tertiary: #ff4500;  /* Deeper orange for active states */

/* テキストカラー: 高コントラスト階層 */
--color-text-primary: #ffffff;    /* Pure white for primary text */
--color-text-secondary: #e8e8e8;  /* High contrast secondary */
--color-text-tertiary: #c4c4c4;   /* Medium contrast */
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

### **AI感のある機械的なデザイン**
```css
/* ❌ AI感のある機械的すぎるデザイン */
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

/* ✅ 人の手による自然なデザイン */
.component {
  background: var(--color-bg-secondary); /* リッチブラック */
  border: 1px solid rgba(255, 107, 53, 0.2); /* 控えめなオレンジボーダー */
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); /* 自然な深み */
}

/* ✅ オレンジアクセントの効果的な使用 */
.interactive-element {
  background: linear-gradient(135deg, #ff6b35, #ff8757);
  color: #ffffff;
  transition: all 0.2s ease; /* 自然な動き */
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

### **オレンジ（セカンダリーカラー）の効果的な使用法**
```css
/* ✅ アクティブ状態・重要な要素 */
.active-tab {
  background: linear-gradient(135deg, #ff6b35, #ff8757);
  color: #ffffff;
}

/* ✅ ホバー効果・インタラクション */
.button:hover {
  border: 1px solid rgba(255, 107, 53, 0.3);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
}

/* ✅ アクセント・強調 */
.highlight {
  color: #ff6b35;
  text-shadow: 0 0 8px rgba(255, 107, 53, 0.3);
}

/* ❌ 過度な使用は避ける */
.everything-orange {
  background: #ff6b35;
  border: 2px solid #ff6b35;
  color: #ff6b35; /* 読みにくい */
}
```

---

## 💡 まとめ

**リッチブラック×オレンジで、AI感のない人の手による自然なデザイン**を実現することが、このプロジェクトの核心です。

### 🎯 デザインの指針
- **リッチブラック**: 深み、高級感、落ち着きを演出
- **オレンジ**: 温かみ、活力、親しみやすさを追加
- **自然な美しさ**: 機械的な完璧さではなく、人間らしい温かさ
- **製品レベル品質**: プロフェッショナルでありながら親しみやすい

技術的な複雑性よりも、**ユーザーが感じる温かさと使いやすさ**を最優先に考えましょう。
