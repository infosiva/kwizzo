'use client'
// components/HeroDemo.tsx — live AI-powered game preview
// Fetches real questions from /api/quiz/generate on mount.
// Falls back to a large static pool if API is slow/unavailable.
// Features: typing effect, confetti burst on correct answer, live score animation.
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DemoQuestion {
  q:       string
  opts:    string[]
  correct: number
}

// 20-question fallback pool — varied categories, never boring
const FALLBACK_POOL: DemoQuestion[] = [
  { q: 'Which planet has the most moons?',           opts: ['Saturn ♄','Jupiter ♃','Neptune ♆','Mars ♂'],         correct: 0 },
  { q: 'What year did the Berlin Wall fall?',        opts: ['1987','1989','1991','1993'],                          correct: 1 },
  { q: 'Which element has the symbol Au?',           opts: ['Silver','Aluminium','Gold','Copper'],                 correct: 2 },
  { q: 'How many bones in the adult human body?',   opts: ['196','206','216','226'],                              correct: 1 },
  { q: 'Fastest land animal on Earth?',             opts: ['Lion','Cheetah','Greyhound','Pronghorn'],             correct: 1 },
  { q: 'Which country invented pizza?',             opts: ['Greece','France','Italy','Spain'],                    correct: 2 },
  { q: 'How many strings on a standard guitar?',   opts: ['4','5','6','7'],                                     correct: 2 },
  { q: 'What is the capital of Japan?',             opts: ['Seoul','Beijing','Tokyo','Bangkok'],                  correct: 2 },
  { q: 'Which ocean is the largest?',               opts: ['Atlantic','Indian','Arctic','Pacific'],               correct: 3 },
  { q: 'Who painted the Mona Lisa?',                opts: ['Raphael','Michelangelo','Da Vinci','Botticelli'],     correct: 2 },
  { q: 'How many sides does a hexagon have?',       opts: ['5','6','7','8'],                                     correct: 1 },
  { q: 'What gas do plants absorb from the air?',  opts: ['Oxygen','Nitrogen','Carbon dioxide','Argon'],         correct: 2 },
  { q: 'Which sport uses a shuttlecock?',           opts: ['Tennis','Squash','Badminton','Pickleball'],           correct: 2 },
  { q: 'What is the square root of 144?',           opts: ['10','11','12','13'],                                  correct: 2 },
  { q: 'How many continents are there?',            opts: ['5','6','7','8'],                                     correct: 2 },
  { q: 'Which planet is closest to the Sun?',       opts: ['Venus','Earth','Mercury','Mars'],                    correct: 2 },
  { q: 'What language has the most native speakers?',opts: ['English','Spanish','Mandarin','Hindi'],             correct: 2 },
  { q: 'What is the chemical symbol for water?',   opts: ['WO','H2O','HO2','W2H'],                              correct: 1 },
  { q: 'Which country has the most natural lakes?', opts: ['Russia','Canada','Brazil','USA'],                    correct: 1 },
  { q: 'What year did the first iPhone launch?',   opts: ['2005','2006','2007','2008'],                          correct: 2 },
]

const PLAYERS = [
  { name: 'Dad 🧑', emoji: '🧑', startScore: 420 },
  { name: 'Maya 👧', emoji: '👧', startScore: 380 },
  { name: 'Tom 👦',  emoji: '👦', startScore: 210 },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Confetti particle burst — CSS only, no library needed
function Confetti({ active }: { active: boolean }) {
  const colours = ['#7c3aed','#a855f7','#22c55e','#f59e0b','#3b82f6','#ec4899']
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left:       `${10 + (i % 9) * 10}%`,
            top:        '40%',
            background: colours[i % colours.length],
          }}
          initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            y:       -(60 + Math.random() * 80),
            x:       (Math.random() - 0.5) * 80,
            opacity: 0,
            scale:   Math.random() * 0.8 + 0.4,
            rotate:  (Math.random() - 0.5) * 360,
          }}
          transition={{ duration: 0.8 + Math.random() * 0.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Typing effect hook — types text character by character
function useTypingEffect(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    setDisplayed(''); setDone(false)
    if (!text) return
    let i = 0
    const tick = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
        setTimeout(tick, speed + Math.random() * 18)
      } else {
        setDone(true)
      }
    }
    const t = setTimeout(tick, 120)
    return () => clearTimeout(t)
  }, [text, speed])

  return { displayed, done }
}

