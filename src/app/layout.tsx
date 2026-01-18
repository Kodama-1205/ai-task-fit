import "./globals.css";
import AppHeader from "@/components/AppHeader";

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
