'use client'
// Pro CTA: real Stripe checkout (/api/checkout) + optional promo code (/api/promo).
import { useState } from 'react'
import { startCheckout } from '@/lib/pro'

export default function ProCheckout({ label }: { label: string }) {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function applyPromo() {
    if (!code.trim()) return
    try {
      const r = await fetch('/api/promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code.trim() }) })
      const d = await r.json()
      setMsg(d.valid ? `Code applied: Pro unlocked for ${d.daysUnlocked} days` : 'That code is not valid')
    } catch { setMsg('Could not check the code, try again') }
  }
  async function go() {
    setBusy(true); setMsg('')
    try { await startCheckout() } catch { setMsg('Checkout is unavailable right now, please try again later') }
    setBusy(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <button onClick={go} disabled={busy} className="min-h-[48px] rounded-xl px-5 text-sm font-black active:scale-[0.97] transition-transform"
        style={{ background: 'linear-gradient(135deg,#e8404f,#ff6a76)', color: '#fff', boxShadow: '0 6px 20px rgba(232,64,79,0.35)' }}>
        {busy ? 'Opening checkout…' : label}
      </button>
      <div className="flex gap-2">
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code"
          className="min-h-[44px] flex-1 rounded-xl px-3 text-sm" style={{ background: '#101026', border: '1px solid #2b2f55', color: '#f1f5f9' }} />
        <button onClick={applyPromo} className="min-h-[44px] rounded-xl px-4 text-sm font-bold" style={{ background: '#181c3a', border: '1px solid #2b2f55', color: '#f1f5f9' }}>Apply</button>
      </div>
      {msg && <p role="status" className="text-xs" style={{ color: '#cbd5e1' }}>{msg}</p>}
    </div>
  )
}
