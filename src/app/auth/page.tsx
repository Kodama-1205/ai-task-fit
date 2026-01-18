import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuthClient from "./AuthClient";

export const dynamic = "force-dynamic";

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 既にログイン済みなら戻す
  if (user) {
    redirect(searchParams?.redirect || "/");
  }

  return <AuthClient redirectTo={searchParams?.redirect || "/"} />;
}
