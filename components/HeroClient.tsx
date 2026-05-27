'use client'
// components/HeroClient.tsx — arcade-personality hero copy + topic chips
import { motion } from 'framer-motion'
import { STAGGER_CONTAINER, FADE_UP, SPRING_CINEMATIC, BUTTON_PRESS, useMotionVariants } from '@/lib/motion'
import { siteConfig } from '@/site.config'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { theme, btn } from '@/lib/theme'
import Link from 'next/link'
import { Users, Gamepad2 } from 'lucide-react'

// Topic chips to display above CTA — game-picker feel
const TOPIC_CHIPS = [
  { label: 'Sports', emoji: '⚽' },
  { label: 'History', emoji: '🏛️' },
  { label: 'Movies', emoji: '🎬' },
  { label: 'Science', emoji: '🔬' },
  { label: 'Music', emoji: '🎵' },
  { label: 'Animals', emoji: '🦁' },
  { label: 'Geography', emoji: '🌍' },
  { label: 'Food', emoji: '🍕' },
]

export default function HeroClient() {
  const variants  = useMotionVariants(STAGGER_CONTAINER(0.06))
  const childVars = useMotionVariants(FADE_UP)

  return (
    <motion.div
      variants={variants as Parameters<typeof motion.div>[0]['variants']}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Live badge */}
      <motion.div variants={childVars as Parameters<typeof motion.div>[0]['variants']}>
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest badge-glow"
          style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.35)',
            color: '#c4b5fd',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <Gamepad2 size={11} />
          {siteConfig.heroBadge}
        </span>
      </motion.div>

      {/* Headline — chunky arcade typography */}
      <motion.h1
        variants={childVars as Parameters<typeof motion.h1>[0]['variants']}
        className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight"
        style={{ fontFamily: 'var(--font-display, system-ui)' }}
      >
        {siteConfig.headline.map((line, i) => (
          <span key={i} className="block">
            {i === 1
              ? (
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 40%, #f0abfc 100%)',
                    filter: 'drop-shadow(0 0 32px rgba(167,139,250,0.5))',
                  }}
                >
                  {line}
                </span>
              )
              : <span className="text-white">{line}</span>
            }
          </span>
        ))}
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={childVars as Parameters<typeof motion.p>[0]['variants']}
        className="text-white/55 text-base sm:text-lg leading-relaxed max-w-md"
      >
        {siteConfig.subheadline}
      </motion.p>

      {/* Topic chips — scrollable on mobile */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
        aria-label="Available quiz topics"
      >
        {TOPIC_CHIPS.map(chip => (
          <Link
            key={chip.label}
            href={`/play?mode=solo&topic=${chip.label.toLowerCase()}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/70 border border-white/[0.10] bg-white/[0.04] hover:bg-violet-500/20 hover:border-violet-500/40 hover:text-white transition-all duration-150 select-none"
          >
            <span>{chip.emoji}</span>
            {chip.label}
          </Link>
        ))}
        <Link
          href="/play?mode=solo"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-violet-300 border border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/20 transition-all duration-150"
        >
          + more
        </Link>
      </motion.div>

      {/* Free tier pills */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
      >
        {siteConfig.freeTier.pills.map(pill => (
          <span
            key={pill}
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#c4b5fd',
            }}
          >
            {pill}
          </span>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-col sm:flex-row gap-3"
        id="hero-play-btn"
      >
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.ctaPrimary.href}>
            <ShimmerButton
              background="rgba(124, 58, 237, 1)"
              shimmerColor="#e9d5ff"
              className="px-8 py-4 text-base font-black min-h-[56px]"
              style={{ boxShadow: '0 0 28px rgba(139,92,246,0.45)' }}
            >
              {siteConfig.ctaPrimary.text}
            </ShimmerButton>
          </Link>
        </motion.div>
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link
            href={siteConfig.ctaSecondary.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white/80 border border-white/15 bg-white/[0.05] hover:bg-white/[0.09] hover:border-violet-500/35 transition-all duration-150 min-h-[56px] text-base"
          >
            <Users size={16} /> {siteConfig.ctaSecondary.text}
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
