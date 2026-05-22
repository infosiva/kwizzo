# Platform Overhaul — kwizzo / tutiq / quizbites
**Date:** 2026-05-22  
**Status:** APPROVED — ready for implementation  
**Scope:** All 3 ai-platform-template projects. Changes made once in kwizzo, propagated to tutiq + quizbites via their `site.config.ts`.

---

## Problem Statement

1. `'use client'` on `page.tsx` → entire homepage is client-rendered → GPTBot / ClaudeBot / PerplexityBot see a blank page → zero AI citation, poor SEO.
2. Hero animation is a single `motion.div` fade — feels generic, not premium.
3. Free tier value prop buried in a feature list — users scan past it.
4. Playwright exists in kwizzo but not wired to CI; missing from tutiq entirely.
5. FAQ schema hardcoded in `layout.tsx` — can't customise without touching infrastructure.
6. Layout variants (split / centered / minimal) require JSX edits — no config switch.
7. No runtime admin panel — all changes require developer + redeploy.
8. `site.config.ts` shape doesn't capture layout preferences or section order.

---

## Architecture Decision: Island Architecture (Option A)

**Rule:** `app/page.tsx` is a **server component**. It renders all static content (H1, subheadline, trust pills, section headings, FAQ) as plain HTML — fully crawlable.

Interactive islands are `'use client'` components imported into the server page:
- `<HeroClient />` — stagger animation wrapper, mounts over server-rendered copy
- `<GamePreview />` — animated quiz demo (already client)
- `<GuidedTour />` — tour logic (already client)
- `<ProCheck />` — localStorage pro status check

**Key invariant:** The H1, subheadline, CTAs, trust pills, and FAQ section text must be readable by a crawler with JS disabled. Test: `curl https://kwizzo.app | grep -i "quiz"` must return content.

---

## 1. `site.config.ts` — Extended Schema

Add these new fields. All are optional with sensible defaults so existing configs don't break.

```ts
layout: {
  heroVariant: 'split' | 'centered' | 'minimal'  // default: 'split'
  sectionOrder: Array<'features' | 'demo' | 'topics' | 'howItWorks' | 'pricing' | 'faq' | 'cta'>
  showSections: {
    demo: boolean        // live game preview panel
    topics: boolean      // subject grid
    howItWorks: boolean  // 3-step guide
    pricing: boolean     // free vs pro table
    faq: boolean         // FAQ accordion
    newsletter: boolean  // email signup
    affiliates: boolean  // affiliate banners
  }
}

freeTier: {
  badge: string          // e.g. "5 rounds free · no sign-up"
  headline: string       // e.g. "Free forever. No card."
  bullets: string[]      // 3 max — shown in hero trust strip
  gateMessage: string    // shown when free limit hit: "You've used your 3 free rounds"
  gateCtaText: string    // e.g. "Unlock unlimited for $5/mo"
  gateCtaHref: string    // e.g. "/pro"
}

faq: Array<{ q: string; a: string }>   // drives both FAQ schema + visible FAQ section

animation: {
  heroStagger: boolean   // word-by-word stagger on H1. default: true
  featureCards: boolean  // whileInView stagger on feature grid. default: true
  reducedMotion: boolean // respects prefers-reduced-motion. default: true
}

seo: {
  // existing fields +
  faqSchema: boolean         // inject FAQPage JSON-LD. default: true
  appSchema: boolean         // inject SoftwareApplication JSON-LD. default: true
  llmsTxt: string            // content for /llms.txt. auto-generated if empty.
}
```

**Why this shape:** Every visible text, section toggle, and animation preference is a config value. A future admin panel writes to this shape — no schema migration needed.

---

## 2. Hero — Island Architecture + Framer Motion Stagger

### Server-rendered shell (`app/page.tsx` — server component)

```
<section>
  <div class="hero-grid lg:grid-cols-2">
    <!-- LEFT: static, crawlable -->
    <div>
      <FreeTierBadge />          ← server: renders from siteConfig.freeTier.badge
      <H1Words />                ← server: splits headline into <span> words
      <p>{siteConfig.subheadline}</p>
      <HowItWorksSteps />        ← server: 3 static steps
      <HeroCTAs />               ← server: Link tags, no JS needed
      <TrustPills />             ← server: siteConfig.freeTier.bullets
    </div>
    <!-- RIGHT: client island -->
    <HeroClient>
      <GamePreview />
    </HeroClient>
  </div>
</section>
```

