// Free trivia questions — Open Trivia DB, no auth, 4000+ questions
const BASE = 'https://opentdb.com/api.php'

export type TriviaQuestion = {
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  correct_answer: string
  incorrect_answers: string[]
  all_answers: string[]
}

export async function fetchTrivia(amount = 10, category?: number, difficulty?: 'easy' | 'medium' | 'hard'): Promise<TriviaQuestion[]> {
  const params = new URLSearchParams({ amount: String(amount), type: 'multiple', encode: 'url3986' })
  if (category) params.set('category', String(category))
  if (difficulty) params.set('difficulty', difficulty)
  const res = await fetch(`${BASE}?${params}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`OpenTDB error: ${res.status}`)
  const data = await res.json()
  if (data.response_code !== 0) throw new Error(`OpenTDB response_code: ${data.response_code}`)
  return data.results.map((q: any) => ({
    category: decodeURIComponent(q.category),
    difficulty: q.difficulty,
    question: decodeURIComponent(q.question),
    correct_answer: decodeURIComponent(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(decodeURIComponent),
    all_answers: shuffle([decodeURIComponent(q.correct_answer), ...q.incorrect_answers.map(decodeURIComponent)]),
  }))
}

// Popular categories: 9=General, 11=Film, 12=Music, 15=Video Games, 17=Science, 18=Computers, 21=Sport, 22=Geography, 23=History
export const OPENTDB_CATEGORIES = {
  general: 9, film: 11, music: 12, videoGames: 15,
  science: 17, computers: 18, sport: 21, geography: 22, history: 23,
}

function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5)
}
