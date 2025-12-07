"use client";

import { cn } from "@/lib/utils/cn";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

type UploadBoxProps = {
  onFileSelected: (file: File) => void;
  loading?: boolean;
  error?: string;
  fileName?: string;
};

export default function UploadBox({ onFileSelected, loading, error, fileName }: UploadBoxProps) {
  const [isDragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string | undefined>(undefined);

  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    setLocalError(null);

    if (!allowedTypes.includes(file.type)) {
      setLocalError("Only PDF or DOCX files are supported.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError("File must be smaller than 5MB.");
      return;
    }

    setLocalFileName(file.name);
    onFileSelected(file);
  };

  return (
    <label
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "glass flex cursor-pointer flex-col items-center justify-center rounded-md border-dashed border-brand-border px-6 py-10 text-center transition hover:border-brand",
        isDragging && "border-brand bg-blue-50"
      )}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={loading}
      />
      <div className="flex items-center gap-3 text-gray-800">
        <UploadCloud className="h-10 w-10 text-brand" />
        <div className="text-left">
          <p className="text-lg font-semibold text-gray-900">Drop your CV (PDF or DOCX)</p>
          <p className="text-sm text-gray-600">
            We parse it locally, then send structured data to OpenAI for optimization.
          </p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-700">
        {fileName || localFileName ? `Selected: ${fileName || localFileName}` : "PDF or DOCX files up to 5MB"}
      </div>
      {loading && <p className="mt-2 text-sm text-gray-600">Processing…</p>}
      {(error || localError) && (
        <p className="mt-4 text-sm text-red-500">{error ?? localError}</p>
      )}
    </label>
  );
}
