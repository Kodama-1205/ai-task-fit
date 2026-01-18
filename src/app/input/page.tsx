"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { TOOL_OPTIONS } from "@/lib/diagnosis/tools";
import type { ToolKey } from "@/lib/diagnosis/types";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "ai_task_fit_draft_v1";

type Draft = {
  taskTitle: string;
  taskDescription: string;
  selectedTools: ToolKey[];
  otherToolText: string;
};

export default function InputPage() {
  const router = useRouter();

  const initial = useMemo<Draft>(() => {
    if (typeof window === "undefined") return { taskTitle: "", taskDescription: "", selectedTools: [], otherToolText: "" };
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { taskTitle: "", taskDescription: "", selectedTools: [], otherToolText: "" };
    try {
      return JSON.parse(raw) as Draft;
    } catch {
      return { taskTitle: "", taskDescription: "", selectedTools: [], otherToolText: "" };
    }
  }, []);

  const [taskTitle, setTaskTitle] = useState(initial.taskTitle);
  const [taskDescription, setTaskDescription] = useState(initial.taskDescription);
  const [selectedTools, setSelectedTools] = useState<ToolKey[]>(initial.selectedTools);
  const [otherToolText, setOtherToolText] = useState(initial.otherToolText);

  function toggleTool(key: ToolKey) {
    setSelectedTools((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  }

  function saveDraft() {
    const draft: Draft = { taskTitle, taskDescription, selectedTools, otherToolText };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  function start() {
    saveDraft();
    router.push("/diagnosis");
  }

  return (
    <div className="grid">
      <div>
        <h1 className="h1">診断の準備</h1>
        <p className="lead">
          まず「何の作業か」と「今使っているツール」を整理します。ツール前提も含めて、自動化可否と推奨アプローチを判定します。
        </p>
      </div>

      <Card title="対象の作業">
        <div className="grid grid2">
          <div>
            <span className="label">作業名（任意）</span>
            <input className="input" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="例：日次レポート作成" />
          </div>
          <div>
            <span className="label">作業概要（任意）</span>
            <textarea className="textarea" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="例：複数シートから数字を拾って集計し、Slackに投稿する" />
          </div>
        </div>
      </Card>

      <Card title="現在使用しているツール（複数選択）">
        <div className="grid">
          <div className="choiceRow">
            {TOOL_OPTIONS.map((t) => (
              <button
                key={t.key}
                className={`choiceBtn ${selectedTools.includes(t.key) ? "choiceBtnActive" : ""}`}
                onClick={() => toggleTool(t.key)}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>

          {selectedTools.includes("other") ? (
            <div>
              <span className="label">その他（自由入力）</span>
              <input className="input" value={otherToolText} onChange={(e) => setOtherToolText(e.target.value)} placeholder="例：社内ツール名、独自SaaSなど" />
            </div>
          ) : null}

          <div className="btnRow">
            <button className="btn btnPrimary" onClick={start} type="button">
              診断を開始
            </button>
            <button className="btn" onClick={saveDraft} type="button">
              入力を保存
            </button>
          </div>

          <div className="small">
            入力は <span className="kbd">sessionStorage</span> に保存されます（ログイン不要）。ログインして結果を保存すると履歴に残せます。
          </div>
        </div>
      </Card>
    </div>
  );
}
