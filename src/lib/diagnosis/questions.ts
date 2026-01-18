import type { QuestionId } from "./types";

export type Question = {
  id: QuestionId;
  label: string;
  // total score用の寄与（YES/NOで増減）
  yesDelta: number;
  noDelta: number;
};

export const QUESTIONS: Question[] = [
  { id: "q1", label: "毎回ほぼ同じ入力・同じ手順ですか？", yesDelta: 10, noDelta: -4 },
  { id: "q2", label: "手順を文章で明確にできますか？", yesDelta: 8, noDelta: -6 },
  { id: "q3", label: "判断基準を条件分岐（IF）で表現できますか？", yesDelta: 8, noDelta: -8 },
  { id: "q4", label: "例外（イレギュラー）は週1回以下ですか？", yesDelta: 7, noDelta: -8 },
  { id: "q5", label: "必要データはデジタルで揃っていますか？", yesDelta: 7, noDelta: -6 },
  { id: "q6", label: "複数システム間の転記・コピーが主作業ですか？", yesDelta: 5, noDelta: 0 },
  { id: "q7", label: "失敗しても致命的ではなく、復旧できますか？", yesDelta: 8, noDelta: -12 },

  // リスク系（YESは減点）
  { id: "q8", label: "個人情報・機密情報を大量に扱いますか？", yesDelta: -10, noDelta: 2 },
  { id: "q9", label: "法務/監査/規制の影響を受けますか？", yesDelta: -10, noDelta: 2 },

  { id: "q10", label: "正解が一意に決まりますか？", yesDelta: 6, noDelta: -6 },

  // “今のツール”前提（現実性）
  { id: "q11", label: "今使っているツールだけで、CSV/Excel/JSON等で取り出せますか？", yesDelta: 5, noDelta: -6 },
  { id: "q12", label: "今使っているツールに、自動化機能（API/Power Automate等）がありますか？", yesDelta: 5, noDelta: -6 },

  // 推奨ツールの方向性
  { id: "q13", label: "作業は『文章の理解・分類・要約』が中心ですか？", yesDelta: 2, noDelta: 0 },
  { id: "q14", label: "作業は『表の加工・集計・照合』が中心ですか？", yesDelta: 2, noDelta: 0 },
];
