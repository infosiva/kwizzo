'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import config from '@/vertical.config'
import { btn, theme } from '@/lib/theme'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className={`${theme.gradientText} font-extrabold tracking-tight`}>
            {config.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/search"    className="hover:text-white transition-colors">Find a {config.providerLabel}</Link>
          <Link href="/providers" className="hover:text-white transition-colors">For {config.providerPlural}</Link>
          <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"    className={btn.ghost}>Log in</Link>
          <Link href="/chat"     className={btn.primary}>Get matched</Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/search"       className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>Find a {config.providerLabel}</Link>
          <Link href="/providers"    className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>For {config.providerPlural}</Link>
          <Link href="/how-it-works" className="text-white/70 hover:text-white" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/chat"         className={btn.primary}                    onClick={() => setOpen(false)}>Get matched free</Link>
        </div>
      )}
    </nav>
  )
}
