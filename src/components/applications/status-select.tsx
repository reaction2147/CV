"use client";

import { useState } from "react";
import { ApplicationStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const statuses: { value: ApplicationStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "REJECTED", label: "Rejected" },
  { value: "OFFER", label: "Offer" },
];

export function StatusSelect({ applicationId, defaultValue }: { applicationId: string; defaultValue: ApplicationStatus }) {
  const { toast } = useToast();
  const [value, setValue] = useState<ApplicationStatus>(defaultValue);
  const [saving, setSaving] = useState(false);

  const save = async (status: ApplicationStatus) => {
    setSaving(true);
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    if (!res.ok) {
      toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
      return;
    }
    setValue(status);
    toast({ title: "Status updated", description: `Marked as ${status}.` });
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        value={value}
        onValueChange={(v) => save(v as ApplicationStatus)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {saving ? <span className="text-xs text-muted-foreground">Saving...</span> : null}
    </div>
  );
}
