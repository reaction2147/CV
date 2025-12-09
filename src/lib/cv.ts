import { CvStructured } from "./ai";

export function parseStructuredCv(input?: string | null): CvStructured | null {
  if (!input) return null;
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === "object" && "fullName" in parsed && "headline" in parsed) {
      return parsed as CvStructured;
    }
    if (parsed?.structuredCv) {
      return parsed.structuredCv as CvStructured;
    }
    return null;
  } catch {
    return null;
  }
}
