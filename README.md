# 🎯 manaVimEditor - Sophisticated Interactive Vim Learning Platform

> **A human-crafted, professional-grade Vim learning experience with sophisticated UI/UX design**

製品化レベルの品質を誇る Vim 練習アプリケーションです。トップティアのデザインスタジオが手がけたような洗練された UI/UX と、CodeMirror 6 による本格的な Vim 体験を提供します。

## ✨ Design Philosophy - デザイン哲学

**Human-Crafted Excellence**: すべてのピクセル、アニメーション、インタラクションが、AI的な汎用パターンを避け、人間の手による温かみと独創性を表現するよう細心に設計されています。

- 🎨 **Rich Black & Orange Aesthetic**: 深みのあるプロフェッショナルな黒と、エネルギッシュなオレンジの組み合わせ
- 🌟 **Sophisticated Micro-interactions**: 自然で反応性の高い、繊細なアニメーション
- 🔥 **Creative UI Components**: 個性と魅力を持つカスタムデザイン要素
- 💎 **Premium Visual Hierarchy**: 視線を自然に導く洗練されたタイポグラフィと余白設計
- ⚡ **Smooth Performance**: 流れるような体験のための最適化されたアニメーションとインタラクション

## ✨ 主な機能

### 🎯 エディタ機能

- **CodeMirror 6** + **@replit/codemirror-vim** による本格的な Vim 体験
- **HTML/CSS/JavaScript** の 3 モード対応
- **Emmet 補完** - CSS/HTML の高速コーディング支援
- **ライブプレビュー** - リアルタイムコード実行結果表示
- **Visual Line/Block モード** 対応

### 🔧 技術仕様

- **Next.js 14.2.3** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Chakra UI** - 洗練された UI コンポーネント
- **Framer Motion** - 滑らかなアニメーション
- **メモ化最適化** - React.memo/useMemo/useCallback による高速レンダリング

### 🎨 Sophisticated Design System - 洗練されたデザインシステム

- **Rich Black Palette**: 深みのあるプロフェッショナルな背景色 (#0a0a0a to #2a2a2a)
- **Vibrant Orange Accents**: フォーカスとインタラクションのためのエネルギッシュなハイライト (#ff6b35)
- **Premium Typography**: UI の明瞭性のための Inter、コードの真正性のための JetBrains Mono
- **8px Grid System**: 視覚的調和のための一貫した数学的スペーシング
- **Glass Morphism Effects**: モダンな奥行きのための繊細な透明度とブラー効果
- **Advanced UI Components**: フローティングアクションボタン、コンテキストメニュー、トースト通知
- **Sophisticated Animations**: Framer Motion による物理ベースの滑らかなトランジション

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
