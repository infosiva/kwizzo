import type { Metadata } from 'next'
import { Nunito, Inter } from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-display' })
import './globals.css'
import config from '@/vertical.config'
import { getMeshStyle, getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import Navbar from '@/components/Navbar'
import ChatBot from '@/components/ChatBot'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title:       config.metaTitle,
  description: 'Discover Kwizzo, the ultimate AI-generated quiz platform for all ages. Play for free, no sign-up needed! Join 10,000+ players and start your quiz journey today!',
  keywords:    config.keywords,
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
        style={{ fontFamily: 'var(--font-body, system-ui)' }}
        style={{ background: colors.base }}
      >
        {/* Dynamic mesh gradient bg — changes per vertical */}
        <div style={meshStyle} />
        {/* Animated blob overlays — adds depth and motion to background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="mesh-blob1" style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}55 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob2" style={{ position: 'absolute', top: '30%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}44 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob3" style={{ position: 'absolute', bottom: '-15%', left: '40%', width: 550, height: 550, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}38 0%, transparent 65%)`, filter: 'blur(50px)' }} />
        </div>

        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        <ChatBot />
        <FeedbackWidget siteName="Kwizzo" accentColor="#7c3aed" accentColor2="#a855f7" />

        <Footer siteName={config.name} />
      <CookieConsent />
      </body>
    </html>
  )
}
