'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Crown, CheckCircle2, Zap, Users } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { isAiTool } from '@/vertical.config'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import GuidedTour, { type TourStep } from '@/components/GuidedTour'

const KWIZZO_TOUR: TourStep[] = [
  { target: '#hero-play-btn', title: 'Play a quiz free', icon: '⚡', body: 'Pick any topic — AI generates fresh questions instantly. No account needed.', placement: 'bottom' },
  { target: '#how-it-works', title: 'How it works', icon: '🎯', body: 'Pick topic → add names → AI quizzes everyone at their level.', placement: 'top' },
  { target: '#why-pro', title: 'Go unlimited with Pro', icon: '👑', body: 'Remove limits and unlock every category for the whole family.', placement: 'top' },
]

const PRO_KEY = 'kwizzo-pro'

const PRO_FEATURES = [
  'Unlimited quiz categories',
  'Custom quiz creation',
  'Family leaderboard',
  'No ads — ever',
  'Priority AI responses',
  'Export results & scorecards',
]

const FREE_FEATURES = [
  '3 free rounds per session',
  '10 standard categories',
  'Solo & group modes',
  'Basic leaderboard',
]

/* Animated game preview — simulates a quiz round */
const PREVIEW_QUESTIONS = [
  { q: 'Which planet has the most moons?', opts: ['Saturn', 'Jupiter', 'Neptune', 'Mars'], correct: 0 },
  { q: 'Who painted the Mona Lisa?', opts: ['Van Gogh', 'Picasso', 'da Vinci', 'Monet'], correct: 2 },
  { q: 'What is 7 × 8?', opts: ['54', '56', '63', '48'], correct: 1 },
]

const PREVIEW_PLAYERS = [
  { name: 'Dad', score: 320, emoji: '🧑' },
  { name: 'Maya', score: 280, emoji: '👧' },
  { name: 'Tom',  score: 160, emoji: '👦' },
]

