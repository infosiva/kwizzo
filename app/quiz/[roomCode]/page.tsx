'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Trophy, RotateCcw, Home, CheckCircle, XCircle, Volume2, VolumeX, Link2, Share2 } from 'lucide-react'
import { theme, btn } from '@/lib/theme'
import ProWall from '@/components/ProWall'
import { isProUser, FREE_QUESTION_LIMIT } from '@/lib/pro'
import { saveGameResult } from '@/lib/gameHistory'
import type { Question } from '@/app/api/quiz/generate/route'
import { useVoiceFeedback } from '@/lib/useVoiceFeedback'
import QuizInsights from '@/components/QuizInsights'

type Member = { name: string; age: string }
type GameState = 'loading' | 'choosing' | 'playing' | 'answered' | 'finished' | 'pro-wall'
type PlayerScore = { name: string; age: string; score: number; answers: boolean[] }

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
type OptionKey = typeof OPTION_LABELS[number]

// Read ?subject= without useSearchParams (avoids useSyncExternalStore / React #310)
function getSubjectParam(): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('subject') ?? ''
}

// Build per-question wrong-pct data from player scores + questions
function buildInsights(
  scores: { name: string; answers: boolean[] }[],
  playerQuestions: Record<string, Question[]>,
  sharedQuestions: Question[],
) {
  if (scores.length === 0) return []
  // Use first player's question bank for question labels
  const firstPlayer = scores[0]?.name ?? ''
  const bank = playerQuestions[firstPlayer]?.length
    ? playerQuestions[firstPlayer]
    : sharedQuestions
  if (!bank.length) return []

  const questionCount = bank.length
  const wrongCounts = new Array<number>(questionCount).fill(0)
  let totalPlayers = 0

  for (const s of scores) {
    const playerBank = playerQuestions[s.name]?.length ? playerQuestions[s.name] : sharedQuestions
    if (!playerBank.length) continue
    totalPlayers++
    for (let i = 0; i < Math.min(s.answers.length, questionCount); i++) {
      if (!s.answers[i]) wrongCounts[i]++
    }
  }

  if (totalPlayers === 0) return []
  return bank.map((q, i) => ({
    question: q.question,
    percentWrong: Math.round((wrongCounts[i] / totalPlayers) * 100),
  }))
}

