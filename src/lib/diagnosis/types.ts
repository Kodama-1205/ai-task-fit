export type ToolKey =
  | "excel"
  | "email"
  | "chat"
  | "drive"
  | "notion"
  | "crm"
  | "erp"
  | "database"
  | "python"
  | "rpa"
  | "dify"
  | "other";

export type ToolSelection = {
  key: ToolKey;
  label: string;
};

export type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11"
  | "q12"
  | "q13"
  | "q14";

export type AnswerMap = Record<QuestionId, "yes" | "no">;

export type Verdict = "自動化OK" | "要注意（部分自動化推奨）" | "自動化NG";

export type Recommendation = {
  primary: "Python" | "Dify" | "手作業";
  secondary?: "Python" | "Dify" | "手作業";
  approach: string[];
  cautions: string[];
  keyDrivers: Array<{ id: QuestionId; label: string; impact: number }>;
};

export type EvaluationResult = {
  totalScore: number;
  verdict: Verdict;
  recommendation: Recommendation;
};
