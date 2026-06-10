'use client'
import Link from 'next/link'
import type { ContentOverrides } from '@/lib/content'

const ACCENT = '#ec4899'

export default function HeroClient({ overrides = {} }: { overrides?: ContentOverrides }) {
  return (
    <div className="flex flex-col gap-5 hero-left">
      {/* Badge */}
      <div style={{ animationDelay: '0ms' }} className="hero-entry">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(236,72,153,0.08)',
            border: '1px solid rgba(236,72,153,0.25)',
            color: ACCENT,
          }}
        >
          ⚡ 30-SECOND SETUP · NO ACCOUNT NEEDED
        </span>
      </div>

      {/* Headline */}
      <div style={{ animationDelay: '60ms' }} className="hero-entry">
        <h1
          className="font-black leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#0f172a' }}
        >
          <span className="block">Build a quiz in 30 seconds.</span>
          <span
            className="block"
            style={{ color: ACCENT }}
          >
            See where your audience got lost.
          </span>
        </h1>
      </div>

      {/* Subtext */}
      <div style={{ animationDelay: '120ms' }} className="hero-entry">
        <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: '#64748b' }}>
          AI generates questions from any topic — share async or live, get per-question drop-off insights.
        </p>
      </div>

      {/* Topic input */}
      <div style={{ animationDelay: '180ms' }} className="hero-entry">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Enter any topic — History, Science, React hooks..."
            className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all duration-150"
            style={{
              background: '#fff',
              border: '1.5px solid #e2e8f0',
              color: '#0f172a',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(236,72,153,0.5)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.10)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(236,72,153,0.10)', color: ACCENT }}
          >
            ⚡ AI
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ animationDelay: '240ms' }} className="hero-entry flex flex-col sm:flex-row gap-3">
        <Link
          href="/play?mode=solo"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base text-white active:scale-[0.97] transition-transform duration-100"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, #f472b6)`,
            boxShadow: `0 4px 20px rgba(236,72,153,0.35)`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(236,72,153,0.45)` }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(236,72,153,0.35)` }}
        >
          Play Free Tonight →
        </Link>
        <Link
          href="/play?mode=group"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm active:scale-[0.97] transition-transform duration-100"
          style={{
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            color: '#475569',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.4)'; (e.currentTarget as HTMLElement).style.color = ACCENT }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.color = '#475569' }}
        >
          👨‍👩‍👧 Family Mode
        </Link>
      </div>

      {/* Live mini-info */}
      <div style={{ animationDelay: '300ms' }} className="hero-entry flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs" style={{ color: '#94a3b8' }}>Free to play · no account needed</span>
        <span style={{ color: '#cbd5e1' }}>·</span>
        <span className="text-xs" style={{ color: '#94a3b8' }}>🎮 Solo or multiplayer</span>
      </div>
    </div>
  )
}
