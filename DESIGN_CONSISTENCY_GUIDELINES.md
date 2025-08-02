# 🔒 デザイン差異防止ガイドライン

## 📋 概要

このドキュメントは、今後のコード変更や機能追加において**デザインの一貫性を保持**し、**CSS 競合や UI 差異の発生を防止**するための厳格なガイドラインです。

---

## ⚠️ 重要な警告

### 🚨 **絶対に変更してはいけないファイル**

以下のファイルは、**デザインシステムの核心**であり、不用意な変更は全体の UI に深刻な影響を与えます：

```
❌ 変更禁止ファイル
├── src/app/globals.css           # グローバルCSS - 既に最適化済み
├── src/constants/design-system.ts # デザイントークン - 統一性の要
├── src/components/ui/Button.tsx   # ボタンコンポーネント - 簡素化済み
├── CSS_BEST_PRACTICES_2025.md    # プロジェクト設計原則
└── src/utils/design-system.ts    # デザインユーティリティ
```

---

## 🎯 設計原則（絶対遵守）

### 1. **シンプルさの維持**

- ❌ 複雑なアニメーション（framer-motion 等）の追加禁止
- ❌ 数学的計算（黄金比等）によるスタイリング禁止
- ✅ 8px グリッドシステムの厳格な遵守
- ✅ 最小限の CSS プロパティの使用

### 2. **CSS 競合の防止**

- ❌ `!important`の使用禁止
- ❌ インラインスタイルの濫用禁止
- ❌ Chakra UI の theme 上書き禁止
- ✅ design-system.ts のトークンのみ使用

### 3. **パフォーマンス優先**

- ❌ GPU 最適化の過度な追加禁止
- ❌ 複雑な hover/focus 状態の追加禁止
- ❌ Container Queries の不必要な使用禁止
- ✅ 基本的な transition のみ使用

---

## 📐 具体的な制約事項

### CSS/スタイリング

```css
/* ❌ 禁止例 */
.component {
  /* 複雑な計算 */
  padding: calc(var(--golden-ratio) * 1.618rem);

  /* GPU最適化の濫用 */
  will-change: transform, opacity, filter;
  transform: translateZ(0) scale3d(1, 1, 1);

  /* 過度なアニメーション */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ✅ 推奨例 */
.component {
  /* 8pxグリッド使用 */
  padding: 1rem; /* 16px */

  /* シンプルなトランジション */
  transition: all 0.2s ease;
}
```

### コンポーネント設計

```tsx
/* ❌ 禁止例 */
import { motion } from "framer-motion";
const MotionBox = motion(Box);

const Component = () => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.98, rotateX: -15 }}
    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
    whileHover={{ scale: 1.02, rotateY: 5 }}
    transition={{
      duration: 0.4,
      ease: "easeOutBack",
      staggerChildren: 0.1,
    }}
  >
    複雑なアニメーション
  </MotionBox>
);

/* ✅ 推奨例 */
const Component = () => (
  <Box
    style={{
      transition: "all 0.2s ease",
    }}
  >
    シンプルなコンポーネント
  </Box>
);
```

---

## 🛠️ 変更時の必須チェックリスト

新機能追加や UI 修正時は、以下を必ずチェックしてください：

### ✅ 開発前チェック

- [ ] design-system.ts の既存トークンで実現可能か？
- [ ] 8px グリッドシステムに準拠しているか？
- [ ] CSS 競合が発生しないか？
- [ ] 既存コンポーネントの再利用が可能か？

### ✅ 実装中チェック

- [ ] `!important`を使用していないか？
- [ ] 複雑な計算式を使用していないか？
- [ ] framer-motion を追加していないか？
- [ ] 新しい CSS カスタムプロパティを定義していないか？

### ✅ 完成後チェック

- [ ] 全ページでレイアウト崩れが発生していないか？
- [ ] ブラウザ間での表示差異がないか？
- [ ] パフォーマンスが劣化していないか？
- [ ] TypeScript エラーが発生していないか？

---

## 🚀 推奨する変更アプローチ

### 1. **小さな変更から開始**

```bash
# 段階的な変更推奨
git add -p  # 部分的なコミット
npm run build  # ビルドテスト
npm run dev  # 動作確認
```

### 2. **既存パターンの活用**

```tsx
// 新コンポーネント作成時は既存コンポーネントを参考に
import { Button } from "./ui/Button"; // ✅ 既存使用
import { DESIGN_SYSTEM } from "@/constants"; // ✅ トークン使用
```

### 3. **段階的な検証**

1. **ローカル確認** → `localhost:3001`での動作確認
2. **ビルド確認** → `npm run build`でエラーチェック
3. **クロスブラウザ確認** → Chrome/Firefox/Safari での確認

---

## 📞 問題発生時の対処法

### エラー発生時

```bash
# 1. 開発サーバー再起動
npm run dev

# 2. キャッシュクリア
rm -rf .next
npm run dev

# 3. 依存関係再インストール
rm -rf node_modules
npm install
npm run dev
```

### デザイン崩れ発生時

1. **globals.css**の変更を確認
2. **design-system.ts**の値を確認
3. **Button.tsx**などの基幹コンポーネント確認
4. 必要に応じて前回の正常なコミットに戻す

---

## 🎨 デザインシステム参照表

### カラーパレット

```typescript
// プライマリカラー（変更禁止）
accent.primary: "#ff6b35"     // メインアクセント
accent.secondary: "#ff8757"   // サブアクセント

// 背景色（変更禁止）
bg.primary: "#0a0a0a"         // メイン背景
bg.secondary: "#1a1a1a"       // セカンダリ背景
bg.tertiary: "#2a2a2a"        // サード背景
```

### スペーシング（8px グリッド）

```typescript
"1": "0.25rem",  // 4px
"2": "0.5rem",   // 8px
"3": "0.75rem",  // 12px
"4": "1rem",     // 16px
"6": "1.5rem",   // 24px
"8": "2rem",     // 32px
```

---

## 🔍 最終確認事項

このガイドラインを読んだ開発者は、以下を理解し同意したものとします：

1. ✅ **デザインの一貫性が最優先**であること
2. ✅ **シンプルさこそがプロフェッショナル品質**であること
3. ✅ **過度な最適化は保守性を損なう**こと
4. ✅ **既存の設計原則を尊重する**こと

---

## 📝 更新履歴

- **2025 年 8 月 3 日**: 初版作成（エラー修正とデザイン差異防止対策）
- **目的**: 「AI が作ったような UI」を完全に排除し、プロフェッショナル品質を維持

---

**💡 覚えておいてください**: 「シンプルで一貫性のあるデザインこそが、最高のユーザーエクスペリエンスを生み出します」
