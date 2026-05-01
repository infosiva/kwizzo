'use client'
import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import config from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import ProviderCard, { Provider } from '@/components/ProviderCard'

// Demo data — replace with Supabase query
const DEMO_PROVIDERS: Provider[] = [
  {
    id: 'p1', name: 'Amelia Rose', avatar: 'https://i.pravatar.cc/150?img=47',
    headline: `Specialist ${config.categories[0]?.label} · 8 years experience`,
    category: config.categories[0]?.id ?? '',
    rating: 4.9, reviewCount: 124, hourlyRate: 22, responseMin: 8,
    location: 'Richmond, SW', badges: ['DBS Checked', 'First Aid', 'Dementia Care'],
    verified: true,
  },
  {
    id: 'p2', name: 'David Okafor', avatar: 'https://i.pravatar.cc/150?img=52',
    headline: `${config.categories[1]?.label} & live-in support`,
    category: config.categories[1]?.id ?? '',
    rating: 4.8, reviewCount: 87, hourlyRate: 19, responseMin: 15,
    location: 'Twickenham', badges: ['DBS Checked', 'NVQ Level 3'],
    verified: true,
  },
  {
    id: 'p3', name: 'Fatima Hassan', avatar: 'https://i.pravatar.cc/150?img=44',
    headline: `Palliative & ${config.categories[2]?.label}`,
    category: config.categories[2]?.id ?? '',
    rating: 5.0, reviewCount: 56, hourlyRate: 28, responseMin: 5,
    location: 'Kingston', badges: ['DBS Checked', 'Palliative Care', 'Driving'],
    verified: true,
  },
  {
    id: 'p4', name: 'George Williams', avatar: 'https://i.pravatar.cc/150?img=33',
    headline: `${config.categories[3]?.label} support specialist`,
    category: config.categories[3]?.id ?? '',
    rating: 4.7, reviewCount: 210, hourlyRate: 17, responseMin: 20,
    location: 'Wandsworth', badges: ['DBS Checked', 'Mental Health Aware'],
    verified: false,
  },
  {
    id: 'p5', name: 'Mei Lin', avatar: 'https://i.pravatar.cc/150?img=25',
    headline: `Overnight & ${config.categories[5]?.label}`,
    category: config.categories[5]?.id ?? '',
    rating: 4.9, reviewCount: 43, hourlyRate: 31, responseMin: 10,
    location: 'Putney', badges: ['DBS Checked', 'Live-in Certified', 'Bilingual'],
    verified: true,
  },
  {
    id: 'p6', name: 'Thomas Berg', avatar: 'https://i.pravatar.cc/150?img=60',
    headline: `Post-hospital recovery & ${config.categories[4]?.label}`,
    category: config.categories[4]?.id ?? '',
    rating: 4.6, reviewCount: 78, hourlyRate: 20, responseMin: 30,
    location: 'East Sheen', badges: ['DBS Checked', 'Physiotherapy Support'],
    verified: true,
  },
]

export default function SearchPage() {
  const [query,    setQuery]    = useState('')
  const [category, setCat]      = useState('')
  const [maxPrice, setMaxPrice] = useState(50)

  const filtered = DEMO_PROVIDERS.filter(p => {
    const matchQ = !query    || p.name.toLowerCase().includes(query.toLowerCase()) || p.headline.toLowerCase().includes(query.toLowerCase())
    const matchC = !category || p.category === category
    const matchP = p.hourlyRate <= maxPrice
    return matchQ && matchC && matchP
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Find a {config.providerLabel} near you
        </h1>
        <p className="text-white/45">{filtered.length} verified {config.providerPlural.toLowerCase()} available</p>
      </div>

      {/* Search bar */}
      <div className={`${theme.card} p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-3`}>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            className="input-dark pl-10 text-sm"
            placeholder={`Search ${config.providerPlural.toLowerCase()}...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <select
          className="input-dark text-sm cursor-pointer"
          value={category}
          onChange={e => setCat(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="">All categories</option>
          {config.categories.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-3 min-w-[180px]">
          <SlidersHorizontal size={14} className="text-white/40 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Max price</span>
              <span className={theme.textAccent}>£{maxPrice}/hr</span>
            </div>
            <input
              type="range" min={config.minPrice} max={config.maxPrice}
              value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => <ProviderCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-white/40">
          <p className="text-lg font-medium mb-2">No {config.providerPlural.toLowerCase()} match your filters</p>
          <p className="text-sm">Try broadening your search or <a href="/chat" className={theme.textAccent}>let AI match for you</a></p>
        </div>
      )}
    </div>
  )
}
