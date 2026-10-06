// components/PricingSection.tsx — light pricing cards
import { siteConfig } from '@/site.config'
import Link from 'next/link'
import ProCheckout from './ProCheckout'

const ACCENT = '#e8404f'

export default function PricingSection() {
  const { free, pro } = siteConfig.pricing

  return (
    <section id="pricing" className="py-5 px-4 sm:px-6 max-w-4xl mx-auto" style={{ borderTop: '1px solid #2b2f55', background: '#101026' }}>
      <div className="text-center mb-3">
        <h2 className="text-lg font-black mb-0.5" style={{ color: '#f1f5f9' }}>Free vs Pro</h2>
        <p className="text-sm" style={{ color: '#cbd5e1' }}>Transparent pricing — no surprises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* FREE */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: '#181c3a',
            border: '1.5px solid #2b2f55',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#a8b3c7' }}>{free.name}</div>
            <div className="text-2xl font-black" style={{ color: '#f1f5f9' }}>{free.price}</div>
            <div className="text-xs mt-0.5" style={{ color: '#a8b3c7' }}>{free.period}</div>
          </div>
          <ul className="flex flex-col gap-1.5 flex-1">
            {free.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: f.included ? 'rgba(16,185,129,0.12)' : '#f8fafc',
                    color: f.included ? '#34d399' : '#cbd5e1',
                    border: f.included ? '1px solid rgba(16,185,129,0.2)' : '1px solid #2b2f55',
                  }}
                >
                  {f.included ? '✓' : '✗'}
                </span>
                <span style={{ color: f.included ? '#f1f5f9' : '#a8b3c7', textDecoration: f.included ? 'none' : 'line-through' }}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Link
            href={free.cta.href}
            className="block text-center px-5 py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-[0.97]"
            style={{ border: '1.5px solid #2b2f55', color: '#e2e8f0', background: '#101026' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,64,79,0.4)'; (e.currentTarget as HTMLElement).style.color = ACCENT }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0' }}
          >
            {free.cta.text}
          </Link>
        </div>

        {/* PRO */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
          style={{
            background: '#181c3a',
            border: `1.5px solid rgba(232,64,79,0.35)`,
            boxShadow: '0 4px 32px rgba(232,64,79,0.12)',
          }}
        >
          {/* Pink top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${ACCENT}, #ff7a85)` }}
          />

          {pro.badge && (
            <span
              className="absolute top-5 right-5 text-[10px] font-black px-2.5 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #ff7a85)` }}
            >
              {pro.badge}
            </span>
          )}

          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>{pro.name}</div>
            <div className="text-2xl font-black" style={{ color: '#f1f5f9' }}>{pro.price}</div>
            <div className="text-xs mt-0.5" style={{ color: '#a8b3c7' }}>{pro.period}</div>
          </div>

          <ul className="flex flex-col gap-1.5 flex-1">
            {pro.features.map(f => (
              <li key={f.text} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: 'rgba(232,64,79,0.10)',
                    color: ACCENT,
                    border: '1px solid rgba(232,64,79,0.2)',
                  }}
                >
                  ✓
                </span>
                <span style={{ color: '#f1f5f9' }}>{f.text}</span>
              </li>
            ))}
          </ul>

          <ProCheckout label={pro.cta.text} />
        </div>
      </div>
    </section>
  )
}
