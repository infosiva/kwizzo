# Platform Overhaul v2 — Clean Rebuild
**Date:** 2026-05-22  
**Status:** APPROVED  
**Projects:** kwizzo · tutiq · quizbites (same template — build once, config drives everything)  
**Approach:** FULL REBUILD. Not a patch. Delete page.tsx, rebuild from scratch with modern stack.

---

## Core Philosophy

Stop thinking in "landing page sections". Think in **narrative arcs**:

> User arrives → immediately understands the value → sees it working → trusts it → tries it free → wants more

Every design decision answers: *does this move the user along that arc faster?*

The existing page is a feature list. We are building an **experience**.

---

## Stack — What We're Adding

| Tool | Purpose | Why |
|------|---------|-----|
| `framer-motion` v12 | All motion — already installed | Spring physics, layout animations, gestures |
| `@radix-ui/react-accordion` | FAQ accordion | Accessible, unstyled, we control look |
| CSS `@property` + Houdini | Aurora gradient animation | GPU-accelerated, zero JS |
| `next/font` + variable fonts | Typography | Already in layout — extend it |
| CSS `clip-path` animations | Section reveals | No library needed — pure CSS |
| `react-intersection-observer` | Scroll triggers | Lighter than Framer viewport |

**Not adding:** GSAP (overkill), Three.js (wrong product type), Lottie (heavy), Builder.io (vendor lock).

---

## New Page Architecture

### Server / Client Split

```
app/page.tsx                    ← SERVER COMPONENT (no 'use client')
  ├── <HeroSection />           ← server — H1, subheadline, CTAs as plain HTML
  ├── <Suspense>
  │     └── <HeroDemo />        ← client island — animated game preview
  │   </Suspense>
  ├── <SocialProofBar />        ← server — static trust strip  
  ├── <HowItWorksSection />     ← server — 3-step static HTML
  ├── <Suspense>
  │     └── <FeaturesGrid />    ← client island — whileInView stagger
  │   </Suspense>
  ├── <PricingSection />        ← server — static pricing table HTML
  ├── <FAQSection />            ← server — accordion (progressive enhancement)
  └── <FinalCTA />              ← server — bottom CTA block
```

**Rule:** If it needs `useState` or `useEffect` → client island in `<Suspense>`. Everything else → server. Crawlers read the full page. JS enhances it.

---

## Section-by-Section Design

### 1. HERO — Split Layout, Cinematic Entry

**Left column (server-rendered, crawlable):**

```
[Animated badge pill]  ← CSS animation only, no JS
  ● kwizzo · AI quiz · free to play

[H1 — 2 lines max]
  "Quiz night,
   reinvented."        ← Short. Punchy. Not a feature list.

[Subheadline — 1 sentence]
  AI generates perfect questions for every age — play in 30 seconds, no account needed.

[Free tier strip — 3 pills]
  ⚡ 5 rounds free    👨‍👩‍👧 Any age    📱 Any device

[Primary CTA]  [Secondary CTA]
  Play Free Now →      Family Mode

[Social proof — real only]
  "Played by families in 40+ countries"  ← only if verifiable, else remove
```

**Right column (client island):**
Live animated game demo — existing `GamePreview` component, kept as-is.

**Entry animation (Framer Motion):**
```ts
// Container staggers children 0.06s apart
// Each child: y: 24→0, opacity: 0→1, filter: blur(6px)→blur(0)
// Spring: stiffness 80, damping 20 — slow, cinematic, not snappy
// Respects prefers-reduced-motion: skip transforms, keep opacity
```

**Badge pill — CSS only (no JS hydration cost):**
```css
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary), 0.4) }
  50%       { box-shadow: 0 0 0 8px rgba(var(--color-primary), 0) }
}
```

---

### 2. SOCIAL PROOF BAR — Logo Marquee

Infinite scroll marquee of tool categories / platforms the quiz covers.  
Not fake logos. Use category icons: Science 🔬 · History 📜 · Sport ⚽ · Music 🎵 · Film 🎬 · Tech 💻

```css
/* CSS-only marquee — zero JS */
@keyframes marquee { to { transform: translateX(-50%) } }
.marquee-track { animation: marquee 20s linear infinite }
```

Gradient fade mask left/right edges via `mask-image`.

---

### 3. HOW IT WORKS — Numbered Steps (server-rendered)

3 steps. Each: large number, icon, title, 1-sentence description.  
Driven entirely by `siteConfig.howItWorks[]`.

```
  01              02               03
Pick a topic   AI generates    Play together
               fresh questions  live scores

  ↑               ↑                ↑
[Icon]          [Icon]           [Icon]
[Title]         [Title]          [Title]
[Desc]          [Desc]           [Desc]
```

On scroll: each step fades in with a slight left→right stagger (client island, `whileInView`).  
Connecting line between steps animates width from 0→100% as user scrolls.

---

### 4. FEATURES GRID — Bento Layout

Not a uniform 3-column grid. **Bento**: mixed card sizes, visual hierarchy.

