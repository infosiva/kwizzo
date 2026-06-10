'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProSuccessPage() {
  const router  = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    localStorage.setItem('kwizzo_pro', '1')
    setReady(true)
  }, [])

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0px) scale(1); opacity: 0.6; }
          50%  { transform: translateY(-20px) scale(1.05); opacity: 0.9; }
          100% { transform: translateY(0px) scale(1); opacity: 0.6; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.8) translateY(20px); opacity: 0; }
          60%  { transform: scale(1.05) translateY(-4px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .success-card {
          animation: successPop 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(-45deg, #fdf2f8, #fce7f3, #f0fdf4, #ecfdf5, #fdf4ff)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 12s ease infinite',
      }}>
        {/* floating orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(236,72,153,0.12)', filter: 'blur(60px)', animation: 'floatUp 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(16,185,129,0.10)', filter: 'blur(80px)', animation: 'floatUp 8s ease-in-out infinite 2s' }} />
        <div style={{ position: 'absolute', top: '50%', right: '25%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(236,72,153,0.08)', filter: 'blur(40px)', animation: 'floatUp 7s ease-in-out infinite 1s' }} />

        <div className="success-card" style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(236,72,153,0.15)',
          borderRadius: 24,
          padding: '48px 40px',
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(236,72,153,0.12), 0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
            Welcome to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ec4899, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Kwizzo Pro!
            </span>
          </h1>
          <p style={{ color: '#64748b', marginBottom: 8, fontSize: 15, lineHeight: 1.6 }}>
            Unlimited questions, custom topics, and no ads — for every quiz, forever.
          </p>
          {ready && (
            <p style={{ color: '#10b981', fontSize: 13, fontWeight: 700, marginBottom: 28 }}>
              ✓ Pro access activated on this device
            </p>
          )}
          <button
            onClick={() => router.push('/play')}
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #ec4899, #f472b6)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              transition: 'transform 150ms cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Start a Pro Quiz →
          </button>
          <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 20, lineHeight: 1.5 }}>
            Subscription managed through Stripe. To cancel, email us or use the customer portal link in your receipt email.
          </p>
        </div>
      </div>
    </>
  )
}
