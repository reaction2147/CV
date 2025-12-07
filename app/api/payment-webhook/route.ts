import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe environment variables missing" }, { status: 500 });
  }

  const stripe = new Stripe(secret);
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const resumeId = session.metadata?.resume_id;

    if (resumeId) {
      const supabase = getServiceSupabase();
      const downloadToken = session.metadata?.download_token ?? uuidv4();
      await supabase
        .from("resumes")
        .update({
          payment_status: "PAID",
          download_token: downloadToken,
        })
        .eq("id", resumeId);
    }
  }

  return NextResponse.json({ received: true });
}
