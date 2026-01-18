import Link from "next/link";

export default function AppHeader(props: { userEmail?: string | null }) {
  const { userEmail } = props;

  return (
    <header className="header">
      <div className="headerInner">
        <Link href="/" className="brand">
          AI向き？人向き？診断
        </Link>

        <nav className="nav">
          <Link href="/" className="navLink">
            TOP
          </Link>

          {/* 診断はログイン必須（middlewareでガード） */}
          <Link href="/input" className="navLink">
            診断
          </Link>

          <Link href="/history" className="navLink">
            履歴
          </Link>

          <Link href="/auth" className="navLink">
            {userEmail ? `ログイン中: ${userEmail}` : "ログイン"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
