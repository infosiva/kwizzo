'use client'
import { siteConfig } from '@/site.config'
import { SpotlightCard } from "@infosiva/shared-ui/modern";

const ACCENT = '#e8404f'

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-5 px-4 sm:px-6 max-w-5xl mx-auto" style={{ borderTop: '1px solid #f1f5f9' }}>
      <div className="text-center mb-3">
        <h2 className="text-lg font-black mb-0.5" style={{ color: '#f1f5f9' }}>Everything you need</h2>
        <p className="text-sm" style={{ color: '#a8b3c7' }}>AI-powered, free to start, works on any device</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {siteConfig.features.map((f, i) => (
          <SpotlightCard key={f.title} className="!p-0 !border-0 !bg-transparent"><div
            className="rounded-2xl p-3 flex items-center gap-2.5 sm:gap-3 transition-all duration-200 group"
            style={{
              background: '#181c3a',
              border: '1.5px solid #2b2f55',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,64,79,0.3)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(232,64,79,0.08)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2b2f55'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            <span
              className="text-xl flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(232,64,79,0.08)', border: '1px solid rgba(232,64,79,0.15)' }}
            >
              {f.icon}
            </span>
            <div>
              <div className="font-bold text-sm mb-1" style={{ color: '#f1f5f9' }}>{f.title}</div>
              <div className="text-xs leading-snug line-clamp-1 hidden sm:block" style={{ color: '#a8b3c7' }}>{f.desc}</div>
            </div>
          </div></SpotlightCard>
        ))}
      </div>
    </section>
  )
}
