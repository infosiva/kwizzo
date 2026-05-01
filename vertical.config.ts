/**
 * vertical.config.ts — THE ONLY FILE THAT CHANGES PER DEPLOYMENT
 *
 * Copy this file, fill in your vertical, deploy to Vercel.
 * All other code reads from this config at runtime.
 */

export type PricingModel = 'hourly' | 'fixed' | 'session' | 'quote'
export type BookingFlow  = 'instant' | 'quote_first' | 'consult_first'

export interface VerticalConfig {
  // ── Identity ────────────────────────────────────────────
  id:          string   // slug used in URLs, DB tables, etc.
  name:        string   // "CleanFast" / "ElderCare+" / "TuneUp"
  tagline:     string
  domain:      string   // final domain, used in metadata
  themeColor:  string   // tailwind color name: "blue" | "emerald" | "violet" etc.

  // ── Provider terminology ─────────────────────────────────
  providerLabel:  string  // "Cleaner" | "Carer" | "Mechanic" | "Tutor"
  providerPlural: string  // "Cleaners" | "Carers" | "Mechanics" | "Tutors"
  consumerLabel:  string  // "Client" | "Family" | "Driver" | "Student"

  // ── Service categories ───────────────────────────────────
  categories: Category[]

  // ── Booking ──────────────────────────────────────────────
  pricingModel:   PricingModel
  bookingFlow:    BookingFlow
  minPrice:       number   // £ — floor for AI price suggestion
  maxPrice:       number   // £ — ceiling
  sessionMinutes: number   // default session length
  platformFeePercent: number

  // ── AI context ───────────────────────────────────────────
  aiSystemPrompt: string   // injected into every AI call
  aiMatchHints:   string[] // extra signals for provider matching

  // ── Features (toggle) ───────────────────────────────────
  features: {
    backgroundCheck:  boolean
    portfolioPhotos:  boolean
    videoIntro:       boolean
    instantBook:      boolean
    recurringBook:    boolean
    homeVisit:        boolean
    remoteSession:    boolean
    groupSession:     boolean
    insuranceBadge:   boolean
    aiDiagnosis:      boolean   // e.g. car fault codes before mechanic
    careJournal:      boolean   // e.g. daily notes for elder care
  }

  // ── SEO / meta ───────────────────────────────────────────
  metaTitle:       string
  metaDescription: string
  keywords:        string[]
}

export interface Category {
  id:    string
  label: string
  icon:  string  // emoji or lucide icon name
  desc:  string
}

// ════════════════════════════════════════════════════════════
// ACTIVE VERTICAL — swap this to change the entire app
// ════════════════════════════════════════════════════════════

const config: VerticalConfig = {
  // ── Elder Care ───────────────────────────────────────────
  id:         'eldercare',
  name:       'ElderCare+',
  tagline:    'Trusted carers for your loved ones — found in minutes, not days',
  domain:     'eldercare.plus',
  themeColor: 'violet',

  providerLabel:  'Carer',
  providerPlural: 'Carers',
  consumerLabel:  'Family',

  categories: [
    { id: 'companionship',  label: 'Companionship',       icon: '🤝', desc: 'Social visits, conversation, light outings' },
    { id: 'personal-care',  label: 'Personal Care',       icon: '🛁', desc: 'Bathing, dressing, hygiene assistance' },
    { id: 'dementia',       label: 'Dementia Support',    icon: '🧠', desc: 'Specialist memory care at home' },
    { id: 'medication',     label: 'Medication Prompts',  icon: '💊', desc: 'Reminders, administration support' },
    { id: 'mobility',       label: 'Mobility Assistance', icon: '🦽', desc: 'Transfers, exercise, fall prevention' },
    { id: 'night-care',     label: 'Overnight / Live-in', icon: '🌙', desc: '24hr or night-shift live-in care' },
    { id: 'post-hospital',  label: 'Post-Hospital Care',  icon: '🏥', desc: 'Recovery support after discharge' },
    { id: 'end-of-life',    label: 'Palliative Support',  icon: '🕊️', desc: 'Compassionate end-of-life companionship' },
  ],

  pricingModel:        'hourly',
  bookingFlow:         'consult_first',
  minPrice:            15,
  maxPrice:            40,
  sessionMinutes:      60,
  platformFeePercent:  12,

  aiSystemPrompt: `You are a compassionate care coordinator for ElderCare+.
Help families find the right carer for their elderly relative.
Ask about: the person's age, main challenges, preferred schedule,
personality (quiet/social), whether they have dementia or mobility issues,
and whether family can be present during visits.
Never give medical advice. Always recommend consulting a GP.
Be warm, empathetic, and reassuring — families are often stressed.`,

  aiMatchHints: [
    'dementia certification', 'moving and handling trained',
    'first aid', 'palliative care experience', 'live-in experience',
    'driving licence', 'same-gender preference',
  ],

  features: {
    backgroundCheck:  true,
    portfolioPhotos:  true,
    videoIntro:       true,
    instantBook:      false,
    recurringBook:    true,
    homeVisit:        true,
    remoteSession:    false,
    groupSession:     false,
    insuranceBadge:   true,
    aiDiagnosis:      false,
    careJournal:      true,
  },

  metaTitle:       'ElderCare+ — Find Trusted Home Carers Near You',
  metaDescription: 'AI-matched home carers for older adults. Background-checked, insured, reviewed by real families. Book a free consultation today.',
  keywords:        ['home carer', 'elder care', 'elderly care at home', 'dementia carer', 'live-in carer'],
}

