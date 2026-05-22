# Platform Overhaul — Kwizzo Clean Rebuild

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild kwizzo's homepage as a server-rendered, AI-crawlable, cinematic experience with config-driven layout, Framer Motion spring animations, transparent free tier UX, 10-check Playwright CI, and a Phase 1 admin panel — then propagate to tutiq and quizbites.

**Architecture:** `app/page.tsx` becomes a pure server component. Interactive parts (game demo, feature stagger, gate) are `'use client'` islands imported inside `<Suspense>`. All page content driven by an extended `site.config.ts`. A global `lib/motion.ts` exports animation constants used by every animated component.

**Tech Stack:** Next.js 16, React 19, Framer Motion v12, `@radix-ui/react-accordion`, `react-intersection-observer`, Tailwind CSS v4, Playwright, GitHub Actions.

**Working directory:** `/Users/sivaprakasam/projects/agents/kwizzo/`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/motion.ts` | **CREATE** | Global animation constants + `useMotionVariants` hook |
| `site.config.ts` | **REPLACE** | Extended schema: freeTier, howItWorks, faq, finalCta, layout, socialProof |
| `app/page.tsx` | **REPLACE** | Server component — assembles sections, respects `layout.sectionOrder` |
| `components/HeroSection.tsx` | **CREATE** | Server — badge, H1, subheadline, pills, CTAs (static HTML) |
| `components/HeroClient.tsx` | **CREATE** | Client island — mounts Framer stagger over server-rendered copy |
| `components/HeroDemo.tsx` | **CREATE** | Client island — wraps existing GamePreview, Suspense boundary |
| `components/MarqueeBar.tsx` | **CREATE** | Server — CSS-only infinite marquee, category icons |
| `components/HowItWorksSection.tsx` | **CREATE** | Server + client island — steps HTML server, connecting line client |
| `components/FeaturesGrid.tsx` | **REPLACE** | Client island — bento layout, whileInView stagger, blur-in |
| `components/PricingSection.tsx` | **CREATE** | Server — transparent free vs pro comparison table |
| `components/FAQSection.tsx` | **CREATE** | Server HTML + Radix accordion enhancement |
| `components/SchemaOrg.tsx` | **CREATE** | Server component — config-driven FAQPage + SoftwareApplication JSON-LD |
| `components/FinalCTA.tsx` | **CREATE** | Server + client island — bottom CTA block with pulse glow |
| `components/ProWall.tsx` | **REPLACE** | Client — session recap + upgrade prompt, driven by `siteConfig.freeTier` |
| `app/layout.tsx` | **MODIFY** | Import `SchemaOrg`, remove hardcoded JSON-LD, fetch runtime config |
| `app/admin/appearance/page.tsx` | **CREATE** | Client — Phase 1 config editor, writes `public/site-config.json` |
| `app/api/admin/config/route.ts` | **CREATE** | POST handler — validates + writes config JSON to `public/` |
| `public/llms.txt` | **CREATE** | Plain text product description for LLM context |
| `public/site-config.json` | **CREATE** | Empty `{}` initially — runtime overrides for admin panel |
| `qa/smoke.spec.ts` | **REPLACE** | 10-check global Playwright spec |
| `.github/workflows/smoke.yml` | **CREATE** | GH Actions — Playwright against Vercel preview URL |
| `app/globals.css` | **MODIFY** | Add badge-glow, marquee, CSS-only animations |

---

## Task 1: `lib/motion.ts` — Global Animation System

**Files:**
- Create: `lib/motion.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/motion.ts — global animation constants consumed by every animated component
// Import from here, never define animation values inline in components.
'use client'
import { useReducedMotion } from 'framer-motion'

export const SPRING_CINEMATIC = { type: 'spring' as const, stiffness: 80, damping: 20 }
export const SPRING_SNAPPY    = { type: 'spring' as const, stiffness: 400, damping: 17 }
export const SPRING_BUTTON    = { type: 'spring' as const, stiffness: 400, damping: 17 }

export const FADE_UP = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
}

export const FADE_IN = {
  hidden: { opacity: 0 },
  show:   { opacity: 1 },
}

export const STAGGER_CONTAINER = (stagger = 0.06) => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger } },
})

export const CARD_HOVER = {
  whileHover: { y: -4 } as const,
  whileTap:   { scale: 0.98 } as const,
}

export const BUTTON_PRESS = {
  whileHover: { scale: 1.03 } as const,
  whileTap:   { scale: 0.97 } as const,
}

