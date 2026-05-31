'use client'
// components/QuizInsights.tsx — per-question drop-off insight panel
// Shown below quiz score. Shows which questions tripped people up.

import { motion } from 'framer-motion'

interface QuestionResult {
  question: string
  percentWrong: number
}

interface QuizInsightsProps {
  results?: QuestionResult[]
}

// Mock data shown when no real results yet (pre-seed for new quizzes)
const MOCK_RESULTS: QuestionResult[] = [
  { question: 'Which element has the symbol Au?', percentWrong: 67 },
  { question: 'What year did the Berlin Wall fall?', percentWrong: 44 },
  { question: 'Fastest land animal on Earth?', percentWrong: 23 },
]

function getBarColor(pct: number): string {
  if (pct >= 60) return '#ef4444' // red — most struggled
  if (pct >= 35) return '#f59e0b' // amber — some struggled
  return '#22c55e'                // green — mostly got it
}

function getLabel(pct: number): string {
  if (pct >= 60) return 'Hard one'
  if (pct >= 35) return 'Tricky'
  return 'Got it'
}

export default function QuizInsights({ results }: QuizInsightsProps) {
  const data = (results && results.length > 0) ? results : MOCK_RESULTS
  const isMock = !results || results.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="mt-6 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(139,92,246,0.06)',
        border: '1px solid rgba(139,92,246,0.18)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">👇</span>
          <span className="text-sm font-bold text-white/80">Where people struggled</span>
        </div>
        {isMock && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#c4b5fd',
            }}
          >
            Sample data
          </span>
        )}
      </div>

      {/* Per-question breakdown */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {data.map((item, i) => {
          const barColor = getBarColor(item.percentWrong)
          const label = getLabel(item.percentWrong)

          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-white/60 leading-snug flex-1 line-clamp-1">
                  <span className="text-white/35 mr-1.5 font-bold">Q{i + 1}</span>
                  {item.question}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[11px] font-black tabular-nums"
                    style={{ color: barColor }}
                  >
                    {item.percentWrong}% wrong
                  </span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: `${barColor}18`,
                      border: `1px solid ${barColor}35`,
                      color: barColor,
                    }}
                  >
                    {label}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentWrong}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                  style={{ background: barColor }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer nudge */}
      <div
        className="px-4 py-2.5 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="text-[11px] text-white/30">
          Insights update in real time as players submit answers
        </p>
      </div>
    </motion.div>
  )
}
