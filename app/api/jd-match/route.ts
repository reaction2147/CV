import { JD_MATCH_PROMPT, completeChat } from "@/lib/openai";
import {
  JdMatchResponseSchema,
  MatchRequestSchema,
  StrictParsedResumeSchema,
} from "@/lib/schemas";
import { getServiceSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = MatchRequestSchema.parse(json);

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
    const prompt = JD_MATCH_PROMPT.replace("{{CV_JSON}}", JSON.stringify(parsedResume, null, 2)).replace(
      "{{JD_TEXT}}",
      payload.jd_text
    );

    const completion = await completeChat("Return JSON only.", prompt);
    const cleaned = completion.replace(/```json|```/g, "").trim();
    const parsed = JdMatchResponseSchema.parse(JSON.parse(cleaned));

    const { error: updateError } = await supabase
      .from("resumes")
      .update({
        ats_missing_keywords: parsed.missing_keywords,
        ats_matched_keywords: parsed.matched_keywords,
        jd_text: payload.jd_text,
      })
      .eq("id", payload.resume_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to score resume" },
      { status: 400 }
    );
  }
}
