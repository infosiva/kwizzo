'use client'
import Link from 'next/link'
import { siteConfig } from '@/site.config'
import type { ContentOverrides } from '@/lib/content'

// Feature pill — no fake stats
function FeaturePill() {
  return (
    <span className="text-white/40 text-xs">
      Free to play · no account needed
    </span>
  )
}

export default function HeroClient({ overrides = {} }: { overrides?: ContentOverrides }) {
  return (
    <div className="flex flex-col gap-5 hero-left">
      {/* Badge */}
      <div style={{ animationDelay: '0ms' }} className="hero-entry">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{
            background: 'rgba(234,179,8,0.10)',
            border: '1px solid rgba(234,179,8,0.30)',
            color: '#fde047',
            boxShadow: '0 0 16px rgba(234,179,8,0.12)',
          }}
        >
          <span>⚡</span>
          30-SECOND SETUP · NO ACCOUNT NEEDED
        </span>
      </div>

      {/* Headline */}
      <div style={{ animationDelay: '60ms' }} className="hero-entry">
        <h1
          className="font-black leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
        >
          <span className="block text-white">Build a quiz in 30 seconds.</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #eab308 0%, #a78bfa 60%, #8b5cf6 100%)',
              filter: 'drop-shadow(0 0 32px rgba(234,179,8,0.35))',
            }}
          >
            See where your audience got lost.
          </span>
        </h1>
      </div>

      {/* Subtext */}
      <div style={{ animationDelay: '120ms' }} className="hero-entry">
        <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-md">
          AI generates questions from any topic — share async or live, get per-question drop-off insights.
        </p>
      </div>

      {/* Topic input */}
      <div style={{ animationDelay: '180ms' }} className="hero-entry">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Enter any topic — History, Science, React hooks..."
            className="w-full rounded-xl px-4 py-3.5 text-sm font-medium text-white/80 outline-none transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(234,179,8,0.22)',
              caretColor: '#eab308',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(234,179,8,0.55)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234,179,8,0.10)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(234,179,8,0.22)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(234,179,8,0.15)', color: '#fde047' }}
          >
            ⚡ AI
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ animationDelay: '240ms' }} className="hero-entry flex flex-col sm:flex-row gap-3">
        <Link
          href="/play?mode=solo"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base active:scale-[0.97] transition-transform duration-100"
          style={{
            background: '#eab308',
            color: '#0d0d1a',
            boxShadow: '0 0 32px rgba(234,179,8,0.45), 0 4px 16px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#facc15'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#eab308'
          }}
        >
          Play Free Tonight →
        </Link>
        <Link
          href="/play?mode=group"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm active:scale-[0.97] transition-transform duration-100"
          style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.30)',
            color: '#c4b5fd',
          }}
        >
          👨‍👩‍👧 Family Mode
        </Link>
      </div>

      {/* Live mini-stats */}
      <div style={{ animationDelay: '300ms' }} className="hero-entry flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <FeaturePill />
        <span className="text-white/20">·</span>
        <span className="text-white/40 text-xs">🎮 Solo or multiplayer</span>
      </div>
    </div>
  )
}
