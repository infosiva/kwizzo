'use client'
// components/FAQSection.tsx — inline 3-col grid, no accordion
import { siteConfig } from '@/site.config'

export default function FAQSection() {
  // Show first 6 FAQs max to keep it tight
  const items = siteConfig.faq.slice(0, 6)

  return (
    <section id="faq" className="py-5 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]" style={{ background: '#080712' }}>
      <div className="text-center mb-3">
        <h2 className="text-lg font-black text-white mb-0.5">FAQ</h2>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
        {items.map((item, i) => (
          <details key={i} className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2.5">
            <summary className="text-sm font-bold text-white cursor-pointer min-h-[24px]">{item.q}</summary>
            <p className="text-xs text-white/55 leading-relaxed mt-1.5">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
