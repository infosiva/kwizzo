import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Zap, Trophy } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { isAiTool } from '@/vertical.config'

const HOW_IT_WORKS = [
  { icon: '👨‍👩‍👧‍👦', step: '1', title: 'Register your family', desc: 'Add each player with their name and age. No sign-up or account needed — just dive in.' },
  { icon: '🎯', step: '2', title: 'Pick a topic', desc: 'Choose from 10 categories — science, sport, music, animals, movies and more.' },
  { icon: '🤖', step: '3', title: 'AI generates questions', desc: 'KwizBot creates age-perfect questions for every player instantly — kids get easy, adults get hard.' },
  { icon: '🏆', step: '4', title: 'Play live together', desc: 'Answer on your phone or tablet, watch the leaderboard fill up, and crown your family champion!' },
]

const SOCIAL_PROOF = [
  { name: 'The Patel Family', text: 'We played for 2 hours straight on holiday. Even grandad was glued to his phone answering questions!', rating: 5 },
  { name: 'Emma & Kids', text: 'The AI made questions perfectly hard for me but easy enough for my 7-year-old. Genius!', rating: 5 },
  { name: 'The Andersons', text: 'Finally a quiz where kids and adults are on the same level. Best family game night we\'ve had.', rating: 5 },
]

const FEATURES = [
  { icon: <Sparkles size={22} />, title: 'AI-generated every time', desc: 'Fresh questions every round — never the same quiz twice. Powered by the latest AI models.' },
  { icon: <Users size={22} />, title: 'Every age plays together', desc: 'KwizBot adapts question difficulty by age. Kids 5–12 get easy, teens get medium, adults get hard.' },
  { icon: <Zap size={22} />, title: 'No app download needed', desc: 'Works in any browser on phone, tablet or TV. Create a room and share the code — done.' },
  { icon: <Trophy size={22} />, title: 'Live leaderboard', desc: 'Scores update after every question. Watch the rankings shift and see who takes the crown!' },
]

export default function HomePage() {
  const subjects = isAiTool(config) ? config.subjects : []

  return (
    <div className="overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-28 max-w-6xl mx-auto text-center">
        {/* Decorative blob */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-3xl -z-10 bg-gradient-to-br ${theme.gradient}`} />

        <div className="fade-up">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-8`}>
            <Sparkles size={12} />
            AI Quiz Game — Free to Play
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-white">Family Quiz Night,</span>
            <br />
            <span className={theme.gradientText}>Powered by AI</span>
          </h1>

          <p className="text-white/55 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Pick a topic. AI creates age-perfect questions for every player — kids to grandparents.
            One room, everyone plays, everyone wins.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play" className={btn.primary + ' text-base px-10 py-4'}>
              Create a Room <ArrowRight size={18} />
            </Link>
            <Link href="/#how-it-works" className={btn.secondary + ' text-base px-10 py-4'}>
              How it works
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-6 mt-10 justify-center text-sm text-white/40">
            <span>✅ No sign-up needed</span>
            <span>✅ Works on any device</span>
            <span>✅ 100% free</span>
            <span>✅ Fresh AI questions every game</span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-8 glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '10',      l: 'Topic categories' },
            { n: 'All ages', l: 'Kids to grandparents' },
            { n: '10 Qs',   l: 'Per round, AI-fresh' },
            { n: '£0',      l: 'Free forever' },
          ].map(s => (
            <div key={s.l}>
              <div className={`text-2xl font-extrabold ${theme.gradientText}`}>{s.n}</div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS GRID ────────────────────────────────────── */}
      <section id="subjects" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Pick your quiz topic</h2>
          <p className="text-white/45">10 categories — AI generates fresh questions every time</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              href={`/play?subject=${subject.id}`}
              className={`${theme.card} ${theme.cardHover} ${theme.glowHover} p-5 flex flex-col gap-2 group text-center items-center`}
            >
              <span className="text-4xl mb-1">{subject.icon}</span>
              <span className="font-semibold text-white text-sm">{subject.label}</span>
              <span className="text-white/40 text-xs leading-snug">{subject.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How {config.name} works</h2>
            <p className="text-white/45">Game night ready in under 2 minutes</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {step.icon}
                </div>
                <div className={`text-xs font-bold ${theme.textAccent} mb-2 uppercase tracking-widest`}>Step {step.step}</div>
                <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why {config.name}?</h2>
          <p className="text-white/45">The quiz game built for the whole family</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className={`${theme.card} p-6 flex gap-4 items-start`}>
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${theme.solidLight} flex items-center justify-center ${theme.textAccent}`}>
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{f.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────── */}
      <section className="py-20 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Family game night just got smarter</h2>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {'★★★★★'} <span className="text-white/50 text-sm ml-2">Loved by families everywhere</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map((r, i) => (
              <div key={i} className={`${theme.card} p-6`}>
                <div className="stars text-sm mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="font-semibold text-white text-sm">{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className={`max-w-3xl mx-auto text-center glass rounded-3xl p-12 border ${theme.border} relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 rounded-3xl`} />
          <div className="text-5xl mb-6 relative">🧠</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 relative">
            Ready for quiz night?
          </h2>
          <p className="text-white/50 mb-8 text-lg relative">
            Free. No download. Works on every phone and TV. Start in 60 seconds.
          </p>
          <Link href="/play" className={btn.primary + ' text-base px-10 py-4 relative'}>
            Create a Room <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}
