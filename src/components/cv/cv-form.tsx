"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  title: z.string().min(2),
  rawText: z.string().min(20),
});

type CVFormValues = z.infer<typeof schema>;

export function CvForm({ defaultValues }: { defaultValues: CVFormValues }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CVFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const rawText = watch("rawText");

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setValue("rawText", text, { shouldValidate: true, shouldDirty: true });
    toast({ title: "CV loaded", description: `Imported ${file.name}` });
  };

  const onSubmit = async (values: CVFormValues) => {
    setSaving(true);
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      toast({ title: "Save failed", description: "Check your CV text and try again.", variant: "destructive" });
      return;
    }
    toast({ title: "CV saved", description: "We will use this CV for tailoring." });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">CV title</Label>
        <Input id="title" placeholder="Default CV" {...register("title")} />
        {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="rawText">CV content</Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Paste your CV or upload a file (.txt/.pdf).</p>
          <Input
            type="file"
            accept=".txt,.md,.pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
            className="sm:w-60"
          />
        </div>
        <Textarea
          id="rawText"
          rows={14}
          placeholder="Paste your CV or resume text here..."
          {...register("rawText")}
        />
        <p className="text-xs text-muted-foreground">We keep formatting simple to stay ATS-friendly.</p>
        {errors.rawText ? <p className="text-xs text-destructive">{errors.rawText.message}</p> : null}
        {!errors.rawText && !rawText ? (
          <p className="text-xs text-muted-foreground">Tip: Add your latest roles and quantified wins before generating.</p>
        ) : null}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save CV"}
        </Button>
      </div>
    </form>
  );
}
