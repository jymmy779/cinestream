# CineStream — Portfolio Edition

This repository is a sanitized portfolio edition of CineStream, a full-stack movie discovery and streaming interface built with Next.js and React.

The production product served **1,000+ monthly users**. That figure refers to the private production deployment, not this public demo. Production infrastructure, credentials, deployment automation, ingestion services, private media sources, analytics identifiers, and operational admin tools are intentionally excluded.

## Highlights

- Responsive cinematic interface for desktop and mobile
- Movie discovery, categories, countries, search, and detail pages
- HLS-capable player UI with episode navigation and playback progress
- Authentication-ready flows, favorites, watch later, and viewing history
- Server rendering, ISR, layered caching, image optimization, and route-level loading states
- Accessible interactions and animated transitions

The public demo uses a public catalog API by default. Authentication and personalized features can be connected to an isolated Supabase project using environment variables. Do not connect this edition to production services.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Supabase Auth and database integration
- Artplayer and HLS.js
- Framer Motion and Swiper
- Optional Redis-compatible cache

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Vercel

1. Import this repository into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the assigned Vercel domain.
3. Keep the default public catalog API, or point the API variables to an isolated demo service.
4. To enable account features, create a separate Supabase project and configure its URL and anonymous key.
5. Never reuse production credentials in this deployment.

## Repository scope

Included: public product UI, user-facing routes, reusable components, player experience, caching strategy, and optional account integrations.

Excluded: production backend and crawler, infrastructure addresses, media storage identifiers, CI/CD workflows, admin mutation tools, notification credentials, and private Git history.

## Data and media

This repository contains no production database and no private media library. Catalog metadata is loaded from a public third-party API for demonstration. Any deployed instance must comply with the API provider's terms and applicable content rights.
