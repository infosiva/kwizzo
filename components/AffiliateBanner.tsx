export default function AffiliateBanner() {
  return (
    <div className="my-6 rounded-xl p-4 text-center text-sm"
      style={{ border: '1px solid rgba(236,72,153,0.18)', background: 'rgba(236,72,153,0.04)' }}>
      <p className="mb-2 font-semibold" style={{ color: '#ec4899' }}>
        Host your own AI app for just $2.99/mo
      </p>
      <a
        href="https://hostinger.com?REFERRALCODE=SIVAPRAKASAM"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}
      >
        Get Hostinger →
      </a>
      <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>Sponsored · We earn a commission</p>
    </div>
  );
}
