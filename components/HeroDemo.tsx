'use client'
// components/HeroDemo.tsx — client island: animated game preview
import { useState, useEffect } from 'react'

const PREVIEW_QUESTIONS = [
  { q: 'Which planet has the most moons?',        opts: ['Saturn ♄', 'Jupiter ♃', 'Neptune ♆', 'Mars ♂'],  correct: 0 },
  { q: 'What year did the Berlin Wall fall?',     opts: ['1987', '1989', '1991', '1993'],                   correct: 1 },
  { q: 'Which element has symbol Au?',            opts: ['Silver', 'Aluminium', 'Gold', 'Copper'],          correct: 2 },
  { q: 'How many bones in the adult human body?', opts: ['196', '206', '216', '226'],                       correct: 1 },
  { q: 'What is the fastest land animal?',        opts: ['Lion', 'Cheetah', 'Greyhound', 'Pronghorn'],      correct: 1 },
]
const PREVIEW_PLAYERS = [
  { name: 'Dad 🧑', score: 420, emoji: '🧑' },
  { name: 'Maya 👧', score: 380, emoji: '👧' },
  { name: 'Tom 👦',  score: 210, emoji: '👦' },
]

export default function HeroDemo() {
  const [qIdx,     setQIdx]     = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [scores,   setScores]   = useState(PREVIEW_PLAYERS.map(p => p.score))
  const [phase,    setPhase]    = useState<'question' | 'answer'>('question')

  useEffect(() => {
    if (phase === 'question') {
      const t = setTimeout(() => { setSelected(PREVIEW_QUESTIONS[qIdx].correct); setPhase('answer') }, 2200)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setScores(s => s.map((v, i) => v + (i === 0 ? 40 : i === 1 ? 25 : 10)))
        const next = (qIdx + 1) % PREVIEW_QUESTIONS.length
        setQIdx(next); setSelected(null); setPhase('question')
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [phase, qIdx])

  const q = PREVIEW_QUESTIONS[qIdx]

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0b1a] overflow-hidden shadow-2xl"
      style={{ boxShadow: '0 0 60px rgba(139,92,246,0.18)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/60">Live Game</span>
        </div>
        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Quiz</span>
      </div>

      <div className="flex gap-3 px-4 py-3 border-b border-white/[0.06]">
        {PREVIEW_PLAYERS.map((p, i) => (
          <div key={p.name} className="flex-1 text-center">
            <div className="text-base">{p.emoji}</div>
            <div className="text-[11px] text-white/60">{p.name}</div>
            <div className={`text-sm font-black tabular-nums ${i === 0 ? 'text-yellow-400' : 'text-white/70'}`}>{scores[i]}</div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4">
        <p className="text-white/80 text-sm font-semibold mb-3 leading-snug">{q.q}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.opts.map((opt, i) => (
            <div key={opt}
              className={`rounded-lg px-3 py-2 text-xs font-bold border transition-all duration-300 ${
                selected === null ? 'border-white/10 bg-white/[0.04] text-white/60' :
                i === q.correct  ? 'border-green-500/60 bg-green-500/15 text-green-300' :
                i === selected   ? 'border-red-500/40   bg-red-500/10   text-red-300'   :
                                   'border-white/5      bg-white/[0.02] text-white/30'
              }`}>
              {opt}
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-white/25 text-xs py-2 border-t border-white/[0.04]">
        Live preview — this is what a real game looks like
      </p>
    </div>
  )
}
