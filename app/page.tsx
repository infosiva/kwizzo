import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Users, Star } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { isAiTool } from '@/vertical.config'

const FEATURES = [
  { icon: '🎲', title: 'Never the same quiz twice', desc: 'AI generates fresh questions every round — even on the same topic.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Any age plays together', desc: 'Kids get easy questions, adults get hard — one game, everyone wins.' },
  { icon: '⚡', title: 'Ready in 30 seconds', desc: 'No downloads, no accounts. Pick a topic and start immediately.' },
  { icon: '🏆', title: 'Live leaderboard', desc: 'Rankings update after every question. Watch the drama unfold.' },
]

const STATS = [
  { n: '10k+', l: 'Games played' },
  { n: '50+',  l: 'Topics' },
  { n: '< 30s', l: 'To start' },
  { n: '100%',  l: 'Free' },
]

export default function HomePage() {
  const subjects = isAiTool(config) ? config.subjects : []

  return (
    <div className="overflow-hidden">

      {/* ── HERO — arcade/game scoreboard style ─────────────── */}
      <section className="relative px-4 sm:px-6 pt-8 sm:pt-14 pb-10 sm:pb-16 max-w-5xl mx-auto">
        {/* Subtle neon grid overlay */}
        <div className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-20 blur-3xl -z-10 bg-gradient-to-br ${theme.gradient}`} />

        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badge} text-xs font-bold mb-6 border border-violet-500/30 uppercase tracking-widest`}>
            <Sparkles size={10} /> AI-powered · Free · No sign-up
          </div>

          {/* Stacked uppercase block headline — arcade game feel */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-5">
            <span className="text-white block">QUIZ</span>
            <span className={`${theme.gradientText} block`}>ANYONE,</span>
            <span className="text-white block">ANY AGE.</span>
          </h1>

          <p className="text-white/50 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            AI creates age-perfect questions for every player. Trusted by 10,000+ players. 100% free, no sign-up required. Pick a topic, add names, and let the battle begin.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href="/play?mode=solo" className={btn.primary + ' text-base px-8 py-4 font-black tracking-wide'}>
              Start Your Quiz Adventure <ArrowRight size={18} />
            </Link>
            <Link href="/play?mode=group" className={btn.secondary + ' text-base px-8 py-4 font-black tracking-wide'}>
              <Users size={16} /> MULTIPLAYER
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {['✓ No sign-up', '✓ Any device', '✓ 100% free', '✓ Fresh AI questions every game'].map(f => (
              <span key={f} className="text-xs text-violet-300/70 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-0.5 text-xs opacity-50 mt-3">
            <span>✓ 3 free rounds — no account needed</span>
            <span>✓ Register free for unlimited access</span>
            <span>✓ No credit card ever</span>
          </div>
        </div>

        {/* Fake leaderboard — decorative social proof */}
        <div className="hidden md:flex justify-center gap-3 mt-10">
          {[
            { name: 'Dad', score: 420, emoji: '🥇' },
            { name: 'Maya', score: 380, emoji: '🥈' },
            { name: 'Tom', score: 290, emoji: '🥉' },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-sm">
              <span className="text-xl">{p.emoji}</span>
              <div>
                <div className="text-white font-bold text-sm">{p.name}</div>
                <div className={`text-xs font-black ${theme.textAccent}`}>{p.score} pts</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-6 glass">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.l}>
              <div className={`text-2xl sm:text-3xl font-black ${theme.gradientText}`}>{s.n}</div>
              <div className="text-white/40 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOPIC GRID ──────────────────────────────────────── */}
      <section id="subjects" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${theme.textAccent} mb-3`}>
            <Zap size={12} /> Pick your topic
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Choose your arena</h2>
          <p className="text-white/40 text-sm mt-2">Fresh AI questions every game — never the same twice</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              href={`/play?mode=solo&subject=${subject.id}`}
              className={`group ${theme.card} ${theme.cardHover} p-4 flex flex-col gap-2 text-center items-center rounded-2xl transition-all border border-white/[0.08] hover:border-violet-500/40 hover:scale-105`}
            >
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{subject.icon}</span>
              <span className="font-bold text-white text-xs">{subject.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY KWIZZO ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 glass border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${theme.textAccent} mb-3`}>
              <Star size={12} /> Why Kwizzo
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Built for the whole family</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl`}
                  style={{ background: 'rgba(139,92,246,0.15)' }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Start in 4 steps</h2>
          <p className="text-white/40 text-sm">Playing in under a minute, guaranteed</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🎯', step: '01', title: 'Pick a topic', desc: 'Choose from 50+ categories.' },
            { icon: '👤', step: '02', title: 'Add players', desc: 'Solo or up to 6 — names & ages.' },
            { icon: '🤖', step: '03', title: 'AI generates', desc: 'Age-perfect questions instantly.' },
            { icon: '🏆', step: '04', title: 'Play & win', desc: 'Answer, score, leaderboard.' },
          ].map(step => (
            <div key={step.step} className="text-center group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 border border-white/10 group-hover:scale-110 transition-transform`}
                style={{ background: 'rgba(139,92,246,0.12)' }}>
                {step.icon}
              </div>
              <div className={`text-[11px] font-black ${theme.textAccent} mb-1 uppercase tracking-widest`}>{step.step}</div>
              <h3 className="font-bold text-white text-sm mb-1">{step.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ──────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 glass border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🎮</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to play?</h2>
          <p className="text-white/45 mb-6 text-sm">No account needed. Start a game in 30 seconds.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/play?mode=solo"  className={btn.primary  + ' text-base px-10 py-4 font-black'}>Play Solo ⚡</Link>
            <Link href="/play?mode=group" className={btn.secondary + ' text-base px-10 py-4 font-black'}>Play with Family 👨‍👩‍👧‍👦</Link>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-xs opacity-50 mt-3">
            <span>✓ 3 free rounds — no account needed</span>
            <span>✓ Register free for unlimited access</span>
            <span>✓ No credit card ever</span>
          </div>
        </div>
      </section>


    </div>
  )
}
