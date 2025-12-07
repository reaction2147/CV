"use client";

import Button from "@/components/Button";
import IndustryRoleSelect from "@/components/IndustryRoleSelect";
import JDInput from "@/components/JDInput";
import PageHeader from "@/components/PageHeader";
import UploadBox from "@/components/UploadBox";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const industryRoleMap: Record<string, string[]> = {
  IT: ["Software Engineer", "DevOps", "Security", "QA", "IT Support"],
  Marketing: ["Content Strategist", "Performance Marketer", "SEO Specialist", "Brand Manager"],
  Healthcare: ["Nurse", "Physician Assistant", "Medical Coder", "Healthcare Admin"],
  Finance: ["Financial Analyst", "Accountant", "FP&A", "Risk Analyst"],
  Sales: ["Account Executive", "SDR", "Customer Success", "Sales Operations"],
  Product: ["Product Manager", "Product Owner", "Product Operations"],
  Design: ["Product Designer", "UX Researcher", "Visual Designer"],
  Data: ["Data Analyst", "Data Scientist", "Analytics Engineer"],
};

type ParseResponse = {
  resume_id: string;
  fileName?: string;
};

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const parseMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<ParseResponse>;
    },
    onSuccess: ({ resume_id, fileName }) => {
      setResumeId(resume_id);
      if (fileName) setSelectedFile(fileName);
    },
  });

  const availableRoles = useMemo(() => industryRoleMap[industry] ?? [], [industry]);
  const canContinue = Boolean(resumeId && industry && role);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file.name);
    setResumeId(undefined);
    parseMutation.mutate(file);
  };

  const handleIndustryRoleChange = (value: { industry: string; role: string }) => {
    setIndustry(value.industry);
    setRole(value.role);
  };

  const handleContinue = () => {
    if (!canContinue || !resumeId) return;
    const params = new URLSearchParams({
      resume_id: resumeId,
      industry,
      role,
    });
    if (jobDescription) params.set("jd", jobDescription);
    router.push(`/preview?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Upload your CV" subtitle="PDF or DOCX supported" />

      <div className="space-y-6">
        <UploadBox
          onFileSelected={handleFileSelected}
          loading={parseMutation.isPending}
          error={parseMutation.error?.message}
          fileName={selectedFile}
        />

        <IndustryRoleSelect
          industry={industry}
          role={role}
          industries={Object.keys(industryRoleMap)}
          roles={availableRoles.length ? availableRoles : undefined}
          onChange={handleIndustryRoleChange}
        />

        <JDInput
          value={jobDescription}
          onChange={setJobDescription}
          label="(Optional) Paste a Job Description"
        />

        <div className="flex justify-end">
          <Button onClick={handleContinue} disabled={!canContinue} loading={parseMutation.isPending}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
