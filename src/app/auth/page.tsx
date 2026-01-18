import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthClient from "./AuthClient";

export const dynamic = "force-dynamic";

function pickRedirect(searchParams: any): string {
  const v = searchParams?.redirect;
  if (!v) return "/";
  if (Array.isArray(v)) return v[0] ?? "/";
  if (typeof v === "string") return v;
  return "/";
}

export default async function AuthPage(props: any) {
  // Next 15 の環境差で searchParams が Promise の場合があるので吸収
  const sp = await Promise.resolve(props?.searchParams);
  const redirectTo = pickRedirect(sp);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 既ログインなら戻す
  if (user) {
    redirect(redirectTo);
  }

  return <AuthClient redirectTo={redirectTo} />;
}
