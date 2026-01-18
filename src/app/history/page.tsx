import Card from "@/components/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth");

  const { data, error } = await supabase
    .from("diagnosis_runs")
    .select("id, created_at, task_title, verdict, total_score")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="grid">
      <div>
        <h1 className="h1">履歴</h1>
        <p className="lead">ログインユーザーの診断履歴を表示します。</p>
      </div>

      <Card title="一覧">
        {error ? (
          <div className="small">取得に失敗しました：{error.message}</div>
        ) : !data || data.length === 0 ? (
          <div className="small">まだ履歴がありません。診断を実行して保存してください。</div>
        ) : (
          <div className="grid">
            {data.map((r) => (
              <div key={r.id} className="card" style={{ boxShadow: "none", background: "rgba(27,18,13,0.35)" }}>
                <div className="cardBody">
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="badge">{r.verdict}</span>
                    <span className="badge">スコア {r.total_score}</span>
                    <span className="badge">{new Date(r.created_at).toLocaleString("ja-JP")}</span>
                  </div>
                  <div style={{ fontWeight: 900, marginTop: 10 }}>
                    <Link href={`/history/${r.id}`}>{r.task_title || "（作業名なし）"}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
