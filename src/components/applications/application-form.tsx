"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "../loading-overlay";
import { CVInputTabs } from "./cv-input-tabs";
import { JobDetailsSection } from "./job-details-section";
import { GenerateCTA } from "./generate-cta";
import JSZip from "jszip";

const schema = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(30),
  tone: z.enum(["PROFESSIONAL", "WARM", "ENTHUSIASTIC", "FORMAL"]),
  cvTitle: z.string().optional(),
  cvText: z.string().min(20),
});

type FormValues = z.infer<typeof schema>;

export function ApplicationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [cvMode, setCvMode] = useState<"paste" | "upload">("paste");
  const [isStreaming, setIsStreaming] = useState(false);
  const stepsProgress = [
    "Analysing your CV…",
    "Reading the job description…",
    "Generating professional structure…",
    "Saving drafts…",
    "Preparing preview…",
  ];
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      sourceUrl: "",
      description: "",
      tone: "PROFESSIONAL",
      cvTitle: "",
      cvText: "",
    },
  });

  const cvText = watch("cvText");

  useEffect(() => {
    setValue("tone", "PROFESSIONAL", { shouldDirty: false });
  }, [setValue]);

  const extractDocxText = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const docXml = await zip.file("word/document.xml")?.async("string");
      if (!docXml) return "";
      const stripped = docXml
        .replace(/<w:p[^>]*>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return stripped;
    } catch {
      return "";
    }
  };

  const loadFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    let text = "";
    const name = file.name.toLowerCase();
    if (name.endsWith(".docx")) {
      text = await extractDocxText(file);
    } else if (name.endsWith(".pdf")) {
      setError("PDF uploads are not supported right now. Please upload a DOCX or paste your CV text.");
      return;
    } else {
      text = await file.text();
    }
    setValue("cvText", text || "", { shouldValidate: true, shouldDirty: true });
    if (!text || text.length < 20) {
      setError("We couldn't extract text from this file. Please paste your CV text instead.");
      toast({ title: "Extraction issue", description: "Try pasting your CV if the PDF is mostly images." });
    } else {
      toast({ title: "CV loaded", description: `Imported ${file.name}` });
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.cvText || values.cvText.trim().length < 20) {
      setError("Please add your CV text (minimum 20 characters)." );
      return;
    }
    setError(null);
    setIsStreaming(true);
    setActiveStep(0);
    try {
      const res = await fetch("/api/applications/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sourceUrl: values.sourceUrl || null,
          letterLength: "STANDARD",
        }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const stepOrder: Record<string, number> = {
        received: 0,
        processing_jd: 1,
        generating: 2,
        saving: 3,
        done: 4,
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.replace(/^data:/, "");
          if (!payload) continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.step && stepOrder[evt.step] !== undefined) {
              setActiveStep(stepOrder[evt.step]);
            }
            if (evt.step === "error" || evt.error) {
              throw new Error(evt.message || evt.error || "Generation failed");
            }
            if (evt.step === "done" && evt.applicationId) {
              toast({ title: "Application generated", description: "Tailored CV is ready for review." });
              router.push(`/applications/${evt.applicationId}`);
              router.refresh();
              return;
            }
          } catch (err: any) {
            setError(err?.message || "Generation failed.");
            return;
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || "Generation failed.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
      {isStreaming ? <LoadingOverlay steps={stepsProgress} active={activeStep} /> : null}
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">CV generation</p>
            <h2 className="text-xl font-semibold text-foreground">Create your tailored CV</h2>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">CV inputs</p>
            <p className="text-xs text-muted-foreground">Paste or upload. We keep formatting ATS-safe.</p>
          </div>
          <CVInputTabs
            mode={cvMode}
            onModeChange={setCvMode}
            cvText={cvText}
            onTextChange={(v) => setValue("cvText", v, { shouldValidate: true, shouldDirty: true })}
            cvTitle={watch("cvTitle") || ""}
            onTitleChange={(v) => setValue("cvTitle", v, { shouldDirty: true })}
            onFile={loadFile}
            error={errors.cvText?.message}
          />
        </div>

        <JobDetailsSection
          register={register}
          errors={{
            title: errors.title?.message,
            company: errors.company?.message,
            description: errors.description?.message,
          }}
          description={watch("description")}
          onDescriptionChange={(v) => setValue("description", v, { shouldValidate: true, shouldDirty: true })}
          letterLength="STANDARD"
          onLetterLengthChange={() => {}}
          showLetterLength={false}
        />

        <GenerateCTA disabled={isSubmitting} submitting={isSubmitting} />
      </div>
    </form>
  );
}
