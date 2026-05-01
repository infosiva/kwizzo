import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import config from '@/vertical.config'
import { isAiTool } from '@/vertical.config'

export interface Question {
  question:    string
  options:     { A: string; B: string; C: string; D: string }
  answer:      'A' | 'B' | 'C' | 'D'
  explanation: string
  difficulty:  'easy' | 'medium' | 'hard'
}

// Hardcoded fallback — used if AI JSON parsing fails
const FALLBACK_QUESTIONS: Question[] = [
  {
    question:    'What is the largest planet in our solar system?',
    options:     { A: 'Earth', B: 'Saturn', C: 'Jupiter', D: 'Neptune' },
    answer:      'C',
    explanation: 'Jupiter is the largest planet — over 1,300 Earths could fit inside it!',
    difficulty:  'easy',
  },
  {
    question:    'Which country has the most natural lakes?',
    options:     { A: 'Russia', B: 'USA', C: 'Brazil', D: 'Canada' },
    answer:      'D',
    explanation: 'Canada has over 60% of the world\'s fresh water lakes — more than any other country.',
    difficulty:  'medium',
  },
  {
    question:    'In which year did the Berlin Wall fall?',
    options:     { A: '1987', B: '1989', C: '1991', D: '1993' },
    answer:      'B',
    explanation: 'The Berlin Wall fell on 9th November 1989, reuniting East and West Germany.',
    difficulty:  'hard',
  },
  {
    question:    'What colour is a polar bear\'s skin underneath its fur?',
    options:     { A: 'White', B: 'Pink', C: 'Black', D: 'Grey' },
    answer:      'C',
    explanation: 'Polar bears have black skin to absorb heat from the sun, while their translucent fur appears white.',
    difficulty:  'easy',
  },
  {
    question:    'How many strings does a standard guitar have?',
    options:     { A: '4', B: '5', C: '6', D: '8' },
    answer:      'C',
    explanation: 'A standard guitar has 6 strings, tuned E-A-D-G-B-E from thickest to thinnest.',
    difficulty:  'easy',
  },
  {
    question:    'Which element has the chemical symbol "Au"?',
    options:     { A: 'Silver', B: 'Gold', C: 'Aluminium', D: 'Argon' },
    answer:      'B',
    explanation: 'Au comes from the Latin word "aurum", meaning gold. It\'s one of the most valuable metals on Earth.',
    difficulty:  'medium',
  },
  {
    question:    'What is the capital city of Australia?',
    options:     { A: 'Sydney', B: 'Melbourne', C: 'Brisbane', D: 'Canberra' },
    answer:      'D',
    explanation: 'Canberra is the capital — chosen as a compromise between rivals Sydney and Melbourne!',
    difficulty:  'easy',
  },
  {
    question:    'How many sides does a hexagon have?',
    options:     { A: '5', B: '6', C: '7', D: '8' },
    answer:      'B',
    explanation: '"Hex" means six in Greek — hexagons appear in honeycombs and snowflakes in nature.',
    difficulty:  'easy',
  },
  {
    question:    'Which ocean is the largest?',
    options:     { A: 'Atlantic', B: 'Indian', C: 'Arctic', D: 'Pacific' },
    answer:      'D',
    explanation: 'The Pacific Ocean covers more than 30% of Earth\'s surface — bigger than all land combined!',
    difficulty:  'easy',
  },
  {
    question:    'Who painted the Mona Lisa?',
    options:     { A: 'Michelangelo', B: 'Raphael', C: 'Leonardo da Vinci', D: 'Caravaggio' },
    answer:      'C',
    explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503–1519. It now hangs in the Louvre, Paris.',
    difficulty:  'easy',
  },
]

function extractJSON(text: string): string {
  // Try to find a JSON block inside markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  // Try to find a raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) return jsonMatch[0]
  return text.trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, members } = body as {
      topic:   string
      members: { name: string; age: number }[]
    }

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    const quizPrompt = isAiTool(config) ? (config.aiQuizPrompt ?? '') : ''
    const ageInfo    = members?.length
      ? `Players: ${members.map(m => `${m.name} (age ${m.age})`).join(', ')}.`
      : 'Mixed age group.'

    const systemPrompt = config.aiSystemPrompt
    const userMessage  = `${quizPrompt}

${ageInfo}
Topic: ${topic}

Generate exactly 10 quiz questions for this topic.
Return ONLY valid JSON in this exact format — no extra text before or after:
{
  "questions": [
    {
      "question": "string",
      "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
      "answer": "A" | "B" | "C" | "D",
      "explanation": "fun fact 1-2 sentences",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}`

    let questions: Question[] = FALLBACK_QUESTIONS

    try {
      const rawResponse = await aiChat(
        [{ role: 'user', content: userMessage }],
        systemPrompt,
      )

      const jsonStr = extractJSON(rawResponse)
      const parsed  = JSON.parse(jsonStr)

      if (Array.isArray(parsed?.questions) && parsed.questions.length > 0) {
        // Validate each question has required fields
        const valid = parsed.questions.filter((q: Partial<Question>) =>
          q.question && q.options?.A && q.options?.B && q.options?.C && q.options?.D
          && q.answer && q.explanation
        ) as Question[]

        if (valid.length >= 3) {
          questions = valid.slice(0, 10)
        }
      }
    } catch {
      // AI failed or JSON parse failed — use fallback
      console.error('[kwizzo] AI question generation failed, using fallback')
    }

    return NextResponse.json({ questions })

  } catch (err) {
    console.error('[kwizzo] /api/quiz/generate error:', err)
    return NextResponse.json(
      { questions: FALLBACK_QUESTIONS },
      { status: 200 }, // still 200 — caller gets fallback questions
    )
  }
}
