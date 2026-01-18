"use client";

export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <div className="grid">
            <div>
              <h1 className="h1">致命的なエラーが発生しました</h1>
              <p className="lead">ページ全体の復旧を試みます。</p>
            </div>

            <div className="card">
              <div className="cardTitle">詳細</div>
              <div className="cardBody">
                <div className="small" style={{ whiteSpace: "pre-wrap" }}>
                  {props.error?.message ?? "unknown error"}
                </div>

                <div className="btnRow" style={{ marginTop: 12 }}>
                  <button className="btn btnPrimary" onClick={props.reset}>
                    再読み込み
                  </button>
                  <a className="btn" href="/">
                    TOPへ戻る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
