'use client'
// components/FAQSection.tsx — Radix accordion, config-driven
// Content mirrors SchemaOrg JSON-LD — single source of truth in siteConfig.faq
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '@/site.config'

export default function FAQSection() {
  return (
    <section id="faq" className="py-14 px-4 sm:px-6 max-w-3xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Frequently asked questions</h2>
        <p className="text-white/40 text-sm">Everything you need to know</p>
      </div>

      <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
        {siteConfig.faq.map((item, i) => (
          <Accordion.Item
            key={i}
            value={String(i)}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
          >
            <Accordion.Trigger
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white/80 hover:text-white transition-colors group"
            >
              {item.q}
              <ChevronDown
                size={16}
                className="text-white/30 group-data-[state=open]:rotate-180 transition-transform duration-200 shrink-0 ml-3"
              />
            </Accordion.Trigger>
            <Accordion.Content className="px-5 pb-4 text-sm text-white/50 leading-relaxed data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              {item.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
