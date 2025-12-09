import OpenAI from "openai";
import { z } from "zod";
import { Tone } from "@prisma/client";

const model = process.env.OPENAI_MODEL ?? "gpt-5";
const strictModel = model.startsWith("o1") || model.startsWith("o3") || model.startsWith("gpt-5");

const openai =
  process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

// Temporary debug log to verify env loading in dev
// eslint-disable-next-line no-console
console.log("[ai] OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY, "model:", process.env.OPENAI_MODEL);

const jobExtractionSchema = z.object({
  cleanedDescription: z.string(),
  roleTitle: z.string().optional(),
  seniority: z.string().optional(),
  mustHaveSkills: z.array(z.string()).optional(),
  niceToHaveSkills: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  companyTone: z.string().optional(),
  summary: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export type JobInsights = z.infer<typeof jobExtractionSchema>;

export async function processJobDescription(rawDescription: string, company?: string): Promise<JobInsights> {
  if (!openai) {
    return {
      cleanedDescription: rawDescription.trim(),
      roleTitle: undefined,
      seniority: undefined,
      mustHaveSkills: [],
      niceToHaveSkills: [],
      responsibilities: [],
      companyTone: undefined,
      summary: undefined,
      keywords: [],
    };
  }

  const prompt = `
You are an analyst that cleans and structures job descriptions for a resume tailoring app.
Return JSON with: cleanedDescription, roleTitle, seniority, mustHaveSkills (array), niceToHaveSkills (array), responsibilities (array), companyTone (string), summary (2-3 sentences), keywords (array of skills/tools).
Keep the tone honest and avoid inventing any requirements.
Company: ${company ?? "Unknown"}`;

  const response = await openai.chat.completions.create({
    model,
    ...(strictModel ? {} : { temperature: 0.4 }),
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You clean and summarize job descriptions. Do not invent requirements. Keep outputs concise and structured.",
      },
      {
        role: "user",
        content: prompt + `\n\nJob Description:\n${rawDescription}`,
      },
    ],
  });

  const json = response.choices[0].message?.content ?? "{}";
  const parsed = jobExtractionSchema.safeParse(JSON.parse(json));
  if (!parsed.success) {
    return {
      cleanedDescription: rawDescription.trim(),
      roleTitle: undefined,
      seniority: undefined,
      mustHaveSkills: [],
      niceToHaveSkills: [],
      responsibilities: [],
      companyTone: undefined,
      summary: undefined,
      keywords: [],
    };
  }
  return parsed.data;
}

const cvContactSchema = z.object({
  location: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  github: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
});

const cvExperienceSchema = z.object({
  roleTitle: z.string(),
  company: z.string(),
  location: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  bullets: z.array(z.string()).default([]),
});

const cvEducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  location: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

const cvStructuredSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  contact: cvContactSchema.default({}),
  summary: z.string(),
  skillsByCategory: z
    .array(
      z.object({
        category: z.string(),
        skills: z.array(z.string()).default([]),
      })
    )
    .default([]),
  experiences: z.array(cvExperienceSchema).default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        bullets: z.array(z.string()).default([]),
      })
    )
    .optional(),
  education: z.array(cvEducationSchema).default([]),
  certifications: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

const generationSchema = z.object({
  structuredCv: cvStructuredSchema,
});

const atsScoreSchema = z.object({
  beforeScore: z.number(),
  afterScore: z.number(),
  whatImproved: z.array(z.string()),
  remainingGaps: z.array(z.string()).optional(),
});

export type ApplicationGenerationPayload = {
  profile?: {
    headline?: string;
    summary?: string;
    location?: string | null;
    jobLevel?: string | null;
    targetRoles?: string[];
  };
  cv: { rawText: string; structuredData?: unknown };
  job: {
    title: string;
    company: string;
    cleanedDescription?: string | null;
    extractedRequirements?: unknown;
    extractedKeywords?: unknown;
    companyTone?: string | null;
  };
  tone: Tone;
  templateStyle?: string;
};

export type CvSectionExperience = z.infer<typeof cvExperienceSchema>;
export type CvSectionEducation = z.infer<typeof cvEducationSchema>;
export type CvStructured = z.infer<typeof cvStructuredSchema>;

export type GeneratedBundle = {
  structuredCv: CvStructured;
  cvHtml: string;
  blurredCvHtml: string;
  atsScore: number;
  atsFeedback: {
    strengths?: string[];
    improvements?: string[];
    beforeScore?: number;
    afterScore?: number;
    whatImproved?: string[];
  };
};

