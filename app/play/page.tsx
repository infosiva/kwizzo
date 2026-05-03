'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowRight, Users, Zap, Pencil, Crown } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { Suspense } from 'react'
import AdUnit from '@/components/AdUnit'
import { isProUser, startCheckout } from '@/lib/pro'

// Read query params without useSearchParams (avoids React error #310)
function getParam(key: string): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get(key) ?? ''
}

type Member   = { name: string; age: string }
type GameType = 'quiz' | 'draw'
type Mode     = 'solo' | 'group' | 'join'

const SUBJECTS = isAiTool(config) ? config.subjects : []

function PlayContent() {
  const router = useRouter()

  const modeParam      = getParam('mode') || 'solo'
  const defaultSubject = getParam('subject')
  const defaultGame    = (getParam('game') as GameType) || 'quiz'

  const [gameType, setGameType] = useState<GameType>(defaultGame)
  const [mode,     setMode]     = useState<Mode>(
    defaultGame === 'draw' ? 'group' :
    modeParam === 'group' ? 'group' : modeParam === 'join' ? 'join' : 'solo'
  )
  const [members,  setMembers]  = useState<Member[]>([{ name: '', age: '' }])
  const [subject,  setSubject]  = useState(defaultSubject)
  const [creating,     setCreating]     = useState(false)
  const [error,        setError]        = useState('')
  const [roomCode,     setRoomCode]     = useState('')
  const [joinError,    setJoinError]    = useState('')
  const [isPro,        setIsPro]        = useState(false)
  const [customTopic,  setCustomTopic]  = useState('')
  const [proLoading,   setProLoading]   = useState(false)

  // Check Pro status on mount
  useEffect(() => { setIsPro(isProUser()) }, [])

  const joinInputRef = useRef<HTMLInputElement>(null)

  // Load saved players — strip any where name is purely numeric (old bug)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kwizzo_family')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.members?.length) {
          const clean: Member[] = data.members.map((m: Member) => ({
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

  function addMember() { setMembers(prev => [...prev, { name: '', age: '' }]) }
  function removeMember(i: number) { setMembers(prev => prev.filter((_, idx) => idx !== i)) }
  function updateMember(i: number, field: keyof Member, val: string) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }

  function selectSubject(id: string) { setSubject(id); setError('') }

  async function handleStart() {
    setError('')
    if (gameType === 'quiz' && !subject) { setError('Pick a topic first.'); return }
    const valid = members.filter(m => m.name.trim() && m.age)
    if (!valid.length) { setError('Add at least one player with a name and age.'); return }
    if (valid.find(m => /^\d+$/.test(m.name.trim()))) {
      setError('Player name cannot be a number — enter a real name.'); return
    }
    if (gameType === 'draw' && valid.length < 2) {
      setError('Draw & Guess needs at least 2 players.'); return
    }
    setCreating(true)
    try {
      const code = String(Math.floor(1000 + Math.random() * 9000))
      localStorage.setItem('kwizzo_family', JSON.stringify({ members: valid }))
      localStorage.setItem(`kwizzo_room_${code}`, JSON.stringify({
        familyName: valid.map(m => m.name).join(' & '),
        members: valid, subject, code,
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="text-center pb-2">
          <div className="text-4xl mb-2">🧠</div>
          <h1 className="text-2xl font-black text-white mb-0.5">
            <span className={theme.gradientText}>Kwizzo</span>
          </h1>
          <p className="text-white/35 text-sm">AI games · any topic · any age</p>
        </div>

        {/* ── Game type ── */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { id: 'quiz' as const, icon: '🧠', label: 'Quiz',         sub: 'Answer AI questions',  badge: null },
            { id: 'draw' as const, icon: '🎨', label: 'Draw & Guess', sub: 'Draw it, guess it',    badge: '2+ players' },
          ]).map(g => (
            <button
              key={g.id}
              onClick={() => selectGameType(g.id)}
              className={`relative p-4 rounded-2xl text-left transition-all ${
                gameType === g.id
                  ? `bg-gradient-to-br ${theme.gradient} text-white shadow-lg`
                  : 'bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] text-white/80'
              }`}
            >
              <div className="text-2xl mb-2">{g.icon}</div>
              <div className="font-bold text-sm">{g.label}</div>
              <div className={`text-xs mt-0.5 ${gameType === g.id ? 'text-white/65' : 'text-white/30'}`}>{g.sub}</div>
              {g.badge && (
                <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  gameType === g.id ? 'bg-white/20 text-white/80' : 'bg-white/[0.08] text-white/30'
                }`}>{g.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Mode tabs ── */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
          {([
            { id: 'solo'  as const, label: 'Solo',          icon: <Zap size={13} />,   off: gameType === 'draw' },
            { id: 'group' as const, label: 'Play Together',  icon: <Users size={13} />, off: false },
            { id: 'join'  as const, label: 'Join Room',      icon: <span>🔑</span>,     off: false },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => !t.off && setMode(t.id)}
              disabled={t.off}
              className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                t.off  ? 'text-white/15 cursor-not-allowed' :
                mode === t.id ? `bg-gradient-to-r ${theme.gradient} text-white shadow` :
                'text-white/40 hover:text-white/70'
              }`}
            >
              {t.icon} <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.id === 'solo' ? 'Solo' : t.id === 'group' ? 'Group' : 'Join'}</span>
            </button>
          ))}
        </div>

        {/* ── Join room ── */}
        {mode === 'join' && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-white font-bold mb-1">Join a game</p>
            <p className="text-white/35 text-xs mb-4">Enter the 4-digit code from the host</p>
            <input
              ref={joinInputRef}
              className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl text-center text-3xl font-black tracking-[0.3em] text-white py-3 mb-3 outline-none focus:border-white/30 transition-colors"
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

        {/* ── Setup ── */}
        {isSetup && (
          <>
            {/* Topic grid — quiz only */}
            {gameType === 'quiz' && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Topic</p>
                  {subject && <span className="text-green-400 text-xs">✓ Selected</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => selectSubject(s.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                        subject === s.id
                          ? `bg-gradient-to-r ${theme.gradient} text-white shadow`
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/55 border border-white/[0.06]'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* Pro: custom topic input */}
                {isPro ? (
                  <div className="mt-3 pt-3 border-t border-white/[0.07]">
                    <p className="text-white/40 text-xs mb-2 flex items-center gap-1.5">
                      <Crown size={11} className="text-amber-400" /> Pro — type any topic
                    </p>
                    <input
                      className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/30 transition-colors"
                      placeholder="e.g. Ancient Egypt, Premier League, Taylor Swift…"
                      value={customTopic}
                      onChange={e => { setCustomTopic(e.target.value); if (e.target.value.trim()) { setSubject('custom:' + e.target.value.trim()); setError('') } else setSubject('') }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={async () => { setProLoading(true); try { await startCheckout() } catch { setProLoading(false) } }}
                    disabled={proLoading}
                    className="mt-3 w-full py-2 rounded-xl border border-amber-500/25 text-amber-400/70 hover:text-amber-400 hover:border-amber-500/50 transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Crown size={11} /> {proLoading ? 'Opening…' : 'Pro: type any topic — £3.99/mo'}
                  </button>
                )}
              </div>
            )}

            {/* Draw info */}
            {gameType === 'draw' && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎨</span>
                  <div>
                    <p className="text-white font-bold text-sm">Draw & Guess</p>
                    <p className="text-white/30 text-xs">2+ players · take turns drawing</p>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-white/40 mt-3">
                  {[
                    'AI picks a word tailored to each player\'s age',
                    'Drawer sees the word privately — draws on paper',
                    'Others type their guess — AI checks if it\'s close',
                    'Hint unlocks after 30s if no one guesses',
                  ].map((t, i) => <li key={i} className="flex gap-2"><span className="opacity-50">·</span>{t}</li>)}
                </ul>
              </div>
            )}

            {/* Players */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Who&apos;s playing?</p>
              <div className="space-y-2">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5">
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                      {m.name.trim() ? m.name.trim()[0].toUpperCase() : String(i + 1)}
                    </div>
                    {/* Name */}
                    <input
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 outline-none min-w-0"
                      placeholder={`Player ${i + 1} name`}
                      value={m.name}
                      autoComplete="off"
                      onChange={e => updateMember(i, 'name', e.target.value)}
                    />
                    {/* Separator */}
                    <div className="w-px h-4 bg-white/[0.10] shrink-0" />
                    {/* Age */}
                    <input
                      className="w-10 bg-transparent text-white/60 text-sm text-center font-semibold placeholder:text-white/20 outline-none shrink-0"
                      type="number"
                      placeholder="Age"
                      min="3" max="110"
                      inputMode="numeric"
                      value={m.age}
                      onChange={e => updateMember(i, 'age', e.target.value)}
                    />
                    <span className="text-white/20 text-xs shrink-0">yrs</span>
                    {members.length > 1 && (
                      <button onClick={() => removeMember(i)} className="text-white/15 hover:text-red-400 transition-colors shrink-0">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addMember}
                className="mt-2.5 w-full py-2.5 rounded-xl border border-dashed border-white/[0.12] text-white/35 hover:text-white/60 hover:border-white/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Plus size={13} /> Add player
              </button>
            </div>

            {/* Group hint */}
            {mode === 'group' && gameType !== 'draw' && (
              <p className="text-white/25 text-xs text-center px-4">
                💡 A room code will be generated — share it so others can join from their device
              </p>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                {error}
              </p>
            )}

            {/* ── Start button — inline, always visible ── */}
            <button
              onClick={handleStart}
              disabled={creating}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all bg-gradient-to-r ${theme.gradient} text-white shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50`}
            >
              {creating
                ? <><span className="inline-block animate-spin">⟳</span> Setting up…</>
                : gameType === 'draw'
                ? <><Pencil size={18} /> Start Drawing!</>
                : <>{mode === 'solo' ? 'Start Quiz' : 'Start Game'} <ArrowRight size={18} /></>
              }
            </button>

            {/* Quiet ad — shown on setup screen only, never during gameplay */}
            <AdUnit size="rectangle" className="my-2" />

            {/* bottom spacer so footer doesn't overlap */}
            <div className="h-4" />
          </>
        )}
      </div>
    </div>
  )
}

export default function PlayPage() {
  return <PlayContent />
}
