import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "manaVimEditor - Vimをマスターする実践的エディタ",
  description: "コードを書きながらVimを覚える。manaby就労移行支援で開発された実践的Vim学習プラットフォーム",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#18181b" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
