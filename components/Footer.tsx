'use client'
import Link from "next/link";

const ACCENT = '#ec4899'

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  siteName: string;
  tagline?: string;
  icon?: string;
  extraLinks?: FooterLink[];
  className?: string;
}

export default function Footer({
  siteName,
  tagline,
  icon,
  extraLinks = [],
  className = "",
}: FooterProps) {
  const year = new Date().getFullYear();

  const complianceLinks: FooterLink[] = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const allLinks = [...complianceLinks, ...extraLinks];

  return (
    <footer
      className={`w-full mt-auto ${className}`}
      style={{ borderTop: '1px solid #e2e8f0', background: '#fff' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            {(icon || siteName) && (
              <div className="flex items-center gap-2 mb-1.5">
                {icon && <span className="text-xl">{icon}</span>}
                <span className="font-black text-sm" style={{ color: '#0f172a' }}>{siteName}</span>
              </div>
            )}
            {tagline && (
              <p className="text-xs max-w-xs" style={{ color: '#94a3b8' }}>{tagline}</p>
            )}
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4 text-xs">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-150"
                style={{ color: '#64748b' }}
                onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid #f1f5f9', color: '#94a3b8' }}
        >
          <span>© {year} {siteName}. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
            Built with AI
          </span>
        </div>
      </div>
    </footer>
  );
}
