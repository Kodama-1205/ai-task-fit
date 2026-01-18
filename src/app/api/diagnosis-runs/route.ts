import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = {
    user_id: user.id,
    task_title: body.task_title ?? null,
    task_description: body.task_description ?? null,
    selected_tools: body.selected_tools ?? [],
    total_score: body.total_score ?? 0,
    verdict: body.verdict ?? null,
    recommendation: body.recommendation ?? null,
    answers: body.answers ?? null,
  };

  const { data, error } = await supabase
    .from("diagnosis_runs")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 200 });
}
