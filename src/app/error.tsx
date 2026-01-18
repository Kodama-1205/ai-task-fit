"use client";

import { useEffect } from "react";

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // console には残す（本番は監視に流す想定）
    console.error(props.error);
  }, [props.error]);

  return (
    <div className="grid">
      <div>
        <h1 className="h1">エラーが発生しました</h1>
        <p className="lead">一時的な問題の可能性があります。再試行してください。</p>
      </div>

      <div className="card">
        <div className="cardTitle">詳細</div>
        <div className="cardBody">
          <div className="small" style={{ whiteSpace: "pre-wrap" }}>
            {props.error?.message ?? "unknown error"}
          </div>

          <div className="btnRow" style={{ marginTop: 12 }}>
            <button className="btn btnPrimary" onClick={props.reset}>
              再試行
            </button>
            <a className="btn" href="/">
              TOPへ戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
