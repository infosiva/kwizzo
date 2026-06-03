'use client'
// components/FAQSection.tsx — inline 3-col grid, no accordion
import { siteConfig } from '@/site.config'

export default function FAQSection() {
  // Show first 6 FAQs max to keep it tight
  const items = siteConfig.faq.slice(0, 6)

  return (
    <section id="faq" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-2">FAQ</h2>
        <p className="text-white/50 text-sm">Common questions answered</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.09] bg-white/[0.03] p-5"
          >
            <p className="text-sm font-bold text-white mb-2">{item.q}</p>
            <p className="text-xs text-white/55 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
