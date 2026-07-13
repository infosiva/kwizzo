export default function AffiliateBanner() {
  return (
    <div className="my-6 rounded-xl p-4 text-center text-sm"
      style={{ border: '1px solid rgba(59,130,246,0.18)', background: 'rgba(59,130,246,0.04)' }}>
      <p className="mb-2 font-semibold" style={{ color: '#3b82f6' }}>
        Host your own AI app for just $2.99/mo
      </p>
      <a
        href="https://hostinger.com?REFERRALCODE=SIVAPRAKASAM"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}
      >
        Get Hostinger →
      </a>
      <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>Sponsored · We earn a commission</p>
    </div>
  );
}
