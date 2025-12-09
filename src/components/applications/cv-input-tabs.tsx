import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasteCVSection } from "./paste-cv-section";
import { UploadCVSection } from "./upload-cv-section";

type Props = {
  mode: "paste" | "upload";
  onModeChange: (v: "paste" | "upload") => void;
  cvText: string;
  onTextChange: (v: string) => void;
  cvTitle: string;
  onTitleChange: (v: string) => void;
  onFile: (file: File | null) => void;
  error?: string;
};

export function CVInputTabs({ mode, onModeChange, cvText, onTextChange, cvTitle, onTitleChange, onFile, error }: Props) {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as "paste" | "upload")}>
      <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1 text-sm">
        <TabsTrigger value="paste" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary">
          Paste CV
        </TabsTrigger>
        <TabsTrigger value="upload" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary">
          Upload File
        </TabsTrigger>
      </TabsList>
      <TabsContent value="paste" className="pt-4">
        <PasteCVSection value={cvText} onChange={onTextChange} error={error} />
      </TabsContent>
      <TabsContent value="upload" className="pt-4">
        <UploadCVSection
          value={cvText}
          onFile={onFile}
          cvTitle={cvTitle}
          onTitleChange={onTitleChange}
          error={error}
        />
      </TabsContent>
    </Tabs>
  );
}
