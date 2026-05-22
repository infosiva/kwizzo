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
      variants={variants as Parameters<typeof motion.div>[0]['variants']}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Badge */}
      <motion.div variants={childVars as Parameters<typeof motion.div>[0]['variants']}>
        <span className={`badge-glow inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.badge} text-xs font-bold uppercase tracking-widest`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {siteConfig.heroBadge}
        </span>
      </motion.div>

      {/* Headline — each line staggered */}
      <motion.h1
        variants={childVars as Parameters<typeof motion.h1>[0]['variants']}
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
      <motion.p
        variants={childVars as Parameters<typeof motion.p>[0]['variants']}
        className="text-white/55 text-base leading-relaxed max-w-md"
      >
        {siteConfig.subheadline}
      </motion.p>

      {/* Free tier pills */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap gap-2"
      >
        {siteConfig.freeTier.pills.map(pill => (
          <span key={pill} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${theme.badge}`}>{pill}</span>
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
