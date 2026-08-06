'use client'
// components/KwizzoMark.tsx — animated brand mark: quiz-card glyph with a checkmark
// that draws itself in on mount, subtle scale+rotate on hover. Used in Navbar.

const ACCENT = '#3b82f6'
const ACCENT_LIGHT = '#60a5fa'

export default function KwizzoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="kwizzo-mark inline-flex items-center justify-center rounded-xl shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
        boxShadow: `0 2px 12px rgba(59,130,246,0.35)`,
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rounded quiz-card outline */}
        <rect x="2" y="3" width="20" height="18" rx="4" stroke="white" strokeWidth="2" fill="none" />
        {/* Checkmark that draws itself in */}
        <path
          className="kwizzo-mark-check"
          d="M7 12.5l3 3 7-7"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <style>{`
        .kwizzo-mark { transition: transform 200ms cubic-bezier(0.23,1,0.32,1); }
        .kwizzo-mark:hover { transform: scale(1.08) rotate(-4deg); }
        .kwizzo-mark-check {
          stroke-dasharray: 16;
          stroke-dashoffset: 16;
          animation: kwizzo-mark-draw 600ms cubic-bezier(0.23,1,0.32,1) 200ms forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .kwizzo-mark-check { animation: none; stroke-dashoffset: 0; }
          .kwizzo-mark:hover { transform: none; }
        }
      `}</style>
    </span>
  )
}
