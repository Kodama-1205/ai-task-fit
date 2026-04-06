"use client";

import { useMemo } from "react";
import Card from "@/components/Card";
import { evaluateDiagnosis } from "@/lib/diagnosis/scoring";
import { TOOL_OPTIONS } from "@/lib/diagnosis/tools";
import type { AnswerMap, ToolKey } from "@/lib/diagnosis/types";

const DRAFT_KEY = "ai_task_fit_draft_v1";
const ANSWERS_KEY = "ai_task_fit_answers_v1";

type Draft = {
  taskTitle: string;
  taskDescription: string;
  selectedTools: ToolKey[];
  otherToolText: string;
};

export default function ResultPage() {
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
        <p className="lead">判定と推奨アプローチを提示します。</p>
      </div>

      <Card title="概要">
        <div className="grid">
          <div className="badge">判定：{evaluation.verdict}</div>
          <div className="badge">スコア：{evaluation.totalScore} / 100</div>
          {draft.taskTitle ? <div className="small">作業名：{draft.taskTitle}</div> : null}
          {draft.taskDescription ? <div className="small">概要：{draft.taskDescription}</div> : null}
          <div className="small">
            使用ツール：{draft.selectedTools
              .map((key) => TOOL_OPTIONS.find((t) => t.key === key)?.label ?? key)
              .join("、")}
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

      <div className="btnRow">
        <a className="btn btnPrimary" href="/input">
          もう一度診断する
        </a>
        <a className="btn" href="/">
          トップへ戻る
        </a>
      </div>
    </div>
  );
}
