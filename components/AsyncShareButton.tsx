'use client'
// components/AsyncShareButton.tsx — copies quiz URL to clipboard with 2s toast
// Prominent "Share quiz link" button for async distribution

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Check } from 'lucide-react'

interface AsyncShareButtonProps {
  quizId?: string
  className?: string
}

export default function AsyncShareButton({ quizId, className = '' }: AsyncShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (copied) return

    const base = typeof window !== 'undefined' ? window.location.origin : 'https://kwizzo.app'
    const url = quizId ? `${base}/quiz/${quizId}` : base

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = url
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Track share event in localStorage stats
    try {
      const prev = parseInt(localStorage.getItem('kwizzo_shares') ?? '0', 10)
      localStorage.setItem('kwizzo_shares', String(prev + 1))
    } catch {
      // localStorage unavailable — non-fatal
    }
  }, [copied, quizId])

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-150 select-none ${className}`}
      style={{
        background: copied
          ? 'rgba(34,197,94,0.2)'
          : 'rgba(139,92,246,0.85)',
        border: copied
          ? '1px solid rgba(34,197,94,0.5)'
          : '1px solid rgba(139,92,246,0.5)',
        color: copied ? '#86efac' : '#ffffff',
        boxShadow: copied
          ? '0 0 20px rgba(34,197,94,0.2)'
          : '0 0 24px rgba(139,92,246,0.35)',
      }}
      aria-label={copied ? 'Link copied!' : 'Copy quiz link'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Check size={15} strokeWidth={2.5} />
            Link copied!
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Link2 size={15} strokeWidth={2} />
            🔗 Share quiz link
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
