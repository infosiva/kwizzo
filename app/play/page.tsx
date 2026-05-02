'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, ArrowRight, Users, Zap } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { Suspense } from 'react'

type Member = { name: string; age: string }

const SUBJECTS = isAiTool(config) ? config.subjects : []

function PlayContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const modeParam    = searchParams.get('mode') ?? 'solo'   // 'solo' | 'create' | 'join'
  const defaultSubject = searchParams.get('subject') ?? ''

  const [mode,       setMode]       = useState<'solo' | 'create' | 'join'>(
    modeParam === 'create' ? 'create' : modeParam === 'join' ? 'join' : 'solo'
  )
  const [members,    setMembers]    = useState<Member[]>([{ name: '', age: '' }])
  const [subject,    setSubject]    = useState(defaultSubject)
  const [creating,   setCreating]   = useState(false)
  const [error,      setError]      = useState('')
  const [roomCode,   setRoomCode]   = useState('')
  const [joinError,  setJoinError]  = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kwizzo_family')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.members?.length) setMembers(data.members)
      }
    } catch { /* ignore */ }
  }, [])

  function addMember() { setMembers(prev => [...prev, { name: '', age: '' }]) }
  function removeMember(i: number) { setMembers(prev => prev.filter((_, idx) => idx !== i)) }
  function updateMember(i: number, field: keyof Member, value: string) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  function generateRoomCode() { return String(Math.floor(1000 + Math.random() * 9000)) }

  async function handleStart() {
    setError('')
    if (!subject) { setError('Pick a topic first.'); return }
    const validMembers = members.filter(m => m.name.trim() && m.age)
    if (validMembers.length < 1) { setError('Add at least one player with name and age.'); return }

    setCreating(true)
    try {
      const code = mode === 'create' ? generateRoomCode() : generateRoomCode()
      localStorage.setItem('kwizzo_family', JSON.stringify({ members: validMembers }))
      localStorage.setItem(`kwizzo_room_${code}`, JSON.stringify({
        familyName: validMembers.map(m => m.name).join(' & '),
        members: validMembers,
        subject,
        code,
      }))
      router.push(`/quiz/${code}?subject=${subject}`)
    } catch {
      setError('Something went wrong. Try again.')
      setCreating(false)
    }
  }

  function handleJoin() {
    setJoinError('')
    const code = roomCode.trim()
    if (!/^\d{4}$/.test(code)) { setJoinError('Enter a valid 4-digit room code.'); return }
    router.push(`/quiz/${code}`)
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8 fade-up">
        <div className="text-4xl mb-3">🧠</div>
        <h1 className="text-2xl font-extrabold text-white mb-1">
          <span className={theme.gradientText}>Kwizzo</span>
        </h1>
        <p className="text-white/40 text-sm">AI quiz — any topic, any age</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl glass mb-6">
        {([
          { id: 'solo',   label: 'Play Solo',    icon: <Zap size={14} /> },
          { id: 'create', label: 'With Others',  icon: <Users size={14} /> },
          { id: 'join',   label: 'Join a Room',  icon: '🔑' },
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
            className="input-dark text-center text-3xl font-bold tracking-widest mb-4"
            placeholder="0000"
            maxLength={4}
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          {joinError && <p className="text-red-400 text-xs mb-3">{joinError}</p>}
          <button onClick={handleJoin} className={btn.primary + ' w-full justify-center py-3'}>
            Join Room <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Solo or Multiplayer setup */}
      {(mode === 'solo' || mode === 'create') && (
        <div className={`${theme.card} p-6 fade-up rounded-2xl space-y-5`}>

          {/* Topic */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">Topic</label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`p-3 rounded-xl text-left flex items-center gap-2 text-sm transition-all ${
                    subject === s.id
                      ? `bg-gradient-to-r ${theme.gradient} text-white font-semibold shadow`
                      : `${theme.card} ${theme.cardHover} text-white/60`
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Players */}
          <div>
            <label className="block text-white/50 text-xs font-semibold mb-1 uppercase tracking-wider">
              {mode === 'solo' ? 'Players' : 'Players'}
            </label>
            <p className="text-white/30 text-xs mb-3">
              {mode === 'solo'
                ? 'Add yourself — or the whole family if playing together on one device'
                : 'Add everyone who will play (each gets their own age-adapted questions)'}
            </p>
            <div className="space-y-2.5">
              {members.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className="input-dark flex-1 py-2.5 text-sm"
                    placeholder={i === 0 ? 'Your name' : `Player ${i + 1}`}
                    value={m.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                  />
                  <input
                    className="input-dark w-16 py-2.5 text-sm text-center"
                    type="number"
                    placeholder="Age"
                    min="3"
                    max="110"
                    value={m.age}
                    onChange={e => updateMember(i, 'age', e.target.value)}
                  />
                  {members.length > 1 && (
                    <button onClick={() => removeMember(i)} className="text-white/25 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addMember}
              className={`mt-3 flex items-center gap-1.5 text-xs ${theme.textAccent} hover:opacity-70 transition-opacity`}
            >
              <Plus size={14} /> Add player
            </button>
          </div>

          {/* Room code note for multiplayer */}
          {mode === 'create' && (
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-xs text-white/40">
              💡 A room code will be generated — share it so remote players can join on their own device
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleStart}
            disabled={creating}
            className={btn.primary + ' w-full justify-center py-3.5 text-base'}
          >
            {creating ? 'Setting up…' : <>{mode === 'solo' ? 'Start Quiz' : 'Start Game'} <ArrowRight size={16} /></>}
          </button>
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
