import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PLANS, type PlanName } from '@/lib/plans';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerId = body.providerId as string;
    const plan = body.plan as PlanName;

    if (!providerId || !plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Missing or invalid checkout payload' }, { status: 400 });
    }

    const { data: provider, error: providerError } = await supabaseAdmin
      .from('providers')
      .select('id,email,company_name,stripe_customer_id')
      .eq('id', providerId)
      .single();

    if (providerError || !provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    let customerId = provider.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: provider.email,
        name: provider.company_name,
        metadata: { providerId: provider.id },
      });
      customerId = customer.id;
      await supabaseAdmin.from('providers').update({ stripe_customer_id: customerId }).eq('id', provider.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: PLANS[plan].stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/provider/billing`,
      metadata: { providerId: provider.id, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create checkout session', details: String(error) }, { status: 500 });
  }
}
