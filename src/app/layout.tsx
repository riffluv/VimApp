import { Metadata } from "next";
import "../styles/accessibility.css";
import "../styles/container-queries.css";
import "../styles/dynamic-viewport.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "manaVimEditor - Vimをマスターする実践的エディタ",
  description:
    "コードを書きながらVimを覚える。manaby就労移行支援で開発された実践的Vim学習プラットフォーム",
  icons: {
    icon: "/manabyicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=yes, minimum-scale=0.5, maximum-scale=3.0"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#18181b" />
        <meta name="color-scheme" content="dark light" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="manaVimEditor" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#18181b" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                import('/src/utils/responsive-debugger').catch(console.error);
              }
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