```
┌─────────────────┬──────────┬──────────┐
│  LARGE CARD     │ med card │ med card │
│  (hero feature) │          │          │
├──────────┬──────┴──────────┴──────────┤
│ med card │   WIDE CARD (social/share) │
└──────────┴───────────────────────────┘
```

Cards driven by `siteConfig.features[]` with an optional `size: 'large' | 'wide' | 'medium'` field.  
Default: first feature gets `large`, last feature gets `wide`, rest `medium`.

**Card animation:** `whileInView` with blur-in reveal. `once: true`. Stagger `0.1s` per card.  
**Card hover:** `whileHover: { y: -4, borderColor: 'rgba(var(--color-primary), 0.4)' }` — subtle lift.

---

### 5. FREE vs PRO — Transparent Comparison

Not a pricing table. A **transparent comparison** that makes free feel generous:

```
┌──────────────────────┬────────────────────────────┐
│  FREE — always free  │  PRO — $5/mo               │
├──────────────────────┼────────────────────────────┤
│  ✓ 5 rounds/session  │  ✓ Unlimited rounds        │
│  ✓ 10 categories     │  ✓ All 100+ categories     │
│  ✓ Solo + group mode │  ✓ Custom quiz creation     │
│  ✓ Live leaderboard  │  ✓ No ads                  │
│  ✗ Custom quizzes    │  ✓ Export scorecards        │
│  ✗ No-ad experience  │  ✓ Priority AI              │
├──────────────────────┴────────────────────────────┤
│  [Play Free Now]          [Upgrade to Pro →]      │
└────────────────────────────────────────────────────┘
```

**Key UX principle:** Free column shows ✗ only for things users clearly want after experiencing the free tier (custom quizzes, no ads). Never show ✗ upfront on things they don't know they want yet. Sequence: impress first, gate second.

Driven by `siteConfig.pricing[]` — each tier has `features[]` with `{ text, included: boolean }`.

---

### 6. FAQ — Accordion + Schema

Visible accordion on page (server-rendered HTML, JS-enhanced with Radix).  
Same data drives `FAQPage` JSON-LD in `<SchemaOrg />` server component.

Single source of truth: `siteConfig.faq: Array<{ q: string; a: string }>`.

4-6 questions. Written to answer what AI tools commonly ask about the product.

---

### 7. FINAL CTA BLOCK

Full-width. High contrast. Single focus.

```
┌──────────────────────────────────────────────────┐
│  [Aurora gradient bg — different from hero]      │
│                                                  │
│  Ready for quiz night?                           │
│  Start free. No account. Works on any device.    │
│                                                  │
│         [ ⚡ Play Free Now → ]                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

Pulsing glow on CTA button. `whileInView` entry. No other distractions.

---

## Config Shape — `site.config.ts` Full Schema

```ts
export const siteConfig = {
  // Identity
  siteName: string
  domain: string
  themeColor: string        // maps to CSS var(--color-primary)

  // Hero
  heroBadge: string         // "kwizzo · AI quiz · free to play"
  headline: string[]        // array of lines: ["Quiz night,", "reinvented."]
  subheadline: string       // 1 sentence
  ctaPrimary: { text: string; href: string }
  ctaSecondary: { text: string; href: string }

  // Free tier — shown in hero strip + gate
  freeTier: {
    pills: string[]         // max 3: ["5 rounds free", "Any age", "Any device"]
    gateHeadline: string    // "You've used your 5 free rounds!"
    gateSubtext: string     // "That was fun. Unlock unlimited for the family."
    gateCtaText: string
    gateCtaHref: string
    gateSecondaryText: string  // "Play again free tomorrow"
  }

  // Social proof
  socialProof: {
    marqueeItems: string[]  // category icons + labels for marquee
    stat?: string           // optional single stat if real: "40+ countries"
  }

  // How it works
  howItWorks: Array<{
    step: number
    icon: string            // emoji
    title: string
    desc: string
  }>

  // Features — bento grid
  features: Array<{
    icon: string
    title: string
    desc: string
    size?: 'large' | 'wide' | 'medium'  // default: medium
  }>

  // Pricing
  pricing: {
    free: {
      name: string
      price: string
      period: string
      features: Array<{ text: string; included: boolean }>
      cta: { text: string; href: string }
    }
    pro: {
      name: string
      price: string
      period: string
      badge?: string
      features: Array<{ text: string; included: boolean }>
      cta: { text: string; href: string }
    }
  }

  // FAQ — drives schema + accordion
  faq: Array<{ q: string; a: string }>

  // Final CTA
  finalCta: {
    headline: string
    subtext: string
    ctaText: string
    ctaHref: string
  }

  // Layout control
  layout: {
    heroVariant: 'split' | 'centered' | 'minimal'
    sectionOrder: string[]  // section IDs in render order
    hideSections: string[]  // section IDs to hide
  }

  // SEO
  seo: {
    title: string
    description: string
    ogImage: string
    llmsDescription: string  // plain text for /llms.txt
  }

  // Chatbot
  chatbot: {
    welcomeMessage: string
    botName: string
    placeholder: string
  }
}
```

---

## Animation System — Global Rules

All animations live in `lib/motion.ts` — imported by every animated component:

```ts
export const SPRING_CINEMATIC = { type: 'spring', stiffness: 80, damping: 20 }
export const SPRING_SNAPPY    = { type: 'spring', stiffness: 400, damping: 17 }
export const SPRING_BUTTON    = { type: 'spring', stiffness: 400, damping: 17 }

