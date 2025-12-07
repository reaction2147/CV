"use client";

type JDInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export default function JDInput({ value, onChange, label = "Job Description" }: JDInputProps) {
  return (
    <div className="glass rounded-md p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wide text-gray-500">{label}</label>
        <span className="text-[11px] text-gray-500">Paste the JD to score keyword coverage</span>
      </div>
      <textarea
        className="mt-2 h-32 w-full resize-none rounded-md border border-brand-border bg-white p-3 text-sm text-gray-800 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-blue-100"
        placeholder="Paste the JD here to check alignment and generate a cover letter."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
