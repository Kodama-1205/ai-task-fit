"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "signup" | "signin";

export default function AuthPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = useMemo(() => {
    const r = searchParams.get("redirect");
    if (!r) return "/input";
    if (!r.startsWith("/")) return "/input"; // open redirect 対策
    return r;
  }, [searchParams]);

  // 新規登録を“デフォルト”に（要望に合わせる）
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // すでにログイン済みなら即遷移
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace(redirectTo);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ensureRedirectIfLoggedIn() {
    const { data } = await supabase.auth.getUser();
    if (data.user) router.replace(redirectTo);
  }

  async function onSubmit() {
    setMsg(null);
    setBusy(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // 環境によっては signUp 直後にログイン状態にならない（メール確認がONなど）
        await ensureRedirectIfLoggedIn();

        setMsg(
          "新規登録を受け付けました。メール確認が必要な設定の場合は、届いたメールのリンクを開いた後にログインしてください。"
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        await ensureRedirectIfLoggedIn();
        setMsg("ログインしました。");
      }
    } catch (e: any) {
      setMsg(e?.message ?? "エラーが発生しました。");
    } finally {
      setBusy(false);
    }
  }

  async function onSignOut() {
    setMsg(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMsg("ログアウトしました。");
      router.replace("/");
    } catch (e: any) {
      setMsg(e?.message ?? "エラーが発生しました。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid">
      <div>
        <h1 className="h1">AI Task Fit</h1>
        <p className="lead">
          本アプリは履歴保存のため、<strong>新規登録（メール/パスワード）</strong>が必要です。
          登録後、診断へ進みます。
        </p>
      </div>

      <Card title={mode === "signup" ? "新規登録（必須）" : "ログイン（登録済みの方）"}>
        <div className="grid">
          <div>
            <span className="label">メールアドレス</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <span className="label">パスワード</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上推奨"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            <div className="small" style={{ marginTop: 8 }}>
              推奨：8文字以上。英数字を混ぜると安全です。
            </div>
          </div>

          <div className="btnRow">
            <button className="btn btnPrimary" onClick={onSubmit} disabled={busy || !email || !password}>
              {mode === "signup" ? "新規登録して開始" : "ログインして開始"}
            </button>

            <button className="btn" onClick={onSignOut} disabled={busy}>
              ログアウト
            </button>
          </div>

          <div className="small">
            ログイン後は <span className="kbd">{redirectTo}</span> に遷移します。
          </div>

          <div className="hr" />

          {/* モード切替は“迷わない”ように小さく */}
          {mode === "signup" ? (
            <div className="small">
              すでに登録済みの方は{" "}
              <button className="btn" style={{ padding: "6px 10px" }} onClick={() => setMode("signin")} disabled={busy}>
                ログインへ
              </button>
            </div>
          ) : (
            <div className="small">
              初めての方は{" "}
              <button className="btn" style={{ padding: "6px 10px" }} onClick={() => setMode("signup")} disabled={busy}>
                新規登録へ
              </button>
            </div>
          )}

          {msg ? <div className="small">{msg}</div> : null}
        </div>
      </Card>

      <Card title="補足">
        <div className="small">
          メール確認が必要な設定の場合、新規登録後に確認メールが届きます。リンクを開いた後、ログインしてください。
          （開発中は Supabase 側でメール確認をOFFにするとスムーズです）
        </div>
      </Card>
    </div>
  );
}
