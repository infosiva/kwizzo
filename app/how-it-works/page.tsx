import Link from 'next/link'
import { ArrowRight, MessageCircle, Sparkles, Calendar, CreditCard, Star } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'

const STEPS = [
  {
    icon: <MessageCircle size={28} />,
    title: 'Tell our AI what you need',
    desc: `Open a chat and describe your situation in plain English. No forms to fill in, no tick-boxes. Just tell us about yourself, what you're looking for, and any preferences.`,
    detail: `"I need a carer for my 82-year-old father who has Parkinson's. He likes routine, is a bit stubborn, and would prefer a male carer who speaks clearly."`,
  },
  {
    icon: <Sparkles size={28} />,
    title: 'AI finds your best matches',
    desc: `Our AI analyses 40+ signals — certifications, experience, personality, location, availability, reviews — and shortlists the ${config.providerPlural.toLowerCase()} who are the best fit.`,
    detail: `Most families get 3–5 excellent matches within seconds.`,
  },
  {
    icon: <Calendar size={28} />,
    title: 'Review profiles & book',
    desc: `Each profile shows verified reviews, video introductions, certifications, and real-time availability. Book a free intro call or go straight to a paid session.`,
    detail: `All bookings are confirmed instantly. You can also set up recurring weekly bookings.`,
  },
  {
    icon: <CreditCard size={28} />,
    title: 'Pay safely, every time',
    desc: `Payment is handled by Stripe. Funds are held securely until the session is complete — then released to your ${config.providerLabel.toLowerCase()}. No cash, no awkwardness.`,
    detail: `Receipts are emailed automatically. Cancel with 24h notice, no charges.`,
  },
  {
    icon: <Star size={28} />,
    title: 'Leave a review, re-book easily',
    desc: `After every session, leave a review. Your ${config.providerLabel.toLowerCase()} builds their portable reputation. Re-book your favourite in one tap.`,
    detail: `Reviews are verified and owned by the ${config.providerLabel.toLowerCase()}, not the platform.`,
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className={`text-4xl font-extrabold mb-4 ${theme.gradientText}`}>How {config.name} works</h1>
        <p className="text-white/50 text-lg">From first search to trusted ongoing relationship</p>
      </div>

      <div className="space-y-6">
        {STEPS.map((step, i) => (
          <div key={i} className={`${theme.card} p-7 flex gap-6 items-start`}>
            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white`}>
              {step.icon}
            </div>
            <div>
              <div className={`text-xs font-bold ${theme.textAccent} mb-1 uppercase tracking-widest`}>Step {i + 1}</div>
              <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-white/60 leading-relaxed mb-3">{step.desc}</p>
              <blockquote className={`text-sm italic ${theme.textAccent} opacity-80 pl-4 border-l-2 border-current`}>
                {step.detail}
              </blockquote>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/chat" className={btn.primary + ' text-base px-10 py-4'}>
          Try it now — it&apos;s free <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
