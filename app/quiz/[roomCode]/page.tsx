'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { ArrowRight, Trophy, RotateCcw, Home, CheckCircle, XCircle } from 'lucide-react'
import { theme, btn } from '@/lib/theme'
import { Suspense } from 'react'
import type { Question } from '@/app/api/quiz/generate/route'

type Member = { name: string; age: string }
type GameState = 'loading' | 'playing' | 'answered' | 'finished'
type PlayerScore = { name: string; age: string; score: number; answers: boolean[] }

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
type OptionKey = typeof OPTION_LABELS[number]

function QuizContent() {
  const params       = useParams()
  const searchParams = useSearchParams()
  const router       = useRouter()

  const roomCode = params.roomCode as string
  const subjectFromUrl = searchParams.get('subject') ?? ''

  const [gameState,    setGameState]    = useState<GameState>('loading')
  const [questions,    setQuestions]    = useState<Question[]>([])
  const [currentQ,     setCurrentQ]     = useState(0)
  const [selected,     setSelected]     = useState<OptionKey | null>(null)
  const [scores,       setScores]       = useState<PlayerScore[]>([])
  const [familyName,   setFamilyName]   = useState('Your Family')
  const [topic,        setTopic]        = useState(subjectFromUrl)
  const [loadError,    setLoadError]    = useState('')

  const loadQuestions = useCallback(async (members: Member[], topicId: string) => {
    setGameState('loading')
    setLoadError('')
    try {
      const res = await fetch('/api/quiz/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          topic:   topicId,
          members: members.map(m => ({ name: m.name, age: Number(m.age) })),
        }),
      })
      const data = await res.json()
      if (data?.questions?.length) {
        setQuestions(data.questions)
        setGameState('playing')
      } else {
        setLoadError('Could not load questions. Please try again.')
      }
    } catch {
      setLoadError('Network error. Please check your connection and try again.')
    }
  }, [])

  useEffect(() => {
    // Load room data from localStorage
    try {
      const roomData = localStorage.getItem(`kwizzo_room_${roomCode}`)
      if (roomData) {
        const data = JSON.parse(roomData)
        const members: Member[] = data.members ?? []
        const topicId: string   = data.subject ?? subjectFromUrl

        setFamilyName(data.familyName ?? 'Your Family')
        setTopic(topicId)
        setScores(members.map(m => ({ name: m.name, age: m.age, score: 0, answers: [] })))
        loadQuestions(members, topicId)
      } else {
        // Someone joined via code — no room data in their localStorage
        // Use fallback and try to load generic questions
        const family = localStorage.getItem('kwizzo_family')
        const members: Member[] = family ? (JSON.parse(family).members ?? []) : [{ name: 'Player', age: '18' }]
        const topicId = subjectFromUrl || 'general'

        setTopic(topicId)
        setScores(members.map(m => ({ name: m.name, age: m.age, score: 0, answers: [] })))
        loadQuestions(members, topicId)
      }
    } catch {
      // Pure fallback
      const members = [{ name: 'Player', age: '18' }]
      setTopic(subjectFromUrl || 'general')
      setScores(members.map(m => ({ name: m.name, age: m.age, score: 0, answers: [] })))
      loadQuestions(members, subjectFromUrl || 'general')
    }
  }, [roomCode, subjectFromUrl, loadQuestions])

  function handleAnswer(opt: OptionKey) {
    if (gameState !== 'playing') return
    setSelected(opt)
    setGameState('answered')

    const correct = opt === questions[currentQ].answer
    setScores(prev => prev.map(s => ({
      ...s,
      score:   s.score + (correct ? 1 : 0),
      answers: [...s.answers, correct],
    })))
  }

  function handleNext() {
    if (currentQ + 1 >= questions.length) {
      setGameState('finished')
    } else {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setGameState('playing')
    }
  }

  function handlePlayAgain() {
    setCurrentQ(0)
    setSelected(null)
    setScores(prev => prev.map(s => ({ ...s, score: 0, answers: [] })))
    setQuestions([])
    // Reload from localStorage
    try {
      const roomData = localStorage.getItem(`kwizzo_room_${roomCode}`)
      if (roomData) {
        const data = JSON.parse(roomData)
        loadQuestions(data.members ?? [], data.subject ?? topic)
      } else {
        loadQuestions([{ name: 'Player', age: '18' }], topic)
      }
    } catch {
      loadQuestions([{ name: 'Player', age: '18' }], topic)
    }
  }

  const q = questions[currentQ]
  const progress = questions.length > 0 ? ((currentQ + (gameState === 'answered' ? 1 : 0)) / questions.length) * 100 : 0
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)

  // ── Loading state ─────────────────────────────────────────
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-6 float">🤖</div>
        <h2 className="text-2xl font-bold text-white mb-3">KwizBot is generating questions…</h2>
        <p className="text-white/50 mb-8">Creating age-perfect questions for your family</p>
        {loadError ? (
          <div className="space-y-4">
            <p className="text-red-400 text-sm px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">{loadError}</p>
            <button onClick={() => router.push('/play')} className={btn.secondary}>
              Back to Game Hub
            </button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <div className={`w-2 h-2 rounded-full ${theme.solid} animate-bounce`} style={{ animationDelay: '0ms' }} />
            <div className={`w-2 h-2 rounded-full ${theme.solid} animate-bounce`} style={{ animationDelay: '150ms' }} />
            <div className={`w-2 h-2 rounded-full ${theme.solid} animate-bounce`} style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    )
  }

  // ── Finished — Leaderboard ────────────────────────────────
  if (gameState === 'finished') {
    const medals = ['🥇', '🥈', '🥉']
    return (
      <div className="min-h-screen px-4 py-12 max-w-xl mx-auto">
        <div className="text-center mb-10 fade-up">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-extrabold text-white mb-2">{familyName}</h1>
          <p className={`${theme.textAccent} font-semibold`}>Quiz Complete!</p>
        </div>

        <div className={`${theme.card} p-6 mb-6 fade-up`}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className={theme.textAccent} /> Final Leaderboard
          </h2>
          <div className="space-y-3">
            {sortedScores.map((s, i) => (
              <div
                key={s.name}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  i === 0 ? `bg-gradient-to-r ${theme.gradient} bg-opacity-20` : 'glass'
                }`}
              >
                <span className="text-2xl w-8 flex-shrink-0">{medals[i] ?? `${i + 1}`}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-white/40 text-xs">Age {s.age}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-extrabold ${i === 0 ? 'text-white' : theme.textAccent}`}>
                    {s.score}/{questions.length}
                  </div>
                  <div className="text-white/40 text-xs">
                    {Math.round((s.score / questions.length) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 fade-up">
          <button onClick={handlePlayAgain} className={btn.primary + ' flex-1 justify-center py-4'}>
            <RotateCcw size={18} /> Play Again
          </button>
          <button onClick={() => router.push('/play')} className={btn.secondary + ' flex-1 justify-center py-4'}>
            <Home size={18} /> New Game
          </button>
        </div>
      </div>
    )
  }

  if (!q) return null

  const options = Object.entries(q.options) as [OptionKey, string][]
  const isCorrect = selected === q.answer

  // ── Playing / Answered ────────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest`}>{familyName}</div>
          <div className="text-white/40 text-sm capitalize">{topic.replace(/-/g, ' ')} · Round 1</div>
        </div>
        <div className={`text-sm font-bold ${theme.textAccentBold}`}>
          {currentQ + 1} / {questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/[0.08] rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Room code */}
      <div className={`${theme.badge} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs mb-6`}>
        Room: {roomCode}
      </div>

      {/* Question */}
      <div className={`${theme.card} p-6 md:p-8 mb-6`}>
        <div className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-4`}>
          Question {currentQ + 1}
          {q.difficulty && (
            <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${
              q.difficulty === 'easy'   ? 'bg-green-500/20 text-green-400' :
              q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                          'bg-red-500/20 text-red-400'
            }`}>
              {q.difficulty}
            </span>
          )}
        </div>
        <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {q.question}
        </p>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {options.map(([key, val]) => {
          let cardClass = `${theme.card} ${theme.cardHover} p-4 md:p-5 rounded-2xl text-left w-full transition-all duration-200 flex items-start gap-3 cursor-pointer`

          if (gameState === 'answered') {
            if (key === q.answer) {
              cardClass = 'bg-green-500/20 border border-green-500/40 p-4 md:p-5 rounded-2xl text-left w-full flex items-start gap-3'
            } else if (key === selected) {
              cardClass = 'bg-red-500/20 border border-red-500/40 p-4 md:p-5 rounded-2xl text-left w-full flex items-start gap-3 opacity-80'
            } else {
              cardClass = 'glass p-4 md:p-5 rounded-2xl text-left w-full flex items-start gap-3 opacity-40'
            }
          }

          return (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={gameState === 'answered'}
              className={cardClass}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                gameState === 'playing'
                  ? `bg-gradient-to-br ${theme.gradient} text-white`
                  : key === q.answer
                  ? 'bg-green-500 text-white'
                  : key === selected
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/50'
              }`}>
                {key}
              </span>
              <span className={`text-sm md:text-base leading-snug font-medium pt-1 ${
                gameState === 'answered' && key !== q.answer && key !== selected
                  ? 'text-white/40'
                  : 'text-white'
              }`}>
                {val}
              </span>
            </button>
          )
        })}
      </div>

      {/* Result + explanation */}
      {gameState === 'answered' && (
        <div className={`${theme.card} p-5 mb-6 border ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className={`flex items-center gap-2 font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect
              ? <><CheckCircle size={18} /> Correct! Well done!</>
              : <><XCircle size={18} /> Not quite — the answer is {q.answer}</>
            }
          </div>
          <p className="text-white/60 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {gameState === 'answered' && (
        <button onClick={handleNext} className={btn.primary + ' w-full justify-center py-4 text-base'}>
          {currentQ + 1 >= questions.length ? (
            <><Trophy size={18} /> See Leaderboard</>
          ) : (
            <>Next Question <ArrowRight size={18} /></>
          )}
        </button>
      )}

      {/* Score strip */}
      {scores.length > 1 && (
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <div className="text-xs text-white/30 mb-3 uppercase tracking-widest">Scores</div>
          <div className="flex flex-wrap gap-2">
            {[...scores].sort((a, b) => b.score - a.score).map(s => (
              <div key={s.name} className={`${theme.card} px-3 py-2 rounded-xl flex items-center gap-2`}>
                <span className="text-white/70 text-xs font-medium">{s.name}</span>
                <span className={`${theme.textAccent} font-bold text-sm`}>{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading quiz…</div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
