import { truncate } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import { EyeOff } from "lucide-react";
import { ReactNode } from "react";

type ResumePreviewProps = {
  title?: string;
  content: string;
  blurred?: boolean;
  footer?: ReactNode;
};

export default function ResumePreview({ title, content, blurred, footer }: ResumePreviewProps) {
  return (
    <div className="relative rounded-md border border-brand-border bg-white p-5 shadow-card">
      {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
      <div
        className={cn(
          "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700",
          blurred && "blurred"
        )}
      >
        {truncate(content, 1600)}
      </div>
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/80 text-center text-sm text-gray-600">
          <div className="flex flex-col items-center gap-2">
            <EyeOff className="h-5 w-5 text-brand" />
            <p className="text-gray-700">Preview locked. Complete checkout to download the PDF.</p>
          </div>
        </div>
      )}
      {footer && <div className="mt-4 border-t border-brand-border pt-4">{footer}</div>}
    </div>
  );
}
