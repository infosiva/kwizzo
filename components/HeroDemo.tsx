'use client'
// components/HeroDemo.tsx — light theme live product simulation
// Cycles through 3 real quiz questions: reveal answer bars, tick score up, advance, loop.

import { useEffect, useState } from 'react'

const ACCENT = '#3b82f6'

type Answer = { letter: string; text: string; pct: number; isCorrect: boolean }
type Question = { topic: string; prompt: string; points: number; answers: Answer[] }

const QUESTIONS: Question[] = [
  {
    topic: 'SCIENCE',
    prompt: 'What is the chemical symbol for water?',
    points: 100,
    answers: [
      { letter: 'A', text: 'H₂O', pct: 67, isCorrect: true },
      { letter: 'B', text: 'HO₂', pct: 12, isCorrect: false },
      { letter: 'C', text: 'H₂', pct: 8, isCorrect: false },
      { letter: 'D', text: 'OH', pct: 13, isCorrect: false },
    ],
  },
  {
    topic: 'GEOGRAPHY',
    prompt: 'Which country has the most natural lakes?',
    points: 150,
    answers: [
      { letter: 'A', text: 'Russia', pct: 18, isCorrect: false },
      { letter: 'B', text: 'USA', pct: 9, isCorrect: false },
      { letter: 'C', text: 'Canada', pct: 61, isCorrect: true },
      { letter: 'D', text: 'Brazil', pct: 12, isCorrect: false },
    ],
  },
  {
    topic: 'HISTORY',
    prompt: 'In which year did the Berlin Wall fall?',
    points: 200,
    answers: [
      { letter: 'A', text: '1987', pct: 14, isCorrect: false },
      { letter: 'B', text: '1989', pct: 58, isCorrect: true },
      { letter: 'C', text: '1991', pct: 20, isCorrect: false },
      { letter: 'D', text: '1993', pct: 8, isCorrect: false },
    ],
  },
]

const AVATARS = ['🎮', '🧑', '👧', '👦', '🐱']
const REVEAL_MS = 1600   // bars shown before correct-answer callout
const HOLD_MS = 1100     // callout + score-tick hold before advancing

export default function HeroDemo() {
  const [qIndex, setQIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)

  const question = QUESTIONS[qIndex]

  // Reveal → award points → hold → advance to next question (loops forever)
  useEffect(() => {
    setRevealed(false)
    const revealTimer = setTimeout(() => setRevealed(true), REVEAL_MS)
    const advanceTimer = setTimeout(() => {
      setScore(s => s + question.points)
      setQIndex(i => (i + 1) % QUESTIONS.length)
    }, REVEAL_MS + HOLD_MS)
    return () => { clearTimeout(revealTimer); clearTimeout(advanceTimer) }
  }, [qIndex, question.points])

  // Animate score count-up toward target
  useEffect(() => {
    if (displayScore === score) return
    const step = Math.max(1, Math.ceil((score - displayScore) / 10))
    const t = setTimeout(() => setDisplayScore(d => Math.min(d + step, score)), 30)
    return () => clearTimeout(t)
  }, [score, displayScore])

  return (
    <div
      className="rounded-2xl overflow-hidden select-none relative"
      style={{
        background: '#fff',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #f1f5f9', background: '#eff6ff' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold" style={{ color: '#64748b' }}>LIVE QUIZ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            key={question.topic}
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full hero-demo-fade"
            style={{ background: '#dbeafe', border: '1px solid rgba(59,130,246,0.3)', color: '#1e40af' }}
          >
            ⚡ {question.topic}
          </span>
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569' }}
          >
            ROUND {qIndex + 1}/3
          </span>
        </div>
      </div>

      {/* Question — key forces remount so text fades between questions */}
      <div key={qIndex} className="px-5 pt-5 pb-2 hero-demo-fade">
        <p className="text-sm font-bold leading-snug mb-1" style={{ color: '#0f172a' }}>
          {question.prompt}
        </p>
      </div>

      {/* Vote bars */}
      <div key={`bars-${qIndex}`} className="px-5 pb-4 flex flex-col gap-2.5">
        {question.answers.map((ans, i) => (
          <div key={ans.letter} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                  style={{
                    background: revealed && ans.isCorrect ? 'rgba(16,185,129,0.12)' : '#f8fafc',
                    color: revealed && ans.isCorrect ? '#059669' : '#94a3b8',
                    border: revealed && ans.isCorrect ? '1px solid rgba(16,185,129,0.25)' : '1px solid #e2e8f0',
                  }}
                >
                  {ans.letter}
                </span>
                <span className="font-semibold" style={{ color: revealed && ans.isCorrect ? '#059669' : '#475569' }}>
                  {ans.text}
                </span>
              </div>
              <span className="font-black tabular-nums" style={{ color: revealed && ans.isCorrect ? ACCENT : '#94a3b8' }}>
                {revealed ? `${ans.pct}%` : ''}
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '7px', background: '#f1f5f9' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: revealed ? `${ans.pct}%` : '0%',
                  transition: `width 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.08}s`,
                  background: ans.isCorrect ? `linear-gradient(90deg, #10b981, ${ACCENT})` : '#e2e8f0',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9' }} />

      {/* Live score + players */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>
            <span className="font-black tabular-nums" style={{ color: '#0f172a' }}>{displayScore}</span>
            {' '}pts · <span className="font-bold" style={{ color: ACCENT }}>{qIndex + 1} of 3 answered</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {AVATARS.map((av, i) => (
            <span key={i} className="text-base leading-none" style={{ marginLeft: i > 0 ? '-4px' : 0 }}>{av}</span>
          ))}
          <span className="text-[10px] font-medium ml-2" style={{ color: '#94a3b8' }}>online now</span>
        </div>
      </div>

      {/* Correct answer callout — only shown once revealed */}
      <div
        className="mx-4 mb-4 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-opacity duration-300"
        style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)',
          opacity: revealed ? 1 : 0,
        }}
      >
        <span className="text-sm" style={{ color: '#059669' }}>✓</span>
        <span className="text-xs font-bold" style={{ color: '#059669' }}>
          Correct! {question.answers.find(a => a.isCorrect)?.text} — {question.answers.find(a => a.isCorrect)?.pct}% answered right
        </span>
        <span className="ml-auto text-xs font-black" style={{ color: ACCENT }}>+{question.points} pts</span>
      </div>

      <style>{`
        @keyframes heroDemoFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-demo-fade { animation: heroDemoFade 0.35s cubic-bezier(0.23,1,0.32,1); }
      `}</style>
    </div>
  )
}
