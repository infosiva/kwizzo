@AGENTS.md

# AI Platform Template

## What This Is
A generic config-driven booking/marketplace platform. ONE codebase, multiple verticals.

## The Only File That Changes Per Vertical
`vertical.config.ts` — swap this and redeploy to Vercel for a completely different product.

## Built-in Verticals (PRESETS in vertical.config.ts)
- `eldercare` — Home care for older adults (ACTIVE)
- `mechanics` — Local auto mechanics with AI pre-diagnosis
- `music` — Music lesson tutors (remote + in-person)
- `wedding` — Wedding vendors marketplace
- `nutrition` — Nutritionist/dietitian matching

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS — dark mesh background, glass cards
- **Theme**: Driven by `themeColor` in `vertical.config.ts` — changes all accents
- **AI**: Groq → Gemini → Anthropic fallback chain (`lib/ai.ts`)
- **DB**: Supabase (Postgres + Auth + Realtime)
- **Payments**: Stripe Connect (marketplace, platform takes configurable cut)

## Key files
| File | Purpose |
|------|---------|
| `vertical.config.ts` | **THE ONLY FILE TO CHANGE** per vertical |
| `lib/theme.ts` | Derives all Tailwind classes from themeColor |
| `lib/ai.ts` | Groq → Gemini → Claude fallback |
| `lib/supabase.ts` | Supabase client |
| `app/page.tsx` | Homepage — hero, categories, social proof |
| `app/chat/page.tsx` | AI chat matching UI |
| `app/search/page.tsx` | Browse + filter providers |
| `app/providers/page.tsx` | Provider acquisition page |
| `app/how-it-works/page.tsx` | Explainer page |
| `components/ChatWidget.tsx` | Full chat UI component |
| `components/ProviderCard.tsx` | Provider listing card |
| `components/HeroChatPreview.tsx` | Animated demo for hero |
| `components/Navbar.tsx` | Sticky glass navbar |

## Adding a New Vertical
1. Copy `vertical.config.ts`
2. Fill in your `id`, `name`, `themeColor`, `categories`, `aiSystemPrompt`, etc.
3. Create a new Vercel project, deploy, set env vars
4. Done — entire UX adapts to the config

## Design System
- Background: `#080712` (deep dark)
- Glass cards: `rgba(255,255,255,0.03)` + `backdrop-filter: blur`
- All accent colors: derived from `themeColor` via `lib/theme.ts`
- Mesh gradient background: `radial-gradient` blobs, fixed position

## What NOT to Change
- `lib/theme.ts` class derivation pattern — adding inline styles breaks SSR
- AI fallback order in `lib/ai.ts`
- `globals.css` animation names — used throughout
