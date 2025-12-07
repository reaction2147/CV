"use client";

import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type ResumeRow = {
  optimized_resume_html?: string | null;
  optimized_cover_letter_html?: string | null;
  payment_status?: string | null;
  download_token?: string | null;
};

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [resume, setResume] = useState<ResumeRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [downloadingCover, setDownloadingCover] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setError("Missing download token.");
        setLoading(false);
        return;
      }
      if (!supabase) {
        setError("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("download_token", token)
        .maybeSingle();
      if (error || !data) {
        setError("Invalid or expired download token.");
        setLoading(false);
        return;
      }
      setResume(data as ResumeRow);
      setLoading(false);
    };
    run();
  }, [token]);

  const isPaid = (resume?.payment_status ?? "").toUpperCase() === "PAID";

  const downloadHtmlAsPdf = async (html: string | null | undefined, fileName: string, setLoadingState: (v: boolean) => void) => {
    if (!html) {
      setError("No file available to download.");
      return;
    }
    setError(null);
    setLoadingState(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, fileName }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Your Files Are Ready" subtitle={isPaid ? "Download your optimized assets below." : undefined} />

      {loading && <p className="text-sm text-gray-600">Checking your download link…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && resume && (
        <div className="glass rounded-md p-6 space-y-4">
          {!isPaid && (
            <p className="text-sm text-gray-700">
              Payment not completed yet. Please finish checkout before downloading.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => downloadHtmlAsPdf(resume.optimized_resume_html, "ats-resume.pdf", setDownloadingResume)}
              disabled={!isPaid || !resume.optimized_resume_html}
              loading={downloadingResume}
            >
              Download Resume
            </Button>
            {resume.optimized_cover_letter_html && (
              <Button
                variant="secondary"
                onClick={() =>
                  downloadHtmlAsPdf(resume.optimized_cover_letter_html, "cover-letter.pdf", setDownloadingCover)
                }
                disabled={!isPaid}
                loading={downloadingCover}
              >
                Download Cover Letter
              </Button>
            )}
          </div>

          {isPaid && (
            <p className="text-sm font-semibold text-emerald-600">
              Good luck with your applications!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
