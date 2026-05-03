'use client'
import { useEffect, useRef } from 'react'

interface AdUnitProps {
  size?: 'banner' | 'rectangle'
  className?: string
}

const ADSTERRA_KEY_BANNER = 'ADSTERRA_BANNER_KEY'
const ADSTERRA_KEY_RECT   = 'ADSTERRA_RECTANGLE_KEY'

export default function AdUnit({ size = 'rectangle', className = '' }: AdUnitProps) {
  const key    = size === 'banner' ? ADSTERRA_KEY_BANNER : ADSTERRA_KEY_RECT
  const width  = size === 'banner' ? 728 : 300
  const height = size === 'banner' ? 90  : 250
  const ref    = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true
    // Use a local options object to avoid polluting window.atOptions globally
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.setAttribute('data-cfasync', 'false')
    s.text = `(function(){var o={key:'${key}',format:'iframe',height:${height},width:${width},params:{}};var s=document.createElement('script');s.type='text/javascript';s.setAttribute('data-cfasync','false');s.src='https://epnzryrk.com/act/files/tag.min.js';document.currentScript.parentNode.appendChild(s);window.atOptions=o;})();`
    ref.current.appendChild(s)
  }, [key, height, width])

  return (
    <div
      className={`relative flex justify-center items-center overflow-hidden rounded-xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', minHeight: height }}
    >
      <div className="text-[9px] text-white/15 text-center absolute top-1 w-full uppercase tracking-widest pointer-events-none">Ad</div>
      <div ref={ref} style={{ width, maxWidth: '100%' }} />
    </div>
  )
}
