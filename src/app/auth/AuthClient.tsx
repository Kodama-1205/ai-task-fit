"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthClient({ redirectTo }: { redirectTo: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("確認メールを送信しました。メール内のリンクから認証してください。");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setMessage(err?.message ?? "認証に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid">
      <div>
        <h1 className="h1">ログイン / 新規登録</h1>
        <p className="lead">診断は未ログインでも利用できます。履歴保存はログインが必要です。</p>
      </div>

      <Card title={mode === "signin" ? "ログイン" : "新規登録"}>
        <form className="grid" style={{ gap: 12 }} onSubmit={onSubmit}>
          <div className="grid" style={{ gap: 8 }}>
            <label className="label">メールアドレス</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="grid" style={{ gap: 8 }}>
            <label className="label">パスワード</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
            />
          </div>

          {message ? <div className="small">{message}</div> : null}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "処理中..." : mode === "signin" ? "ログイン" : "新規登録"}
            </button>

            <button
              className="btn ghost"
              type="button"
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
              disabled={loading}
            >
              {mode === "signin" ? "新規登録へ" : "ログインへ"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
