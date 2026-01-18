import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Next.js の cookies() は await が必要
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
       cookiesToSet: { name: string; value: string; options?: Parameters<ReturnType<typeof cookies>["set"]>[2] }[]
       ) {


        // Server Component では set が禁止されるケースがあるため握りつぶす
        // (主にサインイン/サインアウトは Route Handler/Server Action で行う想定)
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // no-op
        }
      },
    },
  });
}
