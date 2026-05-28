// app/page.tsx — SERVER COMPONENT (no 'use client')
// Assembles sections in order from siteConfig.layout.sectionOrder.
// Crawlers (GPTBot, ClaudeBot, PerplexityBot) read plain HTML from every section.
import { siteConfig } from '@/site.config'
import { getSiteFlags } from '@/lib/flags'
import { Suspense } from 'react'
import HeroSection       from '@/components/HeroSection'
import MarqueeBar        from '@/components/MarqueeBar'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesGrid      from '@/components/FeaturesGrid'
import PricingSection    from '@/components/PricingSection'
import FAQSection        from '@/components/FAQSection'
import FinalCTA          from '@/components/FinalCTA'

const SECTION_MAP: Record<string, React.ReactNode> = {
  hero:        <HeroSection />,
  marquee:     <MarqueeBar />,
  howItWorks:  <HowItWorksSection />,
  features:    <Suspense fallback={<div className="h-96" />}><FeaturesGrid /></Suspense>,
  pricing:     <PricingSection />,
  faq:         <FAQSection />,
  finalCta:    <FinalCTA />,
}

export default async function HomePage() {
  const flags = await getSiteFlags('kwizzo')
  const { sectionOrder, hideSections } = siteConfig.layout

  const ecHide: string[] = []
  if (!flags.pricing) ecHide.push('pricing')
  if (flags.waitlist) ecHide.push('pricing', 'finalCta')

  const allHidden = [...new Set([...hideSections, ...ecHide])]
  const visible = sectionOrder.filter(id => !allHidden.includes(id))

  return (
    <div className="flex flex-col">
      {visible.map(id => (
        <div key={id}>
          {SECTION_MAP[id] ?? null}
        </div>
      ))}
    </div>
  )
}
