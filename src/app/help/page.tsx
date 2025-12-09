import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Does TailorMyJob make up experience?",
    answer:
      "No. Prompts explicitly prohibit fabrication. Drafts only rephrase the experience, skills, and achievements you provide.",
  },
  {
    question: "What models are used?",
    answer:
      "We default to modern, cost-efficient LLMs (e.g., GPT-4o or compatible). You can swap providers via environment variables server-side.",
  },
  {
    question: "Can I regenerate a single section?",
    answer:
      "Yes. Regenerate the CV summary, bullets, cover letter, or match summary individually. Prior edits are sent as context so improvements stay aligned.",
  },
  {
    question: "How do payments work?",
    answer:
      "You preview blurred drafts for free, then pay once to unlock a CV or cover letter. There are no subscriptions or accounts required.",
  },
  {
    question: "Is this a guarantee of employment?",
    answer:
      "No. TailorMyJob is an assistant. Always review drafts, confirm accuracy, and tailor the final submission yourself.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="space-y-3">
        <Badge className="bg-primary/10 text-primary">Help / FAQ</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">How to get the best results</h1>
        <p className="text-muted-foreground">
          Paste a strong base CV, keep job descriptions detailed, and always review AI drafts for accuracy. TailorMyJob is built to assist—not to guarantee outcomes.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq.question} className="border border-border/70 bg-white">
            <CardContent className="space-y-2 p-5">
              <p className="text-base font-semibold text-foreground">{faq.question}</p>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
