import type { ToolSelection } from "./types";

export const TOOL_OPTIONS: ToolSelection[] = [
  { key: "excel", label: "Excel / スプレッドシート" },
  { key: "email", label: "Gmail / Outlook" },
  { key: "chat", label: "Slack / Teams" },
  { key: "drive", label: "Google Drive / SharePoint" },
  { key: "notion", label: "Notion / Confluence" },
  { key: "crm", label: "CRM（Salesforce等）" },
  { key: "erp", label: "基幹/ERP" },
  { key: "database", label: "自社DB（SQL）" },
  { key: "python", label: "Python（既に使用）" },
  { key: "rpa", label: "RPA（Power Automate / UiPath等）" },
  { key: "dify", label: "Dify等のLLMワークフロー" },
  { key: "other", label: "その他" },
];
