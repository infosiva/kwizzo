import Script from 'next/script'
import type { Metadata } from 'next'
import { Nunito, Inter } from 'next/font/google'
import SchemaOrg from '@/components/SchemaOrg'

const nunito = Nunito({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-display' })
import './globals.css'
import config from '@/vertical.config'
import { getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import PageTracker from '@/components/PageTracker'
import Navbar from '@/components/Navbar'
import ChatBot from '@/components/ChatBot'
import { getSiteFlags } from '@/lib/flags'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import BackToTop from '@/components/BackToTop'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";
import StickyFooterCTA from "../components/StickyFooterCTA";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title:       'Kwizzo — Fun Family Quiz Game with AI',
  description: 'Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.',
  keywords:    config.keywords,
  metadataBase: new URL('https://kwizzo.app'),
  alternates:   { canonical: '/' },
  openGraph: {
    title:       'Kwizzo — Fun Family Quiz Game with AI',
    description: 'Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.',
    url:         'https://kwizzo.app',
    siteName:    'Kwizzo',
    type:        'website',
    locale:      'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Kwizzo — Fun Family Quiz Game with AI',
    description: 'Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.',
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true },
  },
}

// Derive CSS custom properties from vertical theme at build time
const colors = COLOR_MAP[config.themeColor] ?? COLOR_MAP['violet']

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getSiteFlags('kwizzo')
  return (
    <html
      lang="en"
      className="h-full"
      style={{
        // CSS vars consumed by globals.css animations and scrollbar
        '--theme-primary':   colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-base':      colors.base,
        '--scrollbar-color': getScrollbarColor(config.themeColor),
      } as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${nunito.variable} min-h-full flex flex-col text-white`}
        style={{ background: colors.base, fontFamily: 'var(--font-body, system-ui)' }}
      >
        {/* Aurora background + grain */}
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        <div className="grain" aria-hidden />

        <PageTracker site='kwizzo' />
        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        {flags.chatbot && <ChatBot />}
        <FeedbackWidget siteName="Kwizzo" accentColor="#7c3aed" accentColor2="#a855f7" />
        <BackToTop accentColor="#7c3aed" />

        <Footer siteName={config.name} />
      <CookieConsent />
        <StickyFooterCTA />
        <SchemaOrg />
        <Script defer data-domain="kwizzo.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        <Script defer data-site="kwizzo.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
