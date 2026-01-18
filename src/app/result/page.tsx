"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { evaluateDiagnosis } from "@/lib/diagnosis/scoring";
import type { AnswerMap, ToolKey } from "@/lib/diagnosis/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const DRAFT_KEY = "ai_task_fit_draft_v1";
const ANSWERS_KEY = "ai_task_fit_answers_v1";

type Draft = {
  taskTitle: string;
  taskDescription: string;
  selectedTools: ToolKey[];
  otherToolText: string;
};

export default function ResultPage() {
  const router = useRouter();

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { draft, answers } = useMemo(() => {
    if (typeof window === "undefined") return { draft: null as Draft | null, answers: null as AnswerMap | null };
    const dRaw = window.sessionStorage.getItem(DRAFT_KEY);
    const aRaw = window.sessionStorage.getItem(ANSWERS_KEY);
    if (!dRaw || !aRaw) return { draft: null, answers: null };
    try {
      return { draft: JSON.parse(dRaw) as Draft, answers: JSON.parse(aRaw) as AnswerMap };
    } catch {
      return { draft: null, answers: null };
    }
  }, []);

  const evaluation = useMemo(() => {
    if (!draft || !answers) return null;
    return evaluateDiagnosis({ answers, selectedTools: draft.selectedTools });
  }, [draft, answers]);

  async function saveToHistory() {
    setSaveMsg(null);
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setSaveMsg("履歴保存にはログインが必要です。先にログインしてください。");
        setBusy(false);
        return;
      }

      if (!draft || !answers || !evaluation) {
        setSaveMsg("保存対象が見つかりません。入力からやり直してください。");
        setBusy(false);
        return;
      }

      const res = await fetch("/api/diagnosis-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: draft.taskTitle,
          taskDescription: draft.taskDescription,
          selectedTools: draft.selectedTools,
          otherToolText: draft.otherToolText,
          answers,
          totalScore: evaluation.totalScore,
          verdict: evaluation.verdict,
          recommendation: evaluation.recommendation,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "保存に失敗しました。");

      setSaveMsg("履歴に保存しました。");
    } catch (e: any) {
      setSaveMsg(e?.message ?? "エラーが発生しました。");
    } finally {
      setBusy(false);
    }
  }

  function goHistory() {
    router.push("/history");
  }

  if (!draft || !answers || !evaluation) {
    return (
      <Card title="結果">
        <div className="small">入力情報が見つかりません。<a className="btn" href="/input">入力へ戻る</a></div>
      </Card>
    );
  }

  const rec = evaluation.recommendation;

  return (
    <div className="grid">
      <div>
        <h1 className="h1">診断結果</h1>
        <p className="lead">判定と推奨アプローチを提示します（ログイン中なら履歴保存できます）。</p>
      </div>

      <Card title="概要">
        <div className="grid">
          <div className="badge">判定：{evaluation.verdict}</div>
          <div className="badge">スコア：{evaluation.totalScore} / 100</div>
          {draft.taskTitle ? <div className="small">作業名：{draft.taskTitle}</div> : null}
          {draft.taskDescription ? <div className="small">概要：{draft.taskDescription}</div> : null}
          <div className="small">
            使用ツール：{draft.selectedTools.join(", ")}
            {draft.otherToolText ? `（その他: ${draft.otherToolText}）` : ""}
          </div>
        </div>
      </Card>

      <Card title="推奨（主＋副）">
        <div className="grid">
          <div className="badge">主：{rec.primary}</div>
          {rec.secondary ? <div className="badge">副：{rec.secondary}</div> : null}

          <div className="hr" />

          <div style={{ fontWeight: 900 }}>進め方（推奨アプローチ）</div>
          <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
            {rec.approach.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {rec.cautions.length ? (
            <>
              <div className="hr" />
              <div style={{ fontWeight: 900 }}>注意点</div>
              <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
                {rec.cautions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </Card>

      <Card title="判定理由（影響が大きかった回答）">
        <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
          {rec.keyDrivers.map((d) => (
            <li key={d.id}>
              {d.label}（影響: {d.impact > 0 ? `+${d.impact}` : d.impact}）
            </li>
          ))}
        </ul>
      </Card>

      <Card title="履歴保存">
        <div className="btnRow">
          <button className="btn btnPrimary" onClick={saveToHistory} disabled={busy} type="button">
            履歴に保存
          </button>
          <button className="btn" onClick={goHistory} disabled={busy} type="button">
            履歴を見る
          </button>
        </div>
        {saveMsg ? <div className="small" style={{ marginTop: 10 }}>{saveMsg}</div> : null}
      </Card>
    </div>
  );
}
