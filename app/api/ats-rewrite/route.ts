import { ATS_REWRITE_PROMPT, completeChat } from "@/lib/openai";
import {
  AtsRewriteResponseSchema,
  RewriteRequestSchema,
  StrictParsedResumeSchema,
} from "@/lib/schemas";
import { getServiceSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = RewriteRequestSchema.parse(json);

    const supabase = getServiceSupabase();
    const { data: resumeRow, error: fetchError } = await supabase
      .from("resumes")
      .select("cv_parsed_json")
      .eq("id", payload.resume_id)
      .single();

    if (fetchError || !resumeRow) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const parsedResume = StrictParsedResumeSchema.parse(resumeRow.cv_parsed_json);

    const prompt = ATS_REWRITE_PROMPT.replace("{{CV_JSON}}", JSON.stringify(parsedResume, null, 2))
      .replace("{{INDUSTRY}}", payload.industry ?? "General")
      .replace("{{ROLE}}", payload.role ?? "Generalist");

    const completion = await completeChat("You return JSON only.", prompt);
    const cleaned = completion.replace(/```json|```/g, "").trim();
    const parsed = AtsRewriteResponseSchema.parse(JSON.parse(cleaned));

    const { error: updateError } = await supabase
      .from("resumes")
      .update({
        optimized_resume_html: parsed.optimized_html,
        ats_score: parsed.ats_score,
        ats_matched_keywords: parsed.keywords_used,
        ats_missing_keywords: parsed.missing_keywords,
      })
      .eq("id", payload.resume_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      optimized_html: parsed.optimized_html,
      ats_score: parsed.ats_score,
      keywords_used: parsed.keywords_used,
      missing_keywords: parsed.missing_keywords,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rewrite resume" },
      { status: 400 }
    );
  }
}
