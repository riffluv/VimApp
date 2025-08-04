/** @type {import('next').NextConfig} */
const nextConfig = {
  // パフォーマンス最適化
  experimental: {
    // CSS最適化を一時的に無効化（critters依存関係の問題のため）
    // optimizeCss: true,
    // パッケージインポートの最適化
    optimizePackageImports: [
      "@chakra-ui/react",
      "@codemirror/state",
      "@codemirror/view",
    ],
  },

  // 本番ビルド時の最適化
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // バンドル分割の最適化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // ベンダーライブラリを別チャンクに分離
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
            // Chakra UIを専用チャンクに分離
            chakra: {
              test: /[\\/]node_modules[\\/]@chakra-ui[\\/]/,
              name: "chakra-ui",
              chunks: "all",
              priority: 10,
            },
            // CodeMirrorを専用チャンクに分離
            codemirror: {
              test: /[\\/]node_modules[\\/]@codemirror[\\/]/,
              name: "codemirror",
              chunks: "all",
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },

  // 画像最適化
  images: {
    // 外部画像の最適化を有効化
    formats: ["image/webp", "image/avif"],
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
