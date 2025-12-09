import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GeneratedDocumentType } from "@prisma/client";
import { getOrCreateSessionId } from "@/lib/session-cookie";
import { PaywallCard } from "@/components/applications/paywall-card";
import { JobDetailsAccordion } from "@/components/applications/job-details-accordion";
import { CvDocumentPreview } from "@/components/applications/cv-document-preview";
import { parseStructuredCv } from "@/lib/cv";
import { AtsScoreHero } from "@/components/applications/ats-score-hero";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { ExportActions } from "@/components/applications/export-actions";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { paid?: string; session_id?: string };
}) {
  const sessionId = await getOrCreateSessionId();
  const application = await prisma.application.findUnique({
    where: { id: params.id, sessionId },
    include: {
      jobPosting: true,
      generatedDocs: true,
      oneTimePurchases: true,
    },
  });

  if (!application) {
    notFound();
  }

  const cvDoc = application.generatedDocs.find((doc) => doc.type === GeneratedDocumentType.CV);
  const getDoc = (doc: typeof cvDoc, field: "htmlTemplate") => doc?.[field] || "";
  const cvHtml = getDoc(cvDoc, "htmlTemplate");

  const keywords = ((application.jobPosting.extractedKeywords as any) as string[]) || [];
  const requirements = (application.jobPosting.extractedRequirements as any)?.mustHaveSkills || [];
  const feedback = (cvDoc?.atsFeedback as any) || {};
  const beforeScore: number | undefined = feedback.beforeScore ?? application.matchScore;
  const afterScore: number | undefined = feedback.afterScore ?? application.matchScore;
  const whatImproved: string[] = feedback.whatImproved || feedback.strengths || [];

  const queryPaid = searchParams?.paid === "true";
  let hasCvPurchase = application.oneTimePurchases.some((p) => p.type === "CV") || queryPaid;

  // If returning from Stripe success, verify and persist purchase
  if (!hasCvPurchase && searchParams?.session_id && stripe) {
    const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
    if (session.payment_status === "paid") {
      await prisma.oneTimePurchase.upsert({
        where: { stripePaymentIntentId: session.payment_intent as string },
        create: {
          sessionId,
          applicationId: application.id,
          type: "CV",
          amount: session.amount_total ?? 0,
          stripePaymentIntentId: session.payment_intent as string,
        },
        update: {},
      });
      hasCvPurchase = true;
    }
  }

  const isUnlocked = hasCvPurchase;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1 text-center">
        <p className="text-sm text-muted-foreground">Your tailored CV</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {application.jobPosting.title} at {application.jobPosting.company}
        </h1>
        {application.jobPosting.location ? (
          <p className="text-sm text-muted-foreground">{application.jobPosting.location}</p>
        ) : null}
      </div>

      <AtsScoreHero before={beforeScore} after={afterScore} whatImproved={whatImproved} />

      <CvDocumentPreview
        structuredCv={parseStructuredCv(cvDoc?.blurredPreviewHtml)}
        fallbackHtml={cvHtml}
        isLocked={!isUnlocked}
      />

      {isUnlocked ? (
        <ExportActions html={cvHtml} />
      ) : (
        <PaywallCard docType="CV" unlockHref={`/api/stripe/one-time?type=cv&applicationId=${application.id}`} />
      )}

      <Link href="/applications/new" className="w-full text-primary">
        Regenerate for free
      </Link>

      <JobDetailsAccordion
        description={application.jobPosting.cleanedDescription || application.jobPosting.rawDescription}
        keywords={keywords}
        mustHaves={requirements}
      />
    </div>
  );
}
