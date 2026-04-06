import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="header">
      <div className="headerInner">
        <Link href="/" className="brand">
          AI向き？人向き？診断
        </Link>

        <nav className="nav">
          <Link href="/" className="navLink">
            トップ
          </Link>
          <Link href="/input" className="navLink">
            診断
          </Link>
        </nav>
      </div>
    </header>
  );
}
