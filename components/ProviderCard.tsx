import Link from 'next/link'
import { Star, CheckCircle, Clock, MapPin } from 'lucide-react'
import { theme, btn } from '@/lib/theme'
import config from '@/vertical.config'

export interface Provider {
  id:          string
  name:        string
  avatar:      string
  headline:    string
  category:    string
  rating:      number
  reviewCount: number
  hourlyRate:  number
  responseMin: number
  location:    string
  badges:      string[]
  verified:    boolean
  videoIntro?: string
}

export default function ProviderCard({ p }: { p: Provider }) {
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating))
  return (
    <div className={`${theme.card} ${theme.cardHover} ${theme.glowHover} p-5 flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex gap-4 items-start">
        <div className="relative flex-shrink-0">
          <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-2xl object-cover" />
          {p.verified && (
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${theme.solid}`}>
              <CheckCircle size={14} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{p.name}</h3>
          <p className="text-white/50 text-sm truncate">{p.headline}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="stars text-xs">{stars}</span>
            <span className={`text-xs ${theme.textAccent} font-medium`}>{p.rating.toFixed(1)}</span>
            <span className="text-white/30 text-xs">({p.reviewCount})</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-white text-lg">£{p.hourlyRate}</div>
          <div className="text-white/40 text-xs">/{config.pricingModel === 'session' ? 'session' : 'hr'}</div>
        </div>
      </div>

      {/* Badges */}
      {p.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {p.badges.slice(0, 3).map(b => (
            <span key={b} className={`text-xs px-2 py-0.5 rounded-full ${theme.badge}`}>{b}</span>
          ))}
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1"><MapPin size={12} />{p.location}</span>
        <span className="flex items-center gap-1"><Clock size={12} />Replies in {p.responseMin}m</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Link href={`/provider/${p.id}`} className={`flex-1 text-center py-2.5 rounded-xl text-sm font-medium ${theme.solidLight} ${theme.textAccent} hover:bg-violet-500/20 transition-all`}>
          View profile
        </Link>
        <Link href={`/book/${p.id}`} className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r ${theme.gradient} text-white ${theme.gradientHover} transition-all`}>
          Book now
        </Link>
      </div>
    </div>
  )
}
