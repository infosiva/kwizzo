'use client'
import { siteConfig } from '@/site.config'

const ACCENT = '#ec4899'

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto" style={{ borderTop: '1px solid #f1f5f9' }}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black mb-2" style={{ color: '#0f172a' }}>Everything you need</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>AI-powered, free to start, works on any device</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {siteConfig.features.map((f, i) => (
          <div
            key={f.title}
            className="rounded-2xl p-5 flex items-start gap-3 transition-all duration-200 group"
            style={{
              background: '#fff',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.3)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(236,72,153,0.08)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            <span
              className="text-xl flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}
            >
              {f.icon}
            </span>
            <div>
              <div className="font-bold text-sm mb-1" style={{ color: '#0f172a' }}>{f.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
