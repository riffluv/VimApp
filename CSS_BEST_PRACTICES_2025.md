# Vim コマンド未対応・制限一覧（CodeMirror Vim 拡張 @replit/codemirror-vim 2025 年 7 月調査）

一部 Vim コマンドは CodeMirror Vim 拡張で未対応・制限・バグがあります。下記に主な注意点をまとめます。

- 複数回数指定のテキストオブジェクト（例: v2a[、v8a[）は正しく動作しない（Issue #229）
- fold 系コマンド（zc, zo, zm, zr 等）は未対応
- %（括弧ジャンプ）は一部未対応（Issue #234）
- IME/日本語キーボードでの挙動にバグ報告あり（Issue #153）
- タグオブジェクト（cat, cit 等）は HTML/XML モードでのみ有効
- 一部 Ex コマンドやマクロ、Undo 系（U）なども未対応・制限あり

基本的な移動・編集・ヤンク・削除・置換・検索・ビジュアルモード等はほぼ全て動作しますが、上記の特殊コマンドや複雑な操作は制限があります。最新情報は GitHub Issue（https://github.com/replit/codemirror-vim/issues）を参照してください。

# CSS ベストプラクティス 2025 (vimapp プロジェクト) - リファクタリング版

このドキュメントは、`vimapp`プロジェクトにおける CSS/スタイリングのコーディング規約とベストプラクティスを定義します。
一貫性、メンテナンス性、パフォーマンス、アクセシビリティを高く保つことを目的とします。

## 1. 基本方針：Chakra UI Props を徹底活用

当プロジェクトでは、UI の構築に **Chakra UI** を全面的に採用します。
CSS の記述は、原則として Chakra UI が提供する**スタイル Props**を通じて行い、`globals.css` には最低限のリセット・ベーススタイルのみを記述します。

**[OK] 正しい例:**

```jsx
<Box bg="teal.500" p={4} color="white">
  Hello World
</Box>
```

## 2. コンポーネント設計とコード分離

### 2.1. カスタムフックによる状態管理の分離

状態管理とビジネスロジックは、カスタムフックに分離します。これにより、コンポーネントの責務を明確にし、テスタビリティと再利用性を向上させます。

**[OK] 正しい例:**

```jsx
// hooks/useVimEditor.ts - 状態管理とロジックを分離
export const useDocs = () => {
  const [docs, setDocs] = useState(loadDocsFromStorage());

  const updateDoc = useCallback(
    (mode, value) => {
      const updated = { ...docs, [mode]: value };
      setDocs(updated);
      saveDocsToStorage(updated);
    },
    [docs]
  );

  return { docs, updateDoc, clearDoc, resetAllDocs };
};

// components/VimEditor.tsx - UI のみに集中
function VimEditor() {
  const { docs, updateDoc } = useDocs();
  const { vimMode, onUpdate } = useVimMode();

  return (
    <MotionBox>
      <CodeMirror value={docs[mode]} onChange={updateDoc} />
    </MotionBox>
  );
}
```

### 2.2. 型定義の集約

すべての型定義は `src/types/` ディレクトリに集約し、コンポーネント間での型の一貫性を保ちます。

**[OK] 正しい例:**

```typescript
// types/editor.ts
export interface VimEditorProps {
  onCodePenModeChange?: (isCodePenMode: boolean) => void;
}

export type EditorMode = "html" | "css" | "js";
export type VimMode = "normal" | "insert" | "visual";
```

### 2.3. 定数の外部化

マジックナンバーや設定値は `src/constants/` ディレクトリに外部化し、保守性を向上させます。

**[OK] 正しい例:**

```typescript
// constants/index.ts
export const VIM_MODE_INFO = {
  normal: {
    text: "NORMAL",
    color: "secondary.400",
    icon: FiCommand,
    hint: "Press i to enter insert mode",
  },
  // ...
} as const;

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  },
  // ...
} as const;
```

## 3. ユーティリティ関数の分離

### 3.1. ビジネスロジックの外部化

複雑なロジックは `src/utils/` ディレクトリのユーティリティ関数に分離し、コンポーネントをシンプルに保ちます。

**[OK] 正しい例:**

```typescript
// utils/storage.ts
export const loadDocsFromStorage = (): DocsState => {
  try {
    const saved = localStorage.getItem("vimapp_shared_docs");
    return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_CODE;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return DEFAULT_SAMPLE_CODE;
  }
};

// utils/editor.ts
export const generatePreviewHTML = (
  html: string,
  css: string,
  js: string
): string => {
  const bodyContent = extractBodyContent(html);
  return createIframeDocument(bodyContent, css, js);
};
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

## 11. リファクタリング済みパターン（2025年7月29日更新）

### 11.1. スタイル関数パターン

**[OK] 推奨パターン:**

```typescript
// 共通スタイル関数でマジックナンバーを排除
const getButtonBaseStyle = (isActive = false) => ({
  size: "sm" as const,
  variant: "ghost" as const,
  bg: isActive ? "gray.600" : "gray.700",
  color: isActive ? UI_STYLES.colors.primary : "gray.300",
  borderWidth: "1px",
  borderColor: isActive ? "gray.500" : "gray.600",
  fontSize: "xs",
  fontWeight: "600",
  px: 3,
  transition: `all ${UI_STYLES.animation.transition.duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
  fontFamily: EDITOR_CONFIG.fonts.ui,
});

// 使用例
<Button
  {...getButtonBaseStyle(showPreview)}
  onClick={handlePreviewToggle}
  _hover={getButtonHoverStyle()}
  _active={getButtonActiveStyle()}
>
  Preview
</Button>
```

### 11.2. 設定の外部化

**[OK] 推奨パターン:**

```typescript
// constants/index.ts
export const UI_STYLES = {
  animation: {
    spring: { type: "spring", damping: 25, stiffness: 300 },
    easeOut: { type: "tween", ease: "easeOut", duration: 0.2 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  spacing: {
    buttonGap: 1,
    containerPadding: 4,
    borderRadius: "lg",
    iconMargin: 1.5,
  },
  shadow: {
    subtle: "0 4px 12px rgba(232,131,58,0.15)",
    medium: "0 6px 20px rgba(232,131,58,0.2)",
  },
  colors: {
    primary: "secondary.400",
    accent: "#e8833a",
    transparent: "rgba(232,131,58,0.15)",
  },
} as const;

export const EDITOR_CONFIG = {
  modes: ["html", "css", "js"] as const,
  defaultMode: "html" as const,
  fonts: {
    mono: "JetBrains Mono, 'Fira Code', 'SF Mono', 'Monaco', Menlo, 'Ubuntu Mono', monospace",
    ui: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif",
  },
  cursor: {
    color: "#e8833a",
    width: "2px",
    blockWidth: "8px",
    height: "1.2em",
  },
} as const;
```

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

### 11.4. CSS分離とホバー効果

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
</Box>
```

**理由:** 2025年7月29日の作業で判明したように、ボタンのホバー効果がCodeMirrorエディタのコンテンツに予期しない影響を与える可能性があります。CSS分離(`isolation: "isolate"`)とスタッキングコンテキスト(`zIndex`)を適切に使用することで、この問題を防げます。

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
