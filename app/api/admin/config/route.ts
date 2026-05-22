import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync } from 'fs'
import path from 'path'

function isAuthorised(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  const auth = req.headers.get('x-admin-secret') ?? req.nextUrl.searchParams.get('secret')
  return auth === secret
}

const ALLOWED_KEYS = ['heroBadge', 'headline', 'subheadline', 'freeTier', 'finalCta', 'layout', 'seo', 'chatbot']

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const body = await req.json()
    const sanitised: Record<string, unknown> = {}
    for (const key of ALLOWED_KEYS) {
      if (key in body) sanitised[key] = body[key]
    }
    const filePath = path.join(process.cwd(), 'public', 'site-config.json')
    writeFileSync(filePath, JSON.stringify(sanitised, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const filePath = path.join(process.cwd(), 'public', 'site-config.json')
    const content = readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch {
    return NextResponse.json({})
  }
}
