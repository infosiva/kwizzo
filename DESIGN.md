# DESIGN — Kwizzo
Source of truth: `agents/design-system` (MASTER.md). This file is the project pointer.

- Accent: `#e8404f` on bg `#101026` (dark, coral)
- Layout/palette/bg animation/GA4/flags: overridable by the hub via Edge Config `theme_kwizzo` (loaded by `lib/theme-loader.ts`, applied in `app/layout.tsx`); hub values win over the defaults here.
- Background: `components/AnimatedBg.tsx` (hub `layout.bgAnimation`, reduced-motion safe, default `none` = unchanged look).
- Logo: `components/Logo.tsx`; favicon is a static icon (no `app/icon.tsx`).

## AI platform (ai-core) status
Not on ai-core yet (honest gap): quiz generation and chat use the local free chain (`lib/ai.ts`). No document upload/RAG/memory in scope; exempt until such a feature exists.


## ANIMATED SCOPE (recorded 2026-10-09 sweep)
- What moves: CSS keyframes already shipped: badge-glow, barFill, bgGradientShift, blink, bounceIn, confettiSpin, cta-pulse, ds-float, ds-shift, fade-in-opacity, fadeSlideIn, fadeUp.
- Why: ambient background + entry/press feedback on the product's core action; no motion carries information alone.
- Trigger: page load (ambient/entry), user press/hover (feedback).
- Reduced-motion: `prefers-reduced-motion` handling present in the project's styles (verified by scan 2026-10-09).
- Still open: `/review-animations` run (needs a running app, one at a time).