/** Returns full variants when motion is OK, opacity-only when reduced. */
export function useMotionVariants(full: object, reduced: object = FADE_IN) {
  const reduce = useReducedMotion()
  return reduce ? reduced : full
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/sivaprakasam/projects/agents/kwizzo && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/motion.ts && git commit -m "feat: global animation constants in lib/motion.ts"
```

---

## Task 2: `site.config.ts` — Extended Schema

**Files:**
- Replace: `site.config.ts`

- [ ] **Step 1: Replace the file with extended schema**

```typescript
// site.config.ts — THE ONLY FILE TO EDIT to rebrand or reconfigure this site
// All sections, copy, FAQ, pricing, and layout variants are driven from here.

export type HeroVariant = 'split' | 'centered' | 'minimal'

export interface SiteConfig {
  siteName: string
  domain: string
  themeColor: string
  heroBadge: string
  headline: string[]
  subheadline: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary: { text: string; href: string }
  freeTier: {
    pills: string[]
    gateHeadline: string
    gateSubtext: string
    gateCtaText: string
    gateCtaHref: string
    gateSecondaryText: string
  }
  socialProof: {
    marqueeItems: string[]
    stat?: string
  }
  howItWorks: Array<{ step: number; icon: string; title: string; desc: string }>
  features: Array<{ icon: string; title: string; desc: string; size?: 'large' | 'wide' | 'medium' }>
  pricing: {
    free: { name: string; price: string; period: string; features: Array<{ text: string; included: boolean }>; cta: { text: string; href: string } }
    pro:  { name: string; price: string; period: string; badge?: string; features: Array<{ text: string; included: boolean }>; cta: { text: string; href: string } }
  }
  faq: Array<{ q: string; a: string }>
  finalCta: { headline: string; subtext: string; ctaText: string; ctaHref: string }
  layout: { heroVariant: HeroVariant; sectionOrder: string[]; hideSections: string[] }
  seo: { title: string; description: string; ogImage: string; llmsDescription: string }
  nav: Array<{ label: string; href: string }>
  chatbot: { welcomeMessage: string; botName: string; placeholder: string }
}

export const siteConfig: SiteConfig = {
  siteName:   'Kwizzo',
  domain:     'kwizzo.app',
  themeColor: 'violet',

  heroBadge:    'kwizzo · AI quiz · free to play',
  headline:     ['Quiz night,', 'reinvented.'],
  subheadline:  'AI generates perfect questions for every age — play in 30 seconds, no account needed.',
  ctaPrimary:   { text: '⚡ Play Free Now →', href: '/play?mode=solo' },
  ctaSecondary: { text: '👨‍👩‍👧 Family Mode',     href: '/play?mode=group' },

  freeTier: {
    pills:             ['⚡ 5 rounds free', '👨‍👩‍👧 Any age', '📱 Any device'],
    gateHeadline:      "You've used your 5 free rounds!",
    gateSubtext:       "That was fun. Unlock unlimited rounds for the whole family.",
    gateCtaText:       'Upgrade to Pro — £3.99/mo',
    gateCtaHref:       '/pro',
    gateSecondaryText: 'Play again free tomorrow',
  },

  socialProof: {
    marqueeItems: [
      '🔬 Science', '📜 History', '⚽ Sport', '🎵 Music',
      '🎬 Film', '💻 Tech', '🌍 Geography', '🍳 Food',
      '📚 Literature', '🎨 Art', '🐾 Animals', '🚀 Space',
    ],
  },

  howItWorks: [
    { step: 1, icon: '🎯', title: 'Pick a topic',      desc: 'Choose from 100+ categories or type any topic you want.' },
    { step: 2, icon: '⚡', title: 'AI generates',      desc: 'Fresh questions appear in seconds — never the same game twice.' },
    { step: 3, icon: '🏆', title: 'Play together',     desc: 'Live leaderboard updates as everyone answers. Crown the champion.' },
  ],

  features: [
    { icon: '⚡', title: 'Instant AI Questions',  desc: 'Fresh questions every game — AI generates from 100+ topics in seconds.',             size: 'large'  },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Mode',         desc: 'Add every player by name. AI adjusts difficulty per age automatically.',            size: 'medium' },
    { icon: '🏆', title: 'Live Leaderboard',      desc: 'Real-time scores as you play. Crown the champion at the end.',                        size: 'medium' },
    { icon: '📱', title: 'Any Device',            desc: 'Works perfectly on phones, tablets and laptops — no app to download.',                size: 'medium' },
    { icon: '🎯', title: 'All Ages Welcome',      desc: 'Kids get easier questions, adults get harder. Everyone plays together.',              size: 'wide'   },
  ],

  pricing: {
    free: {
      name: 'Free', price: '$0', period: 'forever',
      features: [
        { text: '5 rounds per session',     included: true  },
        { text: '10 standard categories',   included: true  },
        { text: 'Solo & group modes',       included: true  },
        { text: 'Live leaderboard',         included: true  },
        { text: 'Custom quiz topics',       included: false },
        { text: 'No ads',                   included: false },
      ],
      cta: { text: 'Play Free Now', href: '/play?mode=solo' },
    },
    pro: {
      name: 'Pro Family', price: '$5', period: '/month', badge: 'Popular',
      features: [
        { text: 'Unlimited rounds',              included: true },
        { text: 'All 100+ categories',           included: true },
        { text: 'Custom quiz creation',          included: true },
        { text: 'No ads — ever',                 included: true },
        { text: 'Priority AI responses',         included: true },
        { text: 'Export results & scorecards',   included: true },
      ],
      cta: { text: 'Upgrade to Pro', href: '/pro' },
    },
  },

  faq: [
    { q: 'Is Kwizzo free to use?',
      a: 'Yes — Kwizzo is free to play. You get 5 rounds every session with no credit card or account required.' },
    { q: 'How does Kwizzo generate quiz questions?',
      a: 'Kwizzo uses AI to instantly generate age-appropriate questions on any topic — from science and history to pop culture and sport. Questions are unique every game.' },
    { q: 'Can I play with my whole family?',
      a: 'Yes. Family Mode lets you add every player by name. The AI adjusts question difficulty automatically based on each player\'s age group.' },
    { q: 'Does Kwizzo work on phones and tablets?',
      a: 'Kwizzo works on any device with a browser — phones, tablets, and laptops. No download required.' },
    { q: 'What does Pro include?',
      a: 'Pro unlocks unlimited rounds, all 100+ categories, custom quiz topics, a no-ad experience, and the ability to export scorecards. It\'s £3.99/month for the whole family.' },
  ],

  finalCta: {
    headline: 'Ready for quiz night?',
    subtext:  'Start free. No account. Works on any device.',
    ctaText:  '⚡ Play Free Now →',
    ctaHref:  '/play?mode=solo',
  },

  layout: {
    heroVariant:  'split',
    sectionOrder: ['hero', 'marquee', 'howItWorks', 'features', 'pricing', 'faq', 'finalCta'],
    hideSections: [],
  },

  seo: {
    title:          'Kwizzo — Fun Family Quiz Game with AI',
    description:    'Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.',
    ogImage:        '/og-kwizzo.png',
    llmsDescription: 'Kwizzo is a free AI-powered family quiz game at kwizzo.app. It generates unique quiz questions on any topic instantly, supports family multiplayer with age-adaptive difficulty, and requires no account to play. Free tier: 5 rounds per session. Pro: unlimited rounds, custom topics, no ads.',
  },

  nav: [
    { label: 'Home',     href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing',  href: '/#pricing' },
    { label: 'About',    href: '/about' },
  ],

  chatbot: {
    welcomeMessage: 'Hi! Ready for a family quiz? I can help you create one.',
    botName:        'KwizBot',
    placeholder:    'Ask me about quizzes…',
  },
}

export default siteConfig
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors (or only errors in other files, not site.config.ts).

- [ ] **Step 3: Commit**

```bash
git add site.config.ts && git commit -m "feat: extend site.config.ts — freeTier, faq, howItWorks, layout control, full schema"
```

---

## Task 3: `app/globals.css` — Add CSS-Only Animations

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append to end of globals.css**

```css
/* ── Badge glow — CSS only, no JS hydration cost ──────────── */
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb, 124 58 237) / 0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(var(--color-primary-rgb, 124 58 237) / 0); }
}
.badge-glow { animation: badge-glow 2.5s ease-in-out infinite; }

/* ── CSS marquee — zero JS ─────────────────────────────────── */
@keyframes marquee-scroll { to { transform: translateX(-50%); } }
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 22s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }
.marquee-wrapper {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, white 8%, white 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, white 8%, white 92%, transparent 100%);
}

/* ── Connecting line animation (How It Works) ──────────────── */
@keyframes line-grow { from { width: 0%; } to { width: 100%; } }
.line-grow { animation: line-grow 0.8s ease-out forwards; }

/* ── Pulse glow on final CTA button ───────────────────────── */
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb, 124 58 237) / 0.6); }
  50%       { box-shadow: 0 0 0 16px rgba(var(--color-primary-rgb, 124 58 237) / 0); }
}
.cta-pulse { animation: cta-pulse 2s ease-in-out infinite; }

/* ── Reduce motion: disable all custom animations ──────────── */
@media (prefers-reduced-motion: reduce) {
  .badge-glow, .marquee-track, .line-grow, .cta-pulse {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/globals.css && git commit -m "feat: CSS-only animations — badge-glow, marquee, line-grow, cta-pulse"
```

---

## Task 4: `components/SchemaOrg.tsx` — Config-Driven JSON-LD

**Files:**
- Create: `components/SchemaOrg.tsx`
- Modify: `app/layout.tsx` (remove hardcoded JSON-LD, add `<SchemaOrg />`)

- [ ] **Step 1: Create SchemaOrg server component**

```tsx
// components/SchemaOrg.tsx — server component, zero JS shipped to client
import { siteConfig } from '@/site.config'

export default function SchemaOrg() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.siteName,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: siteConfig.seo.description,
      url: `https://${siteConfig.domain}`,
    },
    ...(siteConfig.faq.length > 0 ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: siteConfig.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    }] : []),
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}
```

- [ ] **Step 2: Update layout.tsx — replace hardcoded JSON-LD with `<SchemaOrg />`**

In `app/layout.tsx`, find the block:
```tsx
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
```
...and replace the entire JSON-LD `<script>` block (everything from that comment to the closing `/>`) with:
```tsx
        <SchemaOrg />
