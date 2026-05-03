'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, ArrowRight, Users, Zap, Pencil, Sparkles } from 'lucide-react'
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
    defaultGame === 'draw' ? 'group' :
    modeParam === 'group' ? 'group' : modeParam === 'join' ? 'join' : 'solo'
  )
  const [members,  setMembers]  = useState<Member[]>([{ name: '', age: '' }])
  const [subject,  setSubject]  = useState(defaultSubject)
  const [creating, setCreating] = useState(false)
  const [error,    setError]    = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [joinError,setJoinError]= useState('')

  const playersRef   = useRef<HTMLDivElement>(null)
  const joinInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kwizzo_family')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.members?.length) {
          // Filter out any stale entries where name looks like a number
          const clean = data.members.map((m: Member) => ({
            name: /^\d+$/.test((m.name ?? '').trim()) ? '' : (m.name ?? ''),
            age:  m.age ?? '',
          }))
          setMembers(clean)
        }
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (mode === 'join') setTimeout(() => joinInputRef.current?.focus(), 100)
  }, [mode])

  function selectGameType(g: GameType) {
    setGameType(g)
    if (g === 'draw') {
      setMode('group')
      setMembers(prev => prev.length < 2 ? [...prev, { name: '', age: '' }] : prev)
    }
  }

  function addMember()    { setMembers(prev => [...prev, { name: '', age: '' }]) }
  function removeMember(i: number) { setMembers(prev => prev.filter((_, idx) => idx !== i)) }
  function updateMember(i: number, field: keyof Member, value: string) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }
  function generateCode() { return String(Math.floor(1000 + Math.random() * 9000)) }
  function selectSubject(id: string) {
    setSubject(id); setError('')
    setTimeout(() => playersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  async function handleStart() {
    setError('')
    if (gameType === 'quiz' && !subject) { setError('Pick a topic first.'); return }
    const validMembers = members.filter(m => m.name.trim() && m.age)
    if (validMembers.length < 1) { setError('Add at least one player with a name and age.'); return }
    const numericName = validMembers.find(m => /^\d+$/.test(m.name.trim()))
    if (numericName) { setError(`"${numericName.name}" looks like a number — enter a name, not a number.`); return }
    if (gameType === 'draw' && validMembers.length < 2) { setError('Draw & Guess needs at least 2 players.'); return }

    setCreating(true)
    try {
      const code = generateCode()
      localStorage.setItem('kwizzo_family', JSON.stringify({ members: validMembers }))
      localStorage.setItem(`kwizzo_room_${code}`, JSON.stringify({
        familyName: validMembers.map(m => m.name).join(' & '),
        members: validMembers, subject, code,
      }))
      router.push(gameType === 'draw' ? `/draw/${code}` : `/quiz/${code}?subject=${subject}`)
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
    <div className="min-h-screen bg-[#080712]">
      {/* Top gradient blob */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-br ${theme.gradient} opacity-[0.06] blur-3xl`} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-10 pb-32">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-3xl mb-3 shadow-xl">🧠</div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
            <span className={theme.gradientText}>Kwizzo</span>
          </h1>
          <p className="text-white/35 text-sm">AI games · any topic · any age</p>
        </div>

        {/* ── Game type cards ─────────────────────────────────────────────── */}
        <div className="flex gap-3 mb-5">
          {([
            { id: 'quiz', label: 'Quiz',         icon: '🧠', desc: 'Answer AI questions', badge: null },
            { id: 'draw', label: 'Draw & Guess', icon: '🎨', desc: 'Draw it, guess it',   badge: '2+ players' },
          ] as const).map(g => (
            <button
              key={g.id}
              onClick={() => selectGameType(g.id)}
              className={`flex-1 p-4 rounded-2xl text-left transition-all relative overflow-hidden ${
                gameType === g.id
                  ? `bg-gradient-to-br ${theme.gradient} shadow-lg shadow-violet-900/30`
                  : 'bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07]'
              }`}
            >
              {gameType === g.id && <div className="absolute inset-0 bg-white/5 rounded-2xl" />}
              <div className="relative">
                <div className="text-2xl mb-2">{g.icon}</div>
                <div className="font-bold text-sm text-white">{g.label}</div>
                <div className={`text-xs mt-0.5 ${gameType === g.id ? 'text-white/65' : 'text-white/30'}`}>{g.desc}</div>
                {g.badge && (
                  <span className={`absolute top-0 right-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    gameType === g.id ? 'bg-white/20 text-white/80' : 'bg-white/[0.07] text-white/30'
                  }`}>{g.badge}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* ── Mode tabs ───────────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-6">
          {([
            { id: 'solo',  label: 'Solo',          icon: <Zap size={13} />,   disabled: gameType === 'draw' },
            { id: 'group', label: 'Play Together',  icon: <Users size={13} />, disabled: false },
            { id: 'join',  label: 'Join Room',      icon: '🔑',                disabled: false },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setMode(tab.id)}
              disabled={tab.disabled}
              className={`flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                tab.disabled
                  ? 'text-white/15 cursor-not-allowed'
                  : mode === tab.id
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-sm`
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className="opacity-80">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── Join room ───────────────────────────────────────────────────── */}
        {mode === 'join' && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6">
            <p className="text-white font-bold text-base mb-1">Join a game</p>
            <p className="text-white/35 text-xs mb-5">Enter the 4-digit code from the host</p>
            <input
              ref={joinInputRef}
              className="input-dark text-center text-4xl font-black tracking-[0.3em] mb-4 py-4"
              placeholder="0000"
              maxLength={4}
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              inputMode="numeric"
            />
            {joinError && <p className="text-red-400 text-xs mb-3">{joinError}</p>}
            <button onClick={handleJoin} className={btn.primary + ' w-full justify-center py-3.5'}>
              Join Room <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Setup panel ─────────────────────────────────────────────────── */}
        {isSetup && (
          <div className="space-y-5">

            {/* Topic picker — quiz only */}
            {gameType === 'quiz' && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Topic</p>
                  {subject && <span className="text-green-400 text-xs font-medium flex items-center gap-1"><span>✓</span> Selected</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => selectSubject(s.id)}
                      className={`p-3 rounded-xl text-left flex items-center gap-2.5 text-sm font-medium transition-all ${
                        subject === s.id
                          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/55 border border-white/[0.05]'
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
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <p className="font-bold text-white text-sm">Draw & Guess</p>
                    <p className="text-white/30 text-xs">2+ players · take turns drawing</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'AI picks a word tailored to each player\'s age',
                    'Drawer sees the word privately, draws on paper',
                    'Others type their guess — AI checks if it\'s close',
                    'Hint unlocks after 30s if no one gets it',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/45">
                      <span className={`mt-0.5 text-[10px] ${theme.gradientText} font-bold`}>✦</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Players */}
            <div ref={playersRef} className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Who&apos;s playing?</p>

              <div className="space-y-2.5">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 py-2.5">
                    {/* Avatar circle */}
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-black text-xs shrink-0 opacity-80`}>
                      {m.name ? m.name[0].toUpperCase() : (i + 1)}
                    </div>

                    {/* Name input */}
                    <input
                      className="flex-1 min-w-0 bg-transparent text-white text-sm font-medium placeholder:text-white/20 outline-none"
                      placeholder={`Player ${i + 1} name`}
                      value={m.name}
                      onChange={e => updateMember(i, 'name', e.target.value)}
                      autoComplete="off"
                    />

                    {/* Divider */}
                    <div className="w-px h-5 bg-white/[0.08] shrink-0" />

                    {/* Age input */}
                    <input
                      className="w-12 bg-transparent text-white/70 text-sm font-semibold text-center placeholder:text-white/20 outline-none"
                      type="number"
                      placeholder="Age"
                      min="3" max="110"
                      inputMode="numeric"
                      value={m.age}
                      onChange={e => updateMember(i, 'age', e.target.value)}
                    />
                    <span className="text-white/20 text-xs shrink-0">yrs</span>

                    {/* Remove */}
                    {members.length > 1 && (
                      <button onClick={() => removeMember(i)} className="text-white/15 hover:text-red-400 transition-colors shrink-0 ml-0.5">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addMember}
                className="mt-3 w-full py-2.5 rounded-2xl border border-dashed border-white/[0.12] text-white/35 hover:text-white/60 hover:border-white/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add player
              </button>
            </div>

            {/* Group mode hint */}
            {mode === 'group' && gameType !== 'draw' && (
              <div className="flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-4 py-3">
                <Sparkles size={13} className="text-white/30 mt-0.5 shrink-0" />
                <p className="text-xs text-white/35">A room code will be generated — share it so others can join from their device</p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ── Sticky Start button ─────────────────────────────────────────── */}
      {isSetup && (
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-lg mx-auto px-4 pb-6 pt-4 bg-gradient-to-t from-[#080712] via-[#080712]/95 to-transparent">
            {error && (
              <p className="text-red-400 text-xs text-center mb-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={creating}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all bg-gradient-to-r ${theme.gradient} text-white shadow-lg shadow-violet-900/30 hover:opacity-90 active:scale-[0.98] disabled:opacity-50`}
            >
              {creating ? (
                <><span className="animate-spin text-lg">⟳</span> Setting up…</>
              ) : gameType === 'draw' ? (
                <><Pencil size={18} /> Start Drawing!</>
              ) : (
                <>{mode === 'solo' ? 'Start Quiz' : 'Start Game'} <ArrowRight size={18} /></>
              )}
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
      <div className="min-h-screen flex items-center justify-center bg-[#080712]">
        <div className="text-white/30 text-sm">Loading…</div>
      </div>
    }>
      <PlayContent />
    </Suspense>
  )
}