// Parse AI API response into DemoQuestion[]
function parseAIQuestions(data: { questions?: Array<{ question: string; options: { A:string;B:string;C:string;D:string }; answer: string }> }): DemoQuestion[] {
  if (!Array.isArray(data?.questions)) return []
  return data.questions.slice(0, 8).map(q => {
    const opts = [q.options.A, q.options.B, q.options.C, q.options.D]
    const correct = ['A','B','C','D'].indexOf(q.answer)
    return { q: q.question, opts, correct: correct >= 0 ? correct : 0 }
  })
}

export default function HeroDemo() {
  const [questions, setQuestions] = useState<DemoQuestion[]>(() => shuffle(FALLBACK_POOL).slice(0, 8))
  const [qIdx,      setQIdx]      = useState(0)
  const [selected,  setSelected]  = useState<number | null>(null)
  const [scores,    setScores]    = useState(PLAYERS.map(p => p.startScore))
  const [phase,     setPhase]     = useState<'typing' | 'question' | 'answer'>('typing')
  const [confetti,  setConfetti]  = useState(false)
  const [aiLoaded,  setAiLoaded]  = useState(false)
  const hasFetched = useRef(false)

  // Fetch real AI questions once on mount
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const topics = ['general knowledge','science','history','sport','music','geography']
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
        if (parsed.length >= 4) {
          setQuestions(parsed)
          setAiLoaded(true)
        }
      })
      .catch(() => {/* silently fall back to static pool */})
  }, [])

  const q = questions[qIdx % questions.length]
  const { displayed, done } = useTypingEffect(q.q, 20)

  // Auto-advance through phases
  useEffect(() => {
    if (phase === 'typing') {
      if (!done) return
      // After typing completes, wait 600ms then show answer
      const t = setTimeout(() => setPhase('question'), 600)
      return () => clearTimeout(t)
    }
    if (phase === 'question') {
      const t = setTimeout(() => {
        setSelected(q.correct)
        setPhase('answer')
        setConfetti(true)
        setTimeout(() => setConfetti(false), 900)
      }, 2000)
      return () => clearTimeout(t)
    }
    if (phase === 'answer') {
      const t = setTimeout(() => {
        setScores(s => s.map((v, i) => v + (i === 0 ? 40 : i === 1 ? 25 : 10)))
        setQIdx(n => n + 1)
        setSelected(null)
        setPhase('typing')
      }, 1600)
      return () => clearTimeout(t)
    }
  }, [phase, done, q.correct])

  return (
    <div
      className="rounded-2xl border border-white/10 bg-[#0d0b1a] overflow-hidden shadow-2xl relative"
      style={{ boxShadow: '0 0 60px rgba(139,92,246,0.18)' }}
    >
      <Confetti active={confetti} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/60">Live Game</span>
        </div>
        <div className="flex items-center gap-2">
          {aiLoaded && (
            <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">AI ✦ real questions</span>
          )}
          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Quiz</span>
        </div>
      </div>

      {/* Scores */}
      <div className="flex gap-3 px-4 py-3 border-b border-white/[0.06]">
        {PLAYERS.map((p, i) => (
          <div key={p.name} className="flex-1 text-center">
            <div className="text-base">{p.emoji}</div>
            <div className="text-[11px] text-white/60">{p.name}</div>
            <motion.div
              key={scores[i]}
              initial={{ scale: 1.2, color: '#a78bfa' }}
              animate={{ scale: 1,   color: i === 0 ? '#fbbf24' : 'rgba(255,255,255,0.7)' }}
              transition={{ duration: 0.3 }}
              className="text-sm font-black tabular-nums"
            >
              {scores[i]}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="px-4 py-4 min-h-[130px]">
        <p className="text-white/80 text-sm font-semibold mb-3 leading-snug min-h-[40px]">
          {displayed}
          {phase === 'typing' && <span className="animate-pulse text-violet-400">|</span>}
        </p>

        <AnimatePresence mode="wait">
          {phase !== 'typing' && (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              {q.opts.map((opt, i) => (
                <motion.div
                  key={opt}
                  animate={
                    selected !== null && i === q.correct
                      ? { scale: [1, 1.04, 1], transition: { duration: 0.3 } }
                      : {}
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-bold border transition-all duration-300 ${
                    selected === null
                      ? 'border-white/10 bg-white/[0.04] text-white/60'
                      : i === q.correct
                        ? 'border-green-500/60 bg-green-500/15 text-green-300'
                        : 'border-white/5 bg-white/[0.02] text-white/25'
                  }`}
                >
                  {opt}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-white/20 text-[10px] py-2 border-t border-white/[0.04]">
        {aiLoaded ? '✦ Real AI questions — every preview is unique' : 'Live preview — this is what a real game looks like'}
      </p>
    </div>
  )
}
