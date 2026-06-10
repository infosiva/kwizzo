// components/MarqueeBar.tsx — arcade topic chip marquee, CSS-only, zero JS
import { siteConfig } from '@/site.config'

const CHIP_COLORS = [
  { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', text: '#be185d' },  // pink
  { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#1d4ed8' },  // blue
  { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.2)',  text: '#92400e' },  // amber
  { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',  text: '#065f46' },  // green
  { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', text: '#9a3412' },  // orange
]

export default function MarqueeBar() {
  const items = [...siteConfig.socialProof.marqueeItems, ...siteConfig.socialProof.marqueeItems]

  return (
    <section
      aria-label="Quiz topic categories"
      className="py-4 overflow-hidden"
      style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}
    >
      <div className="marquee-wrapper">
        <div className="marquee-track" style={{ gap: '10px' }}>
          {items.map((item, i) => {
            const c = CHIP_COLORS[i % CHIP_COLORS.length]
            return (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap select-none"
                style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
              >
                {item}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
