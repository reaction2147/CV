# TailorMyJob

TailorMyJob is a mobile-first AI job application assistant. Users paste their CV and a job description, generate ATS-friendly CV + cover letter drafts, preview blurred results, and pay once to unlock documents.

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Prisma + PostgreSQL
- Stripe one-time payments (Checkout + webhook)
- OpenAI (server-only LLM calls)

## Setup

1. Copy `.env.example` to `.env.local` and fill values:
   - `DATABASE_URL` (Postgres)
   - `OPENAI_API_KEY` and `OPENAI_MODEL`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_CV`, `STRIPE_PRICE_ID_COVER_LETTER`, `APP_URL`
2. Install deps: `npm install`
3. Generate Prisma client / apply schema:
   - `npx prisma db push` (or `prisma migrate dev`)
4. Run dev server: `npm run dev`

## Key paths

- `prisma/schema.prisma` – data models (session-based, no auth)
- `src/lib/ai.ts` – OpenAI prompts for job processing + generation (anti-fabrication)
- `src/app/api/*` – CV save, application creation, Stripe one-time checkout + webhook
- `src/app/cv`, `src/app/applications/*` – session-based app screens
- `src/app/page.tsx`, `src/app/pricing/page.tsx`, `src/app/help/page.tsx` – marketing + FAQ

## Notes

- No authentication or subscriptions; sessions are tracked via an HTTP-only cookie.
- AI routes run server-side only and include anti-fabrication instructions.
- Stripe routes create payment-mode Checkout sessions; webhooks record one-time purchases tied to the session/application. Default copy assumes GBP amounts.