export default config

// ════════════════════════════════════════════════════════════
// OTHER VERTICALS (copy + swap the export above)
// ════════════════════════════════════════════════════════════

export const PRESETS: Record<string, Partial<VerticalConfig>> = {
  mechanics: {
    id: 'mechanics', name: 'MechFix', themeColor: 'orange',
    tagline: 'Find a trusted local mechanic — AI pre-diagnosis included',
    providerLabel: 'Mechanic', providerPlural: 'Mechanics', consumerLabel: 'Driver',
    pricingModel: 'quote', bookingFlow: 'quote_first',
    features: { backgroundCheck:false, portfolioPhotos:true, videoIntro:false,
      instantBook:false, recurringBook:false, homeVisit:true, remoteSession:false,
      groupSession:false, insuranceBadge:true, aiDiagnosis:true, careJournal:false },
  },
  music: {
    id: 'music', name: 'TuneUp', themeColor: 'indigo',
    tagline: 'Learn any instrument from verified local tutors',
    providerLabel: 'Tutor', providerPlural: 'Tutors', consumerLabel: 'Student',
    pricingModel: 'session', bookingFlow: 'instant',
    features: { backgroundCheck:true, portfolioPhotos:true, videoIntro:true,
      instantBook:true, recurringBook:true, homeVisit:true, remoteSession:true,
      groupSession:true, insuranceBadge:false, aiDiagnosis:false, careJournal:false },
  },
  wedding: {
    id: 'wedding', name: 'WedFlow', themeColor: 'rose',
    tagline: 'Every wedding vendor you need — curated, reviewed, instantly bookable',
    providerLabel: 'Vendor', providerPlural: 'Vendors', consumerLabel: 'Couple',
    pricingModel: 'fixed', bookingFlow: 'quote_first',
    features: { backgroundCheck:false, portfolioPhotos:true, videoIntro:true,
      instantBook:false, recurringBook:false, homeVisit:false, remoteSession:false,
      groupSession:false, insuranceBadge:false, aiDiagnosis:false, careJournal:false },
  },
  nutrition: {
    id: 'nutrition', name: 'NutriCoach', themeColor: 'green',
    tagline: 'Personalised nutrition coaching — AI-matched to your goals',
    providerLabel: 'Nutritionist', providerPlural: 'Nutritionists', consumerLabel: 'Client',
    pricingModel: 'session', bookingFlow: 'consult_first',
    features: { backgroundCheck:false, portfolioPhotos:false, videoIntro:true,
      instantBook:false, recurringBook:true, homeVisit:false, remoteSession:true,
      groupSession:true, insuranceBadge:true, aiDiagnosis:false, careJournal:true },
  },
}
