'use client'
// components/ProWall.tsx — shown when free tier limit hit
// Shows what user accomplished first, then upgrade prompt. Never a cold wall.
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
        variants={vars as Parameters<typeof motion.div>[0]['variants']}
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
        <div
          className="rounded-2xl p-5 border"
          style={{ borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.08)' }}
        >
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
            {...BUTTON_PRESS}
            transition={SPRING_CINEMATIC}
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
            {...BUTTON_PRESS}
            transition={SPRING_CINEMATIC}
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
