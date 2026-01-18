export default function NotFound() {
  return (
    <div className="grid">
      <div>
        <h1 className="h1">ページが見つかりません</h1>
        <p className="lead">URLをご確認ください。</p>
      </div>

      <div className="btnRow">
        <a className="btn btnPrimary" href="/">
          TOPへ戻る
        </a>
        <a className="btn" href="/input">
          診断へ
        </a>
      </div>
    </div>
  );
}
