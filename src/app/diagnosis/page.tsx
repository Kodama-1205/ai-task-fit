"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { QUESTIONS } from "@/lib/diagnosis/questions";
import type { AnswerMap, QuestionId } from "@/lib/diagnosis/types";
import { useRouter } from "next/navigation";

const DRAFT_KEY = "ai_task_fit_draft_v1";
const ANSWERS_KEY = "ai_task_fit_answers_v1";

function initAnswers(): AnswerMap {
  const map: any = {};
  for (const q of QUESTIONS) map[q.id] = "no";
  return map as AnswerMap;
}

export default function DiagnosisPage() {
  const router = useRouter();

  const initialAnswers = useMemo(() => {
    if (typeof window === "undefined") return initAnswers();
    const raw = window.sessionStorage.getItem(ANSWERS_KEY);
    if (!raw) return initAnswers();
    try {
      return JSON.parse(raw) as AnswerMap;
    } catch {
      return initAnswers();
    }
  }, []);

  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);

  function setAnswer(id: QuestionId, value: "yes" | "no") {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    window.sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
  }

  function backToInput() {
    router.push("/input");
  }

  function goResult() {
    // draftが無いとresultで困るので最低限ガード
    const draft = window.sessionStorage.getItem(DRAFT_KEY);
    if (!draft) {
      router.push("/input");
      return;
    }
    router.push("/result");
  }

  return (
    <div className="grid">
      <div>
        <h1 className="h1">YES / NO 診断</h1>
        <p className="lead">回答は自動保存されます。迷う場合は「現状はどちら寄りか」で回答してください。</p>
      </div>

      <Card title="質問">
        <div className="grid">
          {QUESTIONS.map((q) => {
            const v = answers[q.id];
            return (
              <div key={q.id} className="card" style={{ boxShadow: "none", background: "rgba(27,18,13,0.35)" }}>
                <div className="cardBody">
                  <div style={{ fontWeight: 900, marginBottom: 10 }}>{q.label}</div>
                  <div className="choiceRow">
                    <button
                      className={`choiceBtn ${v === "yes" ? "choiceBtnActive" : ""}`}
                      onClick={() => setAnswer(q.id, "yes")}
                      type="button"
                    >
                      YES
                    </button>
                    <button
                      className={`choiceBtn ${v === "no" ? "choiceBtnActive" : ""}`}
                      onClick={() => setAnswer(q.id, "no")}
                      type="button"
                    >
                      NO
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="btnRow">
            <button className="btn" onClick={backToInput} type="button">
              入力へ戻る
            </button>
            <button className="btn btnPrimary" onClick={goResult} type="button">
              結果を見る
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