export async function generateApplicationContent(payload: ApplicationGenerationPayload): Promise<GeneratedBundle> {
  const { profile, cv, job } = payload;

  const fallbackStructured: CvStructured = {
    fullName: "Your Name",
    headline: "Role Title",
    contact: { email: "email@example.com" },
    summary: "Add OPENAI_API_KEY to generate a tailored CV. This is placeholder content.",
    skillsByCategory: [{ category: "Skills", skills: ["Skill A", "Skill B"] }],
    experiences: [
      { roleTitle: "Recent Role", company: "Company", bullets: ["Achievement bullet here"], location: "", startDate: "", endDate: "" },
    ],
    projects: [],
    education: [{ institution: "University", degree: "Degree" }],
    certifications: [],
    interests: [],
  };

  if (!openai) {
    return {
      structuredCv: fallbackStructured,
      cvHtml: renderCvHtml(fallbackStructured),
      blurredCvHtml: '<div style="filter: blur(6px); pointer-events:none;">CV placeholder</div>',
      atsScore: 70,
      atsFeedback: {
        strengths: ["Placeholder strengths"],
        improvements: ["Placeholder improvements"],
        beforeScore: 60,
        afterScore: 70,
        whatImproved: ["Placeholder improvement"],
      },
    };
  }

  const prompt = `
You are an expert CV writer, career consultant, and recruiter with deep knowledge of modern hiring practices.

Your job: Rewrite the user's CV into a professional, recruiter-ready, ATS-optimised CV tailored to the provided job description.

STRICT INSTRUCTIONS:
- NEVER invent jobs, companies, degrees, responsibilities, or certifications.
- You MAY reorganise, rephrase, compress, expand, or improve clarity.
- Use strong action verbs, quantified achievements, and role-relevant keywords.
- Maintain an ATS-friendly structure:
  - No tables
  - No graphics
  - Clear headings
  - Single-column
- Improve clarity, grammar, and impact.
- Tailor the content specifically to the job description.

Return ONLY valid JSON in this format:

{
  "fullName": string,
  "headline": string,
  "contact": {
    "email": string | null,
    "phone": string | null,
    "location": string | null,
    "linkedin": string | null,
    "github": string | null,
    "website": string | null
  },
  "summary": string,
  "skillsByCategory": [
    {
      "category": string,
      "skills": string[]
    }
  ],
  "experiences": [
    {
      "roleTitle": string,
      "company": string,
      "location": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "bullets": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "location": string | null,
      "startDate": string | null,
      "endDate": string | null
    }
  ],
  "certifications": string[],
  "interests": string[]
}

NO commentary.
NO prose outside JSON.
GPT-5 MUST return clean JSON only.
`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You craft truthful, ATS-safe CVs. Never invent employers, education, dates, or achievements. Return only JSON that matches the schema provided.",
    },
    {
      role: "user",
      content: `${prompt}
User Profile: ${JSON.stringify(profile)}
CV Text: ${cv.rawText}
Structured CV Data: ${JSON.stringify(cv.structuredData)}
Job Details: ${JSON.stringify(job)}
`,
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    ...(strictModel ? {} : { temperature: 0 }),
    response_format: { type: "json_object" },
    messages,
  });

  const json = response.choices[0].message?.content ?? "{}";
  let parsedJson = safeJson(json);
  if (!("structuredCv" in parsedJson) && parsedJson.fullName) {
    parsedJson = { structuredCv: parsedJson };
  }
  const parsed = generationSchema.safeParse(parsedJson);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("[ai] Failed to parse CV JSON", parsed.error.format(), "raw:", json);
    return {
      structuredCv: fallbackStructured,
      cvHtml: renderCvHtml(fallbackStructured),
      blurredCvHtml: '<div style="filter: blur(6px); pointer-events:none;">Generation failed</div>',
      atsScore: 0,
      atsFeedback: {},
    };
  }

  const blurWrapper = (html: string) =>
    `<div style="position:relative;"><div style="filter:blur(8px);pointer-events:none;user-select:none;">${html}</div><div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9));"></div></div>`;
  const cvHtml = renderCvHtml(parsed.data.structuredCv);

  const atsScores = await scoreAts(cv.rawText, cvHtml, job.cleanedDescription || job.title);
  const beforeScore = atsScores?.beforeScore ?? 0;
  const afterScore = atsScores?.afterScore ?? beforeScore;

  return {
    structuredCv: parsed.data.structuredCv,
    cvHtml,
    blurredCvHtml: blurWrapper(cvHtml),
    atsScore: afterScore,
    atsFeedback: {
      beforeScore,
      afterScore,
      whatImproved: atsScores?.whatImproved,
      strengths: atsScores?.whatImproved,
      improvements: atsScores?.remainingGaps,
    },
  };
}

