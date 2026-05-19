/**
 * site.config.ts — Kwizzo site-wide content config
 * All landing page text lives here — no hardcoded JSX strings.
 */

export const siteConfig = {
  siteName: 'Kwizzo',
  domain: 'kwizzo.app',
  tagline: 'Fun Family Quiz Game with AI',
  headline: 'The AI quiz game your whole family will love',
  subheadline: 'AI generates age-perfect questions for every player — no account needed, starts in 30 seconds.',
  ctaPrimary: 'Play Free Now',
  ctaSecondary: 'Family Mode',

  seo: {
    title: 'Kwizzo — Fun Family Quiz Game with AI',
    description: 'Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.',
    ogImage: '/og-kwizzo.png',
  },

  nav: [
    { label: 'Home',     href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Topics',   href: '/#subjects' },
    { label: 'Pricing',  href: '/#why-pro' },
    { label: 'About',    href: '/about' },
  ],

  features: [
    { icon: '⚡', title: 'Instant AI Questions',    desc: 'Fresh questions every game — AI generates from 100+ topics in seconds.' },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Mode',           desc: 'Add every player by name. AI adjusts difficulty per age automatically.' },
    { icon: '🏆', title: 'Live Leaderboard',        desc: 'Real-time scores as you play. Crown the champion at the end.' },
    { icon: '📱', title: 'Any Device',              desc: 'Works perfectly on phones, tablets and laptops — no app to download.' },
    { icon: '🆓', title: 'Free Forever',            desc: '3 rounds free every session. No credit card. No sign-up required.' },
    { icon: '🎯', title: 'All Ages Welcome',        desc: 'Kids get easier questions, adults get harder. Everyone plays together.' },
  ],

  pricing: [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      highlight: false,
      features: [
        '3 free rounds per session',
        '10 standard categories',
        'Solo & group modes',
        'Basic leaderboard',
      ],
      cta: 'Play Free Now',
      ctaHref: '/play?mode=solo',
    },
    {
      name: 'Pro Family',
      price: '$5',
      period: '/month',
      highlight: true,
      badge: 'Popular',
      features: [
        'Unlimited quiz categories',
        'Custom quiz creation',
        'Family leaderboard',
        'No ads — ever',
        'Priority AI responses',
        'Export results & scorecards',
      ],
      cta: 'Upgrade to Pro',
      ctaHref: '/pro',
    },
  ],

  trustPills: [
    '✓ No account needed',
    '✓ Any device',
    '✓ Fresh AI questions',
    '✓ All ages',
  ],

  chatbot: {
    welcomeMessage: 'Hi! Ready for a family quiz? I can help you create one.',
    botName: 'KwizBot',
    placeholder: 'Ask me about quizzes…',
  },
} as const
