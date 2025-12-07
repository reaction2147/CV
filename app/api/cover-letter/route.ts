import { COVER_LETTER_PROMPT, completeChat } from "@/lib/openai";
import {
  CoverLetterResponseSchema,
  CoverLetterSchema,
  StrictParsedResumeSchema,
} from "@/lib/schemas";
import { getServiceSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = CoverLetterSchema.parse(json);

    const supabase = getServiceSupabase();
    const { data: resumeRow, error } = await supabase
      .from("resumes")
      .select("cv_parsed_json")
      .eq("id", payload.resume_id)
      .single();

    if (error || !resumeRow) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const parsedResume = StrictParsedResumeSchema.parse(resumeRow.cv_parsed_json);

    const prompt = COVER_LETTER_PROMPT.replace("{{CV_JSON}}", JSON.stringify(parsedResume, null, 2))
      .replace("{{INDUSTRY}}", payload.industry ?? "General")
      .replace("{{ROLE}}", payload.role ?? "General")
      .replace("{{JD_TEXT}}", payload.jd_text ?? "General role");

    const completion = await completeChat("Return JSON only.", prompt);
    const cleaned = completion.replace(/```json|```/g, "").trim();
    const parsed = CoverLetterResponseSchema.parse(JSON.parse(cleaned));

    const supabase = getServiceSupabase();
    const { error: updateError } = await supabase
      .from("resumes")
      .update({ optimized_cover_letter_html: parsed.cover_letter_html })
      .eq("id", payload.resume_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ cover_letter_html: parsed.cover_letter_html });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create cover letter" },
      { status: 400 }
    );
  }
}
