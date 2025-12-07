import Button from "@/components/Button";
import { ArrowRight, Download, FileText, Sparkles, Upload } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: Upload, label: "Upload" },
  { icon: FileText, label: "Parse" },
  { icon: Sparkles, label: "Optimize" },
  { icon: Download, label: "Download" },
];

const features = [
  {
    title: "ATS Rewrite",
    description: "Cleaner sections, quantified bullet points, and keywords tuned to your target role.",
  },
  {
    title: "Job Description Match",
    description: "Paste any JD to score keyword coverage and get a gap analysis before you apply.",
  },
  {
    title: "Instant Cover Letter",
    description: "Generate a concise, tailored cover letter that mirrors the JD in under a minute.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <p className="inline-flex rounded-full border border-brand-border bg-blue-50 px-3 py-1 text-xs font-medium text-brand">
          AI + ATS workflow
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl">
            Beat the ATS. Get More Interviews.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-700">
            Upload your resume and instantly get a fully ATS-optimized rewrite tailored to your target
            role.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/upload">
            <Button className="px-6 py-3 text-base">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="glass rounded-md p-6">
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex flex-col items-center gap-2 text-sm text-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-brand shadow-sm">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-gray-900">{step.label}</p>
              {idx < steps.length - 1 && <span className="text-xs text-gray-400">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="glass rounded-md p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{feature.description}</p>
          </div>
        ))}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border pt-6 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} ATS Resume Optimizer</p>
        <div className="flex gap-4">
          <Link href="/upload" className="hover:text-brand">
            Upload
          </Link>
          <Link href="/checkout" className="hover:text-brand">
            Pricing
          </Link>
          <a href="https://openai.com" className="hover:text-brand">
            OpenAI
          </a>
        </div>
      </footer>
    </div>
  );
}
