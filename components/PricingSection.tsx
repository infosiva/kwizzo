// components/PricingSection.tsx — server component, transparent free vs pro comparison
import { siteConfig } from '@/site.config'
import { theme } from '@/lib/theme'
import Link from 'next/link'

export default function PricingSection() {
  const { free, pro } = siteConfig.pricing

  return (
    <section id="pricing" className="py-14 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white mb-2">Free vs Pro</h2>
        <p className="text-white/40 text-sm">Transparent pricing — no surprises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FREE */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-4">
          <div>
            <div className="text-white/50 text-xs font-black uppercase tracking-widest mb-1">{free.name}</div>
            <div className="text-3xl font-black text-white">{free.price}</div>
            <div className="text-white/30 text-xs mt-0.5">{free.period}</div>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {free.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className={f.included ? 'text-green-400' : 'text-white/20'}>{f.included ? '✓' : '✗'}</span>
                <span className={f.included ? 'text-white/70' : 'text-white/25 line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Link
            href={free.cta.href}
            className="mt-2 block text-center px-5 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-bold hover:border-white/40 hover:text-white transition-all"
          >
            {free.cta.text}
          </Link>
        </div>

        {/* PRO */}
        <div
          className="rounded-2xl border p-6 flex flex-col gap-4 relative overflow-hidden"
          style={{ borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.08)' }}
        >
          {pro.badge && (
            <span className={`absolute top-4 right-4 text-xs font-black px-2.5 py-1 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}>
              {pro.badge}
            </span>
          )}
          <div>
            <div className={`${theme.textAccent} text-xs font-black uppercase tracking-widest mb-1`}>{pro.name}</div>
            <div className="text-3xl font-black text-white">{pro.price}</div>
            <div className="text-white/30 text-xs mt-0.5">{pro.period}</div>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {pro.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-white/80">{f.text}</span>
              </li>
            ))}
          </ul>
          <Link
            href={pro.cta.href}
            className={`mt-2 block text-center px-5 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white text-sm font-bold hover:opacity-90 transition-opacity`}
          >
            {pro.cta.text}
          </Link>
        </div>
      </div>
    </section>
  )
}
