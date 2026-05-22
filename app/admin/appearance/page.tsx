'use client'
// app/admin/appearance/page.tsx — Global UI Customisation Portal
// Access: /admin/appearance?secret=<ADMIN_SECRET>
// Change ANY content, widget, layout, color, section order — no code, no redeploy.
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteConfig, HeroVariant } from '@/site.config'
import { siteConfig as defaultConfig } from '@/site.config'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'hero' | 'sections' | 'content' | 'colors' | 'freeTier' | 'seo' | 'chatbot'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'hero',      label: 'Hero',        icon: '🏠' },
  { id: 'sections',  label: 'Sections',    icon: '📐' },
  { id: 'content',   label: 'Content',     icon: '✏️' },
  { id: 'colors',    label: 'Colors',      icon: '🎨' },
  { id: 'freeTier',  label: 'Free Tier',   icon: '🆓' },
  { id: 'seo',       label: 'SEO',         icon: '🔍' },
  { id: 'chatbot',   label: 'Chatbot',     icon: '💬' },
]

const THEME_COLORS = [
  { name: 'violet',  hex: '#7c3aed', label: 'Violet'  },
  { name: 'emerald', hex: '#059669', label: 'Emerald' },
  { name: 'blue',    hex: '#2563eb', label: 'Blue'    },
  { name: 'cyan',    hex: '#0891b2', label: 'Cyan'    },
  { name: 'rose',    hex: '#e11d48', label: 'Rose'    },
  { name: 'orange',  hex: '#ea580c', label: 'Orange'  },
  { name: 'amber',   hex: '#d97706', label: 'Amber'   },
  { name: 'teal',    hex: '#0d9488', label: 'Teal'    },
  { name: 'indigo',  hex: '#4f46e5', label: 'Indigo'  },
  { name: 'pink',    hex: '#db2777', label: 'Pink'    },
]

const SECTION_ORDER_OPTIONS = ['hero','marquee','howItWorks','features','pricing','faq','finalCta']

