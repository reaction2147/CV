import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CvForm } from "@/components/cv/cv-form";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-cookie";

export default async function CvPage() {
  const sessionId = await getOrCreateSessionId();
  const cv = await prisma.cV.findFirst({ where: { sessionId }, orderBy: { createdAt: "desc" } });

  const defaults = {
    title: cv?.title || "Default CV",
    rawText: cv?.rawText || "",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        title="CV"
        description="Paste your base CV once. We reuse it to tailor summaries, bullets, and cover letters."
      />
      <Card className="border border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Base CV</CardTitle>
        </CardHeader>
        <CardContent>
          <CvForm defaultValues={defaults} />
        </CardContent>
      </Card>
    </div>
  );
}