export const FADE_UP = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
}

export const STAGGER_CONTAINER = (delay = 0.06) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

export const CARD_HOVER = {
  whileHover: { y: -4 },
  whileTap:   { scale: 0.98 },
  transition: SPRING_SNAPPY,
}

export const BUTTON_PRESS = {
  whileHover: { scale: 1.03 },
  whileTap:   { scale: 0.97 },
  transition: SPRING_BUTTON,
}

// Reduced motion: return null variants if user prefers reduced motion
export function useMotionVariants<T>(variants: T): T | null {
  const reduce = useReducedMotion()
  return reduce ? null : variants
}
```

**Rules enforced globally:**
- Never `transition: all` — specify exact properties
- Never `scale(0)` entry — always start `scale(0.95)` minimum
- Never `ease-in` on UI elements — always spring or `ease-out`
- Duration: buttons 100–160ms, cards 200–300ms, page sections 400–600ms
- Every `<motion.button>` and `<motion.a>` gets `BUTTON_PRESS` by default

---

## Playwright CI — 10-Check Global Spec

```ts
// qa/smoke.spec.ts — identical across all 3 projects
const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const ROUTES = (process.env.SMOKE_ROUTES ?? '/,/play,/about').split(',')

// 1. All routes return 200
// 2. H1 present in server-rendered HTML (curl test — no JS)
// 3. Primary CTA visible + has correct href
// 4. No horizontal overflow at 375px mobile
// 5. No JS console errors (filter known noise)
// 6. FAQPage schema present in <script type="application/ld+json">
// 7. /robots.txt allows GPTBot
// 8. /llms.txt returns 200
// 9. POST /api/quiz returns 200 within 10s
// 10. AdBanner not visible on first paint (scroll-gated)
```

**GH Actions workflow** (`.github/workflows/smoke.yml`):
- Trigger: every push to `main`
- Wait for Vercel preview URL (via `vercel-action` or env var)
- Run Playwright against preview URL
- Fail build if any check fails
- Telegram alert on failure (via site-watchdog webhook)

---

## Admin Panel — `/admin/appearance`

**Phase 1 (this sprint):** Config editor only — edit `public/site-config.json` via form.  
**Phase 2 (next sprint):** Live preview iframe alongside the form.  
**Phase 3 (future):** Drag-to-reorder sections, widget-level toggles.

Auth: middleware checks `Authorization: Bearer ${ADMIN_SECRET}` header.  
Store: `public/site-config.json` — fetched at runtime in `layout.tsx` (`cache: 'no-store'`), merges with compiled `site.config.ts` defaults.

---

## Implementation Order

### Batch 1 — kwizzo (template)
1. `lib/motion.ts` — global animation constants
2. `site.config.ts` — extend to full schema above
3. `app/page.tsx` — delete, rebuild as server component with client islands
4. `components/HeroSection.tsx` — server, config-driven
5. `components/HeroDemo.tsx` — client island (GamePreview wrapper)
6. `components/FeaturesGrid.tsx` — bento layout, client island (whileInView)
7. `components/PricingSection.tsx` — server, transparent comparison table
8. `components/FAQSection.tsx` — Radix accordion, server-rendered HTML
9. `components/SchemaOrg.tsx` — server component, config-driven JSON-LD
10. `components/FinalCTA.tsx` — server + animation
11. `components/MarqueeBar.tsx` — CSS-only, server-rendered
12. `components/ProWall.tsx` — rebuilt gate with free recap
13. `public/llms.txt` — generated from siteConfig.seo.llmsDescription
14. `qa/smoke.spec.ts` — 10-check global spec
15. `.github/workflows/smoke.yml` — GH Actions CI
16. `app/admin/appearance/page.tsx` — Phase 1 config editor

### Batch 2 — tutiq propagation
Copy components, update `site.config.ts` with tutiq-specific values.

### Batch 3 — quizbites propagation
Same pattern.

---

## Success Criteria

- `curl https://kwizzo.app | grep -i "quiz night"` → returns H1 in plain HTML
- Google Rich Results Test → FAQPage + SoftwareApplication valid
- Lighthouse Performance ≥ 85 on mobile
- Playwright 10 checks → all green on every push
- `siteConfig.layout.heroVariant = 'centered'` → layout switches, no JSX edits
- `siteConfig.layout.hideSections = ['faq']` → FAQ gone, no JSX edits
- Free tier pills visible above fold, no scroll needed
- ProWall shows session recap before upgrade prompt
- `/llms.txt` → 200 with product description
- `/admin/appearance` → edits `site-config.json` → change visible on next page load (no redeploy)
