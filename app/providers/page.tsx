import Link from 'next/link'
import { CheckCircle, DollarSign, Star, TrendingUp, ArrowRight } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'

const BENEFITS = [
  { icon: <DollarSign size={22} />,   title: 'Keep 88% of every booking',  desc: `We only take ${config.platformFeePercent}% — one of the lowest rates in the industry. No monthly fees, no setup costs.` },
  { icon: <Star size={22} />,         title: 'Portable verified reviews',   desc: 'Your reviews follow you. If you ever leave, you take them with you. Your reputation is yours.' },
  { icon: <TrendingUp size={22} />,   title: 'AI-powered profile boosting', desc: 'Our AI surfaces your profile to the right clients at the right time. No manual bidding.' },
  { icon: <CheckCircle size={22} />,  title: 'Instant payment protection',  desc: 'Stripe-powered escrow. Get paid within 24 hours of job completion. No chasing invoices.' },
]

const STEPS = [
  { n: '1', title: 'Create your profile', desc: 'Add your experience, certifications, and a short video intro. Takes about 15 minutes.' },
  { n: '2', title: 'Pass background check', desc: 'We run a DBS / background check. Most complete in 48 hours.' },
  { n: '3', title: 'Start receiving bookings', desc: 'Our AI matches you with the right clients automatically. You approve each booking.' },
]

export default function ProvidersPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="px-6 pt-20 pb-24 max-w-5xl mx-auto text-center relative">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-3xl -z-10 bg-gradient-to-br ${theme.gradient}`} />

        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-6`}>
          Now accepting new {config.providerPlural.toLowerCase()}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          Grow your {config.providerLabel.toLowerCase()} business<br/>
          <span className={theme.gradientText}>on your terms</span>
        </h1>
        <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Join {config.name} and get matched with clients who need exactly what you offer.
          Keep more of what you earn. Own your reviews. Build your reputation.
        </p>
        <Link href="/join" className={btn.primary + ' text-base px-10 py-4'}>
          Apply to join <ArrowRight size={18} />
        </Link>
        <p className="text-white/30 text-xs mt-3">Free to apply · No monthly fees · Start earning in 48 hours</p>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Why join {config.name}?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className={`${theme.card} p-6 flex gap-4 items-start`}>
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${theme.solidLight} flex items-center justify-center ${theme.textAccent}`}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{b.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-12">Getting started</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {STEPS.map(s => (
            <div key={s.n}>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                {s.n}
              </div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/join" className={btn.primary + ' text-base px-10 py-4'}>
            Apply now — it&apos;s free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
