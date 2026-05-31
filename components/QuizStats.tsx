'use client'
// components/QuizStats.tsx — localStorage stats strip
// 3 shimmer-card pills: quizzes created / questions generated / shares sent
// Magic UI shimmer card style, purple/violet accent

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, HelpCircle, Share2 } from 'lucide-react'

interface StatPill {
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
}

function ShimmerCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl flex-1 min-w-0"
      style={{
        background: 'rgba(139,92,246,0.07)',
        border: '1px solid rgba(139,92,246,0.2)',
      }}
    >
      {/* Shimmer sweep overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(167,139,250,0.08) 50%, transparent 60%)',
          animation: 'shimmer-sweep 3s ease-in-out infinite',
          backgroundSize: '200% 100%',
        }}
      />
      <div className="relative z-10 px-4 py-3 flex flex-col items-center gap-1 text-center">
        {children}
      </div>
    </motion.div>
  )
}

function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (value === 0) return
    let start = 0
    const step = Math.ceil(value / 20)
    const timer = setInterval(() => {
      start = Math.min(start + step, value)
      setDisplay(start)
      if (start >= value) clearInterval(timer)
    }, 40)
    return () => clearInterval(timer)
  }, [value])

  return <span>{display.toLocaleString()}</span>
}

export default function QuizStats() {
  const [stats, setStats] = useState({ quizzes: 0, questions: 0, shares: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const quizzes   = parseInt(localStorage.getItem('kwizzo_quizzes')   ?? '0', 10)
      const questions = parseInt(localStorage.getItem('kwizzo_questions') ?? '0', 10)
      const shares    = parseInt(localStorage.getItem('kwizzo_shares')    ?? '0', 10)
      setStats({ quizzes, questions, shares })
    } catch {
      // localStorage unavailable — show zeros
    }
  }, [])

  if (!mounted) return null

  const pills: StatPill[] = [
    { icon: <Zap size={14} className="text-violet-400" />,   label: 'Quizzes created',    value: stats.quizzes,   suffix: '' },
    { icon: <HelpCircle size={14} className="text-purple-400" />, label: 'Questions generated', value: stats.questions, suffix: '' },
    { icon: <Share2 size={14} className="text-fuchsia-400" />, label: 'Shares sent',        value: stats.shares,    suffix: '' },
  ]

  // Only render if user has any activity
  const hasActivity = stats.quizzes > 0 || stats.questions > 0 || stats.shares > 0
  if (!hasActivity) return null

  return (
    <>
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 sm:px-6 py-6 max-w-6xl mx-auto"
        aria-label="Your quiz activity"
      >
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 text-center">
          Your activity
        </p>
        <div className="flex gap-3">
          {pills.map((pill, i) => (
            <ShimmerCard key={pill.label} delay={i * 0.08}>
              <div className="flex items-center gap-1.5 mb-0.5">
                {pill.icon}
                <span
                  className="text-xl font-black tabular-nums"
                  style={{ color: '#c4b5fd' }}
                >
                  <AnimatedCount value={pill.value} />
                </span>
              </div>
              <p className="text-[11px] text-white/40 leading-tight">{pill.label}</p>
            </ShimmerCard>
          ))}
        </div>
      </motion.section>
    </>
  )
}
