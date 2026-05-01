'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { theme, btn } from '@/lib/theme'
import config from '@/vertical.config'

interface Msg { role: 'user' | 'assistant'; content: string }

export default function ChatWidget({ onClose }: { onClose?: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: `Hi! I'm your ${config.name} assistant. Tell me a bit about what you're looking for and I'll find the perfect ${config.providerLabel.toLowerCase()} for you. 😊` }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoad]  = useState(false)
  const bottomRef           = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const newMsgs: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setLoad(true)

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs.slice(-10) }), // last 10 turns
      })
      const data = await res.json()
      setMsgs(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-white" />
          <span className="font-semibold text-white text-sm">AI {config.providerLabel} Matcher</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? `bg-gradient-to-r ${theme.gradient} text-white`
                : 'glass text-white/85'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="typing-dot text-white/50" />
              <span className="typing-dot text-white/50" />
              <span className="typing-dot text-white/50" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <input
            className="input-dark flex-1 text-sm py-2.5"
            placeholder={`Describe what you need...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white disabled:opacity-40 transition-all flex items-center gap-1.5`}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-white/25 text-xs mt-2 text-center">Powered by AI — free to use</p>
      </div>
    </div>
  )
}
