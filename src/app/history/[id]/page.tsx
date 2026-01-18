import Card from "@/components/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HistoryDetailPage(props: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth");

  const { data, error } = await supabase
    .from("diagnosis_runs")
    .select("*")
    .eq("id", props.params.id)
    .single();

  if (error || !data) {
    return (
      <Card title="詳細">
        <div className="small">取得に失敗しました：{error?.message ?? "not found"}</div>
      </Card>
    );
  }

  return (
    <div className="grid">
      <div>
        <h1 className="h1">履歴詳細</h1>
        <p className="lead">{new Date(data.created_at).toLocaleString("ja-JP")}</p>
      </div>

      <Card title="結果">
        <div className="grid">
          <div className="badge">判定：{data.verdict}</div>
          <div className="badge">スコア：{data.total_score} / 100</div>
          {data.task_title ? <div className="small">作業名：{data.task_title}</div> : null}
          {data.task_description ? <div className="small">概要：{data.task_description}</div> : null}
          <div className="small">使用ツール：{JSON.stringify(data.selected_tools)}</div>
        </div>
      </Card>

      <Card title="推奨内容（保存時のJSON）">
        <pre className="small" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {JSON.stringify(data.recommendation, null, 2)}
        </pre>
      </Card>

      <Card title="回答（保存時のJSON）">
        <pre className="small" style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {JSON.stringify(data.answers, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
