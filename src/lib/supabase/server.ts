import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Next 15(App Router) + @supabase/ssr の cookie ブリッジは
 * 環境により cookies() が Promise / Readonly 扱いになるため、
 * 型地雷を避けつつ「ビルドを通す」「実行時に落ちない」を優先した実装に固定。
 */
export async function createSupabaseServerClient() {
  // cookies() が Promise の環境を吸収し、型は any に落として地雷回避
  const cookieStore: any = await (cookies() as any);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll?.() ?? [];
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          // Server Component 等で set が禁止/readonly の場合があるので安全化
          try {
            for (const { name, value, options } of cookiesToSet) {
              // set が存在する時だけ書き込み（無ければ no-op）
              (cookieStore as any).set?.(name, value, options);
            }
          } catch {
            // no-op（ビルド/実行を止めない）
          }
        },
      },
    }
  );
}
