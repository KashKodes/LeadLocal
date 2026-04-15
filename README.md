# LeadLocal Starter Bundle

A Next.js starter for a local lead generation platform focused on Santa Barbara cleaning companies.

## Quick start

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase and Stripe keys
3. Run `npm install`
4. Run the SQL in `supabase/schema.sql`
5. Run the SQL in `supabase/policies.sql`
6. Start the app with `npm run dev`

## Notes

- Replace the Stripe price IDs in `.env.local`
- Webhook endpoint is `/api/stripe/webhook`
- Provider checkout posts to `/api/stripe/checkout`
- Customer lead form posts to `/api/leads`

## Deploy

Vercel is the easiest deployment target for this project.
