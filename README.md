# 🎯 manaVimEditor - Professional Vim Learning Platform

> **Clean, optimized Vim learning experience with professional CSS architecture**

プロフェッショナルな CSS 設計と Vim 練習環境を提供するアプリケーションです。2025 年の最新 CSS 標準に基づく、自然で美しい DPI スケーリング対応を実現しています。

## ✨ 特徴

### 🎨 **2025 年 CSS 設計ベストプラクティス**

- **rem-based Design System**: ブラウザのネイティブ DPI スケーリングを活用
- **CSS Custom Properties**: 一貫したデザイントークン
- **Container Queries**: モダンなレスポンシブデザイン
- **Natural Scaling**: 100%DPI でも自然なサイズ感

### 🔧 **技術仕様**

- **Next.js 14.2.3** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Chakra UI** - プロフェッショナル UI コンポーネント
- **CodeMirror 6** + **Vim Extension** - 本格的な Vim 体験

### 🎯 **エディタ機能**

- **HTML/CSS/JavaScript** モード対応
- **Emmet 補完** - 高速コーディング支援
- **ライブプレビュー** - リアルタイム実行結果
- **Vim モード** - 本格的なキーバインディング

## 🏗️ CSS Architecture

### 設計思想

```css
/* ブラウザのネイティブDPIスケーリングを活用 */
:root {
  font-size: 16px; /* 固定ベース - ブラウザがDPI処理 */

  /* rem-based デザイントークン */
  --text-base: 1rem; /* 16px */
  --space-4: 1rem; /* 16px */
  --radius-md: 0.375rem; /* 6px */
}
```

### パフォーマンス最適化

- **CSS Custom Properties**: 高速な再計算
- **Container Queries**: 効率的なレスポンシブ
- **Minimal Selectors**: 軽量な CSS 構造

## 🚀 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build
```

アプリケーションは http://localhost:3000 で起動します。

## 📖 Vim コマンド対応状況

### ✅ 対応済み

- **基本移動**: `h`, `j`, `k`, `l`
- **高速移動**: `w`, `b`, `e`, `0`, `$`, `gg`, `G`
- **編集モード**: `i`, `I`, `a`, `A`, `o`, `O`
- **ビジュアルモード**: `v`, `V`, `Ctrl-v`
- **コピー・削除**: `y`, `d`, `p`, `x`
- **検索・置換**: `/`, `?`, `:s//`

### ⚠️ 制限事項

CodeMirror Vim 拡張の制限により、一部コマンドは未対応です：

- fold 系コマンド（zc, zo 等）
- 複数回数指定のテキストオブジェクト（v2a[等）
- 一部の Ex コマンド

詳細は [CSS_BEST_PRACTICES_2025.md](./CSS_BEST_PRACTICES_2025.md) をご覧ください。

## 🏗️ プロジェクト構造

```
src/
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
│   ├── VimEditor.tsx # メインエディタコンポーネント
│   └── CheatSheet.tsx # Vimコマンド一覧
├── hooks/            # カスタムフック
├── utils/            # ユーティリティ関数
├── types/            # TypeScript型定義
└── constants/        # アプリケーション定数
```

## 🎯 品質保証

### パフォーマンス

- **React.memo** によるコンポーネント最適化
- **useMemo/useCallback** による再計算防止
- **デバウンス処理** による快適な入力体験

### 型安全性

- **TypeScript strict mode** 有効
- **型ガード関数** による実行時型チェック
- **厳密な型定義** による開発時エラー防止

### エラーハンドリング

- **try-catch** による例外処理
- **ユーザーフレンドリーなエラー表示**
- **グレースフルデグラデーション**

## 📊 ベストプラクティス

本プロジェクトは 2025 年の最新ベストプラクティスに準拠しています：

- **コンポーネント設計**: 責務分離と再利用性
- **状態管理**: カスタムフックによる分離
- **スタイリング**: Chakra UI Props 優先
- **パフォーマンス**: メモ化とレンダリング最適化
- **型安全性**: TypeScript 活用
- **アクセシビリティ**: WCAG 準拠

詳細なガイドラインは [CSS_BEST_PRACTICES_2025.md](./CSS_BEST_PRACTICES_2025.md) に記載されています。

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📄 ライセンス

MIT License

---

**VimApp** - あなたの Vim スキル向上を支援する最高のツールです 🚀
