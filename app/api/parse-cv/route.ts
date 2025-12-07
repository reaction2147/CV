import { PARSE_CV_PROMPT, completeChat } from "@/lib/openai";
import { StrictParsedResumeSchema, type StrictParsedResume } from "@/lib/schemas";
import { getServiceSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const mimeType = file.type || guessMimeFromName(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    const rawText = await extractAndCleanText(buffer, mimeType);
    const parsed = await parseWithOpenAI(rawText);

    const supabase = getServiceSupabase();
    const downloadToken = uuidv4();
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        cv_raw_text: rawText,
        cv_parsed_json: parsed,
        download_token: downloadToken,
        payment_status: "INIT",
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ resume_id: data.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse resume" },
      { status: 500 }
    );
  }
}

async function extractAndCleanText(buffer: Buffer, mimeType: string): Promise<string> {
  let text = "";
  if (mimeType === "application/pdf") {
    const res = await pdf(buffer);
    text = res.text;
  } else if (mimeType.includes("word") || mimeType === "application/msword") {
    const res = await mammoth.extractRawText({ buffer });
    text = res.value;
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
  }
  return text.replace(/\r/g, "").split("\n").map((line) => line.trim()).filter(Boolean).join("\n").trim();
}

async function parseWithOpenAI(rawText: string): Promise<StrictParsedResume> {
  const prompt = PARSE_CV_PROMPT.replace("{{CV_TEXT}}", rawText);
  const completion = await completeChat("You output JSON only.", prompt);

  let parsedJson: unknown;
  try {
    const cleaned = completion.replace(/```json|```/g, "").trim();
    parsedJson = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Failed to parse JSON from OpenAI response.");
  }

  const validated = StrictParsedResumeSchema.parse(parsedJson);

  return validated;
}

function guessMimeFromName(name: string) {
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".doc")) return "application/msword";
  return "application/octet-stream";
}
