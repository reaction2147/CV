"use client";

import React from "react";
import { CvStructured } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { LockedOverlay } from "./locked-overlay";

type Props = {
  structuredCv?: CvStructured | null;
  fallbackHtml?: string;
  isLocked: boolean;
};

export function CvDocumentPreview({ structuredCv, fallbackHtml, isLocked }: Props) {
  if (!structuredCv && fallbackHtml) {
    return (
      <div className={cn("relative rounded-2xl border border-border/70 bg-white shadow-sm", isLocked ? "select-none" : "select-text")}>
        <div
          className="prose max-w-none p-6 text-sm leading-relaxed text-slate-800"
          dangerouslySetInnerHTML={{ __html: fallbackHtml }}
        />
        {isLocked ? <LockedOverlay label="Locked – Unlock to download or copy" /> : null}
      </div>
    );
  }

  const cv = structuredCv;
  if (!cv) return null;

  const contactItems = [
    cv.contact.location,
    cv.contact.phone,
    cv.contact.email,
    cv.contact.linkedin,
    cv.contact.github,
    cv.contact.website,
  ].filter(Boolean) as string[];

  return (
    <div
      className={cn(
        "relative max-w-[800px] rounded-2xl border border-border/70 bg-white p-8 shadow-md shadow-primary/5",
        isLocked ? "select-none" : "select-text"
      )}
      style={{ WebkitUserSelect: isLocked ? "none" : "text", userSelect: isLocked ? "none" : "text" }}
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{cv.fullName}</div>
          <div className="text-lg text-slate-600">{cv.headline}</div>
          {contactItems.length ? (
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              {contactItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
        </header>

        <Section title="Professional Summary">
          <p className="text-sm leading-relaxed text-slate-800">{cv.summary}</p>
        </Section>

        <Section title="Key Skills">
          <div className="space-y-3">
            {cv.skillsByCategory.map((cat) => (
              <div key={cat.category}>
                <p className="text-sm font-semibold text-slate-800">{cat.category}</p>
                <p className="text-sm text-slate-800">{cat.skills.join(", ")}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Experience">
          <div className="space-y-4">
            {cv.experiences.map((exp) => (
              <div key={`${exp.roleTitle}-${exp.company}`} className="space-y-1">
                <p className="text-base font-semibold text-slate-900">{exp.roleTitle}</p>
                <p className="text-sm text-slate-600">
                  {exp.company}
                  {exp.location ? ` • ${exp.location}` : ""}
                </p>
                <p className="text-xs text-slate-500">{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</p>
                {exp.bullets?.length ? (
                  <ul className="ml-5 list-disc space-y-1 text-sm text-slate-800">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>

        {cv.projects?.length ? (
          <Section title="Projects">
            <div className="space-y-3">
              {cv.projects.map((proj) => (
                <div key={proj.name} className="space-y-1">
                  <p className="text-base font-semibold text-slate-900">{proj.name}</p>
                  <p className="text-sm text-slate-700">{proj.description}</p>
                  {proj.bullets?.length ? (
                    <ul className="ml-5 list-disc space-y-1 text-sm text-slate-800">
                      {proj.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="Education">
          <div className="space-y-3">
            {cv.education.map((edu) => (
              <div key={`${edu.institution}-${edu.degree}`} className="space-y-0.5">
                <p className="text-base font-semibold text-slate-900">{edu.institution}</p>
                <p className="text-sm text-slate-700">
                  {edu.degree}
                  {edu.location ? ` • ${edu.location}` : ""}
                </p>
                <p className="text-xs text-slate-500">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</p>
              </div>
            ))}
          </div>
        </Section>

        {cv.certifications?.length ? (
          <Section title="Certifications">
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-800">
              {cv.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {cv.interests?.length ? (
          <Section title="Interests">
            <p className="text-sm text-slate-800">{cv.interests.join(", ")}</p>
          </Section>
        ) : null}
      </div>
      {isLocked ? <LockedOverlay label="Locked – Unlock to download or copy" /> : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{title}</h3>
      {children}
    </section>
  );
}
