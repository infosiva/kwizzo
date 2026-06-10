// components/PricingSection.tsx — light pricing cards
import { siteConfig } from '@/site.config'
import Link from 'next/link'

const ACCENT = '#ec4899'

export default function PricingSection() {
  const { free, pro } = siteConfig.pricing

  return (
    <section id="pricing" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto" style={{ borderTop: '1px solid #f1f5f9' }}>
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black mb-2" style={{ color: '#0f172a' }}>Free vs Pro</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>Transparent pricing — no surprises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* FREE */}
        <div
          className="rounded-2xl p-7 flex flex-col gap-5"
          style={{
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#94a3b8' }}>{free.name}</div>
            <div className="text-4xl font-black" style={{ color: '#0f172a' }}>{free.price}</div>
            <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{free.period}</div>
          </div>
          <ul className="flex flex-col gap-3 flex-1">
            {free.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: f.included ? 'rgba(16,185,129,0.12)' : '#f8fafc',
                    color: f.included ? '#059669' : '#cbd5e1',
                    border: f.included ? '1px solid rgba(16,185,129,0.2)' : '1px solid #e2e8f0',
                  }}
                >
                  {f.included ? '✓' : '✗'}
                </span>
                <span style={{ color: f.included ? '#0f172a' : '#94a3b8', textDecoration: f.included ? 'none' : 'line-through' }}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Link
            href={free.cta.href}
            className="block text-center px-5 py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97]"
            style={{ border: '1.5px solid #e2e8f0', color: '#475569', background: '#f8fafc' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.4)'; (e.currentTarget as HTMLElement).style.color = ACCENT }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.color = '#475569' }}
          >
            {free.cta.text}
          </Link>
        </div>

        {/* PRO */}
        <div
          className="rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden"
          style={{
            background: '#fff',
            border: `1.5px solid rgba(236,72,153,0.35)`,
            boxShadow: '0 4px 32px rgba(236,72,153,0.12)',
          }}
        >
          {/* Pink top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${ACCENT}, #f472b6)` }}
          />

          {pro.badge && (
            <span
              className="absolute top-5 right-5 text-[10px] font-black px-2.5 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #f472b6)` }}
            >
              {pro.badge}
            </span>
          )}

          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>{pro.name}</div>
            <div className="text-4xl font-black" style={{ color: '#0f172a' }}>{pro.price}</div>
            <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{pro.period}</div>
          </div>

          <ul className="flex flex-col gap-3 flex-1">
            {pro.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: 'rgba(236,72,153,0.10)',
                    color: ACCENT,
                    border: '1px solid rgba(236,72,153,0.2)',
                  }}
                >
                  ✓
                </span>
                <span style={{ color: '#0f172a' }}>{f.text}</span>
              </li>
            ))}
          </ul>

          <Link
            href={pro.cta.href}
            className="block text-center px-5 py-3.5 rounded-xl text-sm font-black text-white transition-all duration-150 active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #f472b6)`,
              boxShadow: `0 4px 16px rgba(236,72,153,0.35)`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px rgba(236,72,153,0.5)` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px rgba(236,72,153,0.35)` }}
          >
            {pro.cta.text}
          </Link>
        </div>
      </div>
    </section>
  )
}
