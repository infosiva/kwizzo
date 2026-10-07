import KwizzoMark from './KwizzoMark'

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <>
      <KwizzoMark size={size} />
      <span className="font-black text-lg tracking-tight" style={{ color: '#f1f5f9' }}>
        Kwi<span style={{ color: '#ff7a85' }}>zzo</span>
      </span>
    </>
  )
}
