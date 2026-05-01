import ChatWidget from '@/components/ChatWidget'
import { theme } from '@/lib/theme'
import config from '@/vertical.config'

export const metadata = {
  title: `AI ${config.providerLabel} Matcher — ${config.name}`,
}

export default function ChatPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className={`text-2xl font-bold ${theme.gradientText}`}>Find your {config.providerLabel}</h1>
          <p className="text-white/45 text-sm mt-1">Just describe what you need — our AI does the rest</p>
        </div>
        <div className={`${theme.card} rounded-2xl overflow-hidden ${theme.glow}`} style={{ minHeight: 520 }}>
          <ChatWidget />
        </div>
      </div>
    </div>
  )
}
