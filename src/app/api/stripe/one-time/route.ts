import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { APP_URL, STRIPE_PRICE_CV, CV_PRICE_GBP } from "@/lib/config";
import { getOrCreateSessionId } from "@/lib/session-cookie";

async function handle(request: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });

  const sessionId = await getOrCreateSessionId();
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const applicationId = url.searchParams.get("applicationId") || undefined;

  if (!applicationId) {
    return NextResponse.json({ error: "Missing application" }, { status: 400 });
  }

  const application = await prisma.application.findFirst({ where: { id: applicationId, sessionId } });
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const priceId = STRIPE_PRICE_CV;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    ...(priceId
      ? { line_items: [{ price: priceId, quantity: 1 }] }
      : {
          line_items: [
            {
              price_data: {
                currency: "gbp",
                product_data: { name: "Tailored CV" },
                unit_amount: Math.round(CV_PRICE_GBP * 100),
              },
              quantity: 1,
            },
          ],
        }),
    success_url: `${APP_URL}/applications/${applicationId}?paid=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/applications/${applicationId}?canceled=true`,
    metadata: {
      sessionId,
      type: "CV",
      applicationId: applicationId ?? "",
    },
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }

  return NextResponse.redirect(checkoutSession.url, 303);
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
