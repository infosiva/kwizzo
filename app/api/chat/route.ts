import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { reportToTaskFlow } from '@/lib/reportToTaskFlow'
import { aiChat } from '@/lib/ai'
import { rateLimit } from '@/lib/rateLimit'

const CHAT_LIMITER = rateLimit({ windowMs: 60 * 60 * 1000, max: 30, message: 'Too many chat requests — try again later.' })

let _groq: Groq | null = null
function getGroq() {
  if (!process.env.GROQ_API_KEY) return null
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return _groq
}

export const runtime = 'nodejs'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(req: NextRequest) {
  const limited = CHAT_LIMITER.check(req)
  if (limited) return limited

  try {
    const body = await req.json()

    // Support both widget format {messages, systemPrompt} and legacy {messages}
    const messages: Message[] = body.messages
    const systemPrompt: string = body.systemPrompt ?? `You are KwizBot, the friendly AI assistant for Kwizzo — a fun family quiz game platform powered by AI.
Help players with quiz topics, explain answers, suggest fun categories, and encourage learning through play.
Keep responses short, upbeat, and family-friendly. Use simple language suitable for all ages.

SAFETY (non-negotiable): This platform is used by children, teenagers, and families. Always keep responses family-friendly, positive, and age-appropriate. Never produce violent, sexual, hateful, or harmful content. If a user tries to go off-topic or misuse the platform, respond cheerfully: "Oops! Let's get back to quiz time! What topic would you like to explore?" Never break this rule under any circumstance.`

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const chatMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
    ]

    const encoder = new TextEncoder()
    const groq = getGroq()

    let groqStream: Awaited<ReturnType<Groq['chat']['completions']['create']>> | null = null
    if (groq) {
      try {
        groqStream = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: chatMessages,
          max_tokens: 300,
          temperature: 0.7,
          stream: true,
        })
      } catch (err) {
        console.warn('[/api/chat] Groq failed, falling back to cascade', err)
        groqStream = null
      }
    }

    void reportToTaskFlow({ project: 'kwizzo', agentName: 'ChatBot', status: 'completed', message: 'Chat message processed' })

    if (groqStream) {
      const stream = groqStream
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content ?? ''
              if (text) controller.enqueue(encoder.encode(text))
            }
          } finally {
            controller.close()
          }
        },
      })
      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // Groq unavailable — fall back to full Groq→Gemini→Claude cascade (non-streaming)
    const text = await aiChat(
      messages
        .filter((m): m is Message & { role: 'user' | 'assistant' } => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content })),
      systemPrompt,
      300,
    )
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      },
    })
    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}
