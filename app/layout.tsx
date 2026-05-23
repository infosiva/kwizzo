import Script from 'next/script'
import type { Metadata } from 'next'
import { Nunito, Inter } from 'next/font/google'
import SchemaOrg from '@/components/SchemaOrg'

const nunito = Nunito({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-display' })
import './globals.css'
import config from '@/vertical.config'
import { getMeshStyle, getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import PageTracker from '@/components/PageTracker'
import Navbar from '@/components/Navbar'
import ChatBot from '@/components/ChatBot'
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
const colors   = COLOR_MAP[config.themeColor] ?? COLOR_MAP['violet']
const meshStyle = getMeshStyle(config.themeColor)

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        {/* Dynamic mesh gradient bg — changes per vertical */}
        <div style={meshStyle} />
        {/* Animated blob overlays — adds depth and motion to background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="mesh-blob1" style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}55 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob2" style={{ position: 'absolute', top: '30%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}44 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob3" style={{ position: 'absolute', bottom: '-15%', left: '40%', width: 550, height: 550, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}38 0%, transparent 65%)`, filter: 'blur(50px)' }} />
        </div>

        <PageTracker site='kwizzo' />
        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        <ChatBot />
        <FeedbackWidget siteName="Kwizzo" accentColor="#7c3aed" accentColor2="#a855f7" />
        <BackToTop accentColor="#7c3aed" />

        <Footer siteName={config.name} />
      <CookieConsent />
        <StickyFooterCTA />
        <SchemaOrg />
        {/* VPS analytics — HTTP only, skip on production HTTPS */}
        {process.env.NODE_ENV !== 'production' && (
          <>
            <script src="http://31.97.56.148:3098/t.js" data-site="kwizzo.app" defer></script>
            <Script async src="http://31.97.56.148:3100/script.js" data-website-id="4e586861-325d-496a-ae03-3b7ed959875c" strategy="afterInteractive" />
          </>
        )}
      </body>
    </html>
  )
}
