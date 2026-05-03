'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, ArrowRight, Users, Zap, Pencil } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { Suspense } from 'react'

type Member   = { name: string; age: string }
type GameType = 'quiz' | 'draw'
type Mode     = 'solo' | 'group' | 'join'

const SUBJECTS = isAiTool(config) ? config.subjects : []

function PlayContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const modeParam      = searchParams.get('mode') ?? 'solo'
  const defaultSubject = searchParams.get('subject') ?? ''
  const defaultGame    = (searchParams.get('game') as GameType) ?? 'quiz'

  const [gameType, setGameType] = useState<GameType>(defaultGame)
  const [mode,     setMode]     = useState<Mode>(
    modeParam === 'group' ? 'group' : modeParam === 'join' ? 'join' : 'solo'
  )
  const [members,  setMembers]  = useState<Member[]>([{ name: '', age: '' }])
  const [subject,  setSubject]  = useState(defaultSubject)
  const [creating, setCreating] = useState(false)
  const [error,    setError]    = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [joinError,setJoinError]= useState('')

  const playersRef  = useRef<HTMLDivElement>(null)
  const joinInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kwizzo_family')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.members?.length) setMembers(data.members)
      }
    } catch { /* ignore */ }
  }, [])

  // Auto-focus join input when Join tab selected
  useEffect(() => {
    if (mode === 'join') {
      setTimeout(() => joinInputRef.current?.focus(), 100)
    }
  }, [mode])

  function addMember()    { setMembers(prev => [...prev, { name: '', age: '' }]) }
  function removeMember(i: number) { setMembers(prev => prev.filter((_, idx) => idx !== i)) }
  function updateMember(i: number, field: keyof Member, value: string) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }
  function generateCode() { return String(Math.floor(1000 + Math.random() * 9000)) }

  function selectSubject(id: string) {
    setSubject(id)
    setError('')
    setTimeout(() => playersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  async function handleStart() {
    setError('')
    if (gameType === 'quiz' && !subject) { setError('Pick a topic first.'); return }
    const validMembers = members.filter(m => m.name.trim() && m.age)
    if (validMembers.length < 1) { setError('Add at least one player with a name and age.'); return }
    const numericName = validMembers.find(m => /^\d+$/.test(m.name.trim()))
    if (numericName) { setError(`"${numericName.name}" doesn't look like a name — enter a name, then age.`); return }
    if (gameType === 'draw' && validMembers.length < 2) {
      setError('Draw & Guess needs at least 2 players.')
      return
    }

    setCreating(true)
    try {
      const code = generateCode()
      localStorage.setItem('kwizzo_family', JSON.stringify({ members: validMembers }))
      localStorage.setItem(`kwizzo_room_${code}`, JSON.stringify({
        familyName: validMembers.map(m => m.name).join(' & '),
        members: validMembers,
        subject,
        code,
      }))
      if (gameType === 'draw') {
        router.push(`/draw/${code}`)
      } else {
        router.push(`/quiz/${code}?subject=${subject}`)
      }
    } catch {
      setError('Something went wrong. Try again.')
      setCreating(false)
    }
  }

  function handleJoin() {
    setJoinError('')
    const code = roomCode.trim()
    if (!/^\d{4}$/.test(code)) { setJoinError('Enter a valid 4-digit room code.'); return }
    router.push(gameType === 'draw' ? `/draw/${code}` : `/quiz/${code}`)
  }

  const isSetup = mode === 'solo' || mode === 'group'

  return (
    <div className="min-h-screen px-3 sm:px-4 py-8 sm:py-10 max-w-xl mx-auto pb-32">

      {/* Header */}
      <div className="text-center mb-7 fade-up">
        <div className="text-4xl mb-2">🧠</div>
        <h1 className="text-2xl font-extrabold text-white mb-1">
          <span className={theme.gradientText}>Kwizzo</span>
        </h1>
        <p className="text-white/40 text-sm">AI games — any topic, any age</p>
      </div>

      {/* Game type selector */}
      <div className="flex gap-2 mb-4">
        {([
          { id: 'quiz', label: 'Quiz',          icon: '🧠', desc: 'Answer AI questions' },
          { id: 'draw', label: 'Draw & Guess',  icon: '🎨', desc: 'Draw it, guess it' },
        ] as const).map(g => (
          <button
            key={g.id}
            onClick={() => setGameType(g.id)}
            className={`flex-1 p-3 rounded-2xl text-left transition-all border ${
              gameType === g.id
                ? `bg-gradient-to-br ${theme.gradient} border-transparent text-white`
                : `${theme.card} ${theme.cardHover} border-white/[0.06]`
            }`}
          >
            <div className="text-xl mb-1">{g.icon}</div>
            <div className="font-bold text-sm">{g.label}</div>
            <div className={`text-xs ${gameType === g.id ? 'text-white/70' : 'text-white/35'}`}>{g.desc}</div>
          </button>
        ))}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl glass mb-5">
        {([
          { id: 'solo',  label: gameType === 'quiz' ? 'Play Solo' : 'Play Together', icon: <Zap size={14} /> },
          { id: 'group', label: 'With Others', icon: <Users size={14} /> },
          { id: 'join',  label: 'Join Room',   icon: '🔑' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
              mode === tab.id
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow`
                : 'text-white/45 hover:text-white/70'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Join room */}
      {mode === 'join' && (
        <div className={`${theme.card} p-6 fade-up rounded-2xl`}>
          <h2 className="text-base font-bold text-white mb-1">Join a game</h2>
          <p className="text-white/40 text-xs mb-5">Enter the 4-digit code from the host</p>
          <input
            ref={joinInputRef}
            className="input-dark text-center text-3xl font-bold tracking-widest mb-4"
            placeholder="0000"
            maxLength={4}
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            inputMode="numeric"
          />
          {joinError && <p className="text-red-400 text-xs mb-3">{joinError}</p>}
          <button onClick={handleJoin} className={btn.primary + ' w-full justify-center py-3'}>
            Join Room <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Setup */}
      {isSetup && (
        <div className={`${theme.card} p-5 fade-up rounded-2xl space-y-5`}>

          {/* Topic — quiz only */}
          {gameType === 'quiz' && (
            <div>
              <label className="block text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">
                Topic {subject && <span className="text-green-400 normal-case tracking-normal font-normal ml-1">✓ selected</span>}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => selectSubject(s.id)}
                    className={`p-3 rounded-xl text-left flex items-center gap-2 text-sm transition-all ${
                      subject === s.id
                        ? `bg-gradient-to-r ${theme.gradient} text-white font-semibold shadow scale-[1.02]`
                        : `${theme.card} ${theme.cardHover} text-white/60`
                    }`}
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Draw & Guess info */}
          {gameType === 'draw' && (
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎨</span>
                <span className="font-semibold text-white text-sm">Draw & Guess</span>
              </div>
              <ul className="text-xs text-white/50 space-y-1">
                <li>✦ AI picks a word tailored to each player's age</li>
                <li>✦ Drawer sees the word privately, draws on paper</li>
                <li>✦ Others type their guess — AI checks if it's close</li>
                <li>✦ Hint unlocks after 30s if no one gets it</li>
              </ul>
              {mode === 'solo' && <p className="text-amber-400/70 text-xs mt-2">⚠ Needs at least 2 players to play</p>}
            </div>
          )}

          {/* Players */}
          <div ref={playersRef}>
            <label className="block text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">
              Who's playing?
            </label>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">👤</span>
                    <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                      {i === 0 ? 'Player 1' : `Player ${i + 1}`}
                    </span>
                    {members.length > 1 && (
                      <button
                        onClick={() => removeMember(i)}
                        className="ml-auto text-white/20 hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <input
                    className="input-dark w-full py-3 text-base mb-2"
                    placeholder={i === 0 ? 'Enter player name' : 'Enter player name'}
                    value={m.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs shrink-0">Age</span>
                    <input
                      className="input-dark w-20 py-2.5 text-base text-center font-semibold"
                      type="number"
                      placeholder="Age"
                      min="3"
                      max="110"
                      inputMode="numeric"
                      value={m.age}
                      onChange={e => updateMember(i, 'age', e.target.value)}
                    />
                    <span className="text-white/20 text-xs">years old</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addMember}
              className={`mt-3 w-full py-3 rounded-2xl bg-white/[0.03] border border-white/[0.10] text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all text-sm font-medium flex items-center justify-center gap-2`}
            >
              <Plus size={15} /> Add another player
            </button>
          </div>

          {mode === 'group' && (
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-xs text-white/40">
              💡 A room code will be generated — share it so remote players can join
            </div>
          )}
        </div>
      )}

      {/* Sticky Start button — always reachable without scrolling */}
      {isSetup && (
        <div className="fixed bottom-0 left-0 right-0 px-3 pb-5 pt-3 bg-gradient-to-t from-[#080712] via-[#080712]/95 to-transparent z-20">
          <div className="max-w-xl mx-auto">
            {error && (
              <p className="text-red-400 text-xs text-center mb-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={creating}
              className={btn.primary + ' w-full justify-center py-4 text-base'}
            >
              {creating
                ? 'Setting up…'
                : gameType === 'draw'
                ? <><Pencil size={16} /> Start Drawing!</>
                : <>{mode === 'solo' ? 'Start Quiz' : 'Start Game'} <ArrowRight size={16} /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    }>
      <PlayContent />
    </Suspense>
  )
}
