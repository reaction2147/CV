import Link from "next/link";
import { CheckCircle2, FileText, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CV_PRICE_LABEL } from "@/lib/config";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white via-white to-slate-50">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-16">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-primary">GPT-5 CV Rewriter</p>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn Your CV Into a Recruiter-Ready Document in 30 Seconds.
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Upload your CV and job description — GPT-5 rewrites it into a tailored, ATS-optimised CV.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/applications/new">Generate My Tailored CV</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#example">See an example CV</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>No fabrication. Ever.</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>ATS-optimised rewrite by GPT-5.</span>
            </div>
          </div>
        </div>
        <Card className="border-none bg-white/80 shadow-xl shadow-primary/5" id="example">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Before → After</p>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Zap className="h-4 w-4" /> GPT-5 Rewrite
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-slate-50/80 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase text-muted-foreground">Before</p>
                <p className="mt-2 font-medium text-foreground">Long, unfocused bullets</p>
                <ul className="mt-2 space-y-2 text-xs">
                  <li>Worked on app features and helped with QA.</li>
                  <li>Collaborated with team members on projects.</li>
                </ul>
              </div>
              <div className="rounded-xl border bg-white p-4 text-sm text-foreground shadow-sm">
                <p className="text-xs uppercase text-muted-foreground">After (GPT-5)</p>
                <p className="mt-2 font-medium text-foreground">Concise, quantified achievements</p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    Launched 3 revenue-impacting features, improving activation by 18%.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    Led QA sign-offs and reduced release bugs by 22% via automated checks.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            "ATS-friendly formatting",
            "GPT-5 professional rewriting",
            "Tailored to any job description",
          ].map((item) => (
            <Card key={item} className="border-none bg-white shadow-sm">
              <CardContent className="flex items-start gap-3 p-5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Upload your CV", icon: <FileText className="h-5 w-5 text-primary" /> },
            { title: "Paste the job description", icon: <Sparkles className="h-5 w-5 text-primary" /> },
            { title: "Get your improved CV + ATS score", icon: <Zap className="h-5 w-5 text-primary" /> },
          ].map((step, idx) => (
            <Card key={step.title} className="border-none bg-white shadow-sm">
              <CardContent className="space-y-2 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {idx + 1}. {step.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Card className="border border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="space-y-4 p-6 text-center">
              <p className="text-sm font-semibold text-primary">Pricing</p>
              <h3 className="text-2xl font-semibold text-foreground">Only {CV_PRICE_LABEL} per CV — one-time payment.</h3>
              <p className="text-sm text-muted-foreground">
                Regenerate for free before you pay. Unlock to download, copy, or email your CV instantly.
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/applications/new">Generate My Tailored CV</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h3 className="text-xl font-semibold text-foreground">FAQ</h3>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">Will this pass ATS?</p>
            <p>Yes — GPT-5 restructures your CV to be fully ATS-friendly.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Do you change my experience?</p>
            <p>We improve clarity and bullet points but never invent anything.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Is this a subscription?</p>
            <p>No — it’s a one-time {CV_PRICE_LABEL} payment.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Can I regenerate?</p>
            <p>Yes — regenerate for free before unlocking.</p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>TailorMyJob</span>
          </div>
          <div className="flex gap-4">
            <Link href="#pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-primary">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
