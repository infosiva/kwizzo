// components/HeroSection.tsx — server component
// Static HTML that crawlers read. HeroClient mounts stagger animation on top.
import { Suspense } from 'react'
import { siteConfig } from '@/site.config'
import HeroClient from './HeroClient'
import HeroDemo from './HeroDemo'

export default function HeroSection() {
  const isSplit    = siteConfig.layout.heroVariant === 'split'
  const isCentered = siteConfig.layout.heroVariant === 'centered'

  return (
    <section className="relative px-4 sm:px-6 pt-6 pb-10 max-w-6xl mx-auto">
      <div className={`grid grid-cols-1 ${
        isSplit    ? 'lg:grid-cols-2 gap-12 items-center' :
        isCentered ? 'max-w-3xl mx-auto text-center' :
                     'max-w-xl'
      }`}>
        {/* LEFT: HeroClient renders badge, H1, pills, CTAs with Framer stagger */}
        <div>
          <HeroClient />
        </div>

        {/* RIGHT: game demo — only in split/minimal variants */}
        {!isCentered && (
          <div className="lg:pl-4">
            <Suspense fallback={
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] h-72 animate-pulse" />
            }>
              <HeroDemo />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  )
}
