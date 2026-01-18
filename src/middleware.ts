import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // response は cookie 更新反映のために必須
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          // request 側へ反映
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              request.cookies.set(name, value, options);
            } catch {
              // no-op
            }
          });

          // response 側へ反映（ブラウザへ返す Set-Cookie）
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              response.cookies.set(name, value, options);
            } catch {
              // no-op
            }
          });
        },
      },
    }
  );

  // セッション更新（副作用で cookie が setAll 経由で反映される）
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
