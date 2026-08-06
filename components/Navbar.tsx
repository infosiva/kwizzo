'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { useMagicAuth } from '@/lib/shared/useMagicAuth'
import MagicAuthModal from '@/lib/shared/MagicAuthModal'
import KwizzoMark from './KwizzoMark'

const ACCENT = '#3b82f6'
const ACCENT_LIGHT = '#60a5fa'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout, onSuccess } = useMagicAuth()

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(16,16,38,0.80)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${ACCENT} 30%, #60a5fa 60%, ${ACCENT} 80%, transparent)` }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <KwizzoMark size={32} />
            <span className="font-black text-lg tracking-tight" style={{ color: '#f1f5f9' }}>
              Kwi<span style={{ color: ACCENT_LIGHT }}>zzo</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            {[
              { label: 'Topics',   href: '/#how-it-works' },
              { label: 'Features', href: '/#features' },
              { label: 'Pricing',  href: '/#pricing' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{ color: '#cbd5e1' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#cbd5e1'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ color: '#fff', border: `1px solid rgba(59,130,246,0.4)`, background: 'rgba(59,130,246,0.18)' }}
                >
                  Dashboard
                </Link>
                <span className="text-xs" style={{ color: '#94a3b8' }}>{user.username || user.email?.split('@')[0]}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)' }}
              >
                Sign in
              </button>
            )}
            <Link
              href="/play?mode=solo"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all duration-150 active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, #60a5fa)`,
                boxShadow: `0 4px 14px rgba(59,130,246,0.35)`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px rgba(59,130,246,0.45)` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px rgba(59,130,246,0.35)` }}
            >
              <Zap size={14} strokeWidth={3} />
              Play Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#e2e8f0' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden px-4 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(16,16,38,0.98)' }}>
            {[
              { label: 'Topics',   href: '/#how-it-works' },
              { label: 'Features', href: '/#features' },
              { label: 'Pricing',  href: '/#pricing' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 font-medium transition-colors"
                style={{ color: '#cbd5e1' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <span className="text-center text-xs pt-1" style={{ color: '#94a3b8' }}>
                  Signed in as {user.email}
                </span>
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="text-center py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAuthOpen(true); setOpen(false) }}
                className="text-center py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: `1px solid rgba(59,130,246,0.4)`, color: '#fff', background: 'rgba(59,130,246,0.20)' }}
              >
                Sign in free
              </button>
            )}

            <Link
              href="/play?mode=solo"
              className="text-center py-3.5 rounded-xl font-black text-white text-base active:scale-[0.97] transition-transform"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #60a5fa)` }}
              onClick={() => setOpen(false)}
            >
              🎮 Play Free Now
            </Link>
          </div>
        )}
      </nav>

      <MagicAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={u => { onSuccess(u); setAuthOpen(false) }}
        site="kwizzo"
        accentColor={ACCENT}
      />
    </>
  )
}
