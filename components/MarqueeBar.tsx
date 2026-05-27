// components/MarqueeBar.tsx — arcade topic chip marquee, CSS-only, zero JS
import { siteConfig } from '@/site.config'

// Assign a color per item for visual variety — cycles through 5 colors
const CHIP_COLORS = [
  { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.30)', text: '#c4b5fd' }, // violet
  { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)', text: '#93c5fd' }, // blue
  { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.28)',  text: '#fde047' }, // yellow
  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.25)',  text: '#86efac' }, // green
  { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.28)', text: '#fdba74' }, // orange
]

export default function MarqueeBar() {
  // Duplicate items so CSS loop is seamless
  const items = [...siteConfig.socialProof.marqueeItems, ...siteConfig.socialProof.marqueeItems]

  return (
    <section
      aria-label="Quiz topic categories"
      className="py-4 overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
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
