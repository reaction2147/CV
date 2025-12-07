import { getBaseUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY is not set" }, { status: 500 });
  }

  const stripe = new Stripe(secret);

  try {
    const { priceInCents = 1900, resume_id, product_type = "resume" } = await req.json();
    if (!resume_id) {
      return NextResponse.json({ error: "resume_id is required" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data: resumeRow, error: resumeError } = await supabase
      .from("resumes")
      .select("id")
      .eq("id", resume_id)
      .single();

    if (resumeError || !resumeRow) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const downloadToken = uuidv4();
    await supabase.from("resumes").update({ download_token: downloadToken }).eq("id", resume_id);

    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceInCents,
            product_data: {
              name: "ATS Resume + Cover Letter",
              description: "Optimized resume, keyword report, and PDF export.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        resume_id,
        product_type,
        download_token: downloadToken,
      },
      success_url: `${baseUrl}/download?token=${downloadToken}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 400 }
    );
  }
}
