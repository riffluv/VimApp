# 🏗️ VimApp 設計方針・統合ガイドライン 2025

## 📋 概要

この統合ガイドラインは、VimApp プロジェクトの設計思想、アーキテクチャパターン、および実装指針を包括的にまとめたものです。今後の機能追加やエージェントによる自動化開発において、一貫性のある高品質なコードベースを維持するための指針となります。

---

## 🎯 設計哲学

### 核心原則

#### 1. **シンプルさ至上主義**

- **複雑性よりも可読性**: 巧妙なコードより明確なコード
- **最小限の依存関係**: 必要最小限のライブラリ使用
- **単一責務原則**: 一つのコンポーネント・関数は一つの責務

#### 2. **型安全性の完全実装**

- **TypeScript strict mode**: 完全な型チェック
- **実行時バリデーション**: Zod スキーマによる検証
- **型ガード**: 安全な型変換

#### 3. **パフォーマンス・ファースト**

- **メモ化戦略**: React.memo, useMemo, useCallback
- **遅延読み込み**: Dynamic import, Suspense
- **最小レンダリング**: 必要な時のみ再描画

#### 4. **アクセシビリティ・ファースト**

- **ARIA 属性**: 完全な支援技術サポート
- **キーボードナビゲーション**: マウス不要の操作
- **カラーコントラスト**: WCAG AA 準拠

---

## 🏗️ アーキテクチャパターン

### ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # グローバルスタイル
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ
│   ├── providers.tsx       # プロバイダー設定
│   ├── theme.ts            # 基本テーマ
│   └── theme-v3.ts         # 強化テーマ（V3対応）
│
├── components/             # React コンポーネント
│   ├── ui/                 # 基本UIコンポーネント
│   │   ├── Button.tsx            # 既存ボタン
│   │   ├── Button-enhanced.tsx   # 強化ボタン
│   │   └── ...
│   ├── features/           # 機能別コンポーネント
│   │   ├── VimEditor.tsx         # 既存エディタ
│   │   ├── VimEditor-enhanced.tsx # 強化エディタ
│   │   ├── CheatSheet.tsx
│   │   └── ...
│   └── layouts/            # レイアウトコンポーネント
│
├── hooks/                  # カスタムフック
│   ├── useVimEditor.ts           # 既存フック
│   ├── useVimEditor-enhanced.ts  # 強化フック
│   └── ...
│
├── types/                  # TypeScript型定義
│   ├── editor.ts
│   └── ...
│
├── utils/                  # ユーティリティ関数
│   ├── editor.ts
│   ├── storage.ts
│   └── ...
│
├── constants/              # 定数・設定
│   ├── index.ts
│   ├── design-system.ts
│   └── ...
│
└── stores/                 # 状態管理（将来的）
    └── ...
```

### レイヤー責務分離

#### 1. **Presentation Layer (UI Components)**

```typescript
// ✅ 責務: 表示ロジックのみ
const Component = ({ data, onAction }: Props) => {
  return (
    <Box>
      <Text>{data.title}</Text>
      <Button onClick={onAction}>Action</Button>
    </Box>
  );
};

// ❌ 避けるべき: ビジネスロジックを含む
const Component = ({ id }: Props) => {
  const [data, setData] = useState();

  useEffect(() => {
    // データフェッチング（別の層で行うべき）
    fetchData(id).then(setData);
  }, [id]);

  return <div>{/* ... */}</div>;
};
```

#### 2. **Business Logic Layer (Custom Hooks)**

```typescript
// ✅ 責務: 状態管理とビジネスロジック
export function useDocumentEditor(initialDoc: Document) {
  const [doc, setDoc] = useState(initialDoc);
  const [isDirty, setIsDirty] = useState(false);

  const updateDoc = useCallback((content: string) => {
    setDoc((prev) => ({ ...prev, content }));
    setIsDirty(true);
  }, []);

  const saveDoc = useCallback(async () => {
    try {
      await saveToStorage(doc);
      setIsDirty(false);
    } catch (error) {
      // エラーハンドリング
    }
  }, [doc]);

  return { doc, isDirty, updateDoc, saveDoc };
}
```

#### 3. **Data Access Layer (Utils)**

```typescript
// ✅ 責務: データの永続化・取得
export const storageUtils = {
  async save<T>(key: string, data: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      throw new StorageError("Failed to save data");
    }
  },

  async load<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      throw new StorageError("Failed to load data");
    }
  },
};
```

---

## 🎨 デザインシステム統合

### テーマシステムの使用

#### 1. **Chakra UI テーマの活用**

```typescript
// ✅ セマンティックトークンの使用
const Component = () => (
  <Box
    bg="gray.900" // ダークモード対応
    color="gray.100" // 自動コントラスト調整
    borderColor="gray.700" // 一貫したボーダー
  >
    Content
  </Box>
);

