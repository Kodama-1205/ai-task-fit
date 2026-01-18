import Card from "@/components/Card";

export default function TopPage() {
  return (
    <div className="grid">
      {/* HERO */}
      <div style={{ marginTop: 8 }}>
        <div
          className="heroKicker"
          style={{
            borderColor: "rgba(196,138,74,0.55)",
            background: "rgba(196,138,74,0.12)",
          }}
        >
          AI Task Fit
        </div>

        <h1 className="heroTitle">
          この作業、<br />
          AIに任せて良い？
          <span style={{ display: "block", opacity: 0.92 }}>それとも、人がやるべき？</span>
        </h1>

        <p className="lead heroLead">
          YES/NOだけで<strong>自動化の可否</strong>を診断し、あなたの<strong>現状ツール</strong>も踏まえて
          <strong>最短の実装方針</strong>（Python / Dify / 手作業）を提示します。
        </p>

        <div className="btnRow" style={{ marginTop: 10 }}>
          <a className="btn btnPrimary" href="/input">
            診断を開始
          </a>

          <a className="btn" href="/history">
            履歴を見る（ログイン必須）
          </a>

          <a className="btn" href="/auth">
            ログイン / 新規登録
          </a>
        </div>

        <div className="choiceRow" style={{ marginTop: 16 }}>
          <span className="badge">YES/NO：14問</span>
          <span className="badge">スコア：0〜100</span>
          <span className="badge">推奨：主＋副</span>
          <span className="badge">履歴：ログインで保存</span>
        </div>
      </div>

      <Card title="何が手に入るか">
        <div className="grid grid2">
          <div>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>判断がブレない「基準」</div>
            <div className="small">
              反復性、ルール化、例外、リスク、データ取り出し可否などの軸で診断。
              「なんとなく自動化できそう」を<strong>意思決定できる形</strong>にします。
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>現実的な「次の一手」</div>
            <div className="small">
              単にOK/NGではなく、現状ツール環境を踏まえた<strong>推奨ルート</strong>を出します。
              例：Difyで抽出→Pythonで整形→人が最終確認。
            </div>
          </div>
        </div>
      </Card>

      <Card title="診断の流れ（3ステップ）">
        <div className="grid grid2">
          <div>
            <div className="badge">Step 1</div>
            <div style={{ fontWeight: 900, marginTop: 10 }}>作業と使用ツールを入力</div>
            <div className="small">現状のツールを前提に、実装可能性まで評価します。</div>
          </div>

          <div>
            <div className="badge">Step 2</div>
            <div style={{ fontWeight: 900, marginTop: 10 }}>YES/NOに回答</div>
            <div className="small">迷う場合は「現状どちら寄りか」でOK。回答は自動保存。</div>
          </div>

          <div>
            <div className="badge">Step 3</div>
            <div style={{ fontWeight: 900, marginTop: 10 }}>結論と推奨アプローチ</div>
            <div className="small">主推奨＋副推奨、注意点、理由（効いた回答）まで提示します。</div>
          </div>

          <div>
            <div className="badge">History</div>
            <div style={{ fontWeight: 900, marginTop: 10 }}>履歴で比較（ログイン）</div>
            <div className="small">保存した診断結果を後から見返せます。</div>
          </div>
        </div>
      </Card>

      <Card title="出力イメージ（例）">
        <div className="grid">
          <div className="small">
            「自動化OK」でも、例外やリスクがある場合は“要注意”に寄せて、現場で事故が起きない提案を返します。
          </div>

          <pre className="small" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
{`判定：要注意（部分自動化推奨）
推奨（主）：Python
推奨（副）：Dify
進め方：
  ① CSV/Excelから取得（再現性確保）
  ② Pythonで加工・集計・照合（ログ/テスト）
  ③ 例外だけ人が最終確認
注意点：
  - 例外が多いので全自動化は避ける
  - 機密情報は入力最小化・権限・監査ログを先に確定`}
          </pre>

          <div className="btnRow">
            <a className="btn btnPrimary" href="/input">
              今すぐ診断する
            </a>
            <a className="btn" href="/history">
              履歴を見る（ログイン必須）
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
