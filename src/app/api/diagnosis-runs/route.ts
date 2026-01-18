import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const payload = {
      user_id: user.id,
      task_title: (body.taskTitle ?? "").toString(),
      task_description: (body.taskDescription ?? "").toString(),
      selected_tools: body.selectedTools ?? [],
      answers: body.answers ?? {},
      total_score: Number(body.totalScore ?? 0),
      verdict: (body.verdict ?? "").toString(),
      recommendation: body.recommendation ?? {},
    };

    if (!payload.verdict || !Number.isFinite(payload.total_score)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("diagnosis_runs")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