// ❌ 避けるべき: ハードコードされた値
const Component = () => (
  <Box
    bg="#111827" // 固定値はNG
    color="#f3f4f6" // テーマ変更に対応できない
    borderColor="#374151" // メンテナンス性低下
  >
    Content
  </Box>
);
```

#### 2. **デザイントークンの活用**

```typescript
import { DESIGN_SYSTEM } from "@/constants/design-system";

// ✅ 統一されたデザイントークン
const styles = {
  spacing: DESIGN_SYSTEM.spacing.md,
  color: DESIGN_SYSTEM.colors.accent.primary,
  borderRadius: DESIGN_SYSTEM.borders.radius.lg,
};

// ❌ 個別の値定義
const styles = {
  spacing: "1.5rem", // 統一性欠如
  color: "#ff6b35", // 色の一貫性なし
  borderRadius: "0.5rem", // スケール感の喪失
};
```

### コンポーネント設計パターン

#### 1. **合成可能コンポーネント**

```typescript
// ✅ 小さな部品から大きな機能を構築
const EditorToolbar = () => (
  <Flex gap={2}>
    <EditorActionButton onClick={onSave}>Save</EditorActionButton>
    <EditorActionButton onClick={onClear}>Clear</EditorActionButton>
    <EditorPrimaryButton onClick={onReset}>Reset</EditorPrimaryButton>
  </Flex>
);

// ❌ モノリシックコンポーネント
const EditorToolbar = ({
  onSave,
  onClear,
  onReset,
  showSave,
  showClear,
  showReset,
  saveLabel,
  clearLabel,
  resetLabel,
}: ComplexProps) => (
  <Flex gap={2}>
    {showSave && <Button onClick={onSave}>{saveLabel}</Button>}
    {showClear && <Button onClick={onClear}>{clearLabel}</Button>}
    {showReset && <Button onClick={onReset}>{resetLabel}</Button>}
  </Flex>
);
```

#### 2. **型安全なプロパティ設計**

```typescript
// ✅ 厳密な型定義
interface ButtonProps {
  variant: "solid" | "ghost" | "outline";
  size: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// ❌ 曖昧な型定義
interface ButtonProps {
  style?: string; // 何でも受け入れるは危険
  config?: any; // any型は型安全性を失う
  options?: object; // 具体的でない
}
```

---

## 🔧 実装パターン

### カスタムフック設計

#### 1. **責務の明確化**

```typescript
// ✅ 単一責務のフック
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // ローカルストレージ操作のみに特化
}

export function useDebounce<T>(value: T, delay: number) {
  // デバウンス処理のみに特化
}

export function useVimEditor() {
  // Vimエディタ状態管理のみに特化
}

// ❌ 多重責務のフック
export function useEverything() {
  // ストレージ、デバウンス、API、UI状態...
  // 責務が不明確
}
```

#### 2. **エラーハンドリングの統一**

```typescript
// ✅ 一貫したエラーハンドリング
export function useAsyncOperation<T>() {
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    loading: boolean;
  }>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await operation();
      setState({ data, error: null, loading: false });
    } catch (error) {
      setState({ data: null, error: error as Error, loading: false });
    }
  }, []);

  return { ...state, execute };
}
```

### パフォーマンス最適化パターン

#### 1. **メモ化戦略**

```typescript
// ✅ 適切なメモ化
const ExpensiveComponent = memo(({ data, onAction }: Props) => {
  const processedData = useMemo(
    () => expensiveCalculation(data),
    [data] // 依存配列を明確に
  );

  const handleAction = useCallback(
    (id: string) => onAction(id),
    [onAction] // 依存関係を最小限に
  );

  return <div>{/* レンダリング */}</div>;
});

