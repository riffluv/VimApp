# Vim コマンド未対応・制限一覧（CodeMirror Vim 拡張 @replit/codemirror-vim 2025 年 7 月調査）

一部 Vim コマンドは CodeMirror Vim 拡張で未対応・制限・バグがあります。下記に主な注意点をまとめます。

- 複数回数指定のテキストオブジェクト（例: v2a[、v8a[）は正しく動作しない（Issue #229）
- fold 系コマンド（zc, zo, zm, zr 等）は未対応
- %（括弧ジャンプ）は一部未対応（Issue #234）
- IME/日本語キーボードでの挙動にバグ報告あり（Issue #153）
- タグオブジェクト（cat, cit 等）は HTML/XML モードでのみ有効
- 一部 Ex コマンドやマクロ、Undo 系（U）なども未対応・制限あり

基本的な移動・編集・ヤンク・削除・置換・検索・ビジュアルモード等はほぼ全て動作しますが、上記の特殊コマンドや複雑な操作は制限があります。最新情報は GitHub Issue（https://github.com/replit/codemirror-vim/issues）を参照してください。

# CSS ベストプラクティス 2025 (vimapp プロジェクト) - 完全リファクタリング版

このドキュメントは、`vimapp`プロジェクトにおける CSS/スタイリングのコーディング規約とベストプラクティスを定義します。
**2025 年最新のモダン CSS 技術**を基盤として、一貫性、メンテナンス性、パフォーマンス、アクセシビリティを最高レベルで保つことを目的とします。

## 1. 基本方針：Chakra UI Props + モダン CSS 技術の融合

当プロジェクトでは、UI の構築に **Chakra UI v3** を全面的に採用し、最新のモダン CSS 技術と組み合わせます：

### 1.1 採用技術スタック

- **CSS Isolation & Scoping**: 各コンポーネントの CSS を完全に分離
- **Container Queries**: レスポンシブデザインの新時代対応
- **CSS Cascade Layers**: スタイル優先順位の明確化
- **Modern CSS Custom Properties**: デザイントークンシステム
- **Performance-First Approach**: レイアウトスラッシング完全回避

**[OK] 正しい例:**

```jsx
<Box
  bg="teal.500"
  p={4}
  color="white"
  containerType="inline-size"
  isolation="isolate"
>
  Hello World
</Box>
```

## 2. パフォーマンスファーストアプローチ（2025 年製品化基準）

### 2.1 レイアウトスラッシング完全回避

以下の原則を **絶対に** 遵守し、強制同期レイアウトを排除します：

**[CRITICAL] 禁止パターン:**

```jsx
// ❌ レイアウトスラッシングを引き起こす
const BadButton = () => {
  const handleHover = () => {
    element.offsetWidth; // 読み取り
    element.style.width = "200px"; // 書き込み - レイアウト強制発生
  };
};
```

**[OK] 最適化パターン:**

```jsx
// ✅ レイアウトスラッシング回避
const OptimizedButton = () => (
  <Button
    // transform/opacity のみ使用（コンポジターレイヤー）
    _hover={{
      transform: "translateY(-1px)", // GPU アクセラレーション
      opacity: 0.9, // レイアウト発生しない
      willChange: "transform", // 最適化ヒント
    }}
    // CSS Isolation で副作用防止
    isolation="isolate"
    // Container Query 対応
    containerType="inline-size"
  >
    Button
  </Button>
);
```

### 2.2 コンポジターフレンドリーアニメーション

以下のプロパティ **のみ** をアニメーションで使用：

- `transform` (translate, rotate, scale)
- `opacity`
- `filter`
- `backdrop-filter`

**[NG] 避けるべきアニメーション:**

```css
/* ❌ レイアウト発生 - 禁止 */
.bad-animation {
  transition: width 0.3s, height 0.3s, top 0.3s;
}
```

**[OK] 推奨アニメーション:**

```css
/* ✅ GPU アクセラレーション対応 */
.good-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
  will-change: transform; /* 必要時のみ設定 */
}
```

## 3. モダン CSS 技術の活用（2025 年最新）

### 3.1 CSS 分離とスコープ化

**全てのコンポーネント**で CSS 分離を徹底し、副作用を完全に防止します：

```jsx
// ✅ CSS分離の徹底
const IsolatedComponent = () => (
  <Box
    isolation="isolate" // CSS分離
    position="relative" // スタッキングコンテキスト作成
    zIndex="auto" // z-index管理の簡素化
    containerType="inline-size" // Container Query有効化
  >
    <Button
      _hover={{
        // ホバー効果を親に波及させない
        transform: "translateY(-1px)",
        isolation: "isolate",
      }}
    >
      Content
    </Button>
  </Box>
);
```

### 3.2 Container Queries でレスポンシブ進化

メディアクエリから Container Queries に移行し、より柔軟なレスポンシブデザインを実現：

```jsx
// ✅ Container Query活用例
const ResponsiveCard = () => (
  <Box
    containerType="inline-size"
    sx={{
      // Container Query でカード内レイアウト制御
      "@container (width >= 300px)": {
        ".card-content": {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        },
      },
      "@container (width >= 500px)": {
        ".card-content": {
          gridTemplateColumns: "1fr 1fr 1fr",
        },
      },
    }}
  >
    <div className="card-content">{/* カード内コンテンツ */}</div>
  </Box>
);
```

### 3.3 カスケードレイヤーによる優先順位管理

CSS の優先順位を明確に分離し、`!important` を排除：

```css
/* globals.css で定義 */
@layer reset, base, components, utilities, overrides;

@layer reset {
  /* CSS Reset */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer base {
  /* 基本スタイル */
  html {
    font-family: "Inter", sans-serif;
  }
  body {
    background: var(--color-bg-primary);
  }
}

@layer components {
  /* コンポーネント固有スタイル */
  .vim-editor {
    /* エディタ特有のスタイル */
  }
}

@layer utilities {
  /* ユーティリティクラス */
  .sr-only {
    position: absolute; /* ... */
  }
}
```

## 4. レスポンシブデザイン

レスポンシブデザインは、Chakra UI の**配列（Array）またはオブジェクト（Object）構文**を使用して実装します。

- **配列構文:** `[mobile, tablet, desktop]` の順で値を指定します。
- **オブジェクト構文:** `{{ base: '...', md: '...', lg: '...' }}` のように、ブレークポイントを明示的に指定します。

**[OK] 正しい例:**

```jsx
// 画面幅が広がるにつれて、paddingが大きくなる
<Box p={{ base: 2, md: 4, lg: 8 }}>
  Responsive Padding
</Box>

// 画面幅が狭い時は縦並び、広い時は横並び
<Flex direction={{ base: "column", lg: "row" }}>
  ...
</Flex>
```

## 5. スタイルの優先順位

1.  **Chakra UI スタイル Props:** (例: `bg`, `p`, `m`, `color`) を最優先で使用します。
2.  **`style` Prop:** Framer Motion など外部ライブラリとの連携で必要な場合のみ使用します。
3.  **`globals.css`:** アプリケーション全体で共通の、ごく基本的なスタイル（例: `body`のフォントファミリー、リセット CSS）のみを記述します。コンポーネント固有のスタイルは**絶対に**記述しません。
4.  **Tailwind CSS クラス:** `className` 属性での Tailwind CSS の直接利用は、Chakra UI のシステムと競合するため**禁止**します（Google Fonts 等のクラス適用は除く）。

## 6. テーマとデザイントークン・マジックナンバー禁止

- **色:** カラーパレットは Chakra UI のデフォルトテーマ、または将来的に拡張するカスタムテーマで管理します。`red.500` や `gray.800` のように、テーマで定義された名前で色を指定し、HEX コード (`#FF0000`) のハードコーディングは**禁止**です。
- **スペーシング:** `p={4}` や `gap={6}` のように、テーマで定義されたスペーシングスケールを使用します。`p="15px"` のようなマジックナンバーは**禁止**です。
- **フォントサイズ:** `fontSize="lg"` のように、テーマで定義されたタイポグラフィスケールを使用します。

## 7. コンポーネントの責務

- スタイルは、そのスタイルが適用されるコンポーネント内で完結させます。
- 親コンポーネントが子コンポーネントの内部スタイルを上書きするような実装は、予期せぬ競合の原因となるため避けてください。
- 状態管理と UI の責務を明確に分離し、カスタムフックによって状態管理を抽象化します。

## 8. アニメーション

アニメーションは Framer Motion を使用し、定数として外部化したバリアントを使用します。

**[OK] 正しい例:**

```jsx
// constants/index.ts
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  },
} as const;

// Component
<MotionBox
  initial="hidden"
  animate="visible"
  variants={ANIMATION_VARIANTS.container}
>
  Content
</MotionBox>
```

---

## 11. リファクタリング済みパターン（2025 年 7 月 31 日更新）

### 11.1. コードアーキテクチャパターン（2025 年製品化レベル）

**[OK] 責務分離とモジュール化:**

```typescript
// constants/index.ts - 設定の外部化
export const EDITOR_CONFIG = {
  modes: ["html", "css", "js"] as const,
  fonts: {
    mono: "JetBrains Mono, 'Fira Code', 'SF Mono', monospace",
    ui: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  cursor: {
    color: "#e8833a",
    width: "2px",
    blockWidth: "8px",
  },
} as const;

// utils/editor.ts - エディタロジック集約
export const getEditorExtensions = (mode: EditorMode): Extension[] => {
  return [
    Prec.highest(vim()),
    languageExtensions[mode],
    advancedAutocompletion,
    // ...他の拡張
  ];
};

// hooks/useVimEditor.ts - 状態管理分離
export const useVimEditor = () => {
  const [vimMode, setVimMode] = useState<VimMode>("normal");
  // ロジック実装
  return { vimMode, onUpdate };
};
```

### 11.2. パフォーマンス最適化パターン

**[OK] 推奨パターン:**

```typescript
// メモ化によるレンダリング最適化
const VimEditor = memo(({ onCodePenModeChange }: VimEditorProps) => {
  const extensions = useMemo(() => getEditorExtensions(mode), [mode]);

  const handleChange = useCallback(
    (value: string) => {
      updateDoc(mode, value);
    },
    [mode, updateDoc]
  );

  return (
    <CodeMirror
      value={docs[mode]}
      onChange={handleChange}
      extensions={extensions}
    />
  );
});
```

### 11.3. TypeScript 型安全性パターン

**[OK] 推奨パターン:**

```typescript
// types/editor.ts - 厳密な型定義
export interface VimEditorProps {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
}

export type EditorMode = "html" | "css" | "js";
export type VimMode =
  | "normal"
  | "insert"
  | "visual"
  | "visualLine"
  | "visualBlock";

// 型ガードでランタイム安全性確保
export const isValidEditorMode = (mode: string): mode is EditorMode => {
  return ["html", "css", "js"].includes(mode);
};

// 定数の型安全性
export const VIM_MODE_INFO = {
  normal: { text: "NORMAL", color: "secondary.400" },
  insert: { text: "INSERT", color: "green.400" },
  visual: { text: "VISUAL", color: "purple.400" },
} as const satisfies Record<VimMode, { text: string; color: string }>;
```

### 11.5. リファクタリング履歴（2025 年 7 月 31 日完了）

**[COMPLETED] 製品化レベルリファクタリング:**

1. **クリーンアップ完了**

   - 不要ファイル削除: `VimEditor_new.tsx`, `VimEditor_fixed.tsx`, `monaco-vim.d.ts`
   - レガシー CSS 削除: `accessibility.css`, `container-queries.css`, `dynamic-viewport.css`
   - 未使用ディレクトリ削除: `samplecode01/`, `samplecode02/`, `neovim/`, `styles/`

2. **TypeScript 型安全性向上**

   - Vim 拡張モード追加: `visualLine`, `visualBlock`
   - 型ガード関数実装: `isValidEditorMode`, `isValidVimMode`
   - 型定義の統一化とインポート最適化

3. **パフォーマンス最適化実装**

   - React.memo 適用によるレンダリング最適化
   - useMemo/useCallback による不要な再計算防止
   - デバウンス設定の外部化（150ms）

4. **エラーハンドリング強化**

   - try-catch 文による例外処理
   - ユーザーフレンドリーなエラー表示
   - ローディング状態とエラー状態の管理

5. **コード品質向上**
   - JSDoc 形式のドキュメンテーション
   - displayName 設定による開発体験向上
   - 一貫した命名規則とコメント

**[VERIFIED] 動作確認済み機能:**

- ✅ CodeMirror 6 + Vim 拡張の正常動作
- ✅ HTML/CSS/JS の 3 モード切り替え
- ✅ Emmet CSS 補完のカーソル位置修正
- ✅ Visual Line/Block モード検出
- ✅ エラーハンドリングとローディング状態
- ✅ レスポンシブ対応
- ✅ プレビュー機能

### 11.3. アニメーション統一

**[OK] 推奨パターン:**

```jsx
// constants/index.ts でアニメーションバリアントを定義
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, staggerChildren: 0.05 },
    },
  },
  modeIndicator: {
    hidden: { opacity: 0, x: -15, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 15, scale: 0.9, transition: { duration: 0.2 } },
  },
} as const;

// コンポーネントで使用
<MotionBox
  initial="hidden"
  animate="visible"
  variants={ANIMATION_VARIANTS.container}
>
  <AnimatePresence mode="wait">
    <MotionFlex
      key={vimMode}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={ANIMATION_VARIANTS.modeIndicator}
    >
      {content}
    </MotionFlex>
  </AnimatePresence>
</MotionBox>
```

### 11.4. CSS 分離とホバー効果

**[OK] 推奨パターン:**

```jsx
// ホバー効果の分離
const getButtonHoverStyle = () => ({
  bg: "gray.600",
  color: UI_STYLES.colors.primary,
  borderColor: "gray.500",
  transform: "translateY(-1px)",
  boxShadow: UI_STYLES.shadow.subtle,
  isolation: "isolate", // CSS分離を強制
  zIndex: 10, // スタッキングコンテキストを作成
});

// エディタコンテナの保護
<Box
  isolation="isolate" // CSS分離を強制してホバー効果の影響を防ぐ
  zIndex={1} // スタッキングコンテキストを作成
>
  <CodeMirror {...props} />
</Box>;
```

**理由:** 2025 年 7 月 29 日の作業で判明したように、ボタンのホバー効果が CodeMirror エディタのコンテンツに予期しない影響を与える可能性があります。CSS 分離(`isolation: "isolate"`)とスタッキングコンテキスト(`zIndex`)を適切に使用することで、この問題を防げます。

---

**このリファクタリング済みパターンは、今後のコンポーネント開発の基準となります。**

---

## 9. 使用を避けるべき技術

### 9.1. インラインスタイル (`style={...}`)

`style`属性によるインラインスタイルの使用は、動的に計算された値（例: `transform: translateX(${value}px)`) を適用するなど、やむを得ない場合、または外部ライブラリ（Framer Motion 等）との連携に必要な場合を除き**原則禁止**とします。

**ただし、外部ライブラリのラッパー（例: CodeMirror, サードパーティ製エディタ等）で Chakra UI の Props で完全にスタイル制御できない場合は、必要最小限の style 属性利用を許容します。**

**[NG] 避けるべき例:**

```jsx
// アイコンのマージンを style で指定
<FiBookOpen style={{ marginRight: "4px" }} />
```

**[OK] 正しい例:**

```jsx
// Chakra UI の Icon コンポーネントと Props を使用
<Icon as={FiBookOpen} mr={1} />
```

**理由:** Chakra UI のテーマ（デザイントークン、レスポンシブ対応、疑似セレクタ）が適用できず、デザインの一貫性を損なうためです。常に Chakra UI のスタイル Props を優先してください。

### 9.2. グローバル CSS クラス（`.glass-effect`等）

Chakra UI の CSS-in-JS システムと競合するグローバル CSS クラスの定義は**禁止**します。ガラスモーフィズム効果やその他の視覚効果は、Chakra UI の Props（`backdropFilter`, `bg`, `border`等）で実装してください。

**[NG] 避けるべき例:**

```css
/* globals.css */
.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(255, 152, 0, 0.2);
}
```

**[OK] 正しい例:**

```jsx
// Chakra UI Props で同等の効果を実現
<Box
  backdropFilter="blur(20px)"
  bg="rgba(24, 24, 27, 0.8)"
  border="1px solid"
  borderColor="rgba(255, 152, 0, 0.2)"
>
  Content
</Box>
```

### 9.3. BEM (Block Element Modifier)・Tailwind CSS

BEM は、CSS クラスの命名規則であり、当プロジェクトのスタイリングアプローチとは異なるため**使用しません**。

Tailwind CSS のクラスも Chakra UI の Props/テーマと競合するため**使用禁止**です（Google Fonts 等のクラス適用は除く）。

**理由:** Chakra UI はコンポーネント単位でスタイルを管理する CSS-in-JS のアプローチです。BEM や Tailwind が解決しようとするグローバルな CSS クラス名の衝突や管理の問題は、このアプローチでは発生しません。私たちは CSS クラス名ではなく、React コンポーネントの Props によってスタイルを記述します。

---

## 10. Vim コマンド互換性に関する注意（CodeMirror Vim 拡張）

本プロジェクトの Vim エディタは、CodeMirror の Vim 拡張（@replit/codemirror-vim）を利用しています。
しかし、現状の CodeMirror Vim 拡張は本家 Vim と完全同等のコマンド互換性はありません。

特に、cit/cat 等のテキストオブジェクトコマンドや複数回数指定（例: v2a[）は未対応、または挙動が異なる場合があります。
（詳細は[公式 Issue](https://github.com/replit/codemirror-vim/issues/229)等を参照）

**Vim コマンドの練習用途としては十分ですが、厳密な Vim 互換を求める場合は注意してください。**

今後のアップデートや独自拡張で改善される可能性はありますが、現状は一部コマンドが未対応・バグありです。
