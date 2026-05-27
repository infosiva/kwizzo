'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Gamepad2, Zap } from 'lucide-react'
import { useMagicAuth } from '@/lib/shared/useMagicAuth'
import MagicAuthModal from '@/lib/shared/MagicAuthModal'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout, onSuccess } = useMagicAuth()

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(8,7,18,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(139,92,246,0.18)',
        }}
      >
        {/* Top neon accent line */}
        <div
          style={{
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #7c3aed 25%, #d946ef 50%, #7c3aed 75%, transparent 100%)',
            animation: 'shimmer 3s linear infinite',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-xl font-black text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #d946ef 100%)' }}
            >
              <Gamepad2 size={16} strokeWidth={2.5} />
            </span>
            <span className="font-black text-lg tracking-tight text-white" style={{ fontFamily: 'var(--font-display, system-ui)' }}>
              Kwi<span style={{ color: '#a855f7' }}>zzo</span>
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
                className="px-3 py-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/[0.06] transition-all duration-150 text-sm font-medium"
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
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-300 border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 transition-all"
                >
                  Dashboard
                </Link>
                <span className="text-xs text-white/40">{user.username || user.email?.split('@')[0]}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs text-white/35 border border-white/10 hover:text-white hover:border-white/25 transition-all"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 rounded-lg text-sm text-white/60 border border-white/10 hover:border-violet-500/40 hover:text-white transition-all font-medium"
              >
                Sign in
              </button>
            )}
            <Link
              href="/play?mode=solo"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all duration-150 hover:scale-105 active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #d946ef 100%)',
                boxShadow: '0 0 20px rgba(139,92,246,0.35)',
              }}
            >
              <Zap size={14} strokeWidth={3} />
              Play Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/[0.06] px-4 py-4 flex flex-col gap-3">
            {[
              { label: 'Topics',   href: '/#how-it-works' },
              { label: 'Features', href: '/#features' },
              { label: 'Pricing',  href: '/#pricing' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/65 hover:text-white py-1 font-medium transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <span className="text-center text-white/40 text-xs pt-1">
                  Signed in as {user.email}
                </span>
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="text-center py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAuthOpen(true); setOpen(false) }}
                className="text-center py-2.5 rounded-xl border border-violet-500/30 text-violet-300 text-sm font-semibold bg-violet-500/10"
              >
                Sign in free
              </button>
            )}

            <Link
              href="/play?mode=solo"
              className="text-center py-3.5 rounded-xl font-black text-white text-base active:scale-[0.97] transition-transform"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #d946ef)' }}
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
        accentColor="#7c3aed"
      />
    </>
  )
}
