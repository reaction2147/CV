"use client";

import Button from "@/components/Button";
import JDInput from "@/components/JDInput";
import PageHeader from "@/components/PageHeader";
import ScoreCard from "@/components/ScoreCard";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function toHtml(text: string) {
  return `<div style="font-family: Inter, system-ui, sans-serif; padding: 20px; color: #0f172a; line-height: 1.6;">
    ${text}
  </div>`;
}

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resume_id") ?? null;
  const initialPaymentStatus = searchParams.get("payment_status") ?? "INIT";
  const industry = searchParams.get("industry") ?? undefined;
  const role = searchParams.get("role") ?? undefined;

  const [resumeHtml, setResumeHtml] = useState<string>(
    "<p>Generate your ATS rewrite to preview the optimized resume.</p>"
  );
  const [coverLetterHtml, setCoverLetterHtml] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState<number | undefined>(undefined);
  const [keywordMatch, setKeywordMatch] = useState<number | undefined>(undefined);
  const [paymentStatus] = useState(initialPaymentStatus);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPaid = paymentStatus === "PAID";
  const hasResumeId = Boolean(resumeId);

  const atsRewrite = useMutation({
    mutationFn: async () => {
      if (!resumeId) throw new Error("Missing resume_id. Upload your resume first.");
      const res = await fetch("/api/ats-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, industry, role }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{
        optimized_html: string;
        ats_score?: number;
        keywords_used?: string[];
        missing_keywords?: string[];
      }>;
    },
    onSuccess: ({ optimized_html, ats_score, keywords_used }) => {
      setError(null);
      setSuccess("ATS rewrite generated successfully.");
      setResumeHtml(optimized_html);
      if (typeof ats_score === "number") setScore(ats_score);
      if (keywords_used?.length) setKeywordMatch(Math.min(100, keywords_used.length * 5));
    },
    onError: (err) => {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Failed to rewrite.");
    },
  });

  const jdMatch = useMutation({
    mutationFn: async () => {
      if (!resumeId) throw new Error("Missing resume_id. Upload your resume first.");
      const res = await fetch("/api/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, jd_text: jobDescription }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{
        missing_keywords: string[];
        matched_keywords: string[];
        rewritten_bullets: string[];
        improved_summary: string;
      }>;
    },
    onSuccess: ({ matched_keywords, improved_summary }) => {
      setError(null);
      setSuccess("JD match applied.");
      if (matched_keywords?.length) setKeywordMatch(Math.min(100, matched_keywords.length * 5));
      if (improved_summary) setResumeHtml(improved_summary);
    },
    onError: (err) => {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Failed to match JD.");
    },
  });

  const coverLetter = useMutation({
    mutationFn: async () => {
      if (!resumeId) throw new Error("Missing resume_id. Upload your resume first.");
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, jd_text: jobDescription, industry, role }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ cover_letter_html: string }>;
    },
    onSuccess: ({ cover_letter_html }) => {
      setError(null);
      setSuccess("Cover letter generated.");
      setCoverLetterHtml(cover_letter_html);
    },
    onError: (err) => {
      setSuccess(null);
      setError(err instanceof Error ? err.message : "Failed to generate cover letter.");
    },
  });

  const handleCheckout = () => {
    const params = new URLSearchParams({ resume_id: resumeId });
    router.push(`/checkout?${params.toString()}`);
  };

  const resumeIframe = useMemo(() => {
    const blurredStyle = isPaid
      ? undefined
      : { filter: "blur(6px)", opacity: 0.4, pointerEvents: "none" as const };
    return (
      <div className="overflow-auto rounded-md border border-brand-border shadow-card h-[70vh] md:h-[80vh] bg-white">
        <iframe
          title="Resume Preview"
          className="w-full h-full"
          srcDoc={resumeHtml}
          style={blurredStyle}
        />
      </div>
    );
  }, [isPaid, resumeHtml]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Optimized Resume Preview"
        subtitle="Upgrade to unlock full download"
      />

      <ScoreCard
        score={score}
        keywordMatch={keywordMatch}
        readability={score ? "Clear" : undefined}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
        {resumeIframe}
        {!isPaid && (
          <p className="text-xs text-gray-500">
            Preview blurred until payment is complete.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <JDInput
          value={jobDescription}
          onChange={setJobDescription}
          label="(Optional) Paste a Job Description"
        />
      </div>

      {success && (
        <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700 border border-emerald-200">
          {success}
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => atsRewrite.mutate()} loading={atsRewrite.isPending} disabled={!hasResumeId}>
          Generate ATS Rewrite
        </Button>
        <Button
          variant="secondary"
          onClick={() => jdMatch.mutate()}
          loading={jdMatch.isPending}
          disabled={!hasResumeId}
        >
          Apply Job Description Match
        </Button>
        <Button
          variant="outline"
          onClick={() => coverLetter.mutate()}
          loading={coverLetter.isPending}
          disabled={!hasResumeId}
        >
          Generate Cover Letter
        </Button>
        <Button onClick={handleCheckout} disabled={!hasResumeId}>
          Proceed to Checkout
        </Button>
      </div>

      {coverLetterHtml && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Cover Letter (preview)</h3>
          <div className="overflow-auto rounded-md border border-brand-border shadow-card h-[60vh] md:h-[70vh] bg-white">
            <iframe
              title="Cover Letter Preview"
              className="w-full h-full"
              srcDoc={coverLetterHtml}
              style={
                isPaid
                  ? undefined
                  : { filter: "blur(6px)", opacity: 0.4, pointerEvents: "none" }
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