```
And add the import at the top of the file:
```tsx
import SchemaOrg from '@/components/SchemaOrg'
```

- [ ] **Step 3: Verify TypeScript + build**

```bash
npx tsc --noEmit 2>&1 | head -20 && npm run build 2>&1 | tail -8
```
Expected: clean compile.

- [ ] **Step 4: Commit**

```bash
git add components/SchemaOrg.tsx app/layout.tsx && git commit -m "feat: SchemaOrg server component — config-driven FAQPage + SoftwareApplication JSON-LD"
```

---

## Task 5: `components/MarqueeBar.tsx` — CSS-Only Social Proof

**Files:**
- Create: `components/MarqueeBar.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/MarqueeBar.tsx — server component, CSS-only animation (zero JS)
import { siteConfig } from '@/site.config'

export default function MarqueeBar() {
  // Duplicate items so CSS loop is seamless
  const items = [...siteConfig.socialProof.marqueeItems, ...siteConfig.socialProof.marqueeItems]

  return (
    <section aria-label="Quiz categories" className="py-6 border-y border-white/[0.06] overflow-hidden">
      <div className="marquee-wrapper">
        <div className="marquee-track gap-8">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-sm text-white/40 font-medium whitespace-nowrap select-none px-3"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add components/MarqueeBar.tsx && git commit -m "feat: MarqueeBar — CSS-only category marquee, server-rendered"
```

---

## Task 6: `components/HeroSection.tsx` + `components/HeroClient.tsx`

**Files:**
- Create: `components/HeroSection.tsx` (server)
- Create: `components/HeroClient.tsx` (client island)
- Create: `components/HeroDemo.tsx` (client island wrapper)

- [ ] **Step 1: Extract GamePreview from page.tsx into HeroDemo.tsx**

Read `app/page.tsx`. Find the `GamePreview` function (starts around line 85). Cut it and the `PREVIEW_QUESTIONS` / `PREVIEW_PLAYERS` constants into a new file:

```tsx
'use client'
// components/HeroDemo.tsx — client island: animated game preview
// Contains GamePreview extracted from original page.tsx
import { useState, useEffect } from 'react'

const PREVIEW_QUESTIONS = [
  { q: 'Which planet has the most moons?',       opts: ['Saturn ♄', 'Jupiter ♃', 'Neptune ♆', 'Mars ♂'],   correct: 0 },
  { q: 'What year did the Berlin Wall fall?',    opts: ['1987', '1989', '1991', '1993'],                    correct: 1 },
  { q: 'Which element has symbol Au?',           opts: ['Silver', 'Aluminium', 'Gold', 'Copper'],           correct: 2 },
  { q: 'How many bones in the adult human body?',opts: ['196', '206', '216', '226'],                        correct: 1 },
  { q: 'What is the fastest land animal?',       opts: ['Lion', 'Cheetah', 'Greyhound', 'Pronghorn'],       correct: 1 },
]
const PREVIEW_PLAYERS = [
  { name: 'Dad 🧑', score: 420, emoji: '🧑' },
  { name: 'Maya 👧', score: 380, emoji: '👧' },
  { name: 'Tom 👦',  score: 210, emoji: '👦' },
]

export default function HeroDemo() {
  const [qIdx,     setQIdx]     = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [scores,   setScores]   = useState(PREVIEW_PLAYERS.map(p => p.score))
  const [phase,    setPhase]    = useState<'question' | 'answer'>('question')

  useEffect(() => {
    if (phase === 'question') {
      const t = setTimeout(() => { setSelected(PREVIEW_QUESTIONS[qIdx].correct); setPhase('answer') }, 2200)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setScores(s => s.map((v, i) => v + (i === 0 ? 40 : i === 1 ? 25 : 10)))
        const next = (qIdx + 1) % PREVIEW_QUESTIONS.length
        setQIdx(next); setSelected(null); setPhase('question')
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [phase, qIdx])

  const q = PREVIEW_QUESTIONS[qIdx]

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0b1a] overflow-hidden shadow-2xl"
      style={{ boxShadow: '0 0 60px rgba(139,92,246,0.18)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/60">Live Game</span>
        </div>
        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Quiz</span>
      </div>

      <div className="flex gap-3 px-4 py-3 border-b border-white/[0.06]">
        {PREVIEW_PLAYERS.map((p, i) => (
          <div key={p.name} className="flex-1 text-center">
            <div className="text-base">{p.emoji}</div>
            <div className="text-[11px] text-white/60">{p.name}</div>
            <div className={`text-sm font-black tabular-nums ${i === 0 ? 'text-yellow-400' : 'text-white/70'}`}>{scores[i]}</div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4">
        <p className="text-white/80 text-sm font-semibold mb-3 leading-snug">{q.q}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.opts.map((opt, i) => (
            <div key={opt}
              className={`rounded-lg px-3 py-2 text-xs font-bold border transition-all duration-300 ${
                selected === null ? 'border-white/10 bg-white/[0.04] text-white/60' :
                i === q.correct  ? 'border-green-500/60 bg-green-500/15 text-green-300' :
                i === selected   ? 'border-red-500/40   bg-red-500/10   text-red-300'   :
                                   'border-white/5      bg-white/[0.02] text-white/30'
              }`}>
              {opt}
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-white/25 text-xs py-2 border-t border-white/[0.04]">
        Live preview — this is what a real game looks like
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create HeroClient.tsx — Framer Motion stagger wrapper**

```tsx
'use client'
// components/HeroClient.tsx — mounts Framer stagger animation over server-rendered hero copy
import { motion } from 'framer-motion'
import { STAGGER_CONTAINER, FADE_UP, SPRING_CINEMATIC, BUTTON_PRESS, useMotionVariants } from '@/lib/motion'
import { siteConfig } from '@/site.config'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { theme, btn } from '@/lib/theme'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default function HeroClient() {
  const variants  = useMotionVariants(STAGGER_CONTAINER(0.06))
  const childVars = useMotionVariants(FADE_UP)

  return (
    <motion.div
      variants={variants ?? undefined}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Badge */}
      <motion.div variants={childVars ?? undefined}>
        <span className={`badge-glow inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.badge} text-xs font-bold uppercase tracking-widest`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {siteConfig.heroBadge}
        </span>
      </motion.div>

      {/* Headline — each line staggered */}
      <motion.h1
        variants={childVars ?? undefined}
        className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight"
      >
        {siteConfig.headline.map((line, i) => (
          <span key={i} className="block">
            {i === 1
              ? <span className={theme.gradientText} style={{ filter: 'drop-shadow(0 0 24px rgba(139,92,246,0.45))' }}>{line}</span>
              : <span className="text-white">{line}</span>
            }
          </span>
        ))}
      </motion.h1>

      {/* Subheadline */}
      <motion.p variants={childVars ?? undefined} className="text-white/55 text-base leading-relaxed max-w-md">
        {siteConfig.subheadline}
      </motion.p>

      {/* Free tier pills */}
      <motion.div variants={childVars ?? undefined} className="flex flex-wrap gap-2">
        {siteConfig.freeTier.pills.map(pill => (
          <span key={pill} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${theme.badge}`}>{pill}</span>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div variants={childVars ?? undefined} className="flex flex-col sm:flex-row gap-3" id="hero-play-btn">
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.ctaPrimary.href}>
            <ShimmerButton background="rgba(124, 58, 237, 1)" shimmerColor="#e9d5ff" className="px-8 py-4 text-base font-bold min-h-[52px]">
              {siteConfig.ctaPrimary.text}
            </ShimmerButton>
          </Link>
        </motion.div>
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.ctaSecondary.href} className={btn.secondary + ' text-sm px-8 py-4 font-bold min-h-[52px] flex items-center gap-2'}>
            <Users size={15} /> {siteConfig.ctaSecondary.text}
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Create HeroSection.tsx — server component shell**

```tsx
// components/HeroSection.tsx — server component
// Static HTML that crawlers read. HeroClient mounts stagger animation on top.
import { Suspense } from 'react'
import { siteConfig } from '@/site.config'
import HeroClient from './HeroClient'
import HeroDemo from './HeroDemo'
import { theme } from '@/lib/theme'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative px-4 sm:px-6 pt-6 pb-10 max-w-6xl mx-auto">
      <div className={`grid grid-cols-1 ${
        siteConfig.layout.heroVariant === 'split'    ? 'lg:grid-cols-2 gap-12 items-center' :
        siteConfig.layout.heroVariant === 'centered' ? 'max-w-3xl mx-auto text-center' :
        /* minimal */                                  'max-w-xl'
      }`}>

        {/* LEFT: static HTML for crawlers — HeroClient enhances with animation */}
        <div>
          {/* Server-rendered fallback (visible before JS, readable by crawlers) */}
          <noscript>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 block"
              style={{ background: 'rgba(124,58,237,0.2)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)' }}>
              ● {siteConfig.heroBadge}
            </span>
            <h1 className="text-5xl font-black leading-tight mb-4">
              {siteConfig.headline.join(' ')}
            </h1>
            <p className="text-white/55 text-base mb-6">{siteConfig.subheadline}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {siteConfig.freeTier.pills.map(p => <span key={p} className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300">{p}</span>)}
            </div>
            <Link href={siteConfig.ctaPrimary.href} className="inline-block px-8 py-4 rounded-xl bg-violet-600 text-white font-bold">
              {siteConfig.ctaPrimary.text}
            </Link>
          </noscript>

          {/* JS-enhanced: HeroClient renders badge, H1, pills, CTAs with stagger */}
          <HeroClient />
        </div>

        {/* RIGHT: game demo (only in split/minimal variants) */}
        {siteConfig.layout.heroVariant !== 'centered' && (
          <div className="lg:pl-4">
            <Suspense fallback={
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] h-72 animate-pulse" />
            }>
              <HeroDemo />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add components/HeroSection.tsx components/HeroClient.tsx components/HeroDemo.tsx
git commit -m "feat: HeroSection server component + HeroClient Framer stagger + HeroDemo client island"
```

---

## Task 7: `components/HowItWorksSection.tsx`

**Files:**
- Create: `components/HowItWorksSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'
// components/HowItWorksSection.tsx
// Steps are server-renderable content; connecting line is client-side animation.
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, STAGGER_CONTAINER, useMotionVariants } from '@/lib/motion'

export default function HowItWorksSection() {
  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.15))
  const itemVars      = useMotionVariants(FADE_UP)

  return (
    <section id="how-it-works" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <motion.div
        variants={containerVars ?? undefined}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVars ?? undefined} className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">How it works</h2>
          <p className="text-white/40 text-sm">Three steps to quiz night</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-white/[0.08]" aria-hidden />

          {siteConfig.howItWorks.map((step) => (
            <motion.div key={step.step} variants={itemVars ?? undefined} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              <div className="text-3xl font-black text-white/10 tabular-nums leading-none">
                {String(step.step).padStart(2, '0')}
              </div>
              <h3 className="text-white font-bold text-base">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add components/HowItWorksSection.tsx && git commit -m "feat: HowItWorksSection — stagger steps, config-driven"
```

---

## Task 8: `components/FeaturesGrid.tsx` — Bento Layout

**Files:**
- Replace: `components/FeaturesGrid.tsx` (delete whatever is there, write fresh)

- [ ] **Step 1: Write the bento grid component**

```tsx
'use client'
// components/FeaturesGrid.tsx — bento layout, whileInView stagger, blur-in
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, STAGGER_CONTAINER, CARD_HOVER, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'
import { theme } from '@/lib/theme'

export default function FeaturesGrid() {
  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.1))
  const itemVars      = useMotionVariants(FADE_UP)

  return (
    <section id="features" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white mb-2">Everything you need</h2>
        <p className="text-white/40 text-sm">AI-powered, free to start, works on any device</p>
      </div>

      <motion.div
        variants={containerVars ?? undefined}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4"
      >
        {siteConfig.features.map((f) => {
          const isLarge = f.size === 'large'
          const isWide  = f.size === 'wide'
          return (
            <motion.div
              key={f.title}
              variants={itemVars ?? undefined}
              {...CARD_HOVER}
              transition={SPRING_CINEMATIC}
              className={`rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 flex flex-col gap-3
                cursor-default select-none
                ${isLarge ? 'md:col-span-1 md:row-span-2' : ''}
                ${isWide  ? 'sm:col-span-2 md:col-span-2' : ''}
              `}
            >
              <span className={`text-3xl ${isLarge ? 'text-4xl' : ''}`}>{f.icon}</span>
              <div className={`font-bold text-white ${isLarge ? 'text-lg' : 'text-sm'}`}>{f.title}</div>
              <div className={`text-white/45 leading-relaxed ${isLarge ? 'text-sm' : 'text-xs'}`}>{f.desc}</div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add components/FeaturesGrid.tsx && git commit -m "feat: FeaturesGrid bento layout — blur-in stagger, config-driven sizes"
```

---

## Task 9: `components/PricingSection.tsx` — Transparent Comparison

**Files:**
- Create: `components/PricingSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/PricingSection.tsx — server component, transparent free vs pro comparison
import { siteConfig } from '@/site.config'
import { theme } from '@/lib/theme'
import Link from 'next/link'

export default function PricingSection() {
  const { free, pro } = siteConfig.pricing

  return (
    <section id="pricing" className="py-14 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white mb-2">Free vs Pro</h2>
        <p className="text-white/40 text-sm">Transparent pricing — no surprises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FREE */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-4">
          <div>
            <div className="text-white/50 text-xs font-black uppercase tracking-widest mb-1">{free.name}</div>
            <div className="text-3xl font-black text-white">{free.price}</div>
            <div className="text-white/30 text-xs mt-0.5">{free.period}</div>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {free.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className={f.included ? 'text-green-400' : 'text-white/20'}>{f.included ? '✓' : '✗'}</span>
                <span className={f.included ? 'text-white/70' : 'text-white/25 line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Link href={free.cta.href}
            className="mt-2 block text-center px-5 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-bold hover:border-white/40 hover:text-white transition-all">
            {free.cta.text}
          </Link>
        </div>

        {/* PRO */}
        <div className="rounded-2xl border p-6 flex flex-col gap-4 relative overflow-hidden"
          style={{ borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.08)' }}>
          {pro.badge && (
            <span className={`absolute top-4 right-4 text-xs font-black px-2.5 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}>
              {pro.badge}
            </span>
          )}
          <div>
            <div className={`${theme.textAccent} text-xs font-black uppercase tracking-widest mb-1`}>{pro.name}</div>
            <div className="text-3xl font-black text-white">{pro.price}</div>
            <div className="text-white/30 text-xs mt-0.5">{pro.period}</div>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {pro.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-white/80">{f.text}</span>
              </li>
            ))}
          </ul>
          <Link href={pro.cta.href}
            className={`mt-2 block text-center px-5 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white text-sm font-bold hover:opacity-90 transition-opacity`}>
            {pro.cta.text}
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Install Radix accordion** (needed for next task)

```bash
npm install @radix-ui/react-accordion 2>&1 | tail -5
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 4: Commit**

```bash
git add components/PricingSection.tsx package.json package-lock.json
git commit -m "feat: PricingSection transparent comparison + install @radix-ui/react-accordion"
```

---

## Task 10: `components/FAQSection.tsx` — Radix Accordion

**Files:**
- Create: `components/FAQSection.tsx`

- [ ] **Step 1: Create the FAQ accordion**

```tsx
'use client'
// components/FAQSection.tsx
// Radix accordion for progressive enhancement; content is also in SchemaOrg JSON-LD.
import * as Accordion from '@radix-ui/react-accordion'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '@/site.config'
import { theme } from '@/lib/theme'

export default function FAQSection() {
  return (
    <section id="faq" className="py-14 px-4 sm:px-6 max-w-3xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Frequently asked questions</h2>
        <p className="text-white/40 text-sm">Everything you need to know</p>
      </div>

      <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
        {siteConfig.faq.map((item, i) => (
          <Accordion.Item
            key={i}
            value={String(i)}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
          >
            <Accordion.Trigger
              className={`w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white/80 hover:text-white transition-colors group`}
            >
              {item.q}
              <ChevronDown
                size={16}
                className="text-white/30 group-data-[state=open]:rotate-180 transition-transform duration-200 shrink-0 ml-3"
              />
            </Accordion.Trigger>
            <Accordion.Content className="px-5 pb-4 text-sm text-white/50 leading-relaxed">
              {item.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add components/FAQSection.tsx && git commit -m "feat: FAQSection Radix accordion — config-driven, matches SchemaOrg JSON-LD"
```

---

## Task 11: `components/FinalCTA.tsx`

**Files:**
- Create: `components/FinalCTA.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'
// components/FinalCTA.tsx — full-width bottom CTA with pulse glow
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, BUTTON_PRESS, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'
import { theme } from '@/lib/theme'
import Link from 'next/link'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

export default function FinalCTA() {
  const vars = useMotionVariants(FADE_UP)

  return (
    <section className="py-20 px-4 sm:px-6 border-t border-white/[0.05]">
      <motion.div
        variants={vars ?? undefined}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          {siteConfig.finalCta.headline}
        </h2>
        <p className="text-white/45 text-base">{siteConfig.finalCta.subtext}</p>

        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.finalCta.ctaHref}>
            <ShimmerButton
              background="rgba(124, 58, 237, 1)"
              shimmerColor="#e9d5ff"
              className="cta-pulse px-10 py-4 text-base font-bold min-h-[56px]"
            >
              {siteConfig.finalCta.ctaText}
            </ShimmerButton>
          </Link>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {siteConfig.freeTier.pills.map(pill => (
            <span key={pill} className={`text-xs font-medium px-3 py-1 rounded-full ${theme.badge}`}>{pill}</span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add components/FinalCTA.tsx && git commit -m "feat: FinalCTA — whileInView entry, cta-pulse glow, config-driven"
```

---

## Task 12: `components/ProWall.tsx` — Rebuilt Gate UX

**Files:**
- Replace: `components/ProWall.tsx`

- [ ] **Step 1: Rebuild ProWall with free recap + upgrade**

```tsx
'use client'
// components/ProWall.tsx — shown when free tier limit hit
// Shows what user accomplished, then upgrade prompt. Never a cold wall.
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, BUTTON_PRESS, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'
import { theme, btn } from '@/lib/theme'
import { startCheckout } from '@/lib/pro'
import { CheckCircle, Zap, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface ProWallProps {
  questionsAnswered: number
  playerName:        string
  score:             number
  onContinueFree:    () => void
  onNewGame:         () => void
}

export default function ProWall({ questionsAnswered, playerName, score, onContinueFree, onNewGame }: ProWallProps) {
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')
  const vars = useMotionVariants(FADE_UP)

  async function upgrade() {
    setLoading(true); setErr('')
    try { await startCheckout() }
    catch { setErr('Could not open checkout — please try again.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        variants={vars ?? undefined}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm flex flex-col gap-4"
      >
        {/* Recap — celebrate what they got */}
        <div className={`${theme.card} p-6 text-center`}>
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-white/50 text-sm mb-1">
            Nice work, <span className="text-white font-bold">{playerName}</span>!
          </p>
          <p className={`text-5xl font-black ${theme.textAccentBold}`}>
            {score}<span className="text-white/30 text-2xl">/{questionsAnswered}</span>
          </p>
          <p className="text-white/30 text-xs mt-2">{siteConfig.freeTier.gateHeadline}</p>
        </div>

        {/* Upgrade pitch */}
        <div className="rounded-2xl p-5 border" style={{ borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className={theme.textAccent} />
            <h2 className="text-white font-black text-lg">Unlock Kwizzo Pro</h2>
            <span className={`ml-auto text-xs font-black px-2.5 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}>
              {siteConfig.pricing.pro.price}{siteConfig.pricing.pro.period}
            </span>
          </div>
          <p className="text-white/50 text-sm mb-4">{siteConfig.freeTier.gateSubtext}</p>
          <ul className="flex flex-col gap-2 mb-4">
            {siteConfig.pricing.pro.features.filter(f => f.included).slice(0, 4).map(f => (
              <li key={f.text} className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle size={14} className="text-green-400 shrink-0" />
                {f.text}
              </li>
            ))}
          </ul>
          {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
          <motion.button
            {...BUTTON_PRESS} transition={SPRING_CINEMATIC}
            onClick={upgrade}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm disabled:opacity-60`}
          >
            {loading ? 'Opening checkout…' : siteConfig.freeTier.gateCtaText}
          </motion.button>
        </div>

        {/* Secondary actions */}
        <div className="flex flex-col gap-2">
          <motion.button
            {...BUTTON_PRESS} transition={SPRING_CINEMATIC}
            onClick={onNewGame}
            className={`${btn.secondary} w-full flex items-center justify-center gap-2 py-3 text-sm font-bold`}
          >
            <RotateCcw size={14} /> {siteConfig.freeTier.gateSecondaryText}
          </motion.button>
          <Link href="/" className="text-center text-white/30 text-xs hover:text-white/50 transition-colors py-2">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add components/ProWall.tsx && git commit -m "feat: ProWall rebuilt — session recap, config-driven gate messaging, no cold wall"
```

---

## Task 13: `app/page.tsx` — Clean Server Component

**Files:**
- Replace: `app/page.tsx`

- [ ] **Step 1: Replace page.tsx with clean server component**

```tsx
// app/page.tsx — SERVER COMPONENT (no 'use client')
// Assembles sections in order from siteConfig.layout.sectionOrder.
// Crawlers (GPTBot, ClaudeBot, PerplexityBot) read plain HTML.
import { siteConfig } from '@/site.config'
import { Suspense } from 'react'
import HeroSection       from '@/components/HeroSection'
import MarqueeBar        from '@/components/MarqueeBar'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesGrid      from '@/components/FeaturesGrid'
import PricingSection    from '@/components/PricingSection'
import FAQSection        from '@/components/FAQSection'
import FinalCTA          from '@/components/FinalCTA'

const SECTION_MAP: Record<string, React.ReactNode> = {
  hero:        <HeroSection />,
  marquee:     <MarqueeBar />,
  howItWorks:  <HowItWorksSection />,
  features:    <Suspense fallback={<div className="h-96" />}><FeaturesGrid /></Suspense>,
  pricing:     <PricingSection />,
  faq:         <FAQSection />,
  finalCta:    <FinalCTA />,
}

export default function HomePage() {
  const { sectionOrder, hideSections } = siteConfig.layout
  const visible = sectionOrder.filter(id => !hideSections.includes(id))

  return (
    <div className="flex flex-col">
      {visible.map(id => (
        <div key={id}>
          {SECTION_MAP[id] ?? null}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Run build to confirm everything compiles**

```bash
npm run build 2>&1 | tail -20
```
Expected: `✓ Compiled successfully` with no TypeScript errors. Fix any import errors before proceeding.

- [ ] **Step 3: Verify H1 is server-rendered**

```bash
curl -s http://localhost:3000 2>/dev/null | grep -i "quiz night\|reinvented" | head -5
```
If server not running, start it first: `npm run dev &` (wait 5s), then run curl.  
Expected: raw HTML containing the H1 text.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx && git commit -m "feat: page.tsx clean server component — config-driven section order, island architecture"
```

---

## Task 14: Static Assets + `public/llms.txt`

**Files:**
- Create: `public/llms.txt`
- Create: `public/site-config.json`

- [ ] **Step 1: Create llms.txt**

```bash
cat > /Users/sivaprakasam/projects/agents/kwizzo/public/llms.txt << 'EOF'
# Kwizzo

Kwizzo is a free AI-powered family quiz game at https://kwizzo.app

It generates unique quiz questions on any topic instantly using AI, supports family multiplayer with age-adaptive difficulty, and requires no account to start playing.

Base URL: https://kwizzo.app
Key features: AI-generated questions, family multiplayer, live leaderboard, 100+ categories, age-adaptive difficulty, no account required
Free tier: 5 rounds per session, 10 categories, solo and group modes
Pro tier: unlimited rounds, all 100+ categories, custom quiz creation, no ads — £3.99/month
Target audience: Families, parents, children, quiz enthusiasts
EOF
```

- [ ] **Step 2: Create empty site-config.json for admin panel**

```bash
echo '{}' > /Users/sivaprakasam/projects/agents/kwizzo/public/site-config.json
```

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt public/site-config.json
git commit -m "feat: add /llms.txt for LLM crawlability + empty site-config.json for admin panel"
```

---

## Task 15: `qa/smoke.spec.ts` — 10-Check Global Spec

**Files:**
- Replace: `qa/smoke.spec.ts`

- [ ] **Step 1: Replace smoke spec**

```typescript
// qa/smoke.spec.ts — 10-check global smoke test
// Identical across kwizzo / tutiq / quizbites — only env vars differ.
import { test, expect } from '@playwright/test'

const BASE   = process.env.BASE_URL    ?? 'http://localhost:3000'
const ROUTES = (process.env.SMOKE_ROUTES ?? '/,/play,/about').split(',')

// 1. All nav routes return 200
for (const route of ROUTES) {
  test(`route ${route} returns 200`, async ({ request }) => {
    const res = await request.get(`${BASE}${route}`)
    expect(res.status()).toBe(200)
  })
}

// 2. H1 present in server-rendered HTML (no JS executed)
test('H1 present in raw server-rendered HTML', async ({ request }) => {
  const res  = await request.get(BASE)
  const html = await res.text()
  expect(html).toMatch(/<h1[^>]*>/i)
  // H1 must contain visible text (not just a tag)
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  expect(match?.[1]?.replace(/<[^>]+>/g, '').trim().length).toBeGreaterThan(3)
})

// 3. Primary CTA visible + has href
test('primary CTA is visible with correct href', async ({ page }) => {
  await page.goto(BASE)
  const cta = page.locator('#hero-play-btn a, #hero-play-btn button').first()
  await expect(cta).toBeVisible({ timeout: 10_000 })
  const href = await cta.getAttribute('href')
  expect(href).toMatch(/\/play/)
})

// 4. No horizontal overflow at 375px
test('no horizontal overflow on mobile (375px)', async ({ browser }) => {
  const ctx  = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  expect(overflow).toBe(false)
  await ctx.close()
})

// 5. No unexpected JS console errors
test('no JS console errors on homepage', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      // Ignore known noise
      if (!text.includes('adsbygoogle') && !text.includes('31.97.56.148')) {
        errors.push(text)
      }
    }
  })
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  expect(errors).toHaveLength(0)
})

// 6. FAQPage schema present in JSON-LD
test('FAQPage JSON-LD schema is present', async ({ page }) => {
  await page.goto(BASE)
  const schemas = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    return scripts.map(s => { try { return JSON.parse(s.textContent ?? '') } catch { return null } })
  })
  const flat = schemas.flat().filter(Boolean)
  const hasFaq = flat.some((s: Record<string, unknown>) =>
    s?.['@type'] === 'FAQPage' || (Array.isArray(s) && s.some((x: Record<string, unknown>) => x?.['@type'] === 'FAQPage'))
  )
  expect(hasFaq).toBe(true)
})

// 7. /robots.txt allows GPTBot
test('/robots.txt allows GPTBot', async ({ request }) => {
  const res  = await request.get(`${BASE}/robots.txt`)
  expect(res.status()).toBe(200)
  const text = await res.text()
  expect(text).toContain('GPTBot')
  expect(text).not.toMatch(/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//m)
})

// 8. /llms.txt returns 200
test('/llms.txt is accessible', async ({ request }) => {
  const res = await request.get(`${BASE}/llms.txt`)
  expect(res.status()).toBe(200)
  const text = await res.text()
  expect(text.length).toBeGreaterThan(50)
})

// 9. POST /api/quiz returns 200 within 10s
test('POST /api/quiz returns 200', async ({ request }) => {
  const res = await request.post(`${BASE}/api/quiz`, {
    data:    { subject: 'general', difficulty: 'easy', playerCount: 1, ageGroups: ['adults'] },
    timeout: 10_000,
  })
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body.length).toBeGreaterThan(10)
})

// 10. AdBanner not visible on first paint (scroll-gated)
test('AdBanner not visible on first paint', async ({ page }) => {
  await page.goto(BASE)
  // Give JS time to hydrate
  await page.waitForTimeout(1500)
  const adVisible = await page.evaluate(() => {
    const ins = document.querySelector('.adsbygoogle')
    if (!ins) return false
    const rect = ins.getBoundingClientRect()
    return rect.height > 10 && rect.top < window.innerHeight
  })
  expect(adVisible).toBe(false)
})
```

- [ ] **Step 2: Run the spec against local dev to check it's syntactically valid**

```bash
cd /Users/sivaprakasam/projects/agents/kwizzo && npm run dev &
sleep 8
BASE_URL=http://localhost:3000 npx playwright test --reporter=line 2>&1 | tail -20
kill %1 2>/dev/null
```
Expected: tests run (some may fail until all components done — that's OK). No syntax errors.

- [ ] **Step 3: Commit**

```bash
git add qa/smoke.spec.ts && git commit -m "feat: 10-check global Playwright smoke spec"
```

---

## Task 16: `.github/workflows/smoke.yml` — GH Actions CI

**Files:**
- Create: `.github/workflows/smoke.yml`

- [ ] **Step 1: Create the directory and workflow**

```bash
mkdir -p /Users/sivaprakasam/projects/agents/kwizzo/.github/workflows
```

```yaml
# .github/workflows/smoke.yml
# Runs Playwright 10-check smoke tests after every push to main.
# Requires: VERCEL_TOKEN and VERCEL_PROJECT_ID as repository secrets.
name: Smoke Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  smoke:
    name: Playwright Smoke
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Wait for Vercel deployment
        id: vercel-url
        run: |
          # Use VERCEL_URL if available (set by Vercel integration), else use production URL
          URL="${VERCEL_URL:-https://kwizzo.app}"
          echo "url=$URL" >> $GITHUB_OUTPUT
          # Wait up to 60s for the deployment to be live
          for i in $(seq 1 12); do
            if curl -sf "$URL" > /dev/null; then
              echo "Site is up: $URL"
              break
            fi
            echo "Waiting... ($i/12)"
            sleep 5
          done
        env:
          VERCEL_URL: ${{ vars.VERCEL_URL }}

      - name: Run smoke tests
        run: npx playwright test --reporter=github
        env:
          BASE_URL:      ${{ steps.vercel-url.outputs.url }}
          SMOKE_ROUTES:  '/,/play,/about'

      - name: Notify on failure
        if: failure()
        run: |
          curl -s -X POST "$TELEGRAM_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"🚨 kwizzo smoke tests FAILED on ${{ github.sha }} — check ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\"}" || true
        env:
          TELEGRAM_WEBHOOK: ${{ secrets.TELEGRAM_WEBHOOK_URL }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/smoke.yml && git commit -m "feat: GH Actions smoke.yml — Playwright CI post-deploy, Telegram alert on failure"
```

---

## Task 17: `app/admin/appearance/page.tsx` — Phase 1 Config Editor

**Files:**
- Create: `app/admin/appearance/page.tsx`
- Create: `app/api/admin/config/route.ts`

- [ ] **Step 1: Create API route**

```typescript
// app/api/admin/config/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync } from 'fs'
import path from 'path'

function isAuthorised(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  const auth = req.headers.get('x-admin-secret') ?? req.nextUrl.searchParams.get('secret')
  return auth === secret
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    const body = await req.json()
    // Only allow known top-level keys to prevent injection
    const allowed = ['heroBadge', 'headline', 'subheadline', 'freeTier', 'finalCta', 'layout', 'seo', 'chatbot']
    const sanitised: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) sanitised[key] = body[key]
    }
    const filePath = path.join(process.cwd(), 'public', 'site-config.json')
    writeFileSync(filePath, JSON.stringify(sanitised, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  try {
    const filePath = path.join(process.cwd(), 'public', 'site-config.json')
    const { readFileSync } = await import('fs')
    const content = readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch {
    return NextResponse.json({})
  }
}
```

- [ ] **Step 2: Create admin page**

```tsx
'use client'
// app/admin/appearance/page.tsx — Phase 1 config editor
// Access via /admin/appearance?secret=<ADMIN_SECRET>
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AppearancePage() {
  const params  = useSearchParams()
  const secret  = params.get('secret') ?? ''
  const [config, setConfig]   = useState<Record<string, unknown>>({})
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')

  useEffect(() => {
    fetch(`/api/admin/config?secret=${secret}`)
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setMsg('Failed to load config'))
  }, [secret])

  async function save() {
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify(config),
    })
    setSaving(false)
    setMsg(res.ok ? '✓ Saved — reload site to see changes' : '✗ Save failed')
  }

  const field = (key: string, label: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/50 uppercase tracking-wider">{label}</label>
      <input
        className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
        value={typeof config[key] === 'string' ? (config[key] as string) : JSON.stringify(config[key] ?? '')}
        onChange={e => {
          try { setConfig(c => ({ ...c, [key]: JSON.parse(e.target.value) })) }
          catch { setConfig(c => ({ ...c, [key]: e.target.value })) }
        }}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07060f] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black mb-2">Appearance</h1>
        <p className="text-white/40 text-sm mb-8">Changes write to <code className="text-violet-400">public/site-config.json</code> — no redeploy needed.</p>

        <div className="flex flex-col gap-4 mb-8">
          {field('heroBadge',   'Hero Badge Text')}
          {field('subheadline', 'Subheadline')}
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Layout</h2>
          {field('layout', 'Layout (JSON — heroVariant, sectionOrder, hideSections)')}
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Final CTA</h2>
          {field('finalCta', 'Final CTA (JSON)')}
        </div>

        {msg && <p className={`text-sm mb-4 ${msg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-bold text-sm disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: TypeScript check + build**

```bash
npx tsc --noEmit 2>&1 | head -20 && npm run build 2>&1 | tail -10
```
Expected: clean compile.

- [ ] **Step 4: Commit**

```bash
git add app/admin/appearance/page.tsx app/api/admin/config/route.ts
git commit -m "feat: /admin/appearance Phase 1 config editor + POST /api/admin/config"
```

---

## Task 18: Final Build Verification + Push

- [ ] **Step 1: Full build**

```bash
cd /Users/sivaprakasam/projects/agents/kwizzo && npm run build 2>&1
```
Expected: `✓ Compiled successfully`. Fix any errors before pushing.

- [ ] **Step 2: Verify H1 crawlability**

```bash
npm run dev & sleep 8 && curl -s http://localhost:3000 | grep -o '<h1[^>]*>.*</h1>' | head -3
kill %1 2>/dev/null
```
Expected: raw H1 tag with "Quiz night" in the output.

- [ ] **Step 3: Run Playwright smoke**

```bash
npm run dev & sleep 8
BASE_URL=http://localhost:3000 npx playwright test --reporter=line 2>&1 | tail -20
kill %1 2>/dev/null
```
Expected: 10+ tests pass. (Test 9 — `/api/quiz` — may fail locally without env vars; that's acceptable.)

- [ ] **Step 4: Push to main**

```bash
git push origin main
```
Expected: GH Actions smoke workflow triggers automatically.

---

## Spec Coverage Self-Review

| Spec requirement | Task |
|-----------------|------|
| Island architecture — page.tsx server component | Task 13 |
| Framer Motion stagger + spring physics | Tasks 6, 7, 8, 11 |
| `lib/motion.ts` global constants | Task 1 |
| `site.config.ts` extended schema | Task 2 |
| `SchemaOrg` server component — config-driven JSON-LD | Task 4 |
| MarqueeBar CSS-only | Task 5 |
| HeroSection + HeroClient + HeroDemo | Task 6 |
| HowItWorksSection | Task 7 |
| FeaturesGrid bento layout | Task 8 |
| PricingSection transparent comparison | Task 9 |
| FAQSection Radix accordion | Task 10 |
| FinalCTA with cta-pulse | Task 11 |
| ProWall rebuilt with recap | Task 12 |
| CSS animations (badge-glow, marquee, cta-pulse) | Task 3 |
| `/llms.txt` + `site-config.json` | Task 14 |
| 10-check Playwright smoke spec | Task 15 |
| GH Actions CI workflow | Task 16 |
| Admin panel Phase 1 | Task 17 |
| `prefers-reduced-motion` respected | Tasks 1, 6, 7, 8, 11, 12 |
| Free tier pills above fold | Tasks 2, 6 |
| `heroVariant` switches layout without JSX edits | Tasks 2, 6 |
| `hideSections` hides sections without JSX edits | Tasks 2, 13 |
