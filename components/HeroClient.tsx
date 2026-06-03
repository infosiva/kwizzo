'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { STAGGER_CONTAINER, FADE_UP, SPRING_CINEMATIC, BUTTON_PRESS, useMotionVariants } from '@/lib/motion'
import { siteConfig } from '@/site.config'
import type { ContentOverrides } from '@/lib/content'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { btn } from '@/lib/theme'
import Link from 'next/link'
import { Users, Gamepad2, Trophy, Zap } from 'lucide-react'

const TOPIC_CHIPS = [
  { label: 'Sports', emoji: '⚽' },
  { label: 'History', emoji: '🏛️' },
  { label: 'Movies', emoji: '🎬' },
  { label: 'Science', emoji: '🔬' },
  { label: 'Music', emoji: '🎵' },
  { label: 'Geography', emoji: '🌍' },
  { label: 'Food', emoji: '🍕' },
  { label: 'Animals', emoji: '🦁' },
]

// Live battle counter — animates number up on mount
function BattleCounter() {
  const [count] = useState(1247)
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold text-purple-300/60 uppercase tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {count.toLocaleString()} battles live right now
    </div>
  )
}

export default function HeroClient({ overrides = {} }: { overrides?: ContentOverrides }) {
  const variants  = useMotionVariants(STAGGER_CONTAINER(0.06))
  const childVars = useMotionVariants(FADE_UP)

  return (
    <motion.div
      variants={variants as Parameters<typeof motion.div>[0]['variants']}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Badge — Digitwist-inspired neon pill */}
      <motion.div variants={childVars as Parameters<typeof motion.div>[0]['variants']}>
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.30)',
            color: '#c4b5fd',
            boxShadow: '0 0 16px rgba(139,92,246,0.15)',
          }}
        >
          <Gamepad2 size={11} className="text-violet-400" />
          {siteConfig.heroBadge}
        </span>
      </motion.div>

      {/* Live counter */}
      <motion.div variants={childVars as Parameters<typeof motion.div>[0]['variants']}>
        <BattleCounter />
      </motion.div>

      {/* Headline — arcade, compact */}
      <motion.h1
        variants={childVars as Parameters<typeof motion.h1>[0]['variants']}
        className="font-black leading-[0.95] tracking-tight"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
      >
        {(overrides.headline
          ? [overrides.headline]
          : siteConfig.headline
        ).map((line, i) => (
          <span key={i} className="block">
            {i === 1 ? (
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 50%, #f0abfc 100%)',
                  filter: 'drop-shadow(0 0 40px rgba(167,139,250,0.55))',
                }}
              >
                {line}
              </span>
            ) : (
              <span className="text-white">{line}</span>
            )}
          </span>
        ))}
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={childVars as Parameters<typeof motion.p>[0]['variants']}
        className="text-white/50 text-base sm:text-lg leading-relaxed max-w-md"
      >
        {overrides.subheadline ?? siteConfig.subheadline}
      </motion.p>

      {/* Topic chips — quick-pick game launcher */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
        aria-label="Quiz topics"
      >
        {TOPIC_CHIPS.map(chip => (
          <Link
            key={chip.label}
            href={`/play?mode=solo&topic=${chip.label.toLowerCase()}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/65 border border-white/[0.09] bg-white/[0.03] hover:bg-violet-500/18 hover:border-violet-500/35 hover:text-white transition-all duration-150 active:scale-[0.97]"
          >
            <span>{chip.emoji}</span>
            {chip.label}
          </Link>
        ))}
        <Link
          href="/play?mode=solo"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-violet-300 border border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/20 transition-all duration-150 active:scale-[0.97]"
        >
          + more
        </Link>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
      >
        {[
          { icon: <Zap size={10} className="text-yellow-400" />, label: 'AI-generated' },
          { icon: <Trophy size={10} className="text-amber-400" />, label: 'Leaderboards' },
          { icon: <Users size={10} className="text-violet-400" />, label: 'Multiplayer' },
          { icon: null, label: 'Free to play' },
        ].map(({ icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.10)',
              border: '1px solid rgba(139,92,246,0.22)',
              color: '#c4b5fd',
            }}
          >
            {icon}
            {label}
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
              background="rgba(109, 40, 217, 1)"
              shimmerColor="#e9d5ff"
              className="px-8 py-4 text-base font-black min-h-[56px]"
              style={{ boxShadow: '0 0 32px rgba(139,92,246,0.5)' }}
            >
              {overrides.cta ?? siteConfig.ctaPrimary.text}
            </ShimmerButton>
          </Link>
        </motion.div>
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link
            href={siteConfig.ctaSecondary.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white/75 border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-violet-500/30 transition-all duration-150 min-h-[56px] text-base active:scale-[0.97]"
          >
            <Users size={16} /> {siteConfig.ctaSecondary.text}
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
