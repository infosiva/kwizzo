'use client'
// app/admin/appearance/page.tsx — Phase 1 config editor
// Access: /admin/appearance?secret=<ADMIN_SECRET>
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AppearanceEditor() {
  const params  = useSearchParams()
  const secret  = params.get('secret') ?? ''
  const [config, setConfig]  = useState<Record<string, unknown>>({})
  const [saving, setSaving]  = useState(false)
  const [msg,    setMsg]     = useState('')

  useEffect(() => {
    fetch(`/api/admin/config?secret=${secret}`)
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setMsg('Failed to load config'))
  }, [secret])

  async function save() {
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/config', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body:    JSON.stringify(config),
    })
    setSaving(false)
    setMsg(res.ok ? '✓ Saved — reload site to see changes' : '✗ Save failed')
  }

  function field(key: string, label: string) {
    const val = config[key]
    const display = typeof val === 'string' ? val : JSON.stringify(val ?? '')
    return (
      <div key={key} className="flex flex-col gap-1">
        <label className="text-xs text-white/50 uppercase tracking-wider">{label}</label>
        <input
          className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
          value={display}
          onChange={e => {
            try { setConfig(c => ({ ...c, [key]: JSON.parse(e.target.value) })) }
            catch { setConfig(c => ({ ...c, [key]: e.target.value })) }
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07060f] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black mb-2">Appearance</h1>
        <p className="text-white/40 text-sm mb-8">
          Changes write to <code className="text-violet-400">public/site-config.json</code> — no redeploy needed.
        </p>

        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Hero</h2>
          {field('heroBadge',   'Badge text')}
          {field('subheadline', 'Subheadline')}
        </div>

        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Layout (JSON)</h2>
          {field('layout', 'heroVariant, sectionOrder, hideSections')}
        </div>

        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Final CTA (JSON)</h2>
          {field('finalCta', 'headline, subtext, ctaText, ctaHref')}
        </div>

        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Chatbot (JSON)</h2>
          {field('chatbot', 'welcomeMessage, botName, placeholder')}
        </div>

        {msg && (
          <p className={`text-sm mb-4 ${msg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-bold text-sm disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default function AppearancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07060f]" />}>
      <AppearanceEditor />
    </Suspense>
  )
}
