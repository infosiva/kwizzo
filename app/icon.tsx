import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'linear-gradient(135deg, #ec4899, #f472b6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Simplified game controller — rounded body + two thumb circles */}
        <rect x="2" y="8" width="20" height="10" rx="5" stroke="white" strokeWidth="2"/>
        <circle cx="8" cy="13" r="1.6" fill="white"/>
        <circle cx="16" cy="13" r="1.6" fill="white"/>
      </svg>
    </div>
  )
}
