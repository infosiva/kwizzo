'use client'
// components/HeroDemo.tsx — arcade-style live quiz preview
// A/B/C/D lettered options, countdown timer bar, score pop, confetti burst
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Zap } from 'lucide-react'

interface DemoQuestion {
  q:       string
  opts:    string[]
  correct: number
}

// 20-question fallback pool — varied categories, never boring
const FALLBACK_POOL: DemoQuestion[] = [
  { q: 'Which planet has the most moons?',           opts: ['Saturn', 'Jupiter', 'Neptune', 'Mars'],           correct: 0 },
  { q: 'What year did the Berlin Wall fall?',        opts: ['1987', '1989', '1991', '1993'],                   correct: 1 },
  { q: 'Which element has the symbol Au?',           opts: ['Silver', 'Aluminium', 'Gold', 'Copper'],          correct: 2 },
  { q: 'How many bones in the adult human body?',   opts: ['196', '206', '216', '226'],                       correct: 1 },
  { q: 'Fastest land animal on Earth?',             opts: ['Lion', 'Cheetah', 'Greyhound', 'Pronghorn'],      correct: 1 },
  { q: 'Which country invented pizza?',             opts: ['Greece', 'France', 'Italy', 'Spain'],             correct: 2 },
  { q: 'What is the capital of Japan?',             opts: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],           correct: 2 },
  { q: 'Who painted the Mona Lisa?',                opts: ['Raphael', 'Michelangelo', 'Da Vinci', 'Botticelli'], correct: 2 },
  { q: 'Which sport uses a shuttlecock?',           opts: ['Tennis', 'Squash', 'Badminton', 'Pickleball'],    correct: 2 },
  { q: 'What is the square root of 144?',           opts: ['10', '11', '12', '13'],                          correct: 2 },
  { q: 'How many continents are there?',            opts: ['5', '6', '7', '8'],                              correct: 2 },
  { q: 'Which ocean is the largest?',               opts: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],        correct: 3 },
  { q: 'What gas do plants absorb from the air?',  opts: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'],  correct: 2 },
  { q: 'Which planet is closest to the Sun?',       opts: ['Venus', 'Earth', 'Mercury', 'Mars'],             correct: 2 },
  { q: 'What year did the first iPhone launch?',   opts: ['2005', '2006', '2007', '2008'],                   correct: 2 },
  { q: 'What is the chemical symbol for water?',   opts: ['WO', 'H2O', 'HO2', 'W2H'],                      correct: 1 },
  { q: 'How many sides does a hexagon have?',       opts: ['5', '6', '7', '8'],                              correct: 1 },
  { q: 'Which country has the most natural lakes?', opts: ['Russia', 'Canada', 'Brazil', 'USA'],             correct: 1 },
  { q: 'Which element has the symbol O?',           opts: ['Gold', 'Osmium', 'Oxygen', 'Oganesson'],         correct: 2 },
  { q: 'How many strings on a standard guitar?',   opts: ['4', '5', '6', '7'],                              correct: 2 },
]

const PLAYERS = [
  { name: 'Dad', emoji: '🧑', startScore: 420, color: '#fbbf24' },
  { name: 'Maya', emoji: '👧', startScore: 380, color: '#a78bfa' },
  { name: 'Tom', emoji: '👦', startScore: 210, color: '#34d399' },
]

// Answer choice colors — arcade-style A/B/C/D
const CHOICE_COLORS = [
  { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.45)', text: '#fca5a5', letter: 'A' },
  { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.45)', text: '#93c5fd', letter: 'B' },
  { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.45)', text: '#fde047', letter: 'C' },
  { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.45)', text: '#86efac', letter: 'D' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function Confetti({ active }: { active: boolean }) {
  const colours = ['#7c3aed', '#a855f7', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#f97316']
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            left:       `${5 + (i % 10) * 9}%`,
            top:        '35%',
            width:       i % 3 === 0 ? 8 : 5,
            height:      i % 3 === 0 ? 8 : 5,
            background: colours[i % colours.length],
          }}
          initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            y:       -(70 + Math.random() * 100),
            x:       (Math.random() - 0.5) * 100,
            opacity: 0,
            scale:   Math.random() * 0.8 + 0.3,
            rotate:  (Math.random() - 0.5) * 540,
          }}
          transition={{ duration: 0.9 + Math.random() * 0.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function useTypingEffect(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed(''); setDone(false)
    if (!text) return
    let i = 0
    const tick = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
        setTimeout(tick, speed + Math.random() * 16)
      } else {
        setDone(true)
      }
    }
    const t = setTimeout(tick, 80)
    return () => clearTimeout(t)
  }, [text, speed])

  return { displayed, done }
}

function parseAIQuestions(data: { questions?: Array<{ question: string; options: { A: string; B: string; C: string; D: string }; answer: string }> }): DemoQuestion[] {
  if (!Array.isArray(data?.questions)) return []
  return data.questions.slice(0, 8).map(q => {
    const opts = [q.options.A, q.options.B, q.options.C, q.options.D]
    const correct = ['A', 'B', 'C', 'D'].indexOf(q.answer)
    return { q: q.question, opts, correct: correct >= 0 ? correct : 0 }
  })
}

