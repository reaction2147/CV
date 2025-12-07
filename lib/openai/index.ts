import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  client = new OpenAI({ apiKey });
  return client;
}

export async function completeChat(system: string, prompt: string) {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

export const PARSE_CV_PROMPT = `
You are a CV parser. Convert the resume text into STRICT JSON:

{
  "summary": "",
  "skills": [],
  "jobs": [
    {
      "title": "",
      "company": "",
      "start_date": "",
      "end_date": "",
      "bullets": []
    }
  ],
  "education": []
}

Rules:
- Do NOT hallucinate.
- If unknown → null.
- Keep bullets verbatim.
- Only return valid JSON.

Resume text:
{{CV_TEXT}}
`;

export const ATS_REWRITE_PROMPT = `
You are an ATS optimization engine.

Inputs:
CV JSON: {{CV_JSON}}
Industry: {{INDUSTRY}}
Role: {{ROLE}}

Requirements:
1. Rewrite every bullet:
   - action verbs
   - measurable metrics
   - ATS keywords
   - achievement-based

2. Output ATS-safe HTML:
   - single column
   - <h2>, <h3>, <p>, <ul>, <li>

3. Add Key Skills section.

4. Calculate ATS score (0–100).

Return JSON:
{
  "optimized_html": "",
  "ats_score": 0,
  "keywords_used": [],
  "missing_keywords": []
}
`;

export const JD_MATCH_PROMPT = `
You are a job description matcher.

Inputs:
CV JSON: {{CV_JSON}}
Job Description: {{JD_TEXT}}

Output JSON:
{
  "missing_keywords": [],
  "matched_keywords": [],
  "rewritten_bullets": [],
  "improved_summary": ""
}

Rules:
- Extract required skills from JD
- Compare to CV
- Highlight matches
- Rewrite bullets using JD language
`;

export const COVER_LETTER_PROMPT = `
Write a 200–250 word cover letter using <p> tags.

Include:
- Intro
- Top achievements
- Alignment with role
- Confident closing

Inputs:
{{CV_JSON}}
{{INDUSTRY}}
{{ROLE}}
{{JD_TEXT}}

Return JSON:
{
  "cover_letter_html": "<p>...</p>"
}
`;
