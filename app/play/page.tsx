'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, ArrowRight, Users, Hash } from 'lucide-react'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { Suspense } from 'react'

type Member = { name: string; age: string }
type FamilyData = { familyName: string; members: Member[] }

const SUBJECTS = isAiTool(config) ? config.subjects : []

function PlayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultSubject = searchParams.get('subject') ?? ''

  const [mode, setMode] = useState<'create' | 'join'>('create')

  // Create room state
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState<Member[]>([{ name: '', age: '' }])
  const [subject, setSubject] = useState(defaultSubject)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  // Join room state
  const [roomCode, setRoomCode] = useState('')
  const [joinError, setJoinError] = useState('')

  // Load saved family from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kwizzo_family')
      if (saved) {
        const data: FamilyData = JSON.parse(saved)
        if (data.familyName) setFamilyName(data.familyName)
        if (data.members?.length) setMembers(data.members)
      }
    } catch { /* ignore */ }
  }, [])

  function addMember() {
    setMembers(prev => [...prev, { name: '', age: '' }])
  }

  function removeMember(i: number) {
    setMembers(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateMember(i: number, field: keyof Member, value: string) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  function generateRoomCode() {
    return String(Math.floor(1000 + Math.random() * 9000))
  }

  async function handleCreate() {
    setError('')
    if (!familyName.trim()) { setError('Please enter your family name.'); return }
    if (!subject) { setError('Please pick a quiz topic.'); return }
    const validMembers = members.filter(m => m.name.trim() && m.age)
    if (validMembers.length < 1) { setError('Please add at least one player with name and age.'); return }

    setCreating(true)
    try {
      const code = generateRoomCode()
      const familyData: FamilyData = { familyName: familyName.trim(), members: validMembers }

      // Save family to localStorage for reuse
      localStorage.setItem('kwizzo_family', JSON.stringify(familyData))
      // Save game session data
      localStorage.setItem(`kwizzo_room_${code}`, JSON.stringify({ ...familyData, subject, code }))

      router.push(`/quiz/${code}?subject=${subject}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setCreating(false)
    }
  }

  function handleJoin() {
    setJoinError('')
    const code = roomCode.trim()
    if (!/^\d{4}$/.test(code)) { setJoinError('Please enter a valid 4-digit room code.'); return }
    router.push(`/quiz/${code}`)
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <div className="text-center mb-10 fade-up">
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          <span className={theme.gradientText}>Kwizzo</span> Game Hub
        </h1>
        <p className="text-white/50">Create a family room or join an existing game</p>
      </div>

      {/* Mode tabs */}
      <div className={`flex gap-2 p-1 rounded-2xl glass mb-8`}>
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            mode === 'create'
              ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Users size={16} className="inline mr-2" />
          Create a Room
        </button>
        <button
          onClick={() => setMode('join')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            mode === 'join'
              ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Hash size={16} className="inline mr-2" />
          Join a Room
        </button>
      </div>

      {/* Create Room */}
      {mode === 'create' && (
        <div className={`${theme.card} p-6 md:p-8 fade-up`}>
          <h2 className="text-xl font-bold text-white mb-6">Set up your game</h2>

          {/* Family name */}
          <div className="mb-5">
            <label className="block text-white/60 text-sm font-medium mb-2">Family name</label>
            <input
              className="input-dark"
              placeholder="e.g. The Smiths"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
            />
          </div>

          {/* Players */}
          <div className="mb-5">
            <label className="block text-white/60 text-sm font-medium mb-3">
              Players <span className="text-white/30 font-normal">(name + age for age-perfect questions)</span>
            </label>
            <div className="space-y-3">
              {members.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className="input-dark flex-1"
                    placeholder={`Player ${i + 1} name`}
                    value={m.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                  />
                  <input
                    className="input-dark w-20"
                    type="number"
                    placeholder="Age"
                    min="3"
                    max="110"
                    value={m.age}
                    onChange={e => updateMember(i, 'age', e.target.value)}
                  />
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(i)}
                      className="text-white/30 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addMember}
              className={`mt-3 flex items-center gap-2 text-sm ${theme.textAccent} hover:opacity-80 transition-opacity`}
            >
              <Plus size={16} /> Add player
            </button>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-white/60 text-sm font-medium mb-3">Quiz topic</label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-2 text-sm ${
                    subject === s.id
                      ? `bg-gradient-to-r ${theme.gradient} text-white font-semibold shadow-lg`
                      : `${theme.card} ${theme.cardHover} text-white/70`
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={creating}
            className={btn.primary + ' w-full justify-center py-4 text-base'}
          >
            {creating ? 'Setting up your room…' : <>Start Game <ArrowRight size={18} /></>}
          </button>
        </div>
      )}

      {/* Join Room */}
      {mode === 'join' && (
        <div className={`${theme.card} p-6 md:p-8 fade-up`}>
          <h2 className="text-xl font-bold text-white mb-2">Join a game</h2>
          <p className="text-white/45 text-sm mb-6">Enter the 4-digit room code from the host</p>

          <div className="mb-6">
            <input
              className="input-dark text-center text-3xl font-bold tracking-widest"
              placeholder="0000"
              maxLength={4}
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
          </div>

          {joinError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {joinError}
            </div>
          )}

          <button
            onClick={handleJoin}
            className={btn.primary + ' w-full justify-center py-4 text-base'}
          >
            Join Room <ArrowRight size={18} />
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
        <div className="text-white/50">Loading…</div>
      </div>
    }>
      <PlayContent />
    </Suspense>
  )
}
