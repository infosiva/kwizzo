# DESIGN — Kwizzo
Source of truth: `agents/design-system` (MASTER.md). This file is the project pointer.

- Accent: `#e8404f` on bg `#101026` (dark, coral)
- Layout/palette/bg animation/GA4/flags: overridable by the hub via Edge Config `theme_kwizzo` (loaded by `lib/theme-loader.ts`, applied in `app/layout.tsx`); hub values win over the defaults here.
- Background: `components/AnimatedBg.tsx` (hub `layout.bgAnimation`, reduced-motion safe, default `none` = unchanged look).
- Logo: `components/Logo.tsx`; favicon is a static icon (no `app/icon.tsx`).

## AI platform (ai-core) status
Not on ai-core yet (honest gap): quiz generation and chat use the local free chain (`lib/ai.ts`). No document upload/RAG/memory in scope; exempt until such a feature exists.
