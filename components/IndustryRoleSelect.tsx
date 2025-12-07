"use client";

import { cn } from "@/lib/utils/cn";

const defaultIndustries = [
  "Software",
  "Product",
  "Data",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
];

const defaultRoles = [
  "Engineer",
  "Manager",
  "Analyst",
  "Designer",
  "Marketer",
  "Strategist",
  "Consultant",
  "Specialist",
];

type IndustryRoleSelectProps = {
  industry?: string;
  role?: string;
  onChange: (value: { industry: string; role: string }) => void;
  industries?: string[];
  roles?: string[];
};

export default function IndustryRoleSelect({
  industry,
  role,
  onChange,
  industries = defaultIndustries,
  roles = defaultRoles,
}: IndustryRoleSelectProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="glass rounded-md p-4">
        <label className="text-xs uppercase tracking-wide text-gray-500">Industry</label>
        <select
          className={cn(
            "mt-2 w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-gray-800 shadow-sm",
            "focus:border-brand focus:outline-none focus:ring-2 focus:ring-blue-100"
          )}
          value={industry}
          onChange={(e) => onChange({ industry: e.target.value, role: role ?? "" })}
        >
          <option value="">Select industry</option>
          {industries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="glass rounded-md p-4">
        <label className="text-xs uppercase tracking-wide text-gray-500">Role focus</label>
        <select
          className={cn(
            "mt-2 w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-gray-800 shadow-sm",
            "focus:border-brand focus:outline-none focus:ring-2 focus:ring-blue-100"
          )}
          value={role}
          onChange={(e) => onChange({ industry: industry ?? "", role: e.target.value })}
        >
          <option value="">Select role</option>
          {roles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
