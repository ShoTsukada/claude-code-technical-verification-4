import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import { ToastProvider } from "@/components/feedback/Toast";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "研究管理プラットフォーム",
  description: "研究機関・研究テーマ・投資家の登録・管理・関連付けシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-surface text-text-body font-sans">
        <a href="#main-content" className="skip-link">
          本文へスキップ
        </a>
        <ToastProvider>
          <AppLayout>{children}</AppLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
