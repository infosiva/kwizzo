// components/HeroSection.tsx — server component
// Static HTML that crawlers read. HeroClient mounts stagger animation on top.
import { Suspense } from 'react'
import { siteConfig } from '@/site.config'
import { getContentOverrides } from '@/lib/content'
import HeroClient from './HeroClient'
import HeroDemo from './HeroDemo'

export default async function HeroSection() {
  const isSplit    = siteConfig.layout.heroVariant === 'split'
  const isCentered = siteConfig.layout.heroVariant === 'centered'
  const overrides  = await getContentOverrides()

  return (
    <section className="relative px-4 sm:px-6 pt-4 pb-8 max-w-6xl mx-auto">
      <div className={`grid grid-cols-1 ${
        isSplit    ? 'lg:grid-cols-2 gap-8 lg:gap-12 items-center' :
        isCentered ? 'max-w-3xl mx-auto text-center' :
                     'max-w-xl'
      }`}>
        {/* LEFT: HeroClient renders badge, H1, pills, CTAs — always first in DOM */}
        <div className="order-1">
          <HeroClient overrides={overrides} />
        </div>

        {/* RIGHT: game demo — below copy on mobile, alongside on desktop */}
        {!isCentered && (
          <div className="order-2 lg:pl-4 mt-6 lg:mt-0">
            <Suspense fallback={
              <div className="rounded-2xl h-56 animate-pulse" style={{ border: '1px solid #e2e8f0', background: '#f1f5f9' }} />
            }>
              <HeroDemo />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  )
}
