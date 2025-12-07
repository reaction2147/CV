import mammoth from "mammoth";
import pdf from "pdf-parse";
import { ResumeSectionSchema, ResumeSchema, type StructuredResume } from "../schemas";

export async function extractTextFromBuffer(fileBuffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const result = await pdf(fileBuffer);
    return result.text;
  }

  const docTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/doc",
  ];

  if (docTypes.includes(mimeType)) {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

const headingPattern = /^[A-Z][A-Z\s/&-]{2,}$/;

export function structureResume(rawText: string): StructuredResume {
  const normalized = rawText
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const sections: Array<{ title: string; bullets: string[] }> = [];
  let current = { title: "Experience", bullets: [] as string[] };

  for (const line of normalized) {
    if (headingPattern.test(line)) {
      if (current.bullets.length) {
        sections.push(current);
      }
      current = { title: titleCase(line), bullets: [] };
    } else {
      current.bullets.push(line);
    }
  }
  if (current.bullets.length) {
    sections.push(current);
  }

  const resume = ResumeSchema.parse({
    sections: sections.map((section) => ResumeSectionSchema.parse(section)),
    rawText,
  });

  return resume;
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
