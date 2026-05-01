import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import config from '@/vertical.config'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:       config.metaTitle,
  description: config.metaDescription,
  keywords:    config.keywords,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full flex flex-col text-white`}>
        <div className="mesh-bg" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
            <span>© {new Date().getFullYear()} {config.name}. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy</a>
              <a href="/terms"   className="hover:text-white/70 transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white/70 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