// ❌ 過度なメモ化
const SimpleComponent = memo(({ text }: { text: string }) => {
  // シンプルなコンポーネントにmemoは不要
  return <Text>{text}</Text>;
});
```

#### 2. **レンダリング最適化**

```typescript
// ✅ レンダリング最適化
const ListComponent = ({ items }: { items: Item[] }) => {
  return (
    <VirtualizedList
      items={items}
      renderItem={({ item }) => <ItemComponent key={item.id} item={item} />}
    />
  );
};

// ❌ 非効率なレンダリング
const ListComponent = ({ items }: { items: Item[] }) => {
  return (
    <div>
      {items.map((item) => (
        <ItemComponent
          key={item.id}
          item={item}
          // 毎回新しいオブジェクトを作成（React.memoが無効化）
          style={{ marginBottom: "1rem" }}
        />
      ))}
    </div>
  );
};
```

---

## 🛡️ エラーハンドリング戦略

### エラー境界の実装

#### 1. **グレースフルデグラデーション**

```typescript
// ✅ エラー境界コンポーネント
const EditorErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { error, reportError, clearError } = useErrorBoundary();

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Box>
          <AlertTitle>エディタでエラーが発生しました</AlertTitle>
          <AlertDescription>{error.error.message}</AlertDescription>
        </Box>
        <Button onClick={clearError} ml={4}>
          再試行
        </Button>
      </Alert>
    );
  }

  return <>{children}</>;
};
```

#### 2. **エラーレポーティング**

```typescript
// ✅ 構造化されたエラーレポート
interface ErrorReport {
  error: {
    code: string;
    message: string;
    timestamp: Date;
    stack?: string;
    context?: Record<string, unknown>;
  };
  severity: "low" | "medium" | "high" | "critical";
  recovery?: () => void;
}

