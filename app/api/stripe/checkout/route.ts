import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId, plan } = await req.json();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log('[Checkout API] Creating session for user:', user.id, '| plan:', plan, '| priceId:', priceId)

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/app?upgraded=true`,
    cancel_url: `${req.nextUrl.origin}/#cennik`,
    customer_email: user.email,
    metadata: { userId: user.id, plan },
  });

  console.log('[Checkout API] Session created, url:', session.url)
  return NextResponse.json({ url: session.url });
}