### Client animation layer (`components/HeroClient.tsx`)

Wraps the left column copy in `<AnimatePresence>`. On mount, triggers stagger over the pre-rendered word spans:

```
variants.container: staggerChildren: 0.04
variants.word:      { hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }
transition:         { type: 'spring', stiffness: 120, damping: 20 }
```

**Why spring not easeOut:** Spring physics feel intentional. `easeOut` feels like a loading state. Every top-tier SaaS (Linear, Vercel, Cursor) uses spring for hero text.

CTA buttons get:
```
whileHover: { scale: 1.03 }
whileTap:   { scale: 0.97 }
transition: { type: 'spring', stiffness: 400, damping: 17 }
```

Feature cards get:
```
whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' }
initial:     { opacity: 0, y: 20, filter: 'blur(4px)' }
viewport:    { once: true, amount: 0.3 }
transition:  { delay: index * 0.08 }
```

All animations respect `prefers-reduced-motion` via a `useReducedMotion()` hook — if true, skip transform animations, keep opacity only.

---

## 3. Free Tier UX

**Hero badge** (top of left column, above H1):
```
● Free · 5 rounds · no sign-up needed
```
Green pulse dot. Driven by `siteConfig.freeTier.badge`.

**Trust strip** (below CTAs, above fold):
3 pills from `siteConfig.freeTier.bullets`:
- ✓ No account needed
- ✓ 5 free rounds every session  
- ✓ Works on any device

**Gate message** (when limit hit — `ProWall` component):
Full-screen overlay with:
- Headline: `siteConfig.freeTier.gateMessage`
- What they got for free (recap of session)
- What they unlock with Pro (3 bullets)
- Primary CTA: `siteConfig.freeTier.gateCtaText` → `/pro`
- Secondary: "Play again free tomorrow" (reset tomorrow)

**Principle:** Never surprise users with a paywall. Show free limits upfront in the hero. When the gate triggers, celebrate what they already got ("You finished 5 rounds!") before asking for upgrade.

---

## 4. Config-Driven Layout Variants

Three hero variants, all driven by `siteConfig.layout.heroVariant`:

| Variant | Layout | Use case |
|---------|--------|----------|
| `split` | lg:grid-cols-2, copy left, demo right | Default — kwizzo, tutiq, quizbites |
| `centered` | max-w-3xl centered, no demo panel | Content-heavy tools (complybuddy) |
| `minimal` | Single column, compact, CTA-first | Mobile-optimised tools |

Section visibility from `siteConfig.layout.showSections` — each section wrapped in `{siteConfig.layout.showSections.X && <Section />}`.

Section order from `siteConfig.layout.sectionOrder` — page renders sections by iterating this array, looking up the component. Zero JSX changes to reorder.

---

## 5. Playwright CI — Global Strategy

**Local pre-push:** TypeScript check + `next build` only. Fast (~15s). Blocks on compile errors.

**Post-deploy CI** (GitHub Actions — `.github/workflows/smoke.yml`):
```yaml
on: [push]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install chromium
      - run: BASE_URL=${{ vars.VERCEL_URL }} npx playwright test
```

**Global smoke spec** (`qa/smoke.spec.ts`) — same file across all 3 projects, driven by env:

```ts
const routes = (process.env.SMOKE_ROUTES ?? '/,/play,/about').split(',')

// 1. All nav routes return 200
// 2. H1 visible and non-empty
// 3. Primary CTA visible and has href
// 4. No horizontal overflow at 375px
// 5. No console errors (filter known noise)
// 6. schema: FAQPage present in <script type="application/ld+json">
// 7. robots.txt allows GPTBot
// 8. /llms.txt returns 200
// 9. POST /api/quiz returns 200 within 10s
// 10. AdBanner not visible on first paint (scroll-gated check)
```

10 checks. Runs headless in ~25s on Chromium only (mobile test is separate job, runs weekly not on every push).

**Failure behaviour:** GH Action fails → Vercel deployment marked failed → Slack/Telegram alert via site-watchdog webhook.

---

