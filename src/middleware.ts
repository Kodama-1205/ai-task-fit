import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          // request.cookies.set は環境により (name, value) の2引数のみの型になるため options は渡さない
          for (const { name, value } of cookiesToSet) {
            try {
              request.cookies.set(name, value);
            } catch {
              // no-op
            }
          }

          // response を作り直して、response 側に Set-Cookie を積む（ここは options を渡してOK）
          response = NextResponse.next({
            request: { headers: request.headers },
          });

          for (const { name, value, options } of cookiesToSet) {
            try {
              response.cookies.set(name, value, options);
            } catch {
              // no-op
            }
          }
        },
      },
    }
  );

  // セッション更新（cookie 更新が発生した場合は setAll 経由で response に反映される）
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
