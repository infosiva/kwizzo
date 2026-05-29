// site.config.ts — THE ONLY FILE TO EDIT to rebrand or reconfigure this site
// All sections, copy, FAQ, pricing, and layout variants are driven from here.

export type HeroVariant = 'split' | 'centered' | 'minimal'

export interface SiteConfig {
  siteName: string
  domain: string
  themeColor: string
  heroBadge: string
  headline: string[]
  subheadline: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary: { text: string; href: string }
  freeTier: {
    pills: string[]
    gateHeadline: string
    gateSubtext: string
    gateCtaText: string
    gateCtaHref: string
    gateSecondaryText: string
  }
  socialProof: {
    marqueeItems: string[]
    stat?: string
  }
  howItWorks: Array<{ step: number; icon: string; title: string; desc: string }>
  features: Array<{ icon: string; title: string; desc: string; size?: 'large' | 'wide' | 'medium' }>
  pricing: {
    free: { name: string; price: string; period: string; features: Array<{ text: string; included: boolean }>; cta: { text: string; href: string } }
    pro:  { name: string; price: string; period: string; badge?: string; features: Array<{ text: string; included: boolean }>; cta: { text: string; href: string } }
  }
  faq: Array<{ q: string; a: string }>
  finalCta: { headline: string; subtext: string; ctaText: string; ctaHref: string }
  layout: { heroVariant: HeroVariant; sectionOrder: string[]; hideSections: string[] }
  seo: { title: string; description: string; ogImage: string; llmsDescription: string }
  nav: Array<{ label: string; href: string }>
  chatbot: { welcomeMessage: string; botName: string; placeholder: string }
}

export const siteConfig: SiteConfig = {
  siteName:   'Kwizzo',
  domain:     'kwizzo.app',
  themeColor: 'violet',

  heroBadge:    '🎮 Free to play · No account needed',
  headline:     ['Quiz night that never', 'repeats itself.'],
  subheadline:  'AI generates fresh questions every round — any topic, every age. Never the same game twice. 30 seconds to start.',
  ctaPrimary:   { text: '🎮 Play Free Tonight', href: '/play?mode=solo' },
  ctaSecondary: { text: '👨‍👩‍👧 Family Mode',     href: '/play?mode=group' },

  freeTier: {
    pills:             ['🎮 5 rounds free', '👪 All ages', '📱 No download'],
    gateHeadline:      "You've used your 5 free rounds!",
    gateSubtext:       "That was fun. Unlock unlimited rounds for the whole family.",
    gateCtaText:       'Upgrade to Pro — £3.99/mo',
    gateCtaHref:       '/pro',
    gateSecondaryText: 'Play again free tomorrow',
  },

  socialProof: {
    marqueeItems: [
      '🔬 Science', '📜 History', '⚽ Sport', '🎵 Music',
      '🎬 Film', '💻 Tech', '🌍 Geography', '🍳 Food',
      '📚 Literature', '🎨 Art', '🐾 Animals', '🚀 Space',
    ],
  },

  howItWorks: [
    { step: 1, icon: '🎯', title: 'Pick your topic',   desc: 'Choose from Sports, History, Movies, Science and 100+ more — or type anything.' },
    { step: 2, icon: '⚡', title: 'AI drops questions', desc: 'Fresh questions generated in seconds. Never the same game twice.' },
    { step: 3, icon: '🏆', title: 'Battle it out',     desc: 'Live scores update as everyone answers. Crown the family champion.' },
  ],

  features: [
    { icon: '⚡', title: 'Instant AI Questions', desc: 'Fresh questions every game — AI generates from 100+ topics in seconds.',          size: 'large'  },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Mode',        desc: 'Add every player by name. AI adjusts difficulty per age automatically.',         size: 'medium' },
    { icon: '🏆', title: 'Live Leaderboard',     desc: 'Real-time scores as you play. Crown the champion at the end.',                     size: 'medium' },
    { icon: '📱', title: 'Any Device',           desc: 'Works perfectly on phones, tablets and laptops — no app to download.',             size: 'medium' },
    { icon: '🎯', title: 'All Ages Welcome',     desc: 'Kids get easier questions, adults get harder. Everyone plays together.',           size: 'wide'   },
  ],

  pricing: {
    free: {
      name: 'Free', price: '$0', period: 'forever',
      features: [
        { text: '5 rounds per session',   included: true  },
        { text: '10 standard categories', included: true  },
        { text: 'Solo & group modes',     included: true  },
        { text: 'Live leaderboard',       included: true  },
        { text: 'Custom quiz topics',     included: false },
        { text: 'No ads',                 included: false },
      ],
      cta: { text: 'Play Free Now', href: '/play?mode=solo' },
    },
    pro: {
      name: 'Pro Family', price: '$5', period: '/month', badge: 'Popular',
      features: [
        { text: 'Unlimited rounds',            included: true },
        { text: 'All 100+ categories',         included: true },
        { text: 'Custom quiz creation',        included: true },
        { text: 'No ads — ever',               included: true },
        { text: 'Priority AI responses',       included: true },
        { text: 'Export results & scorecards', included: true },
      ],
      cta: { text: 'Upgrade to Pro', href: '/pro' },
    },
  },

  faq: [
    { q: 'Is Kwizzo free to use?',
      a: 'Yes — Kwizzo is free to play. You get 5 rounds every session with no credit card or account required.' },
    { q: 'How does Kwizzo generate quiz questions?',
      a: 'Kwizzo uses AI to instantly generate age-appropriate questions on any topic — from science and history to pop culture and sport. Questions are unique every game.' },
    { q: 'Can I play with my whole family?',
      a: "Yes. Family Mode lets you add every player by name. The AI adjusts question difficulty automatically based on each player's age group." },
    { q: 'Does Kwizzo work on phones and tablets?',
      a: 'Kwizzo works on any device with a browser — phones, tablets, and laptops. No download required.' },
    { q: 'What does Pro include?',
      a: "Pro unlocks unlimited rounds, all 100+ categories, custom quiz topics, a no-ad experience, and the ability to export scorecards. It's £3.99/month for the whole family." },
  ],

  finalCta: {
    headline: 'Ready to play?',
    subtext:  'Free forever. No account needed. Works on any device.',
    ctaText:  '🎮 Start Playing Free',
    ctaHref:  '/play?mode=solo',
  },

  layout: {
    heroVariant:  'split',
    sectionOrder: ['hero', 'marquee', 'howItWorks', 'features', 'pricing', 'faq', 'finalCta'],
    hideSections: [],
  },

  seo: {
    title:          'Kwizzo — Fun Family Quiz Game with AI',
    description:    'Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.',
    ogImage:        '/og-kwizzo.png',
    llmsDescription: 'Kwizzo is a free AI-powered family quiz game at kwizzo.app. It generates unique quiz questions on any topic instantly, supports family multiplayer with age-adaptive difficulty, and requires no account to play. Free tier: 5 rounds per session. Pro: unlimited rounds, custom topics, no ads.',
  },

  nav: [
    { label: 'Home',         href: '/' },
    { label: 'Features',    href: '/#features' },
    { label: 'How it works',href: '/#how-it-works' },
    { label: 'Pricing',     href: '/#pricing' },
    { label: 'About',        href: '/about' },
  ],

  chatbot: {
    welcomeMessage: 'Pick a topic and I\'ll generate a quiz that\'s never been played before — any subject, any age group.',
    botName:        'KwizBot',
    placeholder:    'Ask me about quizzes…',
  },
}

export default siteConfig