## 6. Admin Panel — Phase 2 Architecture

**Route:** `/admin/appearance` — protected by `ADMIN_SECRET` env var (checked in middleware).

**Config store:** `public/site-config.json` — runtime-fetched at page load via `fetch('/site-config.json', { cache: 'no-store' })`. Falls back to compiled `site.config.ts` if file missing or fetch fails. Zero redeploy needed. Next.js `layout.tsx` fetches this as a server component so the config is resolved at request time, not build time.

**Panel sections:**
1. **Hero** — toggle variant (split/centered/minimal), edit headline + subheadline + CTA text
2. **Sections** — drag to reorder, toggle visibility per section
3. **Free tier** — edit badge text, gate message, bullets
4. **Theme** — color picker → updates `themeColor` → live preview
5. **Ads** — per-section toggle for AdBanner visibility
6. **SEO** — edit FAQ questions/answers, OG title, description

**Tech:** React `useState` form → `POST /api/admin/config` → writes `public/site-config.json` → page reloads with new config.

**Why not Builder.io:** Adds vendor dependency + $20/mo. This achieves the same for content changes. Builder.io worth revisiting if a non-technical co-founder joins.

---

## 7. Schema — Config-Driven JSON-LD

Move all JSON-LD from hardcoded `layout.tsx` to a `SchemaOrg` server component:

```tsx
// components/SchemaOrg.tsx — server component, no JS shipped
export function SchemaOrg({ config }: { config: SiteConfig }) {
  const schemas = []
  
  if (config.seo.appSchema) schemas.push({
    '@type': 'SoftwareApplication',
    name: config.siteName,
    ...
  })
  
  if (config.seo.faqSchema && config.faq.length > 0) schemas.push({
    '@type': 'FAQPage',
    mainEntity: config.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  })
  
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
}
```

FAQ items in `site.config.ts` drive both the schema AND a visible `<FAQSection>` accordion on the page — single source of truth.

---

## 8. AI Crawlability Checklist

Applied to all 3 projects:

- [ ] `robots.txt` — already allows GPTBot/ClaudeBot/PerplexityBot in kwizzo. Copy to tutiq/quizbites.
- [ ] `/llms.txt` — generated from `siteConfig.seo.llmsTxt`. Describes the tool in plain text for LLM context.
- [ ] H1 server-rendered (island architecture fix above)
- [ ] FAQ visible in HTML (not just schema) — `<FAQSection>` renders from `siteConfig.faq`
- [ ] Segmented sitemap: `/sitemap.xml` (static) + `/blog-sitemap.xml` if blog exists
- [ ] Submit to Bing Webmaster Tools (IndexNow) — `POST https://api.indexnow.org/indexnow` on deploy

---

## Implementation Plan

**Batch 1 — kwizzo (template project)**
1. Extend `site.config.ts` schema (new fields with defaults)
2. Refactor `page.tsx` → server component + `HeroClient.tsx` island
3. Implement Framer Motion stagger + spring physics
4. Build `SchemaOrg` server component (config-driven)
5. Add `FreeTierBadge`, `TrustPills`, improved `ProWall` gate
6. Add layout variant switching (heroVariant + sectionOrder + showSections)
7. Update `qa/smoke.spec.ts` to 10-check global spec
8. Add `.github/workflows/smoke.yml`
9. Generate `/public/llms.txt`
10. Build admin panel skeleton (`/admin/appearance`)

**Batch 2 — propagate to tutiq**
- Copy `site.config.ts` shape (fill tutiq-specific values)
- Copy `qa/smoke.spec.ts` + GH Action
- Copy `SchemaOrg`, `HeroClient`, layout system
- Update tutiq `public/robots.txt`

**Batch 3 — propagate to quizbites**
- Same as tutiq propagation

---

## Success Criteria

- `curl https://kwizzo.app | grep -i "quiz game"` → returns H1 content
- Google Rich Results Test → FAQPage schema valid
- Playwright 10-check smoke → all green
- `site.config.ts` `heroVariant: 'centered'` → layout switches without touching JSX
- Free tier badge visible above fold in hero
- ProWall gate shows free recap + upgrade prompt, never surprise-blocks
- GH Action fails build if Playwright fails post-deploy
- `/llms.txt` returns 200 with tool description
