export const PLANS = {
  Starter: {
    name: 'Starter',
    monthlyPrice: 99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_1TMZ2eRaWFxdaRdnaiqs3O3J',
  },
  Growth: {
    name: 'Growth',
    monthlyPrice: 199,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID || 'price_1TMZ2ORaWFxdaRdn5az10JQx',
  },
  Exclusive: {
    name: 'Exclusive',
    monthlyPrice: 349,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_EXCLUSIVE_PRICE_ID || 'price_1TMZ2eRaWFxdaRdnaiqs3O3J',
  },
} as const;

export type PlanName = keyof typeof PLANS;
