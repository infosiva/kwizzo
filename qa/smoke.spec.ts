// qa/smoke.spec.ts — 10-check global smoke test
// Identical across kwizzo / tutiq / quizbites — only env vars differ.
import { test, expect } from '@playwright/test'

const BASE   = process.env.BASE_URL    ?? 'http://localhost:3000'
const ROUTES = (process.env.SMOKE_ROUTES ?? '/,/play,/about').split(',')

// 1. All nav routes return 200
for (const route of ROUTES) {
  test(`route ${route} returns 200`, async ({ request }) => {
    const res = await request.get(`${BASE}${route}`)
    expect(res.status()).toBe(200)
  })
}

// 2. H1 present in server-rendered HTML (no JS executed)
test('H1 present in raw server-rendered HTML', async ({ request }) => {
  const res  = await request.get(BASE)
  const html = await res.text()
  expect(html).toMatch(/<h1[^>]*>/i)
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  expect(match?.[1]?.replace(/<[^>]+>/g, '').trim().length).toBeGreaterThan(3)
})

// 3. Primary CTA visible + has href to /play
test('primary CTA is visible with correct href', async ({ page }) => {
  await page.goto(BASE)
  const cta = page.locator('#hero-play-btn a, #hero-play-btn button').first()
  await expect(cta).toBeVisible({ timeout: 10_000 })
  const href = await cta.getAttribute('href')
  expect(href).toMatch(/\/play/)
})

// 4. No horizontal overflow at 375px mobile
test('no horizontal overflow on mobile (375px)', async ({ browser }) => {
  const ctx  = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const page = await ctx.newPage()
  await page.goto(BASE)
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  expect(overflow).toBe(false)
  await ctx.close()
})

// 5. No unexpected JS console errors
test('no JS console errors on homepage', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      if (!text.includes('adsbygoogle') && !text.includes('31.97.56.148')) {
        errors.push(text)
      }
    }
  })
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  expect(errors).toHaveLength(0)
})

// 6. FAQPage schema present in JSON-LD
test('FAQPage JSON-LD schema is present', async ({ page }) => {
  await page.goto(BASE)
  const schemas = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    return scripts.map(s => { try { return JSON.parse(s.textContent ?? '') } catch { return null } })
  })
  const flat = (schemas as Array<unknown>).flat().filter(Boolean)
  const hasFaq = flat.some((s) => {
    if (typeof s !== 'object' || s === null) return false
    const obj = s as Record<string, unknown>
    return obj['@type'] === 'FAQPage' ||
      (Array.isArray(obj) && (obj as Array<Record<string, unknown>>).some(x => x['@type'] === 'FAQPage'))
  })
  expect(hasFaq).toBe(true)
})

// 7. /robots.txt allows GPTBot
test('/robots.txt allows GPTBot', async ({ request }) => {
  const res  = await request.get(`${BASE}/robots.txt`)
  expect(res.status()).toBe(200)
  const text = await res.text()
  expect(text).toContain('GPTBot')
  expect(text).not.toMatch(/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//m)
})

// 8. /llms.txt returns 200
test('/llms.txt is accessible', async ({ request }) => {
  const res = await request.get(`${BASE}/llms.txt`)
  expect(res.status()).toBe(200)
  const text = await res.text()
  expect(text.length).toBeGreaterThan(50)
})

// 9. POST /api/quiz returns 200 within 10s
test('POST /api/quiz/generate returns 200', async ({ request }) => {
  const res = await request.post(`${BASE}/api/quiz/generate`, {
    data:    { subject: 'general', difficulty: 'easy', playerCount: 1, ageGroups: ['adults'] },
    timeout: 10_000,
  })
  expect([200, 201]).toContain(res.status())
})

// 10. AdBanner not visible on first paint (scroll-gated)
test('AdBanner not visible on first paint', async ({ page }) => {
  await page.goto(BASE)
  await page.waitForTimeout(1500)
  const adVisible = await page.evaluate(() => {
    const ins = document.querySelector('.adsbygoogle')
    if (!ins) return false
    const rect = ins.getBoundingClientRect()
    return rect.height > 10 && rect.top < window.innerHeight
  })
  expect(adVisible).toBe(false)
})
