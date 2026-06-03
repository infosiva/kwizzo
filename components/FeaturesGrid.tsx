'use client'
// components/FeaturesGrid.tsx — tight 2-col feature list, always visible
import { siteConfig } from '@/site.config'

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-2">Everything you need</h2>
        <p className="text-white/50 text-sm">AI-powered, free to start, works on any device</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {siteConfig.features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-white/[0.09] bg-white/[0.04] p-5 flex items-start gap-3"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
            <div>
              <div className="font-bold text-white text-sm mb-1">{f.title}</div>
              <div className="text-white/60 text-xs leading-relaxed">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
