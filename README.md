# Coco Site

Guest-facing website for Coconut Beach Koh Phangan.

## Architecture

- Separate public app from CocoCal
- Shared Supabase source of truth
- Server-side reads from controlled public views
- No admin credentials or service-role keys in the browser

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Health check

`GET /api/health` verifies that the app can read the controlled room view from Supabase.

## Near-term roadmap

1. Verified property and room catalog
2. Availability and quote contract
3. Room pages with vertical video tours
4. Traveler-fit questionnaire
5. Structured WhatsApp handoff
6. Read-only agent interfaces
