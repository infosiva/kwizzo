'use client'
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, BUTTON_PRESS, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'
import Link from 'next/link'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

const ACCENT = '#f59e0b'

export default function FinalCTA() {
  const vars = useMotionVariants(FADE_UP)

  return (
    <section
      className="py-10 px-4 sm:px-6"
      style={{ borderTop: '1px solid #f1f5f9' }}
    >
      <motion.div
        variants={vars as Parameters<typeof motion.div>[0]['variants']}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
      >
        <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: '#0f172a' }}>
          {siteConfig.finalCta.headline}
        </h2>
        <p className="text-base" style={{ color: '#64748b' }}>{siteConfig.finalCta.subtext}</p>

        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link href={siteConfig.finalCta.ctaHref}>
            <ShimmerButton
              background={ACCENT}
              shimmerColor="#fef3c7"
              className="cta-pulse px-10 py-4 text-base font-bold min-h-[56px]"
            >
              {siteConfig.finalCta.ctaText}
            </ShimmerButton>
          </Link>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {siteConfig.freeTier.pills.map(pill => (
            <span
              key={pill}
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: 'rgba(245, 158, 11,0.08)',
                border: '1px solid rgba(245, 158, 11,0.2)',
                color: '#b45309',
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
