# 🔒 デザイン差異防止ガイドライン

## 📋 概要

このドキュメントは、今後のコード変更や機能追加において**デザインの一貫性を保持**し、**CSS 競合や UI 差異の発生を防止**するための厳格なガイドラインです。

---

## ⚠️ 重要な警告

### 🚨 **慎重に変更すべき核心ファイル**

以下のファイルは、**デザインシステムの核心**であり、変更時は全体への影響を十分検討してください：

```
⚠️ 慎重に変更すべきファイル
├── src/app/globals.css           # グローバルCSS - Cascade Layers使用
├── src/constants/design-system.ts # デザイントークン - 色・サイズの統一管理
├── src/components/ui/Button.tsx   # ボタンコンポーネント - 状態管理実装済み
├── src/app/page.tsx              # メインページ - framer-motion使用
├── src/utils/editor.ts           # エディター設定 - !important使用許可
└── src/app/theme.ts              # Chakra UIテーマ - カラーパレット定義
```

---

## 🎯 設計原則（絶対遵守）

### 1. **実用的なシンプルさの維持**

- ✅ framer-motion: ページレベルのトランジションのみ使用
- ❌ 複雑な数学的計算（黄金比等）によるスタイリング禁止
- ✅ 8px グリッドシステムの遵守（design-system.tsで管理）
- ✅ 必要最小限の CSS プロパティの使用

### 2. **CSS 競合の適切な管理**

- ✅ `!important`: CodeMirrorテーマでのみ使用許可
- ❌ インラインスタイルの濫用禁止
- ✅ Chakra UI との適切な共存
- ✅ design-system.ts のトークン優先使用

### 3. **パフォーマンスと UX のバランス**

- ✅ React state による適度なインタラクティブ効果
- ✅ ホバー・プレス状態の実装（ボタンコンポーネント）
- ❌ 過度な GPU 最適化の追加禁止
- ✅ 0.2s 程度の滑らかな transition 使用

---

## 📐 具体的な制約事項

### CSS/スタイリング

```css
/* ❌ 避けるべき例 */
.component {
  /* 複雑な計算 */
  padding: calc(var(--golden-ratio) * 1.618rem);

  /* 過度なGPU最適化 */
  will-change: transform, opacity, filter, background;
  transform: translateZ(0) scale3d(1, 1, 1) perspective(1000px);

  /* 複雑すぎるアニメーション */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ✅ 推奨例 */
.component {
  /* design-system.tsの値を使用 */
  padding: var(--space-md); /* 1.5rem = 24px */

  /* 適度なトランジション */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ 例外: CodeMirrorでの!important使用 */
.cm-cursor {
  border-left: 2px solid var(--color-accent-primary) !important;
}
```

### コンポーネント設計

```tsx
/* ❌ 避けるべき例 */
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
    過度に複雑なアニメーション
  </MotionBox>
);

/* ✅ 推奨例1: React state使用 */
const Component = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Box
      style={{
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      適度なインタラクション
    </Box>
  );
};

/* ✅ 推奨例2: 必要最小限のframer-motion */
const MotionBox = motion.create(Box);

const PageComponent = () => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    ページレベルのシンプルなトランジション
  </MotionBox>
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

- [ ] `!important`をCodeMirror以外で使用していないか？
- [ ] 複雑な計算式を使用していないか？
- [ ] framer-motion をページレベル以外で追加していないか？
- [ ] design-system.ts以外で新しいカラー値を定義していないか？
- [ ] React stateでのインタラクション実装を検討したか？

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
import { Button, ModeTabButton } from "./ui/Button"; // ✅ 状態管理実装済み
import { DESIGN_SYSTEM } from "@/constants"; // ✅ トークン使用

// ✅ React stateによるインタラクション
const [isHovered, setIsHovered] = useState(false);

// ✅ design-system.tsの値を使用
const styles = {
  background: DESIGN_SYSTEM.colors.bg.primary,
  color: DESIGN_SYSTEM.colors.accent.primary,
};
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
- **2025 年 8 月 3 日**: 現実のコードベースに合わせて更新
  - framer-motionの適切な使用を明記
  - !importantのCodeMirrorでの使用を許可
  - React stateによるインタラクション実装を推奨
- **目的**: 実用的で保守しやすいプロフェッショナル品質の維持

---

**💡 覚えておいてください**: 「シンプルで一貫性のあるデザインこそが、最高のユーザーエクスペリエンスを生み出します」
