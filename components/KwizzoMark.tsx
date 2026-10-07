'use client'
// components/KwizzoMark.tsx — animated brand mark: quiz-card glyph with a checkmark
// that draws itself in on mount, subtle scale+rotate on hover. Used in Navbar.

const ACCENT = '#e8404f'
const ACCENT_LIGHT = '#ff7a85'

export default function KwizzoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="kwizzo-mark inline-flex items-center justify-center rounded-xl shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
        boxShadow: `0 2px 12px rgba(232,64,79,0.35)`,
      }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* K whose lower arm ends in a question-mark dot */}
        <g stroke="white" strokeWidth="8" strokeLinecap="round" fill="none">
          <path d="M20 15v34" />
          <path d="M22 35L41 16" />
          <path className="kwizzo-mark-check" d="M29 31l9 10" />
        </g>
        <circle cx="46" cy="49" r="5" fill="#101026" />
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
