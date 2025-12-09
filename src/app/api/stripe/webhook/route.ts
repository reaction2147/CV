import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature as string, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      if (session.mode === "payment") {
        const sessionId = session.metadata?.sessionId as string | undefined;
        const applicationId = session.metadata?.applicationId || undefined;
        const type = session.metadata?.type as "CV" | "COVER_LETTER" | undefined;
        if (sessionId && type && session.payment_intent && applicationId) {
          await prisma.oneTimePurchase.create({
            data: {
              sessionId,
              applicationId,
              type,
              amount: session.amount_total ?? 0,
              stripePaymentIntentId: session.payment_intent as string,
            },
          });
        }
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
