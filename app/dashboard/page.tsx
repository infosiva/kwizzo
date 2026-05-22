'use client'
// app/dashboard/page.tsx — post-login dashboard
// Shows quiz history, stats, streak, top topics, quick-play CTA.
// All data from localStorage — no backend required.
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Zap, Target, TrendingUp, Play, Clock, ChevronRight, Flame } from 'lucide-react'
import { computeStats, loadHistory, type DashboardStats, type GameResult } from '@/lib/gameHistory'
import { getStoredUser, isLoggedIn } from '@/lib/shared/useMagicAuth'
import { isProUser } from '@/lib/pro'
import { theme, btn } from '@/lib/theme'
import { STAGGER_CONTAINER, FADE_UP, useMotionVariants } from '@/lib/motion'
import Navbar from '@/components/Navbar'

function StatCard({ icon, label, value, sub, accent = false }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: boolean
}) {
  const vars = useMotionVariants(FADE_UP)
  return (
    <motion.div
      variants={vars as Parameters<typeof motion.div>[0]['variants']}
      className={`rounded-2xl border p-5 flex flex-col gap-2 ${
        accent
          ? 'border-violet-500/40 bg-violet-500/[0.08]'
          : 'border-white/[0.07] bg-white/[0.03]'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-violet-500/20' : 'bg-white/[0.05]'}`}>
        {icon}
      </div>
      <div className={`text-2xl font-black ${accent ? 'text-violet-300' : 'text-white'}`}>{value}</div>
      <div className="text-white/50 text-xs font-medium">{label}</div>
      {sub && <div className="text-white/30 text-[10px]">{sub}</div>}
    </motion.div>
  )
}

function GameRow({ game }: { game: GameResult }) {
  const topPlayer  = game.players.sort((a, b) => b.score - a.score)[0]
  const totalQ     = game.players.reduce((s, p) => s + p.total, 0)
  const totalRight = game.players.reduce((s, p) => s + p.score, 0)
  const pct        = totalQ > 0 ? Math.round((totalRight / totalQ) * 100) : 0
  const ago        = (() => {
    const diff = Date.now() - new Date(game.playedAt).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1)  return 'Just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  })()

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-base shrink-0">
        🏆
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-semibold truncate capitalize">{game.topic.replace(/-/g, ' ')}</div>
        <div className="text-white/40 text-xs">{game.familyName} · {game.players.length} player{game.players.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="text-right shrink-0">
        <div className={`text-sm font-black ${pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-yellow-400' : 'text-white/50'}`}>{pct}%</div>
        <div className="text-white/30 text-[10px]">{ago}</div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-5xl mb-4">🎯</div>
      <h2 className="text-white font-black text-xl mb-2">No games yet</h2>
      <p className="text-white/40 text-sm mb-8 max-w-xs">Play your first quiz and your stats, history, and streaks will appear here.</p>
      <Link href="/play" className={btn.primary + ' px-8 py-4 font-bold text-base'}>
        ⚡ Play your first quiz →
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats,    setStats]    = useState<DashboardStats | null>(null)
  const [user,     setUser]     = useState<{ username: string } | null>(null)
  const [isPro,    setIsPro]    = useState(false)
  const [mounted,  setMounted]  = useState(false)

  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.07))

  useEffect(() => {
    setMounted(true)
    // Redirect to home if not logged in (soft gate — dashboard still works without auth)
    const u = getStoredUser()
    setUser(u)
    setIsPro(isProUser())
    setStats(computeStats())
  }, [])

  if (!mounted || !stats) return null

  const hasGames = stats.totalGames > 0

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              {stats.currentStreak > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                  <Flame size={11} /> {stats.currentStreak} day streak
                </span>
              )}
              {isPro && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}>
                  PRO
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {user ? `Hey ${user.username} 👋` : 'Your Dashboard'}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {hasGames
                ? `${stats.totalGames} game${stats.totalGames !== 1 ? 's' : ''} played · ${stats.totalQuestions} questions answered`
                : 'Start playing to build your stats'
              }
            </p>
          </div>

          <Link href="/play" className={btn.primary + ' flex items-center gap-2 px-5 py-3 text-sm font-bold shrink-0'}>
            <Play size={14} /> Play Now
          </Link>
        </motion.div>

        {!hasGames ? <EmptyState /> : (
          <>
            {/* Stats grid */}
            <motion.div
              variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            >
              <StatCard
                icon={<Trophy size={18} className="text-yellow-400" />}
                label="Games played"
                value={stats.totalGames}
                accent
              />
              <StatCard
                icon={<Target size={18} className="text-green-400" />}
                label="Avg score"
                value={`${stats.avgScore}%`}
                sub={stats.totalQuestions + ' questions'}
              />
              <StatCard
                icon={<Flame size={18} className="text-orange-400" />}
                label="Best streak"
                value={`🔥 ${stats.bestStreak}`}
                sub="correct in a row"
              />
              <StatCard
                icon={<Zap size={18} className="text-violet-400" />}
                label="Day streak"
                value={stats.currentStreak}
                sub="days in a row"
              />
            </motion.div>

            {/* Recent games + Top topics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Recent games — 2/3 width */}
              <motion.div
                variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
                initial="hidden"
                animate="show"
                className="md:col-span-2 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50">Recent Games</h2>
                  <Link href="/history" className="text-violet-400 text-xs font-bold hover:text-violet-300 flex items-center gap-1">
                    All <ChevronRight size={12} />
                  </Link>
                </div>
                {stats.recentGames.map(g => <GameRow key={g.id} game={g} />)}
              </motion.div>

              {/* Top topics — 1/3 width */}
              <motion.div
                variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3"
              >
                <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50 mb-1">Top Topics</h2>
                {stats.topTopics.length === 0 ? (
                  <p className="text-white/30 text-xs">Play more games to see your favourite topics.</p>
                ) : stats.topTopics.map((t, i) => (
                  <Link
                    key={t.topic}
                    href={`/play?subject=${encodeURIComponent(t.topic)}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                  >
                    <span className="text-white/30 text-xs font-black w-4 tabular-nums">{i + 1}</span>
                    <span className="text-white/70 text-sm capitalize flex-1 truncate group-hover:text-white transition-colors">
                      {t.topic.replace(/-/g, ' ')}
                    </span>
                    <span className="text-white/30 text-xs shrink-0">{t.count}×</span>
                  </Link>
                ))}

                {/* Quick-play suggestions */}
                <div className="mt-4">
                  <h2 className="text-white font-bold text-sm uppercase tracking-widest opacity-50 mb-3">Play Again</h2>
                  {['Science', 'History', 'Sport'].map(topic => (
                    <Link
                      key={topic}
                      href={`/play?subject=${topic.toLowerCase()}`}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.05] hover:border-violet-500/30 bg-white/[0.02] hover:bg-violet-500/[0.06] transition-all group mb-2"
                    >
                      <Zap size={13} className="text-violet-400" />
                      <span className="text-white/60 text-sm group-hover:text-white transition-colors">{topic}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Upgrade CTA for free users */}
            {!isPro && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 rounded-2xl border border-violet-500/30 bg-violet-500/[0.06] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="text-white font-bold mb-1">Unlock unlimited games with Pro</div>
                  <div className="text-white/50 text-sm">Remove limits, all 100+ categories, custom quiz topics, no ads.</div>
                </div>
                <Link href="/pro" className={`shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm hover:opacity-90 transition-opacity`}>
                  Upgrade to Pro →
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
