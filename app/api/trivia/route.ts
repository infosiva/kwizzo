import { fetchTrivia, OPENTDB_CATEGORIES } from '@/lib/trivia'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const amount = Math.min(Number(searchParams.get('amount') || 10), 50)
  const categoryKey = searchParams.get('category') as keyof typeof OPENTDB_CATEGORIES | null
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null
  try {
    const questions = await fetchTrivia(amount, categoryKey ? OPENTDB_CATEGORIES[categoryKey] : undefined, difficulty || undefined)
    return NextResponse.json({ questions, count: questions.length, source: 'opentdb' })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'failed' }, { status: 500 })
  }
}
