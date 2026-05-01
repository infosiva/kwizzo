import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap, Users, CheckCircle, ChevronRight } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import HeroChatPreview from '@/components/HeroChatPreview'

const SOCIAL_PROOF = [
  { name: 'Sarah M.', role: 'Used last week', text: `Found the perfect ${config.providerLabel.toLowerCase()} within 20 minutes. The AI understood exactly what I needed.`, rating: 5 },
  { name: 'James T.', role: 'Regular user', text: `${config.name} has transformed how I find trusted professionals. No more scrolling through endless profiles.`, rating: 5 },
  { name: 'Priya K.', role: 'Verified family', text: 'The background checks and reviews gave us real peace of mind. Would recommend to anyone.', rating: 5 },
]

const HOW_IT_WORKS = [
  { icon: '💬', step: '1', title: 'Chat with our AI', desc: `Tell our AI assistant what you need. No forms — just a natural conversation.` },
  { icon: '✨', step: '2', title: 'Get matched', desc: `AI shortlists the best ${config.providerPlural.toLowerCase()} based on your specific requirements.` },
  { icon: '📅', step: '3', title: 'Book instantly', desc: `Review profiles, check availability, and confirm — all in one place.` },
]

export default function HomePage() {
  const cats = config.categories.slice(0, 6)

  return (
    <div className="overflow-hidden">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-28 max-w-6xl mx-auto">
        {/* Decorative blob */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-20 blur-3xl -z-10 bg-gradient-to-br ${theme.gradient}`} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left fade-up">
            {/* Trust badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-6`}>
              <Zap size={12} />
              AI-Powered Matching — Free to Use
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="text-white">{config.tagline.split('—')[0]}</span>
              {config.tagline.includes('—') && (
                <><br /><span className={theme.gradientText}>— {config.tagline.split('—')[1].trim()}</span></>
              )}
            </h1>

            <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Describe what you need in plain English. Our AI finds the best verified {config.providerPlural.toLowerCase()},
              checks availability in real time, and helps you book in minutes — not days.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/chat" className={btn.primary + ' text-base px-8 py-4'}>
                Find my {config.providerLabel} <ArrowRight size={18} />
              </Link>
              <Link href="/providers" className={btn.secondary + ' text-base px-8 py-4'}>
                I&apos;m a {config.providerLabel}
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-5 mt-8 justify-center lg:justify-start text-sm text-white/45">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} />Background checked</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} />Real verified reviews</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} />No hidden fees</span>
            </div>
          </div>

          {/* Right: AI chat preview */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <HeroChatPreview />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-8 glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '2,400+', l: `Verified ${config.providerPlural}` },
            { n: '98%',    l: 'Satisfaction rate' },
            { n: '< 5min', l: 'Avg match time' },
            { n: '£0',     l: 'To browse & match' },
          ].map(s => (
            <div key={s.l}>
              <div className={`text-2xl font-extrabold ${theme.gradientText}`}>{s.n}</div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">What do you need help with?</h2>
          <p className="text-white/45">Browse by category or let our AI guide you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map(cat => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.id}`}
              className={`${theme.card} ${theme.cardHover} ${theme.glowHover} p-5 flex flex-col gap-2 group`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold text-white group-hover:${theme.textAccentBold} transition-colors">{cat.label}</span>
              <span className="text-white/45 text-xs leading-snug">{cat.desc}</span>
            </Link>
          ))}
          <Link
            href="/search"
            className={`${theme.card} ${theme.cardHover} p-5 flex flex-col gap-2 items-center justify-center group`}
          >
            <ChevronRight size={28} className={`${theme.textAccent} group-hover:translate-x-1 transition-transform`} />
            <span className="font-semibold text-white/60 text-sm">All categories</span>
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-20 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How {config.name} works</h2>
            <p className="text-white/45">From search to booked in under 5 minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {step.icon}
                </div>
                <div className={`text-xs font-bold ${theme.textAccent} mb-2 uppercase tracking-widest`}>Step {step.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Trusted by real families</h2>
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {'★★★★★'} <span className="text-white/50 text-sm ml-2">4.9 average from 1,200+ reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SOCIAL_PROOF.map((r, i) => (
            <div key={i} className={`${theme.card} p-6`}>
              <div className="stars text-sm mb-3">{'★'.repeat(r.rating)}</div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
              <div>
                <div className="font-semibold text-white text-sm">{r.name}</div>
                <div className="text-white/40 text-xs">{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST FEATURES ──────────────────────────────────── */}
      <section className="py-20 px-6 glass border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why {config.name}?</h2>
            <p className="text-white/45">We built what {config.name.slice(0,4)} was missing</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={22} />, title: 'Background checks', desc: 'Every provider is DBS/background checked before they can take bookings.' },
              { icon: <Star size={22} />,   title: 'Portable reviews',  desc: `${config.providerPlural} own their reviews — they follow them everywhere, preventing gaming.` },
              { icon: <Zap size={22} />,    title: 'AI matching',       desc: 'Describe your situation in plain English. No tick boxes, no wasted calls.' },
              { icon: <Users size={22} />,  title: 'Same-provider continuity', desc: 'Families can re-book the same trusted provider effortlessly.' },
              { icon: <CheckCircle size={22} />, title: 'Transparent pricing', desc: 'Full quote upfront. No surprise call-out fees or hidden extras.' },
              { icon: <ArrowRight size={22} />, title: '5-min booking',  desc: 'Go from search to confirmed booking without leaving the app.' },
            ].map(f => (
              <div key={f.title} className={`${theme.card} p-5 flex gap-4 items-start`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${theme.solidLight} flex items-center justify-center ${theme.textAccent}`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{f.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className={`max-w-3xl mx-auto text-center glass rounded-3xl p-12 border ${theme.border} relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 rounded-3xl`} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 relative">
            Ready to find your perfect {config.providerLabel.toLowerCase()}?
          </h2>
          <p className="text-white/50 mb-8 text-lg relative">Free to match. No card required. Takes 2 minutes.</p>
          <Link href="/chat" className={btn.primary + ' text-base px-10 py-4 relative'}>
            Get matched now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}
