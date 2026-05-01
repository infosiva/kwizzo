/**
 * lib/ai.ts — Dynamic best-free-model chain
 *
 * Priority order (cheapest/fastest free tier first):
 *   1. Groq   — llama-3.3-70b-versatile  (free, very fast, high quality)
 *   2. Groq   — gemma2-9b-it              (free fallback within Groq)
 *   3. Gemini — gemini-2.0-flash          (free, latest Google)
 *   4. Gemini — gemini-2.5-flash-preview  (free preview, most capable)
 *   5. Anthropic — claude-haiku-4-5       (paid, last resort only)
 *
 * Models are picked at runtime so upgrading = change one string here.
 */
import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'
import config from '@/vertical.config'

// ── Model roster ─────────────────────────────────────────────
// Change these strings to upgrade without touching caller code
const GROQ_PRIMARY   = 'llama-3.3-70b-versatile'   // best free Groq model as of 2026
const GROQ_FALLBACK  = 'gemma2-9b-it'               // lighter Groq fallback
const GEMINI_PRIMARY = 'gemini-2.0-flash'           // latest stable free Gemini
const GEMINI_HEAVY   = 'gemini-2.5-flash-preview-05-20'  // most capable free preview
const CLAUDE_FALLBACK = 'claude-haiku-4-5-20251001' // cheapest Claude (paid)

// ── Lazy clients — instantiated at request time, not build time ──
function groq()      { return new Groq({ apiKey: process.env.GROQ_API_KEY! }) }
function gemini()    { return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!) }
function anthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }) }

type Msg = { role: 'user' | 'assistant'; content: string }

export async function aiChat(messages: Msg[], systemPrompt?: string): Promise<string> {
  const system = systemPrompt ?? config.aiSystemPrompt
  const groqMsgs = [{ role: 'system' as const, content: system }, ...messages]

  // ── 1. Groq llama-3.3-70b (free, fast, high quality) ─────────
  try {
    const res = await groq().chat.completions.create({
      model:      GROQ_PRIMARY,
      messages:   groqMsgs,
      max_tokens: 700,
      temperature: 0.7,
    })
    const text = res.choices[0]?.message?.content
    if (text) return text
  } catch { /* rate-limited or unavailable — try next */ }

  // ── 2. Groq gemma2-9b (free, lighter fallback) ───────────────
  try {
    const res = await groq().chat.completions.create({
      model:      GROQ_FALLBACK,
      messages:   groqMsgs,
      max_tokens: 700,
    })
    const text = res.choices[0]?.message?.content
    if (text) return text
  } catch { /* fall through */ }

  // ── 3. Gemini 2.0 Flash (free tier, very fast) ───────────────
  try {
    const model = gemini().getGenerativeModel({ model: GEMINI_PRIMARY, systemInstruction: system })
    const history = messages.slice(0, -1).map(m => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))
    const chat = model.startChat({ history })
    const res  = await chat.sendMessage(messages.at(-1)!.content)
    const text = res.response.text()
    if (text) return text
  } catch { /* fall through */ }

  // ── 4. Gemini 2.5 Flash Preview (free, most capable Google) ──
  try {
    const model = gemini().getGenerativeModel({ model: GEMINI_HEAVY, systemInstruction: system })
    const chat  = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role:  m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }))
    })
    const res  = await chat.sendMessage(messages.at(-1)!.content)
    const text = res.response.text()
    if (text) return text
  } catch { /* fall through */ }

  // ── 5. Claude Haiku (paid, absolute last resort) ─────────────
  const res = await anthropic().messages.create({
    model:      CLAUDE_FALLBACK,
    max_tokens: 700,
    system,
    messages,
  })
  return (res.content[0] as { text: string }).text
}

// ── In-memory response cache (per-process, 1h TTL) ───────────
const cache = new Map<string, { text: string; ts: number }>()
const TTL   = 60 * 60 * 1000

export async function aiCached(key: string, fn: () => Promise<string>): Promise<string> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < TTL) return hit.text
  const text = await fn()
  cache.set(key, { text, ts: Date.now() })
  return text
}