// ── Primitives ────────────────────────────────────────────────────────────────

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[11px] text-white/40 uppercase tracking-wider font-bold mb-1.5${className ? ' ' + className : ''}`}>{children}</div>
}

function Input({ value, onChange, placeholder, multiline = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) {
  const cls = "w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500 transition-colors resize-none"
  return multiline
    ? <textarea className={cls} rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    : <input    className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-all relative ${checked ? 'bg-violet-600' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-1'}`} />
      </div>
      <span className="text-white/60 text-sm group-hover:text-white transition-colors">{label}</span>
    </label>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function HeroTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Label>Hero Layout Variant</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {(['split','centered','minimal'] as HeroVariant[]).map(v => (
            <button
              key={v}
              onClick={() => set('layout', { ...(cfg.layout ?? defaultConfig.layout), heroVariant: v })}
              className={`py-3 rounded-xl text-sm font-bold border transition-all capitalize ${
                (cfg.layout?.heroVariant ?? 'split') === v
                  ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                  : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
              }`}
            >
              {v === 'split' ? '⬜⬜ Split' : v === 'centered' ? '⬛ Centered' : '▭ Minimal'}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Badge Text</Label>
        <Input value={String(cfg.heroBadge ?? defaultConfig.heroBadge)} onChange={v => set('heroBadge', v)} placeholder="kwizzo · AI quiz · free to play" />
      </Card>

      <Card>
        <Label>Headline (one line per entry — press Enter to add)</Label>
        {(cfg.headline ?? defaultConfig.headline).map((line, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={line}
              onChange={v => {
                const lines = [...(cfg.headline ?? defaultConfig.headline)]
                lines[i] = v
                set('headline', lines)
              }}
              placeholder={`Line ${i + 1}`}
            />
            <button
              onClick={() => {
                const lines = (cfg.headline ?? defaultConfig.headline).filter((_, j) => j !== i)
                set('headline', lines)
              }}
              className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
            >✕</button>
          </div>
        ))}
        <button
          onClick={() => set('headline', [...(cfg.headline ?? defaultConfig.headline), ''])}
          className="text-xs text-violet-400 hover:text-violet-300 mt-1"
        >+ Add line</button>
      </Card>

      <Card>
        <Label>Subheadline</Label>
        <Input value={String(cfg.subheadline ?? defaultConfig.subheadline)} onChange={v => set('subheadline', v)} multiline placeholder="One sentence description" />
      </Card>

      <Card>
        <Label>Primary CTA</Label>
        <div className="flex gap-2">
          <Input value={cfg.ctaPrimary?.text ?? defaultConfig.ctaPrimary.text} onChange={v => set('ctaPrimary', { ...(cfg.ctaPrimary ?? defaultConfig.ctaPrimary), text: v })} placeholder="Button text" />
          <Input value={cfg.ctaPrimary?.href ?? defaultConfig.ctaPrimary.href} onChange={v => set('ctaPrimary', { ...(cfg.ctaPrimary ?? defaultConfig.ctaPrimary), href: v })} placeholder="/play" />
        </div>
        <Label className="mt-3">Secondary CTA</Label>
        <div className="flex gap-2 mt-1.5">
          <Input value={cfg.ctaSecondary?.text ?? defaultConfig.ctaSecondary.text} onChange={v => set('ctaSecondary', { ...(cfg.ctaSecondary ?? defaultConfig.ctaSecondary), text: v })} placeholder="Button text" />
          <Input value={cfg.ctaSecondary?.href ?? defaultConfig.ctaSecondary.href} onChange={v => set('ctaSecondary', { ...(cfg.ctaSecondary ?? defaultConfig.ctaSecondary), href: v })} placeholder="/play?mode=group" />
        </div>
      </Card>
    </div>
  )
}

function SectionsTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  const order   = cfg.layout?.sectionOrder   ?? defaultConfig.layout.sectionOrder
  const hidden  = cfg.layout?.hideSections   ?? defaultConfig.layout.hideSections

  const toggle = (id: string) => {
    const next = hidden.includes(id) ? hidden.filter(x => x !== id) : [...hidden, id]
    set('layout', { ...(cfg.layout ?? defaultConfig.layout), hideSections: next })
  }

  const moveUp = (i: number) => {
    if (i === 0) return
    const next = [...order]
    ;[next[i-1], next[i]] = [next[i], next[i-1]]
    set('layout', { ...(cfg.layout ?? defaultConfig.layout), sectionOrder: next })
  }

  const moveDown = (i: number) => {
    if (i === order.length - 1) return
    const next = [...order]
    ;[next[i], next[i+1]] = [next[i+1], next[i]]
    set('layout', { ...(cfg.layout ?? defaultConfig.layout), sectionOrder: next })
  }

  return (
    <Card>
      <Label>Section order + visibility — drag or use arrows to reorder</Label>
      <div className="flex flex-col gap-2 mt-2">
        {order.map((id, i) => (
          <div key={id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
            hidden.includes(id) ? 'border-white/5 bg-white/[0.01] opacity-40' : 'border-white/[0.08] bg-white/[0.03]'
          }`}>
            <Toggle checked={!hidden.includes(id)} onChange={() => toggle(id)} label="" />
            <span className="text-white/70 text-sm font-medium flex-1 capitalize">{id.replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex gap-1">
              <button onClick={() => moveUp(i)}   disabled={i === 0}              className="px-2 py-1 rounded text-white/30 hover:text-white disabled:opacity-20 text-xs">↑</button>
              <button onClick={() => moveDown(i)} disabled={i === order.length-1} className="px-2 py-1 rounded text-white/30 hover:text-white disabled:opacity-20 text-xs">↓</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ContentTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Label>Marquee items (one per line)</Label>
        <textarea
          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500 resize-none"
          rows={6}
          value={(cfg.socialProof?.marqueeItems ?? defaultConfig.socialProof.marqueeItems).join('\n')}
          onChange={e => set('socialProof', {
            ...(cfg.socialProof ?? defaultConfig.socialProof),
            marqueeItems: e.target.value.split('\n').filter(Boolean)
          })}
        />
      </Card>

      <Card>
        <Label>How It Works steps</Label>
        {(cfg.howItWorks ?? defaultConfig.howItWorks).map((step, i) => (
          <div key={i} className="flex gap-2 mb-3 items-start">
            <Input value={step.icon}  onChange={v => { const s=[...(cfg.howItWorks??defaultConfig.howItWorks)]; s[i]={...s[i],icon:v}; set('howItWorks',s) }} placeholder="🎯" />
            <Input value={step.title} onChange={v => { const s=[...(cfg.howItWorks??defaultConfig.howItWorks)]; s[i]={...s[i],title:v}; set('howItWorks',s) }} placeholder="Title" />
            <Input value={step.desc}  onChange={v => { const s=[...(cfg.howItWorks??defaultConfig.howItWorks)]; s[i]={...s[i],desc:v}; set('howItWorks',s) }} placeholder="Description" multiline />
          </div>
        ))}
      </Card>

      <Card>
        <Label>FAQ items</Label>
        {(cfg.faq ?? defaultConfig.faq).map((item, i) => (
          <div key={i} className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <div className="mb-2">
              <Input value={item.q} onChange={v => { const f=[...(cfg.faq??defaultConfig.faq)]; f[i]={...f[i],q:v}; set('faq',f) }} placeholder="Question" />
            </div>
            <Input value={item.a} onChange={v => { const f=[...(cfg.faq??defaultConfig.faq)]; f[i]={...f[i],a:v}; set('faq',f) }} placeholder="Answer" multiline />
            <button onClick={() => { const f=(cfg.faq??defaultConfig.faq).filter((_,j)=>j!==i); set('faq',f) }} className="text-xs text-red-400 mt-2">Remove</button>
          </div>
        ))}
        <button onClick={() => set('faq', [...(cfg.faq??defaultConfig.faq), {q:'',a:''}])} className="text-xs text-violet-400 hover:text-violet-300">+ Add FAQ item</button>
      </Card>

      <Card>
        <Label>Final CTA</Label>
        <div className="flex flex-col gap-2">
          <Input value={cfg.finalCta?.headline ?? defaultConfig.finalCta.headline} onChange={v => set('finalCta',{...(cfg.finalCta??defaultConfig.finalCta),headline:v})} placeholder="Headline" />
          <Input value={cfg.finalCta?.subtext  ?? defaultConfig.finalCta.subtext}  onChange={v => set('finalCta',{...(cfg.finalCta??defaultConfig.finalCta),subtext:v})} placeholder="Subtext" />
          <Input value={cfg.finalCta?.ctaText  ?? defaultConfig.finalCta.ctaText}  onChange={v => set('finalCta',{...(cfg.finalCta??defaultConfig.finalCta),ctaText:v})} placeholder="Button text" />
          <Input value={cfg.finalCta?.ctaHref  ?? defaultConfig.finalCta.ctaHref}  onChange={v => set('finalCta',{...(cfg.finalCta??defaultConfig.finalCta),ctaHref:v})} placeholder="/play" />
        </div>
      </Card>
    </div>
  )
}

function ColorsTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  const current = cfg.themeColor ?? defaultConfig.themeColor
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Label>Theme color — controls all accents, gradients, and highlights</Label>
        <div className="grid grid-cols-5 gap-3 mt-2">
          {THEME_COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => set('themeColor', c.name)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                current === c.name ? 'border-white/40 bg-white/10' : 'border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="w-8 h-8 rounded-full" style={{ background: c.hex }} />
              <span className="text-[10px] text-white/50 font-medium">{c.label}</span>
              {current === c.name && <span className="text-[9px] text-white/70 font-bold">✓ Active</span>}
            </button>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-3">Change takes effect on next page load. No redeploy needed.</p>
      </Card>
    </div>
  )
}

function FreeTierTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  const ft = cfg.freeTier ?? defaultConfig.freeTier
  const upd = (k: string, v: string) => set('freeTier', { ...ft, [k]: v })
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Label>Hero pills (one per line, max 3)</Label>
        <textarea
          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500 resize-none"
          rows={3}
          value={ft.pills.join('\n')}
          onChange={e => set('freeTier', { ...ft, pills: e.target.value.split('\n').filter(Boolean).slice(0,3) })}
        />
      </Card>
      <Card>
        <Label>Gate headline (shown when free limit hit)</Label>
        <Input value={ft.gateHeadline} onChange={v => upd('gateHeadline', v)} placeholder="You've used your 5 free rounds!" />
        <div className="mt-3"><Label>Gate subtext</Label></div>
        <Input value={ft.gateSubtext} onChange={v => upd('gateSubtext', v)} placeholder="Unlock unlimited..." multiline />
        <div className="mt-3"><Label>Upgrade CTA text</Label></div>
        <Input value={ft.gateCtaText} onChange={v => upd('gateCtaText', v)} placeholder="Upgrade to Pro" />
        <div className="mt-3"><Label>Upgrade CTA link</Label></div>
        <Input value={ft.gateCtaHref} onChange={v => upd('gateCtaHref', v)} placeholder="/pro" />
        <div className="mt-3"><Label>Secondary action text</Label></div>
        <Input value={ft.gateSecondaryText} onChange={v => upd('gateSecondaryText', v)} placeholder="Try again tomorrow" />
      </Card>
    </div>
  )
}

function SEOTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  const seo = cfg.seo ?? defaultConfig.seo
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Label>Page title</Label>
        <Input value={seo.title} onChange={v => set('seo', { ...seo, title: v })} placeholder="Kwizzo — Fun Family Quiz Game with AI" />
        <div className="mt-3"><Label>Meta description (140–160 chars)</Label></div>
        <Input value={seo.description} onChange={v => set('seo', { ...seo, description: v })} placeholder="Description..." multiline />
        <div className="text-white/20 text-xs mt-1">{(seo.description ?? '').length} chars</div>
        <div className="mt-3"><Label>LLMs.txt description (for AI tools)</Label></div>
        <Input value={seo.llmsDescription} onChange={v => set('seo', { ...seo, llmsDescription: v })} placeholder="Plain text description for ChatGPT/Claude..." multiline />
      </Card>
    </div>
  )
}

function ChatbotTab({ cfg, set }: { cfg: Partial<SiteConfig>; set: (k: string, v: unknown) => void }) {
  const cb = cfg.chatbot ?? defaultConfig.chatbot
  return (
    <Card>
      <Label>Bot name</Label>
      <Input value={cb.botName} onChange={v => set('chatbot', { ...cb, botName: v })} placeholder="KwizBot" />
      <div className="mt-3"><Label>Welcome message</Label></div>
      <Input value={cb.welcomeMessage} onChange={v => set('chatbot', { ...cb, welcomeMessage: v })} placeholder="Hi! Ready for a quiz?" multiline />
      <div className="mt-3"><Label>Input placeholder</Label></div>
      <Input value={cb.placeholder} onChange={v => set('chatbot', { ...cb, placeholder: v })} placeholder="Ask me about quizzes…" />
    </Card>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

function AppearanceEditor() {
  const params   = useSearchParams()
  const secret   = params.get('secret') ?? ''
  const [tab,    setTab]    = useState<Tab>('hero')
  const [config, setConfig] = useState<Partial<SiteConfig>>({})
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  useEffect(() => {
    fetch(`/api/admin/config?secret=${secret}`)
      .then(r => r.json())
      .then(data => setConfig(data ?? {}))
      .catch(() => setErr('Failed to load config'))
  }, [secret])

  const set = useCallback((key: string, value: unknown) => {
    setConfig(c => ({ ...c, [key]: value }))
    setSaved(false)
  }, [])

  async function save() {
    setSaving(true); setErr('')
    const res = await fetch('/api/admin/config', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body:    JSON.stringify(config),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else setErr('Save failed — check ADMIN_SECRET')
  }

  function reset() {
    if (!confirm('Reset all customisations to defaults?')) return
    setConfig({})
    fetch('/api/admin/config', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body:    JSON.stringify({}),
    })
  }

  const tabProps = { cfg: config, set }

  return (
    <div className="min-h-screen bg-[#07060f] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#07060f]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-base">⚙️ Appearance</span>
            <a href="/" target="_blank" className="text-white/30 text-xs hover:text-white/60 transition-colors">↗ Preview site</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="px-4 py-2 rounded-lg text-xs text-white/30 border border-white/10 hover:text-white/60 hover:border-white/20 transition-all">
              Reset
            </button>
            <button
              onClick={save}
              disabled={saving}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                saved ? 'bg-green-600 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60'
              }`}
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>
        {err && <div className="bg-red-500/10 border-t border-red-500/20 px-6 py-2 text-red-400 text-xs">{err}</div>}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar tabs */}
        <nav className="w-44 shrink-0 flex flex-col gap-1 sticky top-20 self-start">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                tab === t.id
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {tab === 'hero'     && <HeroTab      {...tabProps} />}
              {tab === 'sections' && <SectionsTab  {...tabProps} />}
              {tab === 'content'  && <ContentTab   {...tabProps} />}
              {tab === 'colors'   && <ColorsTab    {...tabProps} />}
              {tab === 'freeTier' && <FreeTierTab  {...tabProps} />}
              {tab === 'seo'      && <SEOTab       {...tabProps} />}
              {tab === 'chatbot'  && <ChatbotTab   {...tabProps} />}
            </motion.div>
          </AnimatePresence>
        </main>
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