function renderCvHtml(cv: CvStructured): string {
  const esc = (str?: string) => (str ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "");
  const sectionHeading = (title: string) => `<h3 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#64748b;margin:0 0 8px 0;">${title}</h3>`;
  const bullets = (items?: string[]) =>
    items && items.length
      ? `<ul style="margin:0 0 12px 18px;padding:0;list-style:disc;color:#0f172a;">${items
          .map((b) => `<li style="margin-bottom:6px;line-height:1.6;">${esc(b)}</li>`)
          .join("")}</ul>`
      : "";

  return `
  <div style="max-width:800px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;font-family:Inter, system-ui, -apple-system, sans-serif;color:#0f172a;line-height:1.6;box-shadow:0 10px 30px rgba(15,23,42,0.06);">
    <header style="margin-bottom:20px;">
      <div style="font-size:30px;font-weight:700;letter-spacing:-0.02em;margin-bottom:4px;">${esc(cv.fullName)}</div>
      <div style="font-size:16px;color:#475569;margin-bottom:8px;">${esc(cv.headline)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:#64748b;">
        ${[cv.contact.location, cv.contact.phone, cv.contact.email, cv.contact.linkedin, cv.contact.github, cv.contact.website]
          .filter(Boolean)
          .map((item) => `<span>${esc(item as string)}</span>`)
          .join("")}
      </div>
    </header>

    <section style="margin-bottom:24px;">
      ${sectionHeading("Professional Summary")}
      <p style="margin:0;font-size:14px;color:#0f172a;">${esc(cv.summary)}</p>
    </section>

    <section style="margin-bottom:24px;">
      ${sectionHeading("Key Skills")}
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${cv.skillsByCategory
          .map(
            (cat) =>
              `<div><div style="font-weight:600;font-size:13px;color:#0f172a;margin-bottom:2px;">${esc(cat.category)}</div><div style="font-size:13px;color:#0f172a;">${esc(cat.skills.join(", "))}</div></div>`
          )
          .join("")}
      </div>
    </section>

    <section style="margin-bottom:24px;">
      ${sectionHeading("Experience")}
      ${cv.experiences
        .map(
          (exp) => `<div style="margin-bottom:14px;">
          <div style="font-weight:700;font-size:15px;color:#0f172a;">${esc(exp.roleTitle)}</div>
          <div style="font-size:13px;color:#475569;">${esc(exp.company)}${exp.location ? " • " + esc(exp.location) : ""}</div>
          <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</div>
          ${bullets(exp.bullets)}
        </div>`
        )
        .join("")}
    </section>

    ${
      cv.projects && cv.projects.length
        ? `<section style="margin-bottom:24px;">
      ${sectionHeading("Projects")}
      ${cv.projects
        .map(
          (proj) => `<div style="margin-bottom:12px;">
          <div style="font-weight:700;font-size:14px;color:#0f172a;">${esc(proj.name)}</div>
          <div style="font-size:13px;color:#475569;margin-bottom:4px;">${esc(proj.description)}</div>
          ${bullets(proj.bullets)}
        </div>`
        )
        .join("")}
    </section>`
        : ""
    }

    <section style="margin-bottom:24px;">
      ${sectionHeading("Education")}
      ${cv.education
        .map(
          (edu) => `<div style="margin-bottom:10px;">
          <div style="font-weight:700;font-size:14px;color:#0f172a;">${esc(edu.institution)}</div>
          <div style="font-size:13px;color:#475569;">${esc(edu.degree)}${edu.location ? " • " + esc(edu.location) : ""}</div>
          <div style="font-size:12px;color:#94a3b8;">${[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</div>
        </div>`
        )
        .join("")}
    </section>

    ${
      cv.certifications && cv.certifications.length
        ? `<section style="margin-bottom:24px;">
        ${sectionHeading("Certifications")}
        ${bullets(cv.certifications)}
      </section>`
        : ""
    }

    ${
      cv.interests && cv.interests.length
        ? `<section style="margin-bottom:12px;">
        ${sectionHeading("Interests")}
        <p style="margin:0;font-size:13px;color:#0f172a;">${esc(cv.interests.join(", "))}</p>
      </section>`
        : ""
    }
  </div>
  `;
}

async function scoreAts(originalCv: string, improvedCv: string, jobDescription?: string | null) {
  if (!openai) {
    return { beforeScore: 60, afterScore: 75, whatImproved: ["Placeholder improvements"], remainingGaps: ["Placeholder gaps"] };
  }
  const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer.

Evaluate:
1. The user's ORIGINAL CV.
2. The IMPROVED CV generated by our system.

Return ONLY:
{
  "beforeScore": number,
  "afterScore": number,
  "whatImproved": string[],
  "remainingGaps": string[]
}

Scoring logic:
- Range: 0–100.
- Factors:
  - Keyword match
  - Skills relevance
  - Quantified achievements
  - Clarity
  - Structure and sections
  - ATS-friendly formatting
  - Alignment with job description

Definitions:
- beforeScore = score of original CV
- afterScore = score of improved CV
- whatImproved = specific improvements (e.g. “added missing cloud keywords”, “quantified key achievements”, “improved section clarity”, “matched summary to job role”)
- remainingGaps = small optional suggestions

MANDATORY RULES:
- Compare the TWO CVs directly.
- DO NOT hallucinate improvements that aren’t present.
- Output must be valid JSON only.
`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: "You are an ATS scoring engine. Return JSON only." },
    {
      role: "user",
      content: `${prompt}

Original CV:
${originalCv}

Improved CV:
${improvedCv}

Job Description:
${jobDescription ?? "Not provided"}
`,
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    ...(strictModel ? {} : { temperature: 0 }),
    response_format: { type: "json_object" },
    messages,
  });

  const json = response.choices[0].message?.content ?? "{}";
  const parsed = atsScoreSchema.safeParse(safeJson(json));
  if (!parsed.success) return null;
  return parsed.data;
}

function safeJson(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    return {};
  }
}
