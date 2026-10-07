'use client'
import Link from 'next/link'
import type { ContentOverrides } from '@/lib/content'
import { MagneticButton } from "@infosiva/shared-ui/modern";

const ACCENT = '#e8404f'
const ACCENT_LIGHT = '#ff7a85'

export default function HeroClient({ overrides = {} }: { overrides?: ContentOverrides }) {
  return (
    <div className="flex flex-col gap-3 hero-left">
      {/* Badge */}
      <div style={{ animationDelay: '0ms' }} className="hero-entry hidden sm:block">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(232,64,79,0.12)',
            border: '1px solid rgba(232,64,79,0.40)',
            color: '#ffb3ba',
          }}
        >
          ⚡ 30-SECOND SETUP · NO ACCOUNT NEEDED
        </span>
      </div>

      {/* Headline */}
      <div style={{ animationDelay: '60ms' }} className="hero-entry">
        <h1
          className="font-black leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#f1f5f9' }}
        >
          <span className="block">Build a quiz in 30 seconds.</span>
          <span className="block kw-grad-text">
            See where your audience got lost.
          </span>
        </h1>
      </div>

      {/* Subtext */}
      <div style={{ animationDelay: '120ms' }} className="hero-entry hidden sm:block">
        <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: '#a8b3c7' }}>
          AI generates questions from any topic — share async or live, get per-question drop-off insights.
        </p>
      </div>

      {/* Topic input */}
      <div style={{ animationDelay: '180ms' }} className="hero-entry">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Any topic: History, Science..."
            className="w-full rounded-xl pl-4 pr-14 min-h-[48px] text-base sm:text-sm font-medium outline-none transition-all duration-150"
            style={{
              background: '#181c3a',
              border: '1.5px solid #2b2f55',
              color: '#f1f5f9',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(232,64,79,0.6)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,64,79,0.15)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#2b2f55'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(232,64,79,0.22)', color: '#dbeafe' }}
          >
            ⚡ AI
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ animationDelay: '240ms' }} className="hero-entry flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link href="/play?mode=solo" className="flex sm:inline-flex">
          <MagneticButton
            tabIndex={-1}
            className="inline-flex items-center justify-center gap-2 px-8 min-h-[48px] w-full sm:w-auto rounded-xl font-black text-base text-white kw-press"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #ff7a85)`,
              boxShadow: `0 4px 20px rgba(232,64,79,0.35)`,
            }}
          >
            Play Free Tonight →
          </MagneticButton>
        </Link>
        <Link
          href="/play?mode=group"
          className="inline-flex items-center justify-center gap-2 px-6 min-h-[44px] rounded-xl font-bold text-sm kw-press"
          style={{
            background: '#181c3a',
            border: '1.5px solid #2b2f55',
            color: '#cbd5e1',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,64,79,0.4)'; (e.currentTarget as HTMLElement).style.color = ACCENT }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2b2f55'; (e.currentTarget as HTMLElement).style.color = '#cbd5e1' }}
        >
          👨‍👩‍👧 Family Mode
        </Link>
      </div>

      {/* Live mini-info */}
      <div style={{ animationDelay: '300ms' }} className="hero-entry hidden sm:flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs" style={{ color: '#a8b3c7' }}>Free to play · no account needed</span>
        <span style={{ color: '#cbd5e1' }}>·</span>
        <span className="text-xs" style={{ color: '#a8b3c7' }}>🎮 Solo or multiplayer</span>
      </div>
    </div>
  )
}