function GamePreview() {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [scores, setScores] = useState(PREVIEW_PLAYERS.map(p => p.score))
  const [phase, setPhase] = useState<'question' | 'answer'>('question')

  useEffect(() => {
    if (phase === 'question') {
      const t = setTimeout(() => {
        setSelected(PREVIEW_QUESTIONS[qIdx].correct)
        setPhase('answer')
      }, 2200)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setScores(s => s.map((v, i) => v + (i === 0 ? 40 : i === 1 ? 25 : 10)))
        const next = (qIdx + 1) % PREVIEW_QUESTIONS.length
        setQIdx(next)
        setSelected(null)
        setPhase('question')
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [phase, qIdx])

  const q = PREVIEW_QUESTIONS[qIdx]

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0b1a] overflow-hidden shadow-2xl"
      style={{ boxShadow: '0 0 60px rgba(139,92,246,0.18)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/60">Live Game</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Quiz</span>
        </div>
      </div>

      {/* Scores */}
      <div className="flex gap-3 px-4 py-3 border-b border-white/[0.06]">
        {PREVIEW_PLAYERS.map((p, i) => (
          <div key={p.name} className="flex-1 text-center">
            <div className="text-base">{p.emoji}</div>
            <div className="text-[11px] text-white/60">{p.name}</div>
            <div className={`text-sm font-black tabular-nums ${i === 0 ? 'text-yellow-400' : 'text-white/70'}`}>
              {scores[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="px-4 pt-4 pb-2">
        <div className="text-[10px] uppercase tracking-widest text-violet-400 font-bold mb-2">Q{qIdx + 1} of 10</div>
        <p className="text-white text-sm font-semibold leading-snug mb-3">{q.q}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.opts.map((opt, i) => (
            <button
              key={opt}
              className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-300 ${
                selected === null
                  ? 'border-white/10 bg-white/[0.04] text-white/70'
                  : i === q.correct
                    ? 'border-green-500/60 bg-green-500/15 text-green-300 font-bold'
                    : selected === i
                      ? 'border-red-500/40 bg-red-500/10 text-red-400'
                      : 'border-white/[0.05] bg-white/[0.02] text-white/30'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-center">
        <p className="text-[10px] text-white/30">Age-perfect questions for every player</p>
      </div>
    </div>
  )
}

/* Handwriting-style animated step guide */
function HowItWorks() {
  const steps = [
    { icon: '🎯', label: 'Pick a topic' },
    { icon: '👥', label: 'Add player names' },
    { icon: '🤖', label: 'AI quizzes everyone' },
    { icon: '🏆', label: 'Crown the champion' },
  ]
  const [visible, setVisible] = useState<number[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        steps.forEach((_, i) => {
          setTimeout(() => setVisible(v => [...v, i]), i * 350)
        })
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} id="how-it-works" className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 transition-all duration-500 ${visible.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm font-bold text-white/80" style={{ fontFamily: '"Caveat", "Segoe Print", cursive' }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className={`text-violet-400/60 mx-1 text-lg transition-all duration-500 delay-150 ${visible.includes(i) ? 'opacity-100' : 'opacity-0'}`}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const subjects  = isAiTool(config) ? config.subjects : []
  const [isPro, setIsPro]         = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [lbVisible, setLbVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === '1') {
      localStorage.setItem(PRO_KEY, '1')
      window.history.replaceState({}, '', window.location.pathname)
    }
    setIsPro(localStorage.getItem(PRO_KEY) === '1')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLbVisible(true), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleUpgrade = useCallback(async () => {
    setUpgrading(true)
    try {
      const res  = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Could not start checkout. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }, [])

  return (
    <div className="overflow-hidden">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.18) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '-60px',
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,70,239,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '-60px',
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── PRO BANNER ── */}
      {isPro && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-400/20 border-b border-yellow-500/30 py-2 px-4 text-center text-sm font-bold text-yellow-300">
          <Crown size={14} className="inline mr-1" /> You&apos;re on Kwizzo PRO — enjoy unlimited everything!
        </div>
      )}

      {/* ══════════════════════════════════════════
          HERO — two column, compact
      ══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 pt-10 pb-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — copy + CTAs */}
          <div>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badge} text-xs font-bold mb-5 border border-violet-500/30 uppercase tracking-widest`}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Free · No sign-up needed
            </div>

            {/* Headline — compact, mixed case */}
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
              <span className="text-white">The AI quiz game</span>
              <br />
              <span className={theme.gradientText} style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.5))' }}>
                your whole family
              </span>
              <br />
              <span className="text-white">will love</span>
            </h1>

            {/* Sub */}
            <p className="text-white/55 text-base mb-6 leading-relaxed max-w-md">
              AI generates age-perfect questions for every player — kids get easy, adults get hard.{' '}
              <strong className="text-white/80">No account. Starts in 30 seconds.</strong>
            </p>

            {/* Handwriting guide */}
            <div className="mb-6 py-3 px-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.06]">
              <HowItWorks />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5" id="hero-play-btn">
              <Link href="/play?mode=solo">
                <ShimmerButton background="rgba(124, 58, 237, 1)" shimmerColor="#e9d5ff" className="px-7 py-3.5 text-base font-semibold">
                  ⚡ Play free now →
                </ShimmerButton>
              </Link>
              <Link href="/play?mode=group" className={btn.secondary + ' text-sm px-7 py-3.5 font-bold'}>
                <Users size={15} /> Family mode
              </Link>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2">
              {['✓ No account', '✓ Any device', '✓ Fresh AI questions', '✓ All ages'].map(f => (
                <span key={f} className="text-xs text-violet-300/70 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — live game preview */}
          <div className="lg:pl-4">
            <GamePreview />
            <p className="text-center text-white/25 text-xs mt-3">
              Live preview — this is what a real game looks like
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TOPIC GRID (compact)
      ══════════════════════════════════════════ */}
      {subjects.length > 0 && (
        <section id="subjects" className="py-10 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-white">Pick your topic</h2>
              <p className="text-white/40 text-xs mt-0.5">Fresh AI questions every game</p>
            </div>
            <div className={`inline-flex items-center gap-1 text-xs font-bold ${theme.textAccent}`}>
              <Zap size={12} /> {subjects.length} topics
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {subjects.map(subject => (
              <Link
                key={subject.id}
                href={`/play?mode=solo&subject=${subject.id}`}
                className={`group ${theme.card} ${theme.cardHover} p-3 flex flex-col gap-1.5 text-center items-center rounded-xl transition-all border border-white/[0.08] hover:border-violet-500/40 hover:scale-105`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{subject.icon}</span>
                <span className="font-semibold text-white text-[11px] leading-tight">{subject.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          WHY PRO + PRICING — combined, compact
      ══════════════════════════════════════════ */}
      <section id="why-pro" className="py-10 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-1">Free vs Pro</h2>
          <p className="text-white/40 text-sm">Upgrade the whole family for less than a coffee</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* FREE */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-4">
            <div>
              <div className="text-white/50 text-xs font-black uppercase tracking-widest mb-1">Free</div>
              <div className="text-3xl font-black text-white">$0</div>
              <div className="text-white/30 text-xs mt-0.5">Forever free · no card needed</div>
            </div>
            <ul className="space-y-2.5 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                  <CheckCircle2 size={15} className="text-white/30 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/play?mode=solo" className={btn.secondary + ' justify-center font-bold text-sm'}>
              Play free now
            </Link>
          </div>

          {/* PRO */}
          <div className="rounded-2xl border-2 border-violet-500/60 bg-gradient-to-b from-violet-900/30 to-purple-900/15 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 50px rgba(139,92,246,0.12), 0 0 30px rgba(139,92,246,0.12)' }} />
            <div className="absolute top-4 right-4">
              <span className="text-[11px] font-black text-yellow-300 bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✨ Popular
              </span>
            </div>
            <div className="relative">
              <div className={`text-xs font-black uppercase tracking-widest mb-1 ${theme.textAccent}`}>Pro Family</div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black text-white">$5</span>
                <span className="text-white/40 text-sm mb-1">/month</span>
              </div>
              <div className="text-white/30 text-xs">Cancel anytime · no hidden fees</div>
            </div>
            <ul className="space-y-2.5 flex-1 relative">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                  <CheckCircle2 size={15} className="text-violet-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="relative flex items-center justify-center gap-2 py-3 rounded-xl font-black text-yellow-300 bg-yellow-500/15 border border-yellow-500/30">
                <Crown size={16} /> You&apos;re PRO!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className={`relative ${btn.primary} justify-center font-black text-base py-3.5 w-full disabled:opacity-70`}
                style={{ boxShadow: '0 0 25px rgba(139,92,246,0.35)' }}
              >
                {upgrading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </span>
                ) : (
                  <><Crown size={15} /> Upgrade to Pro — $5/mo</>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-5 flex items-center justify-center gap-2">
          <span>🔒 Secure via Stripe</span><span>·</span><span>Cancel anytime</span>
        </p>
      </section>

      {/* ══════════════════════════════════════════
          CTA FOOTER — tight
      ══════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 glass border-t border-white/[0.05]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-2">Ready? Game starts in 30 seconds.</h2>
          <p className="text-white/40 mb-6 text-sm">No account needed. Works on any device.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/play?mode=solo"
              className={btn.primary + ' text-base px-8 py-3.5 font-black'}
              style={{ boxShadow: '0 0 25px rgba(139,92,246,0.35)' }}>
              ⚡ Play Solo
            </Link>
            <Link href="/play?mode=group" className={btn.secondary + ' text-base px-8 py-3.5 font-black'}>
              👨‍👩‍👧‍👦 Family Mode
            </Link>
          </div>
          {!isPro && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="mt-4 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors disabled:opacity-50 font-bold"
            >
              {upgrading ? 'Redirecting...' : '✨ Upgrade to Pro — $5/mo →'}
            </button>
          )}
        </div>
      </section>

      <GuidedTour steps={KWIZZO_TOUR} storageKey="kwizzo_tour_v2" accentColor="#7c3aed" />
    </div>
  )
}
