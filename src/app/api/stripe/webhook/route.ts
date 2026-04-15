import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return NextResponse.json({ error: `Webhook Error: ${String(error)}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const providerId = session.metadata?.providerId;
      const plan = session.metadata?.plan;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;

      if (providerId && subscriptionId && plan) {
        await supabaseAdmin.from('subscriptions').insert({
          provider_id: providerId,
          stripe_subscription_id: subscriptionId,
          plan_name: plan,
          status: 'active',
        });
        await supabaseAdmin.from('providers').update({ status: 'approved', is_approved: true }).eq('id', providerId);
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: subscription.status })
        .eq('stripe_subscription_id', subscription.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook handler failed', details: String(error) }, { status: 500 });
  }
}
