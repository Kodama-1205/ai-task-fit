import Card from "@/components/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 履歴はログイン必須
  if (!user) redirect("/auth?redirect=/history");

  const { data, error } = await supabase
    .from("diagnosis_runs")
    .select("id, created_at, task_title, verdict, total_score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="grid">
      <div>
        <h1 className="h1">履歴</h1>
        <p className="lead">保存した診断結果の一覧です（最新50件）。</p>
      </div>

      <Card title="履歴一覧">
        {error ? (
          <div className="small">読み込みに失敗しました：{error.message}</div>
        ) : !data || data.length === 0 ? (
          <div className="small">履歴がありません。診断を実行して保存してください。</div>
        ) : (
          <div className="grid" style={{ gap: 12 }}>
            {data.map((row) => (
              <Link
                key={row.id}
                href={`/history/${row.id}`}
                style={{
                  display: "block",
                  padding: 14,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(255,255,255,.03)",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 900 }}>{row.task_title || "（無題）"}</div>
                  <div className="badge">スコア：{row.total_score ?? 0}/100</div>
                </div>
                <div className="small" style={{ marginTop: 6, opacity: 0.9 }}>
                  判定：{row.verdict || "-"} ／{" "}
                  {row.created_at ? new Date(row.created_at).toLocaleString("ja-JP") : "-"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
