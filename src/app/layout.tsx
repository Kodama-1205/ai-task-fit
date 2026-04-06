import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "AI Task Fit | 業務自動化可否診断",
  description: "YES/NOだけで業務の自動化可否を診断し、最短の実装方針（Python / Dify / 手作業）を提示します。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AppHeader />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
