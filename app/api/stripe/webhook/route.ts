import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  console.log("[Webhook] Received request");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      console.log("[Webhook] Signature verified successfully");
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    console.warn("[Webhook] No webhook secret or signature — parsing body directly (dev mode)");
    event = JSON.parse(body) as Stripe.Event;
  }

  console.log("[Webhook] Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("[Webhook] Session metadata:", session.metadata);

    const { userId, plan } = session.metadata ?? {};

    if (!userId || !plan) {
      console.error("[Webhook] Missing userId or plan in metadata:", session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ plan })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("[Webhook] Supabase update failed:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    console.log("[Webhook] Supabase update result:", data);
  }

  return NextResponse.json({ received: true });
}
