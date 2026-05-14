'use client'
import { useState, useEffect } from 'react'

// ── Streak engine ─────────────────────────────────────────────────────────────
export function useStreak(key = 'kwizzo-streak') {
  const [data, setData] = useState({ streak: 0, freezes: 1, lastDate: '', todayDone: false })

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key) ?? '{}')
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      let streak = raw.streak ?? 0
      let freezes = raw.freezes ?? 1
      const todayDone = raw.lastDate === today

      // Streak broken — check if freeze available
      if (raw.lastDate && raw.lastDate !== today && raw.lastDate !== yesterday) {
        if (freezes > 0 && raw.lastDate >= new Date(Date.now() - 172800000).toISOString().split('T')[0]) {
          // Use freeze automatically if gap is only 2 days
          freezes = Math.max(0, freezes - 1)
        } else {
          streak = 0
        }
      }
      setData({ streak, freezes, lastDate: raw.lastDate ?? '', todayDone })
    } catch {}
  }, [key])

  const completeToday = () => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    setData(prev => {
      if (prev.todayDone) return prev
      const newStreak = (prev.lastDate === yesterday || prev.lastDate === today) ? prev.streak + 1 : 1
      const next = { ...prev, streak: newStreak, lastDate: today, todayDone: true }
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  const addFreeze = () => {
    setData(prev => {
      const next = { ...prev, freezes: prev.freezes + 1 }
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  return { ...data, completeToday, addFreeze }
}

// ── Milestone badges ──────────────────────────────────────────────────────────
const BADGES = [
  { streak: 1,   icon: '🌱', label: 'First Day',    color: 'bg-green-100 text-green-700 border-green-200' },
  { streak: 3,   icon: '🔥', label: '3-Day Fire',   color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { streak: 7,   icon: '⚡', label: 'Week Warrior', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { streak: 14,  icon: '🏆', label: '2-Week Champ', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { streak: 30,  icon: '💎', label: 'Month Master', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { streak: 100, icon: '👑', label: 'Legend',       color: 'bg-amber-100 text-amber-700 border-amber-200' },
]

export function getEarnedBadges(streak: number) {
  return BADGES.filter(b => streak >= b.streak)
}

export function getNextBadge(streak: number) {
  return BADGES.find(b => b.streak > streak) ?? null
}

// ── StreakBar component ───────────────────────────────────────────────────────
export function StreakBar({ streakKey }: { streakKey?: string }) {
  const { streak, freezes, todayDone, completeToday, addFreeze } = useStreak(streakKey)
  const earned = getEarnedBadges(streak)
  const next = getNextBadge(streak)
  const [showBadges, setShowBadges] = useState(false)
  const [justEarned, setJustEarned] = useState<typeof BADGES[0] | null>(null)

  const latestBadge = earned[earned.length - 1]

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Streak count */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">{streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '🌱'}</div>
          <div>
            <div className="text-2xl font-black text-white leading-none">{streak} day streak</div>
            <div className="text-xs text-white/40 mt-0.5">
              {todayDone ? '✅ Done today' : '⏳ Not done yet today'}
            </div>
          </div>
        </div>

        {/* Right: freeze + badge */}
        <div className="flex items-center gap-2">
          {/* Streak freeze */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            🧊 {freezes} freeze{freezes !== 1 ? 's' : ''}
          </div>

          {/* Latest badge */}
          {latestBadge && (
            <button onClick={() => setShowBadges(!showBadges)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${latestBadge.color}`}>
              {latestBadge.icon} {latestBadge.label}
            </button>
          )}
        </div>
      </div>

      {/* Progress to next badge */}
      {next && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>Next: {next.icon} {next.label}</span>
            <span>{streak}/{next.streak} days</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (streak / next.streak) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Badge collection */}
      {showBadges && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Your badges</div>
          <div className="flex flex-wrap gap-2">
            {BADGES.map(b => (
              <div key={b.streak}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${streak >= b.streak ? b.color : 'bg-white/5 text-white/20 border-white/10 grayscale'}`}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
