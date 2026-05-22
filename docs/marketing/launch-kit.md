# Kwizzo Marketing Launch Kit
**Date:** 2026-05-22

---

## Product Hunt Launch

### Tagline (60 chars max)
> AI quiz game for family night — no sign-up, plays in 30s

### Description (260 chars)
> Kwizzo uses AI to generate unlimited quiz questions on any topic, instantly. Pick a subject, add your players, and the AI adapts difficulty to each person's age. Free to play — no account, no download. 100+ categories or type any topic you want.

### First Comment (maker's note)
> Hey PH! I built Kwizzo because every "family quiz" app I tried needed an account, took 10 minutes to set up, and used the same recycled questions. Kwizzo generates fresh, unique questions every game — and adapts difficulty so kids and adults can genuinely compete together. The whole thing starts in 30 seconds with no sign-up. Try it → kwizzo.app

### Gallery screenshots needed
1. Hero page (1270×952) — split layout with live game preview
2. Game in progress — question + 4 options + live leaderboard
3. Family mode — 3+ players with different scores
4. Pro wall — session recap + upgrade prompt

---

## Twitter/X Threads

### Thread 1 — Product launch
```
1/ I built an AI quiz game for family night.

No account. No download. Starts in 30 seconds.

Here's how it works 🧵

2/ You pick a topic — anything. "90s movies", "Premier League", "The solar system", whatever.

The AI generates fresh questions instantly. Never the same game twice.

3/ Then you add players by name.

Kid? Gets easier questions.
Teen? Medium difficulty.
Adult? Full challenge.

Everyone competes in the same game. AI handles the levelling.

4/ Live leaderboard updates in real-time as everyone answers.

No app needed. Works on every phone, tablet, and laptop in the room.

5/ 5 rounds free every session. No credit card. No sign-up.

Just: go to kwizzo.app → pick a topic → play.

That's it.

→ https://kwizzo.app
```

### Thread 2 — Feature highlight (quiz night tips)
```
1/ 5 things that make family quiz night actually fun (from building an AI quiz app):

2/ Different difficulty per player.
Kids shouldn't answer "Name all 15 EU founding members". Adults shouldn't answer "What sound does a dog make?"
→ AI solving this = everyone competitive.

3/ Fresh questions every game.
Recycled questions kill the fun after 3 plays. AI generates unique questions each time.

4/ No setup friction.
If it takes more than 60 seconds to start, someone gives up. Zero sign-up = zero drop-off.

5/ A leaderboard everyone can see.
Live scores on a shared screen = tension, trash talk, rematch requests. That's the game.

6/ The option to type any topic.
"Songs from Mum's playlist" is more fun than "Pop Music". Custom topics = personal games.

All of this is in Kwizzo → kwizzo.app (free)
```

### Thread 3 — Behind the build
```
1/ How I built an AI quiz game that generates fresh questions in 2 seconds:

2/ The hard part isn't the AI call. It's the prompt.

"Generate 10 quiz questions" gives terrible output — too easy, repeated, off-topic.

The prompt I use:

3/ System: You are a quiz master. Age group: {ageGroup}. Difficulty: {difficulty}. Topic: {topic}. Every game must be completely different — vary subtopics, question styles, and angles. Return valid JSON only.

4/ The seed trick: I append a random UUID to every request. Forces the AI to treat it as a fresh generation, not a cached response.

Result: genuinely different questions every game.

5/ Fallback chain: Groq → Gemini → Cerebras → Anthropic.

If one provider is down or rate-limited, next one picks up immediately. Users never see a failure.

6/ The whole thing runs on Vercel + Cloudflare. Zero servers to manage.

Full stack: Next.js 16 + Framer Motion + Groq API.

Try it → kwizzo.app
```

---

## LinkedIn Posts

### Post 1 — Problem/solution
```
I kept losing at pub quiz because the questions were always the same recycled 2019 trivia pack.

So I built Kwizzo — an AI quiz game that generates unique questions every game, adapts difficulty to each player's age, and starts in 30 seconds with no account.

100+ topic categories. Or type any subject you want. Science, obscure 80s films, Premier League stats, Tamil cinema — anything.

Free to play. No card. No download.

→ kwizzo.app

What topic would you quiz your family on first?
```

### Post 2 — Founder story
```
6 months ago I had this simple frustration: every family quiz app either needed a £10/month subscription or took 20 minutes to set up.

So I built the thing I wanted to exist.

Kwizzo is an AI quiz game for families. Here's what makes it different:

✓ AI generates questions — never the same game twice
✓ Age-adaptive difficulty — kids and adults compete together fairly  
✓ Zero friction — no account, no download, plays in 30 seconds
✓ 100+ categories or any custom topic you type

Just launched the redesign this week. The whole landing experience is built with server-rendered React for speed and AI-crawlability.

Try it free → kwizzo.app

What would you quiz your family on?
```

---

## SEO Blog Posts (publish to /blog)

### Post 1: "Best AI Quiz Games for Family Night 2026"
**Target keywords:** AI quiz game, family quiz game, quiz night ideas
**Word count:** 1,800
**Outline:**
- Why regular quiz apps get boring fast (recycled questions)
- What AI-powered quizzes do differently
- 5 best AI quiz games reviewed (include Kwizzo #1)
- How to pick the right one for your family
- FAQ (drives FAQPage schema)

### Post 2: "How to Host the Perfect Family Quiz Night"
**Target keywords:** family quiz night, quiz night at home, how to host quiz night
**Word count:** 1,500
**Outline:**
- 7 rules for a great quiz night
- How many rounds, what topics, how to handle different ages
- Tech you need (spoiler: just a phone)
- Free tools (embed Kwizzo demo)
- Printable score sheet (lead magnet)

### Post 3: "100+ Quiz Night Questions for Every Age Group"
**Target keywords:** quiz questions, family quiz questions, easy quiz questions for kids
**Word count:** 2,000+
**Outline:**
- 20 easy questions (ages 6-10)
- 20 medium questions (ages 11-16)
- 20 hard questions (adults)
- 20 science questions
- 20 sport questions
- CTA: "Or let AI generate unlimited questions → Kwizzo"

### Post 4: "AI Quiz Generator — How It Works"
**Target keywords:** AI quiz generator, AI questions generator
**Word count:** 1,200
**Outline:**
- What makes AI-generated questions better
- How Kwizzo's AI adapts to age and difficulty
- Technical overview (LLM + fallback chain)
- Try it live (embedded demo)

---

## Quick Win Channels (do this week)

| Channel | Action | Time |
|---------|--------|------|
| Reddit r/FamilyGames | Post "I built a free AI quiz game" | 20min |
| Reddit r/webdev | Post "I rebuilt my landing with server components for AI crawlers" | 20min |
| IndieHackers | Share "3 months in — lessons from building AI quiz game" | 30min |
| Twitter | Post Thread 1 + screenshot | 10min |
| LinkedIn | Post 1 with screenshot | 10min |
| Product Hunt | Schedule launch (Tuesday 12:01am PST) | 45min |

---

## OG Image Text (for og.png generation)

```
Background: dark violet gradient
Headline: "Quiz night, reinvented."
Subtext: "AI generates unique questions for every player"
Badge: "Free · No sign-up"
URL: kwizzo.app
```
Generate with: `/image-gen` skill using fal.ai FLUX
