import Card from "@/components/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth?redirect=${encodeURIComponent(`/history/${id}`)}`);
  }

  const { data, error } = await supabase
    .from("diagnosis_runs")
    .select(
      "id, created_at, task_title, task_description, selected_tools, total_score, verdict, recommendation, answers, user_id"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <div className="grid">
      <div>
        <h1 className="h1">履歴詳細</h1>
        <p className="lead">{new Date(data.created_at).toLocaleString("ja-JP")}</p>
      </div>

      <Card title="結果">
        <div className="grid">
          <div className="choiceRow">
            <span className="badge">判定：{data.verdict}</span>
            <span className="badge">スコア：{data.total_score} / 100</span>
          </div>

          <div className="grid grid2">
            <div>
              <div className="label">作業名（任意）</div>
              <div style={{ fontWeight: 900 }}>{data.task_title || "-"}</div>
            </div>
            <div>
              <div className="label">現在使用しているツール</div>
              <div className="small" style={{ whiteSpace: "pre-wrap" }}>
                {Array.isArray(data.selected_tools) ? data.selected_tools.join(" / ") : "-"}
              </div>
            </div>
          </div>

          <div>
            <div className="label">作業概要（任意）</div>
            <div className="small" style={{ whiteSpace: "pre-wrap" }}>
              {data.task_description || "-"}
            </div>
          </div>

          <div className="hr" />

          <div>
            <div className="label">推奨内容（保存時のJSON）</div>
            <pre className="small" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(data.recommendation, null, 2)}
            </pre>
          </div>

          <div>
            <div className="label">回答（保存時のJSON）</div>
            <pre className="small" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(data.answers, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