// Share-link button component — shown prominently near top of results
function ShareQuizLink({ roomCode, topic }: { roomCode: string; topic: string }) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    const url = `${window.location.origin}/quiz/${roomCode}?subject=${encodeURIComponent(topic)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback: show the URL in a prompt
      window.prompt('Copy this quiz link:', url)
    })
  }

  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3 fade-up"
      style={{
        background: 'rgba(139,92,246,0.08)',
        border: '1px solid rgba(139,92,246,0.22)',
      }}
    >
      <Link2 size={16} className="text-violet-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white/70 text-xs font-semibold">Share this quiz</p>
        <p className="text-white/30 text-[10px] truncate">
          kwizzo.app/quiz/{roomCode}?subject={topic}
        </p>
      </div>
      <button
        onClick={copyLink}
        className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
        style={{
          background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.18)',
          border: copied ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(139,92,246,0.35)',
          color: copied ? '#86efac' : '#c4b5fd',
        }}
      >
        {copied ? '✓ Copied!' : '🔗 Copy link'}
      </button>
    </div>
  )
}

// Share-score button — copies personalised score text to clipboard
function ShareScoreButton({ score, total, topic }: { score: number; total: number; topic: string }) {
  const [copied, setCopied] = useState(false)
  const pct = Math.round((score / total) * 100)
  const topicLabel = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  function shareScore() {
    const text = `I scored ${pct}% on ${topicLabel} at kwizzo.app — try to beat me! 🧠`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      window.prompt('Copy your score:', text)
    })
  }

  return (
    <button
      onClick={shareScore}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
      style={{
        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.12)',
        border: copied ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(139,92,246,0.28)',
        color: copied ? '#86efac' : '#c4b5fd',
      }}
    >
      {copied ? <CheckCircle size={15} /> : <Share2 size={15} />}
      {copied ? 'Copied!' : 'Share score'}
    </button>
  )
}

// Topic-specific tips shown during loading to fill dead time
const TOPIC_TIPS: Record<string, string[]> = {
  science: ['Water boils at 100°C at sea level — but lower on a mountain!', 'DNA contains about 3 billion base pairs.', 'Light travels at ~300,000 km per second.'],
  history: ['The Great Wall of China was built over many centuries, not all at once.', 'Cleopatra lived closer in time to the Moon landing than to the pyramids being built.', 'The shortest war in history lasted 38–45 minutes.'],
  geography: ['Russia spans 11 time zones.', 'Australia is wider than the Moon.', 'Canada has the most lakes of any country in the world.'],
  maths: ['Zero is the only number that cannot be represented in Roman numerals.', 'A googol is 1 followed by 100 zeros.', 'The equals sign (=) was invented in 1557.'],
  sports: ['A regulation football pitch is between 100–110 metres long.', 'The Olympics were held every 4 years since 776 BC.', 'Table tennis is the world\'s most participated sport.'],
  music: ['The piano has 88 keys.', 'A guitar has 6 strings in standard tuning.', '"Happy Birthday" was the first song ever played in space.'],
  movies: ['The Wilhelm Scream has appeared in hundreds of films since 1951.', 'The Lord of the Rings trilogy won 17 Oscars combined.', 'Pixar accidentally deleted Toy Story 2 during production.'],
  technology: ['The first computer bug was an actual bug — a moth found in a relay in 1947.', 'There are more internet-connected devices than people on Earth.', 'The first website is still online: info.cern.ch.'],
  nature: ['A group of flamingos is called a flamboyance.', 'Octopuses have three hearts.', 'Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs.'],
  food: ['Apples are members of the rose family.', 'Strawberries are not technically berries — bananas are.', 'Chocolate was once used as currency by the Aztecs.'],
  general: ['A day on Venus is longer than a year on Venus.', 'Sharks are older than trees.', 'The human body contains enough iron to make a small nail.'],
}

function getLoadingTip(topic: string): string {
  const key = Object.keys(TOPIC_TIPS).find(k => topic.toLowerCase().includes(k)) ?? 'general'
  const tips = TOPIC_TIPS[key]
  return tips[Math.floor(Math.random() * tips.length)]
}

function QuizContent() {
  const params  = useParams()
  const router  = useRouter()

  const roomCode       = params.roomCode as string
  const subjectFromUrl = getSubjectParam()

  const [gameState,       setGameState]       = useState<GameState>('loading')
  // Per-player question banks: { playerName: Question[] }
  const [playerQuestions, setPlayerQuestions] = useState<Record<string, Question[]>>({})
  // Shared fallback questions (single-player or fallback)
  const [questions,       setQuestions]       = useState<Question[]>([])
  const [currentQ,        setCurrentQ]        = useState(0)
  const [selected,        setSelected]        = useState<OptionKey | null>(null)
  const [scores,          setScores]          = useState<PlayerScore[]>([])
  const [familyName,      setFamilyName]      = useState('Your Family')
  const [topic,           setTopic]           = useState(subjectFromUrl)
  const [loadError,       setLoadError]       = useState('')
  // Which player is currently answering (round-robin)
  const [activePlayerIdx, setActivePlayerIdx] = useState(0)
  const [members,         setMembers]         = useState<Member[]>([])
  const [streak,          setStreak]          = useState(0)       // current correct streak
  const [bestStreak,      setBestStreak]      = useState(0)
  const [showScorePop,    setShowScorePop]    = useState(false)   // +1 float animation
  const [answerAnim,      setAnswerAnim]      = useState<'bounce-in' | 'shake' | ''>('')
  const [answerStartTime, setAnswerStartTime] = useState(0)       // timestamp Q was shown
  const [fastestSec,      setFastestSec]      = useState<number | null>(null) // fastest answer in seconds
  const [fastestBy,       setFastestBy]       = useState('')
  const [qKey,            setQKey]            = useState(0)       // changes on every new Q, triggers stagger animation
  const [isPro,           setIsPro]           = useState(false)
  const [voiceOn,         setVoiceOn]         = useState(true)

  const { speakResult, speakQuestion, cancel: cancelVoice, supported: voiceSupported } = useVoiceFeedback({ pitch: 1.15, rate: 1.1 })
  const topRef = useRef<HTMLDivElement>(null)

  // Check Pro status once on mount
  useEffect(() => { setIsPro(isProUser()) }, [])

  // Scroll to top + stamp question start time on every new question
  useEffect(() => {
    if (gameState === 'playing') {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setAnswerStartTime(Date.now())
    }
  }, [currentQ, activePlayerIdx, gameState])

  const loadQuestions = useCallback(async (ms: Member[], topicId: string) => {
    setGameState('loading')
    setLoadError('')
    try {
      const res = await fetch('/api/quiz/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          topic:   topicId,
          members: ms.map(m => ({ name: m.name, age: Number(m.age) })),
        }),
      })
      const data = await res.json()

      if (data?.aiError) {
        setLoadError(
          res.status === 503 && data.error?.includes('not configured')
            ? 'AI keys not set up on server. Contact support.'
            : 'AI is busy right now — tap retry in a moment.'
        )
        return
      }

      if (data?.questions?.length) {
        setQuestions(data.questions)
        if (data.playerQuestions && Object.keys(data.playerQuestions).length > 0) {
          setPlayerQuestions(data.playerQuestions)
        }
        setGameState(ms.length > 1 ? 'choosing' : 'playing')
      } else {
        setLoadError('Could not load questions. Please try again.')
      }
    } catch {
      setLoadError('Network error. Please check your connection and try again.')
    }
  }, [])

  useEffect(() => {
    // Sanitise members: strip blank names, fill missing ages, guarantee ≥1 player
    function sanitise(raw: Member[]): Member[] {
      const clean = raw
        .filter(m => m.name?.trim() && !/^\d+$/.test(m.name.trim()))
        .map(m => ({ name: m.name.trim(), age: m.age || '10' }))
      return clean.length > 0 ? clean : [{ name: 'Player', age: '10' }]
    }

    try {
      const roomData = localStorage.getItem(`kwizzo_room_${roomCode}`)
      if (roomData) {
        const data    = JSON.parse(roomData)
        const ms      = sanitise(data.members ?? [])
        const topicId = data.subject ?? subjectFromUrl ?? 'general'

        setFamilyName(data.familyName ?? ms.map(m => m.name).join(' & '))
        setTopic(topicId)
        setMembers(ms)
        setScores(ms.map(m => ({ name: m.name, age: m.age, score: 0, answers: [] })))
        loadQuestions(ms, topicId)
      } else {
        const family  = localStorage.getItem('kwizzo_family')
        const raw     = family ? (JSON.parse(family).members ?? []) : []
        const ms      = sanitise(raw)
        const topicId = subjectFromUrl || 'general'

        setTopic(topicId)
        setMembers(ms)
        setScores(ms.map(m => ({ name: m.name, age: m.age, score: 0, answers: [] })))
        loadQuestions(ms, topicId)
      }
    } catch {
      const ms = [{ name: 'Player', age: '10' }]
      setTopic(subjectFromUrl || 'general')
      setMembers(ms)
      setScores(ms.map(m => ({ name: m.name, age: m.age, score: 0, answers: [] })))
      loadQuestions(ms, subjectFromUrl || 'general')
    }
  }, [roomCode, subjectFromUrl, loadQuestions])

  // Get the question for the current active player
  function getCurrentQuestion(): Question | null {
    if (members.length === 0) return questions[currentQ] ?? null
    const activeName  = members[activePlayerIdx]?.name
    const playerBank  = playerQuestions[activeName]
    // Use per-player question bank if available, else shared
    const bank = playerBank?.length ? playerBank : questions
    return bank[currentQ] ?? null
  }

  function handleAnswer(opt: OptionKey) {
    if (gameState !== 'playing') return
    const q = getCurrentQuestion()
    if (!q) return
    setSelected(opt)
    setGameState('answered')

    const correct    = opt === q.answer
    if (voiceOn) speakResult(correct, correct ? undefined : (q.options?.[q.answer] ?? q.answer))
    const elapsed    = answerStartTime ? Math.round((Date.now() - answerStartTime) / 1000) : 99
    const activeName = members[activePlayerIdx]?.name ?? scores[0]?.name

    // Streak tracking
    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    if (newStreak > bestStreak) setBestStreak(newStreak)

    // Fastest answer tracking
    if (correct && (fastestSec === null || elapsed < fastestSec)) {
      setFastestSec(elapsed)
      setFastestBy(displayName(activeName))
    }

    // Score update
    setScores(prev => prev.map(s =>
      s.name === activeName
        ? { ...s, score: s.score + (correct ? 1 : 0), answers: [...s.answers, correct] }
        : s
    ))

    // Animations
    setAnswerAnim(correct ? 'bounce-in' : 'shake')
    if (correct) {
      setShowScorePop(true)
      setTimeout(() => setShowScorePop(false), 900)
    }
    setTimeout(() => setAnswerAnim(''), 500)
  }

  function handleNext() {
    const totalQs = (() => {
      if (members.length === 0) return questions.length
      const activeName = members[activePlayerIdx]?.name
      const bank = playerQuestions[activeName]?.length ? playerQuestions[activeName] : questions
      return bank.length
    })()

    const nextQ = currentQ + 1

    // Pro gate — free users limited to FREE_QUESTION_LIMIT questions
    if (!isPro && nextQ >= FREE_QUESTION_LIMIT) {
      setGameState('pro-wall')
      return
    }

    if (nextQ >= totalQs) {
      // This player is done — move to next player or finish
      const nextPlayerIdx = activePlayerIdx + 1
      if (nextPlayerIdx < members.length) {
        // Next player's turn
        setActivePlayerIdx(nextPlayerIdx)
        setCurrentQ(0)
        setSelected(null)
        setStreak(0)
        setGameState('choosing')
      } else {
        // Save result to localStorage history before showing results screen
        try {
          saveGameResult({
            topic:       topic,
            familyName,
            players:     scores.map(s => ({
              name:  s.name,
              score: s.score,
              total: playerQuestions[s.name]?.length || questions.length || 10,
              age:   parseInt(s.age, 10) || 18,
            })),
            bestStreak,
            fastestSec,
            fastestBy,
            durationSec: 0,
          })
        } catch {}
        setGameState('finished')
      }
    } else {
      setCurrentQ(nextQ)
      setSelected(null)
      setStreak(0)
      setAnswerStartTime(Date.now())
      setQKey(k => k + 1)
      setGameState('playing')
    }
  }

  function handlePlayAgain() {
    setCurrentQ(0)
    setSelected(null)
    setActivePlayerIdx(0)
    setStreak(0)
    setBestStreak(0)
    setFastestSec(null)
    setFastestBy('')
    setQKey(0)
    setAnswerStartTime(Date.now())
    setScores(prev => prev.map(s => ({ ...s, score: 0, answers: [] })))
    setQuestions([])
    setPlayerQuestions({})
    try {
      const roomData = localStorage.getItem(`kwizzo_room_${roomCode}`)
      if (roomData) {
        const data = JSON.parse(roomData)
        loadQuestions(data.members ?? [], data.subject ?? topic)
      } else {
        loadQuestions(members.length ? members : [{ name: 'Player', age: '18' }], topic)
      }
    } catch {
      loadQuestions([{ name: 'Player', age: '18' }], topic)
    }
  }

  const q          = getCurrentQuestion()
  const activeName = members[activePlayerIdx]?.name ?? scores[0]?.name ?? ''
  const activeAge  = members[activePlayerIdx]?.age ?? '?'
  // Guard: if name is purely numeric (e.g. user typed age in name field), show 'Player'
  const displayName = (name: string) => /^\d+$/.test(name.trim()) ? 'Player' : (name || 'Player')
  const totalQsForPlayer = (() => {
    const bank = playerQuestions[activeName]?.length ? playerQuestions[activeName] : questions
    return bank.length
  })()
  const progress  = totalQsForPlayer > 0
    ? ((currentQ + (gameState === 'answered' ? 1 : 0)) / totalQsForPlayer) * 100
    : 0
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)
  const topicLabel   = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  // Shuffle options once per question — MUST be before ALL conditional returns (Rules of Hooks)
  const options = useMemo(() => {
    if (!q) return []
    const arr = Object.entries(q.options) as [OptionKey, string][]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  // q.question ensures we re-shuffle when the actual question content changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qKey, currentQ, activePlayerIdx, q?.question])

  // ── Loading ───────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadingTip = useMemo(() => getLoadingTip(topic), [topic])

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-5 float">🤖</div>
        <h2 className="text-xl font-bold text-white mb-2">Cooking up your quiz…</h2>
        <p className="text-white/40 text-sm mb-1 capitalize">Topic: <span className="text-white/60">{topicLabel}</span></p>
        <p className="text-white/30 text-xs mb-8">Personalising for each player's age — takes a few seconds</p>
        {loadError ? (
          <div className="space-y-3">
            <p className="text-red-400 text-sm px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">{loadError}</p>
            <button onClick={() => router.push('/play')} className={btn.secondary}>← Back</button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 justify-center mb-10">
              <div className={`w-2 h-2 rounded-full ${theme.solid} animate-bounce`} style={{ animationDelay: '0ms' }} />
              <div className={`w-2 h-2 rounded-full ${theme.solid} animate-bounce`} style={{ animationDelay: '150ms' }} />
              <div className={`w-2 h-2 rounded-full ${theme.solid} animate-bounce`} style={{ animationDelay: '300ms' }} />
            </div>
            {/* Fun fact to fill wait time */}
            <div
              className="max-w-xs rounded-2xl px-5 py-4 fade-up"
              style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)' }}
            >
              <p className="text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Did you know?</p>
              <p className="text-white/60 text-sm leading-relaxed">{loadingTip}</p>
            </div>
          </>
        )}
      </div>
    )
  }

  // ── Player handoff screen ─────────────────────────────────
  if (gameState === 'choosing') {
    const prevPlayerIdx = activePlayerIdx - 1
    const prevPlayer    = prevPlayerIdx >= 0 ? members[prevPlayerIdx] : null
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {prevPlayer && (
          <div className="mb-8 text-white/50 text-sm">
            ✅ {prevPlayer.name} finished their round
          </div>
        )}
        <div className="text-6xl mb-6">🎮</div>
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Your turn, <span className={theme.gradientText}>{displayName(activeName)}</span>!
        </h2>
        <p className="text-white/50 mb-2">Age {activeAge} · {totalQsForPlayer} questions ready for you</p>
        <p className="text-white/30 text-sm mb-10 capitalize">Topic: {topic.replace(/-/g, ' ')}</p>
        <button
          onClick={() => setGameState('playing')}
          className={btn.primary + ' text-lg px-12 py-4'}
        >
          I'm ready <ArrowRight size={20} />
        </button>
        {/* Show other players' scores so far */}
        {scores.some(s => s.answers.length > 0) && (
          <div className="mt-10 w-full max-w-sm">
            <div className="text-xs text-white/30 mb-3 uppercase tracking-widest">Scores so far</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {sortedScores.filter(s => s.answers.length > 0).map(s => (
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

  // ── Finished ──────────────────────────────────────────────
  if (gameState === 'finished') {
    const medals = ['🥇', '🥈', '🥉']
    // For single player: show their score. For multi: show winner's score in hero.
    const heroPlayer = sortedScores[0]
    const heroBank   = heroPlayer
      ? (playerQuestions[heroPlayer.name]?.length ? playerQuestions[heroPlayer.name] : questions)
      : questions
    const heroTotal  = heroBank.length || 10
    const heroPct    = heroPlayer ? Math.round((heroPlayer.score / heroTotal) * 100) : 0
    const isSolo     = scores.length === 1

    return (
      <div className="min-h-screen px-4 py-12 max-w-xl mx-auto">
        {/* ── Animated score hero ── */}
        <div className="text-center mb-8 fade-up">
          <div className="text-6xl mb-4">{heroPct >= 80 ? '🏆' : heroPct >= 50 ? '🎉' : '💪'}</div>
          {/* Big animated score number */}
          <div
            className="text-8xl font-black mb-1 tabular-nums"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {heroPct}%
          </div>
          <p className="text-white/50 text-base mb-1">
            {isSolo
              ? `You got ${heroPlayer?.score ?? 0} out of ${heroTotal} correct`
              : `${heroPlayer?.name ?? ''} leads with ${heroPlayer?.score ?? 0}/${heroTotal}`}
          </p>
          <h1 className="text-xl font-extrabold text-white mt-2">{familyName}</h1>
          <p className={`${theme.textAccent} font-semibold text-sm`}>Quiz Complete!</p>
          {!isSolo && (
            <p className="text-white/30 text-xs mt-1">Everyone played their own age-adapted round</p>
          )}
        </div>

        <div className={`${theme.card} p-6 mb-6 fade-up`}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className={theme.textAccent} /> Final Leaderboard
          </h2>
          <div className="space-y-3">
            {sortedScores.map((s, i) => {
              const playerBank = playerQuestions[s.name]?.length ? playerQuestions[s.name] : questions
              const total      = playerBank.length || 10
              return (
                <div
                  key={s.name}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    i === 0 ? `bg-gradient-to-r ${theme.gradient} bg-opacity-20` : 'glass'
                  }`}
                >
                  <span className="text-2xl w-8 flex-shrink-0">{medals[i] ?? `${i + 1}`}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="text-white/40 text-xs">Age {s.age} · {i === 0 ? 'Leaderboard leader 🎉' : `${Math.round((s.score / total) * 100)}% correct`}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-extrabold ${i === 0 ? 'text-white' : theme.textAccent}`}>
                      {s.score}/{total}
                    </div>
                    <div className="text-white/40 text-xs">
                      {Math.round((s.score / total) * 100)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Share row: copy score text + share quiz link */}
        <div className="flex items-center gap-2 mb-4 fade-up">
          {heroPlayer && (
            <ShareScoreButton
              score={heroPlayer.score}
              total={heroTotal}
              topic={topic}
            />
          )}
          <div className="flex-1">
            <ShareQuizLink roomCode={roomCode} topic={topic} />
          </div>
        </div>

        {/* Per-question drop-off insights */}
        <QuizInsights results={buildInsights(scores, playerQuestions, questions)} />

        {/* Fun stats strip */}
        {(bestStreak > 1 || fastestSec !== null) && (
          <div className="flex gap-3 mb-5 fade-up">
            {bestStreak > 1 && (
              <div className={`flex-1 ${theme.card} p-3 rounded-xl text-center`}>
                <div className="text-2xl font-extrabold text-orange-400">🔥 {bestStreak}</div>
                <div className="text-white/40 text-xs mt-0.5">best streak</div>
              </div>
            )}
            {fastestSec !== null && (
              <div className={`flex-1 ${theme.card} p-3 rounded-xl text-center`}>
                <div className="text-2xl font-extrabold text-cyan-400">⚡ {fastestSec}s</div>
                <div className="text-white/40 text-xs mt-0.5">fastest answer{fastestBy ? ` by ${fastestBy}` : ''}</div>
              </div>
            )}
          </div>
        )}

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

  // ── Pro wall ──────────────────────────────────────────────
  if (gameState === 'pro-wall') {
    const activeScore = scores.find(s => s.name === members[activePlayerIdx]?.name)
    return (
      <ProWall
        questionsAnswered={FREE_QUESTION_LIMIT}
        playerName={displayName(members[activePlayerIdx]?.name ?? 'Player')}
        score={activeScore?.score ?? 0}
        onContinueFree={() => {
          setCurrentQ(0)
          setSelected(null)
          setStreak(0)
          setQKey(k => k + 1)
          setGameState('playing')
        }}
        onNewGame={() => router.push('/play')}
      />
    )
  }

  if (!q) return null

  const isCorrect = selected === q.answer

  // Encouragement message based on streak
  const encouragement = streak >= 5 ? '🔥 On fire!' : streak >= 3 ? '⚡ Streak!' : ''

  // ── Playing / Answered ────────────────────────────────────
  return (
    <div ref={topRef} className="min-h-screen px-3 sm:px-4 py-5 sm:py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        {/* Left: logo + player info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0">🧠</span>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight truncate">{displayName(activeName)}</div>
            <div className="text-white/35 text-xs truncate">Age {activeAge} · <span className="capitalize">{topicLabel}</span></div>
          </div>
        </div>
        {/* Right: voice toggle + Q number + streak */}
        <div className="shrink-0 text-right flex items-center gap-3">
          {voiceSupported && (
            <button
              onClick={() => { setVoiceOn(v => !v); if (voiceOn) cancelVoice() }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ background: voiceOn ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', color: voiceOn ? '#a78bfa' : 'rgba(255,255,255,0.2)' }}
              title={voiceOn ? 'Mute voice' : 'Enable voice'}
            >
              {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          )}
          {streak >= 2 && (
            <div className="text-right">
              <div className="text-orange-400 font-bold text-sm tabular-nums leading-tight">🔥 {streak}</div>
              <div className="text-white/25 text-[10px] uppercase tracking-widest">streak</div>
            </div>
          )}
          <div>
            <div className={`text-base font-extrabold ${theme.textAccentBold} tabular-nums leading-tight`}>
              {currentQ + 1}<span className="text-white/30 font-normal text-sm">/{totalQsForPlayer}</span>
            </div>
            <div className="text-white/25 text-[10px] uppercase tracking-widest">Question</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-white/20 rounded-full mb-5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Encouragement + score pop */}
      <div className="relative h-7 mb-1">
        {encouragement && (
          <div className="text-center text-sm font-bold text-orange-400 fade-up">{encouragement}</div>
        )}
        {showScorePop && (
          <div className={`absolute right-0 top-0 text-green-400 font-extrabold text-lg score-pop`}>+1</div>
        )}
      </div>

      {/* Difficulty badge */}
      <div className="flex items-center gap-2 mb-4">
        {q.difficulty && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            q.difficulty === 'easy'   ? 'bg-green-500/20 text-green-400' :
            q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-red-500/20 text-red-400'
          }`}>
            {q.difficulty}
          </span>
        )}
        <span className={`${theme.badge} px-2.5 py-1 rounded-full text-xs`}>for {displayName(activeName)}</span>
        <span className="text-white/25 text-xs">{totalQsForPlayer} questions</span>
      </div>

      {/* Question */}
      <div className={`${theme.card} p-5 md:p-8 mb-5`}>
        <div className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-3`}>
          Question {currentQ + 1}
        </div>
        <p className="text-xl md:text-3xl font-bold text-white leading-tight">
          {q.question}
        </p>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {options.map(([key, val], idx) => {
          const isCorrectKey = key === q.answer
          const isSelectedKey = key === selected

          let cardClass = `${theme.card} ${theme.cardHover} p-3.5 sm:p-4 rounded-2xl text-left w-full transition-all duration-200 flex items-start gap-3 cursor-pointer option-appear`

          if (gameState === 'answered') {
            if (isCorrectKey) {
              cardClass = `bg-green-500/20 border border-green-500/40 p-3.5 sm:p-4 rounded-2xl text-left w-full flex items-start gap-3 ${answerAnim && isCorrectKey ? answerAnim : ''}`
            } else if (isSelectedKey) {
              cardClass = `bg-red-500/20 border border-red-500/40 p-3.5 sm:p-4 rounded-2xl text-left w-full flex items-start gap-3 opacity-80 ${answerAnim && isSelectedKey ? answerAnim : ''}`
            } else {
              cardClass = 'glass p-3.5 sm:p-4 rounded-2xl text-left w-full flex items-start gap-3 opacity-40'
            }
          }

          return (
            <button
              key={`${qKey}-${key}`}
              onClick={() => handleAnswer(key)}
              disabled={gameState === 'answered'}
              className={cardClass}
              style={gameState === 'playing' ? { animationDelay: `${idx * 60}ms` } : undefined}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                gameState === 'playing'
                  ? `bg-gradient-to-br ${theme.gradient} text-white`
                  : isCorrectKey
                  ? 'bg-green-500 text-white'
                  : isSelectedKey
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/50'
              }`}>
                {key}
              </span>
              <span className={`text-sm md:text-base leading-snug font-medium pt-1 ${
                gameState === 'answered' && !isCorrectKey && !isSelectedKey
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
        <div className={`${theme.card} p-4 mb-6 border fade-up ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className={`flex items-center gap-2 font-bold mb-1 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect
              ? <><CheckCircle size={16} />{streak >= 3 ? ` ${streak} in a row, ${displayName(activeName)}! 🔥` : ` Correct! Well done, ${displayName(activeName)}!`}</>
              : <><XCircle size={16} /> Not quite — the answer was <span className="ml-1 px-1.5 py-0.5 bg-white/10 rounded text-white">{q.options[q.answer]}</span></>
            }
          </div>
          <p className="text-white/50 text-xs leading-relaxed mt-1.5">{q.explanation}</p>
        </div>
      )}

      {/* Next button — sticky at bottom so it's always visible without scrolling */}
      {gameState === 'answered' && (
        <div className="fixed bottom-0 left-0 right-0 px-3 pt-3 bg-gradient-to-t from-[#080712] via-[#080712]/90 to-transparent z-20" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          <button onClick={handleNext} className={btn.primary + ' w-full justify-center py-4 text-base max-w-2xl mx-auto'}>
            {currentQ + 1 >= totalQsForPlayer ? (
              activePlayerIdx + 1 < members.length
                ? <><ArrowRight size={18} /> Pass to {members[activePlayerIdx + 1]?.name}</>
                : <><Trophy size={18} /> See Leaderboard</>
            ) : (
              <>Next Question <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      )}

      {/* Score strip */}
      {scores.length > 1 && (
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <div className="text-xs text-white/30 mb-3 uppercase tracking-widest">Scores</div>
          <div className="flex flex-wrap gap-2">
            {[...scores].sort((a, b) => b.score - a.score).map(s => (
              <div key={s.name} className={`${theme.card} px-3 py-2 rounded-xl flex items-center gap-2 ${s.name === activeName ? 'ring-1 ring-violet-400' : ''}`}>
                <span className="text-white/70 text-xs font-medium">{s.name}</span>
                <span className={`${theme.textAccent} font-bold text-sm`}>{s.score}</span>
                {s.name === activeName && <span className="text-[10px] text-white/30">playing</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuizPage() {
  return <QuizContent />
}
