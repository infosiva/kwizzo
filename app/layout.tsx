import Script from 'next/script'
import type { Metadata } from 'next'
import { Nunito, Inter } from 'next/font/google'
import SchemaOrg from '@/components/SchemaOrg'

const nunito = Nunito({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-display' })
import './globals.css'
import config from '@/vertical.config'
import { getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import Navbar from '@/components/Navbar'
import ChatBot from '@/components/ChatBot'
import { getSiteFlags } from '@/lib/flags'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import BackToTop from '@/components/BackToTop'
import CookieConsent from "../components/CookieConsent"
import Footer from "../components/Footer"
import StickyFooterCTA from "../components/StickyFooterCTA"
import { loadSiteTheme, buildThemeStyleTag, isWidgetHidden } from '@/lib/theme-loader'

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

const colors = COLOR_MAP[config.themeColor] ?? COLOR_MAP['amber']

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [flags, theme] = await Promise.all([
    getSiteFlags('kwizzo'),
    loadSiteTheme('kwizzo'),
  ])

  const themeCSS = buildThemeStyleTag(theme, {
    background: '#101026',
    primary: colors.primary,
    secondary: colors.secondary,
  })

  return (
    <html
      lang="en"
      className="h-full"
      style={{
        '--theme-primary':   colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-base':      colors.base,
        '--scrollbar-color': getScrollbarColor(config.themeColor),
      } as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className={`${inter.variable} ${nunito.variable} min-h-full flex flex-col`}
        style={{
          background: '#101026',
          color: '#f1f5f9',
          fontFamily: 'var(--font-body, system-ui)',
        }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Kwizzo",
          "url": "https://kwizzo.app",
          "description": "Create and play AI-powered quizzes with your family. Hundreds of topics, instant questions, all ages.",
          "applicationCategory": "GameApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        }) }} />
        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        {flags.chatbot && !isWidgetHidden(theme, 'chatbot') && <ChatBot />}
        <FeedbackWidget siteName="Kwizzo" accentColor="#3b82f6" accentColor2="#60a5fa" position={flags.chatbot ? 'left' : 'right'} />
        {!isWidgetHidden(theme, 'backToTop') && <BackToTop accentColor="#3b82f6" />}
        <Footer siteName={config.name} />
        {!isWidgetHidden(theme, 'cookieConsent') && <CookieConsent />}
        {!isWidgetHidden(theme, 'stickyFooterCTA') && <StickyFooterCTA />}
        <SchemaOrg />
        <Script defer data-domain="kwizzo.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
