'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { siteConfig } from '@/site.config'

export default function HowItWorksSection() {
  const slides = siteConfig.howItWorks
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragStartScroll = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToSlide = useCallback((idx: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[idx] as HTMLElement
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: 'smooth' })
    setActive(idx)
  }, [])

  const next = useCallback(() => scrollToSlide((active + 1) % slides.length), [active, slides.length, scrollToSlide])

  useEffect(() => {
    if (isDragging) return
    timerRef.current = setInterval(next, 3200)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isDragging, next])

  const pauseAuto = () => { if (timerRef.current) clearInterval(timerRef.current) }

  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const mid = track.scrollLeft + track.clientWidth / 2
    let closest = 0, minDist = Infinity
    Array.from(track.children).forEach((el, i) => {
      const child = el as HTMLElement
      const dist = Math.abs(child.offsetLeft + child.clientWidth / 2 - mid)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActive(closest)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true); pauseAuto()
    dragStartX.current = e.clientX
    dragStartScroll.current = trackRef.current?.scrollLeft ?? 0
    trackRef.current?.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return
    trackRef.current.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current)
  }
  const onPointerUp = () => setIsDragging(false)

  return (
    <section id="how-it-works" className="py-14 border-t border-white/[0.05]">
      <div className="text-center mb-8 px-4">
        <h2 className="text-2xl font-black text-white mb-2">How it works</h2>
        <p className="text-white/40 text-sm">Three steps to quiz night</p>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onMouseEnter={pauseAuto}
          style={{
            display: 'flex', gap: '12px',
            overflowX: 'auto', scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            paddingLeft: '24px', paddingRight: '24px', paddingBottom: '8px',
            cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              onClick={() => scrollToSlide(i)}
              style={{
                scrollSnapAlign: 'center', flexShrink: 0,
                width: 'min(260px, 72vw)', borderRadius: '18px',
                padding: '24px 20px',
                background: active === i
                  ? 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(168,85,247,0.05))'
                  : 'rgba(255,255,255,0.02)',
                border: active === i ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                transform: active === i ? 'scale(1)' : 'scale(0.96)',
                opacity: active === i ? 1 : 0.5,
                transition: 'transform 220ms cubic-bezier(0.23,1,0.32,1), opacity 220ms ease, border-color 220ms ease, background 220ms ease',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '32px', lineHeight: 1, filter: active === i ? 'none' : 'grayscale(0.5)', transition: 'filter 220ms ease' }}>
                  {slide.icon}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: active === i ? 'rgba(139,92,246,0.9)' : 'rgba(255,255,255,0.2)', fontVariantNumeric: 'tabular-nums', transition: 'color 220ms ease' }}>
                  {String(slide.step).padStart(2, '0')}
                </span>
              </div>
              <div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '15px', marginBottom: 6, lineHeight: 1.3 }}>{slide.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 8, width: '24px', background: 'linear-gradient(to right, #080712, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 8, width: '24px', background: 'linear-gradient(to left, #080712, transparent)', pointerEvents: 'none' }} />

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => scrollToSlide(i)} aria-label={`Slide ${i + 1}`}
              style={{
                width: active === i ? '20px' : '6px', height: '6px', borderRadius: 99,
                background: active === i ? 'rgba(139,92,246,0.8)' : 'rgba(255,255,255,0.15)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'width 220ms cubic-bezier(0.23,1,0.32,1), background 220ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
