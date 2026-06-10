'use client'
// components/HeroDemo.tsx — light theme live results panel

const ACCENT = '#ec4899'

const ANSWERS = [
  { letter: 'A', text: 'H₂O', pct: 67, isCorrect: true },
  { letter: 'B', text: 'HO₂', pct: 12, isCorrect: false },
  { letter: 'C', text: 'H₂',  pct:  8, isCorrect: false },
  { letter: 'D', text: 'OH',  pct: 13, isCorrect: false },
]

const AVATARS = ['🎮', '🧑', '👧', '👦', '🐱']

export default function HeroDemo() {
  return (
    <div
      className="rounded-2xl overflow-hidden select-none relative"
      style={{
        background: '#fff',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid #f1f5f9',
          background: '#fdf2f8',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold" style={{ color: '#64748b' }}>LIVE QUIZ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(236,72,153,0.10)',
              border: '1px solid rgba(236,72,153,0.25)',
              color: ACCENT,
            }}
          >
            ⚡ SCIENCE
          </span>
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
            }}
          >
            ROUND 3
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="px-5 pt-5 pb-2">
        <p
          className="text-sm font-bold leading-snug mb-1"
          style={{ color: '#0f172a' }}
        >
          What is the chemical symbol for water?
        </p>
      </div>

      {/* Vote bars */}
      <div className="px-5 pb-4 flex flex-col gap-2.5">
        {ANSWERS.map((ans, i) => (
          <div key={ans.letter} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                  style={{
                    background: ans.isCorrect ? 'rgba(16,185,129,0.12)' : '#f8fafc',
                    color: ans.isCorrect ? '#059669' : '#94a3b8',
                    border: ans.isCorrect ? '1px solid rgba(16,185,129,0.25)' : '1px solid #e2e8f0',
                  }}
                >
                  {ans.letter}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: ans.isCorrect ? '#059669' : '#475569' }}
                >
                  {ans.text}
                </span>
              </div>
              <span
                className="font-black tabular-nums"
                style={{ color: ans.isCorrect ? ACCENT : '#94a3b8' }}
              >
                {ans.pct}%
              </span>
            </div>
            {/* Bar track */}
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: '7px', background: '#f1f5f9' }}
            >
              <div
                className="h-full rounded-full vote-bar"
                style={{
                  '--bar-target': `${ans.pct}%`,
                  animationDelay: `${0.4 + i * 0.12}s`,
                  background: ans.isCorrect
                    ? `linear-gradient(90deg, #10b981, ${ACCENT})`
                    : '#e2e8f0',
                } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #f1f5f9' }} />

      {/* Response counter */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>
            <span className="response-counter font-black" style={{ color: '#0f172a' }}>847</span>
            {' '}responses · <span className="font-bold" style={{ color: ACCENT }}>3 responses/sec</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {AVATARS.map((av, i) => (
            <span
              key={i}
              className="text-base leading-none"
              style={{ marginLeft: i > 0 ? '-4px' : 0 }}
            >
              {av}
            </span>
          ))}
          <span className="text-[10px] font-medium ml-2" style={{ color: '#94a3b8' }}>online now</span>
        </div>
      </div>

      {/* Correct answer callout */}
      <div
        className="mx-4 mb-4 px-4 py-2.5 rounded-xl flex items-center gap-2"
        style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
      >
        <span className="text-sm" style={{ color: '#059669' }}>✓</span>
        <span className="text-xs font-bold" style={{ color: '#059669' }}>
          Correct! H₂O — 67% answered right
        </span>
        <span className="ml-auto text-xs font-black" style={{ color: ACCENT }}>+100 pts</span>
      </div>
    </div>
  )
}