export function useErrorReporting() {
  const reportError = useCallback((error: Error, severity: ErrorSeverity) => {
    const report: ErrorReport = {
      error: {
        code: error.name,
        message: error.message,
        timestamp: new Date(),
        stack: error.stack,
        context: {
          userAgent: navigator.userAgent,
          url: window.location.href,
        },
      },
      severity,
    };

    // 開発環境ではコンソール出力
    if (process.env.NODE_ENV === "development") {
      console.error("Error Report:", report);
    }

    // 本番環境では外部サービスに送信
    if (process.env.NODE_ENV === "production") {
      sendToErrorService(report);
    }
  }, []);

  return { reportError };
}
```

---

## 🧪 テスト戦略

### テストカテゴリ

#### 1. **単体テスト (Unit Tests)**

```typescript
// ✅ カスタムフックのテスト
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return default value when storage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("should save and retrieve values", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(localStorage.getItem("test-key")).toBe('"new value"');
  });
});
```

#### 2. **統合テスト (Integration Tests)**

```typescript
// ✅ コンポーネント統合テスト
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import VimEditor from "../components/VimEditor-enhanced";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe("VimEditor Integration", () => {
  it("should switch modes correctly", async () => {
    render(<VimEditor onCodePenModeChange={jest.fn()} />, {
      wrapper: TestWrapper,
    });

    const htmlTab = screen.getByRole("tab", { name: /html/i });
    const cssTab = screen.getByRole("tab", { name: /css/i });

    fireEvent.click(cssTab);

    expect(cssTab).toHaveAttribute("aria-pressed", "true");
    expect(htmlTab).toHaveAttribute("aria-pressed", "false");
  });
});
```

#### 3. **アクセシビリティテスト**

```typescript
// ✅ a11y テスト
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(
      <VimEditor onCodePenModeChange={jest.fn()} />,
      { wrapper: TestWrapper }
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## 📝 ドキュメント規約

### コメント規約

#### 1. **JSDoc コメント**

````typescript
/**
 * Enhanced Button Component with type-safe variants
 *
 * @example
 * ```tsx
 * <Button variant="solid" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @param variant - Visual style variant
 * @param size - Button size
 * @param children - Button content
 * @param onClick - Click handler
 * @returns React component
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", size = "md", children, onClick, ...props }, ref) => {
    // Implementation
  }
);
````

#### 2. **実装コメント**

```typescript
// ✅ 意図を説明するコメント
const useDebounce = <T>(value: T, delay: number): T => {
  // パフォーマンス最適化のため、頻繁な更新をデバウンス
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // タイマーを設定し、遅延後に値を更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数でメモリリークを防止
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ❌ 自明なコメント
const add = (a: number, b: number): number => {
  // aとbを足し算する
  return a + b;
};
```

### README 規約

#### 1. **コンポーネント README**

```markdown
# Button Enhanced Component

## 概要

型安全で一貫した UI を提供する強化されたボタンコンポーネント

## 使用方法

\`\`\`tsx
import { Button } from '@/components/ui/Button-enhanced'

const App = () => (
<Button variant="solid" size="md" onClick={handleClick}>
Click me
</Button>
)
\`\`\`

## Props

| Prop    | Type          | Default | Description      |
| ------- | ------------- | ------- | ---------------- |
| variant | ButtonVariant | 'solid' | ボタンのスタイル |
| size    | ButtonSize    | 'md'    | ボタンのサイズ   |

## Variants

- `solid`: プライマリアクション
- `ghost`: セカンダリアクション
- `outline`: アウトラインスタイル
```

---

## 🚀 デプロイメント・CI/CD

### ビルド最適化

#### 1. **Next.js 設定**

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // パフォーマンス最適化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@chakra-ui/react"],
  },

  // バンドル分析
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
```

#### 2. **パフォーマンス監視**

```typescript
// パフォーマンスメトリクス収集
export function usePerformanceMetrics() {
  useEffect(() => {
    // Core Web Vitals 監視
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
        }
        if (entry.entryType === "first-input") {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
        if (entry.entryType === "layout-shift") {
          console.log("CLS:", entry.value);
        }
      });
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
    });

    return () => observer.disconnect();
  }, []);
}
```

---

## 📊 メトリクス・監視

### パフォーマンス指標

#### 1. **Core Web Vitals**

- **LCP (Largest Contentful Paint)**: < 2.5 秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

#### 2. **開発者体験指標**

- **TypeScript エラー**: 0 件
- **ESLint ワーニング**: 0 件
- **テストカバレッジ**: > 80%
- **ビルド時間**: < 30 秒

#### 3. **ユーザー体験指標**

- **ページロード時間**: < 1 秒
- **インタラクティブ時間**: < 2 秒
- **アクセシビリティスコア**: AAA

---

## 🔄 継続的改善

### 定期レビュープロセス

#### 1. **コードレビューチェックリスト**

- [ ] TypeScript 型安全性
- [ ] パフォーマンス影響
- [ ] アクセシビリティ対応
- [ ] テストカバレッジ
- [ ] ドキュメント更新

#### 2. **アーキテクチャレビュー**

- **月次**: 技術負債の特定と対応
- **四半期**: パフォーマンス評価
- **年次**: 技術スタック見直し

#### 3. **改善提案プロセス**

```markdown
## 改善提案テンプレート

### 問題の説明

現在の問題点を具体的に記述

### 提案する解決策

具体的な実装案とメリット

### 影響範囲

変更による影響範囲の分析

### 実装計画

段階的な実装スケジュール
```

---

## 💡 まとめ

### 成功の鍵

1. **一貫性**: 統一されたパターンとルールの厳守
2. **型安全性**: TypeScript の力を最大限活用
3. **テスト駆動**: 品質保証の自動化
4. **ドキュメント**: 知識の継承と共有
5. **継続改善**: 定期的な見直しと最適化

### 次のステップ

1. **既存コードの段階的移行**: レガシーから新パターンへ
2. **自動化の強化**: テスト・リント・デプロイの自動化
3. **監視体制の構築**: パフォーマンス・エラーの常時監視
4. **チーム教育**: 新パターンの共有と普及

この統合ガイドラインに従うことで、VimApp は長期的に保守可能で拡張性の高いプロジェクトとして成長し続けることができます。
