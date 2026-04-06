import { QUESTIONS } from "./questions";
import type { AnswerMap, EvaluationResult, ToolKey, Verdict } from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toVerdict(score: number): Verdict {
  if (score >= 70) return "自動化OK";
  if (score >= 40) return "要注意（部分自動化推奨）";
  return "自動化NG";
}

function hasAnyTool(selectedTools: ToolKey[], keys: ToolKey[]) {
  return keys.some((k) => selectedTools.includes(k));
}

export function evaluateDiagnosis(input: {
  answers: AnswerMap;
  selectedTools: ToolKey[];
}): EvaluationResult {
  const { answers, selectedTools } = input;

  // ベース50点から各質問の寄与で増減（0〜100 にクランプ）
  let total = 50;
  const drivers: Array<{ id: keyof AnswerMap; label: string; impact: number }> = [];

  for (const q of QUESTIONS) {
    const delta = answers[q.id] === "yes" ? q.yesDelta : q.noDelta;
    total += delta;
    drivers.push({ id: q.id, label: q.label, impact: delta });
  }

  // ツール環境補正：データ取り出し不可 かつ 自動化基盤なし → 実現性が低いため減点
  if (answers.q11 !== "yes" && answers.q12 !== "yes") total -= 6;

  // RPA / Python / DB が既にある場合は実装現実性が高いため加点
  if (hasAnyTool(selectedTools, ["rpa", "python", "database"])) total += 4;

  total = clamp(total, 0, 100);
  const verdict = toVerdict(total);

  // 推奨ツール判定
  const textCentric = answers.q13 === "yes";
  const tableCentric = answers.q14 === "yes";
  const sensitive = answers.q8 === "yes" || answers.q9 === "yes";
  const manyExceptions = answers.q4 === "no";
  const highRisk = answers.q7 === "no";

  let primary: "Python" | "Dify" | "手作業" = "手作業";
  let secondary: "Python" | "Dify" | "手作業" | undefined;

  if (verdict === "自動化NG") {
    // NG の場合でも部分自動化を提案
    primary = "手作業";
    secondary = textCentric ? "Dify" : tableCentric ? "Python" : undefined;
  } else {
    const difyReady = selectedTools.includes("dify") || textCentric;
    const pythonReady = selectedTools.includes("python") || selectedTools.includes("database") || tableCentric;

    if (textCentric && difyReady && !highRisk) {
      primary = "Dify";
      secondary = pythonReady ? "Python" : "手作業";
    } else if (tableCentric && pythonReady) {
      primary = "Python";
      secondary = difyReady ? "Dify" : "手作業";
    } else if (difyReady) {
      primary = "Dify";
      secondary = "手作業";
    } else if (pythonReady) {
      primary = "Python";
      secondary = "手作業";
    } else {
      primary = "手作業";
      secondary = textCentric ? "Dify" : tableCentric ? "Python" : undefined;
    }
  }

  // 進め方（推奨アプローチ）
  const approach: string[] = [];

  if (primary === "Dify") {
    approach.push("① 入力文/資料をDifyで分類・要約・項目抽出（構造化）");
    approach.push("② ルール（IF）を適用して一次判定を自動化");
    approach.push("③ 人が最終確認（重要・例外・機密は必須）");
    if (secondary === "Python") approach.push("④ Pythonで整形/集計/照合して安定運用");
  } else if (primary === "Python") {
    approach.push("① データをCSV/Excel/DB/APIから取得（再現性を確保）");
    approach.push("② Pythonで加工・集計・照合（ログ/テストを用意）");
    approach.push("③ 人が例外・差分のみ確認（省力化）");
    if (secondary === "Dify") approach.push("④ 文書入力がある場合はDifyで抽出→Pythonへ連携");
  } else {
    approach.push("① まず手作業で安定手順（チェックリスト）を確立");
    approach.push("② 部分自動化：テンプレ生成/転記支援/チェック補助から開始");
    if (secondary === "Dify") approach.push("③ Difyで要約・分類など『失敗しても致命的でない領域』を支援");
    if (secondary === "Python") approach.push("③ Pythonで集計・照合など『正解が一意な領域』だけ自動化");
  }

  // 注意点
  const cautions: string[] = [];
  if (highRisk) cautions.push("失敗時に致命的な影響があるため、全面自動化より『人の確認を前提』に設計してください。");
  if (manyExceptions) cautions.push("例外が多いため、全自動より『例外検知→人が判断』の構成が現実的です。");
  if (sensitive) cautions.push("機密/個人情報を扱う場合、入力データの最小化、権限、監査ログ、マスキング方針を先に確定してください。");
  if (answers.q11 === "no") cautions.push("現状ツールだけでデータ取り出しが難しいため、まず『取り出し手段』の確立（CSV/API/RPA）を優先してください。");
  if (answers.q12 === "no") cautions.push("自動化基盤が弱い場合、最初は『手順の標準化→部分自動化』の順で進めると失敗しにくいです。");

  // 影響が大きかった上位3問を理由表示用に抽出
  const keyDrivers = drivers
    .slice()
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 3)
    .map((d) => ({ id: d.id, label: d.label, impact: d.impact }));

  return {
    totalScore: total,
    verdict,
    recommendation: { primary, secondary, approach, cautions, keyDrivers },
  };
}
