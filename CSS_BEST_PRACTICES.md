# VimApp CSS 設計ベストプラクティス 2025

## 📋 概要

VimApp の CSS 設計は、**100% DPI スケールでの自然なサイズ感**と**全 DPI スケールでの一貫性**を実現するため、rem-based システムを採用しています。

## 🎯 設計思想

### 問題意識

- 100%DPI でも「拡大した感じ」がする問題
- 複雑な clamp()関数による予期しないスケーリング
- ビューポート単位とピクセル単位の混在による不整合

### 解決方針

- **rem 単位中心**: ブラウザのネイティブ DPI スケーリングを活用
- **シンプルなデザインシステム**: 複雑性を排除し、予測可能な動作
- **CSS Custom Properties**: 一貫性とメンテナンス性の向上

## 🏗️ アーキテクチャ

### 1. CSS Custom Properties (`globals.css`)

```css
:root {
  /* 基準サイズ - ブラウザがDPIスケーリングを自動処理 */
  font-size: 16px;

  /* カラーシステム - プロフェッショナル黒&オレンジ */
  --bg-primary: #0a0a0a;
  --text-primary: #ffffff;
  --orange-primary: #ff6b35;

  /* タイポグラフィ - シンプルなremスケール */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */

  /* スペーシング - クリーンな progression */
  --space-2: 0.5rem; /* 8px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
}
```

### 2. TypeScript Design System (`design-system.ts`)

```typescript
export const COLORS = {
  bg: { primary: "#0a0a0a", secondary: "#141414" },
  text: { primary: "#ffffff", secondary: "#e8e8e8" },
  accent: { primary: "#ff6b35", secondary: "#ff8757" },
} as const;

export const SPACING = {
  2: "0.5rem", // 8px
  4: "1rem", // 16px
  6: "1.5rem", // 24px
} as const;
```

### 3. Chakra UI Theme (`theme.ts`)

```typescript
const customTheme = extendTheme({
  styles: {
    global: {
      html: { fontSize: "16px" }, // 固定ベース
      body: { bg: "var(--bg-primary)" }, // CSS変数使用
    },
  },
  fontSizes: {
    sm: "0.875rem", // 固定rem値
    md: "1rem",
    lg: "1.125rem",
  },
});
```

## ✅ ベストプラクティス

### 1. 単位の使い分け

- **rem**: すべてのサイズ（フォント、スペーシング、レイアウト）
- **px**: ボーダー幅のみ（1px、2px）
- **%**: コンテナ幅のみ
- **vw/vh**: 使用禁止（予期しないスケーリングの原因）

### 2. レスポンシブデザイン

```css
/* ❌ 避けるべき - 複雑なclamp() */
font-size: clamp(1rem, 2.5vw, 1.5rem);

/* ✅ 推奨 - シンプルなrem + メディアクエリ */
font-size: 1rem;
@media (min-width: 768px) {
  font-size: 1.125rem;
}
```

### 3. コンポーネント設計

```css
/* ✅ 推奨 - CSS変数活用 */
.btn {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}
```

### 4. DPI スケーリング対応

- **ブラウザに委ねる**: HTML font-size: 16px 固定
- **相対単位使用**: すべて rem 基準
- **テスト必須**: 100%, 125%, 150% DPI で確認

## 🚀 パフォーマンス最適化

### 1. CSS 構造

- カスケードレイヤー使用（reset, base, components, utilities）
- 必要最小限のセレクタ
- Container Queries 活用

### 2. フォント最適化

```css
/* 最小限のフォントウェイト */
@import url("...Inter:wght@400;500;600&...");

/* フォント表示最適化 */
font-display: swap;
```

### 3. アニメーション配慮

```css
/* アクセシビリティ対応 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
```

## 🔧 開発ワークフロー

### 1. 新しいコンポーネント追加時

1. `design-system.ts`でトークン確認
2. CSS Custom Properties の使用
3. rem 単位のみ使用
4. 複数 DPI でのテスト

### 2. デバッグ手順

1. ブラウザ DevTools でコンピューテッドスタイル確認
2. DPI スケールを変更してテスト（100%, 125%, 150%）
3. 実際のデバイスでの確認

### 3. パフォーマンスチェック

- Lighthouse CSS 評価
- バンドルサイズ監視
- レンダリング時間測定

## 📱 デバイス対応

### DPI スケール対応表

- **100% DPI**: ベースライン（16px = 1rem）
- **125% DPI**: 自動スケール（20px = 1rem）
- **150% DPI**: 自動スケール（24px = 1rem）
- **200% DPI**: 自動スケール（32px = 1rem）

### ブレークポイント

```typescript
breakpoints: {
  sm: "30em",   // 480px
  md: "48em",   // 768px
  lg: "64em",   // 1024px
  xl: "80em",   // 1280px
}
```

## 🎨 カラーシステム

### パレット構成

- **背景**: 4 段階の黒グラデーション
- **テキスト**: 4 段階のコントラスト
- **アクセント**: プロフェッショナルオレンジ
- **ステータス**: 成功・警告・エラー

### アクセシビリティ

- WCAG AA 準拠のコントラスト比
- ハイコントラストモード対応
- カラーブラインドフレンドリー

## 🔄 メンテナンス

### 定期チェック項目

- [ ] 新機能追加時の DPI テスト
- [ ] パフォーマンス監視
- [ ] デザインシステムの一貫性
- [ ] ブラウザ互換性確認

### 更新時の注意点

- CSS Custom Properties の変更は全体への影響を考慮
- 新しいコンポーネントも rem-based システムに準拠
- clamp()や vw/vh 単位の使用は避ける

## 📚 参考資料

- [CSS Container Queries - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [CSS Custom Properties - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**更新日**: 2025 年 8 月 4 日  
**バージョン**: 1.0  
**対象**: VimApp CSS Architecture
