import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
};

export default function PageHeader({ title, subtitle, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        {eyebrow && (
          <span className="inline-flex rounded-full border border-brand-border bg-blue-50 px-3 py-1 text-xs font-medium text-brand">
            {eyebrow}
          </span>
        )}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}