export default function HeroDemo() {
  const [questions, setQuestions] = useState<DemoQuestion[]>(() => shuffle(FALLBACK_POOL).slice(0, 8))
  const [qIdx, setQIdx]       = useState(0)
  const [selected, setSelected]  = useState<number | null>(null)
  const [scores, setScores]    = useState(PLAYERS.map(p => p.startScore))
  const [phase, setPhase]      = useState<'typing' | 'question' | 'answer'>('typing')
  const [confetti, setConfetti]  = useState(false)
  const [aiLoaded, setAiLoaded]  = useState(false)
  // Timer 0-100 during 'question' phase
  const [timerPct, setTimerPct]  = useState(100)
  const hasFetched = useRef(false)

  // Fetch real AI questions once
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const topics = ['general knowledge', 'science', 'history', 'sport', 'music', 'geography']
    const topic  = topics[Math.floor(Math.random() * topics.length)]
    fetch('/api/quiz/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ subject: topic, difficulty: 'mixed', playerCount: 1, ageGroups: ['adults'] }),
      signal:  AbortSignal.timeout(8000),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const parsed = data ? parseAIQuestions(data) : []
        if (parsed.length >= 4) { setQuestions(parsed); setAiLoaded(true) }
      })
      .catch(() => {/* fall back to static pool */})
  }, [])

  const q = questions[qIdx % questions.length]
  const { displayed, done } = useTypingEffect(q.q, 18)

  // Countdown timer during 'question' phase
  useEffect(() => {
    if (phase !== 'question') { setTimerPct(100); return }
    setTimerPct(100)
    const start = Date.now()
    const duration = 2000
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setTimerPct(pct)
      if (elapsed < duration) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  // Phase auto-advance
  useEffect(() => {
    if (phase === 'typing') {
      if (!done) return
      const t = setTimeout(() => setPhase('question'), 500)
      return () => clearTimeout(t)
    }
    if (phase === 'question') {
      const t = setTimeout(() => {
        setSelected(q.correct)
        setPhase('answer')
        setConfetti(true)
        setTimeout(() => setConfetti(false), 900)
      }, 2100)
      return () => clearTimeout(t)
    }
    if (phase === 'answer') {
      const t = setTimeout(() => {
        setScores(s => s.map((v, i) => v + (i === 0 ? 40 : i === 1 ? 25 : 10)))
        setQIdx(n => n + 1)
        setSelected(null)
        setPhase('typing')
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [phase, done, q.correct])

  const roundNum = (qIdx % questions.length) + 1

  return (
    <div
      className="rounded-2xl overflow-hidden relative select-none"
      style={{
        background: 'linear-gradient(145deg, #0f0c1f 0%, #130d26 100%)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 0 60px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.08)',
      }}
    >
      <Confetti active={confetti} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.12)', background: 'rgba(139,92,246,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/55">Live game</span>
        </div>
        <div className="flex items-center gap-2">
          {aiLoaded && (
            <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20">
              AI ✦ live
            </span>
          )}
          <span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/20 uppercase tracking-wider">
            Round {roundNum}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div
        className="flex gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {PLAYERS.map((p, i) => (
          <div key={p.name} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="text-lg">{p.emoji}</div>
            <div className="text-[10px] text-white/45 font-medium">{p.name}</div>
            <motion.div
              key={scores[i]}
              initial={{ scale: 1.3, color: '#a78bfa' }}
              animate={{ scale: 1, color: p.color }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className="text-sm font-black tabular-nums"
            >
              {scores[i]}
            </motion.div>
            {/* Mini rank indicator */}
            {i === 0 && <Trophy size={10} className="text-yellow-400" />}
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-white/[0.05]">
        <motion.div
          className="h-full"
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{
            background: timerPct > 50
              ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
              : timerPct > 25
                ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                : 'linear-gradient(90deg, #ef4444, #f97316)',
          }}
        />
      </div>

      {/* Question */}
      <div className="px-4 py-4 min-h-[160px]">
        <p className="text-white/85 text-sm font-bold mb-4 leading-snug min-h-[44px]">
          {displayed}
          {phase === 'typing' && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
          )}
        </p>

        <AnimatePresence mode="wait">
          {phase !== 'typing' && (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-2"
            >
              {q.opts.map((opt, i) => {
                const cc = CHOICE_COLORS[i]
                const isCorrect = selected !== null && i === q.correct
                const isWrong   = selected !== null && i !== q.correct

                return (
                  <motion.div
                    key={opt}
                    animate={
                      isCorrect
                        ? { scale: [1, 1.05, 1], transition: { duration: 0.35 } }
                        : {}
                    }
                    className="rounded-xl px-3 py-2.5 text-xs font-bold border flex items-center gap-2 transition-all duration-200"
                    style={{
                      background: isCorrect
                        ? 'rgba(34,197,94,0.2)'
                        : isWrong
                          ? 'rgba(255,255,255,0.02)'
                          : cc.bg,
                      borderColor: isCorrect
                        ? 'rgba(34,197,94,0.6)'
                        : isWrong
                          ? 'rgba(255,255,255,0.04)'
                          : cc.border,
                      color: isCorrect
                        ? '#86efac'
                        : isWrong
                          ? 'rgba(255,255,255,0.2)'
                          : cc.text,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{
                        background: isCorrect
                          ? 'rgba(34,197,94,0.3)'
                          : isWrong
                            ? 'rgba(255,255,255,0.04)'
                            : `${cc.border.replace('0.45', '0.3')}`,
                      }}
                    >
                      {cc.letter}
                    </span>
                    <span className="truncate">{opt}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="text-center text-white/20 text-[10px] py-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Zap size={8} className="inline mr-1" />
        {aiLoaded ? 'Real AI questions — every preview is unique' : 'Live preview — real game experience'}
      </div>
    </div>
  )
}
