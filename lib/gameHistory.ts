// lib/gameHistory.ts — persistent game history + stats via localStorage
// Written at game end, read by dashboard. Works without any backend.

export interface GameResult {
  id:          string
  playedAt:    string            // ISO
  topic:       string
  familyName:  string
  players:     Array<{ name: string; score: number; total: number; age: number }>
  bestStreak:  number
  fastestSec:  number | null
  fastestBy:   string | null
  durationSec: number
}

const KEY    = 'kwizzo_history'
const MAX    = 50                // keep last 50 games

export function saveGameResult(result: Omit<GameResult, 'id' | 'playedAt'>): void {
  if (typeof window === 'undefined') return
  const history = loadHistory()
  const entry: GameResult = {
    ...result,
    id:       Math.random().toString(36).slice(2) + Date.now().toString(36),
    playedAt: new Date().toISOString(),
  }
  const updated = [entry, ...history].slice(0, MAX)
  try { localStorage.setItem(KEY, JSON.stringify(updated)) } catch {}
}

export function loadHistory(): GameResult[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

export interface DashboardStats {
  totalGames:     number
  totalQuestions: number
  avgScore:       number        // 0-100
  bestStreak:     number
  topTopics:      Array<{ topic: string; count: number }>
  recentGames:    GameResult[]
  currentStreak:  number        // days in a row with at least 1 game
}

export function computeStats(): DashboardStats {
  const history = loadHistory()

  if (history.length === 0) {
    return { totalGames: 0, totalQuestions: 0, avgScore: 0, bestStreak: 0, topTopics: [], recentGames: [], currentStreak: 0 }
  }

  let totalQ = 0, totalCorrect = 0, bestStreak = 0
  const topicCount: Record<string, number> = {}

  for (const g of history) {
    for (const p of g.players) {
      totalQ      += p.total
      totalCorrect += p.score
    }
    bestStreak = Math.max(bestStreak, g.bestStreak)
    topicCount[g.topic] = (topicCount[g.topic] ?? 0) + 1
  }

  const topTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }))

  // Daily streak — count consecutive days (from today backwards) with ≥1 game
  const daySet = new Set(history.map(g => g.playedAt.slice(0, 10)))
  let currentStreak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (daySet.has(key)) currentStreak++
    else break
  }

  return {
    totalGames:     history.length,
    totalQuestions: totalQ,
    avgScore:       totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
    bestStreak,
    topTopics,
    recentGames:    history.slice(0, 5),
    currentStreak,
  }
}
