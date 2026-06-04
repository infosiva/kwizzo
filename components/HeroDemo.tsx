'use client'
// components/HeroDemo.tsx — CSS-only animated live results panel
// Vote bars grow from 0% to final % using pure CSS keyframes (no React state needed)

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
        background: 'linear-gradient(145deg, #0f0c1f 0%, #120e22 100%)',
        border: '1px solid rgba(139,92,246,0.28)',
        boxShadow: '0 0 64px rgba(234,179,8,0.08), 0 0 40px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.06)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(139,92,246,0.05)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/50">LIVE QUIZ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(234,179,8,0.15)',
              border: '1px solid rgba(234,179,8,0.25)',
              color: '#fde047',
            }}
          >
            ⚡ SCIENCE
          </span>
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#c4b5fd',
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
          style={{ color: 'rgba(255,255,255,0.90)' }}
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
                    background: ans.isCorrect ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)',
                    color: ans.isCorrect ? '#86efac' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {ans.letter}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: ans.isCorrect ? '#86efac' : 'rgba(255,255,255,0.55)' }}
                >
                  {ans.text}
                </span>
              </div>
              <span
                className="font-black tabular-nums"
                style={{ color: ans.isCorrect ? '#eab308' : 'rgba(255,255,255,0.30)' }}
              >
                {ans.pct}%
              </span>
            </div>
            {/* Bar track */}
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: '7px', background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="h-full rounded-full vote-bar"
                style={{
                  '--bar-target': `${ans.pct}%`,
                  animationDelay: `${0.4 + i * 0.12}s`,
                  background: ans.isCorrect
                    ? 'linear-gradient(90deg, #22c55e, #eab308)'
                    : 'rgba(139,92,246,0.35)',
                } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* Response counter */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/40 font-medium">
            <span className="response-counter font-black text-white/60">847</span>
            {' '}responses · <span className="text-yellow-400 font-bold">3 responses/sec</span>
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
          <span className="text-[10px] text-white/35 font-medium ml-2">online now</span>
        </div>
      </div>

      {/* Correct answer callout */}
      <div
        className="mx-4 mb-4 px-4 py-2.5 rounded-xl flex items-center gap-2"
        style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.20)',
        }}
      >
        <span className="text-green-400 text-sm">✓</span>
        <span className="text-xs font-bold text-green-400">
          Correct! H₂O — 67% answered right
        </span>
        <span className="ml-auto text-yellow-400 text-xs font-black">+100 pts</span>
      </div>
    </div>
  )
}
