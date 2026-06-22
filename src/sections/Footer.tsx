import { Link } from 'react-router';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { productCategories } from '@contracts/product-catalog';
import { categoryPath } from '@contracts/seo-content';

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.77a8.16 8.16 0 0 0 4.77 1.52V6.84a4.85 4.85 0 0 1-1.84-.15z" />
    </svg>
  );
}

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Farming Tips', href: '/farming-tips' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Disclaimer', href: '/terms-disclaimer' },
];

const categoryLinks = Object.entries(productCategories).map(([key, label]) => ({
  label,
  href: categoryPath(key as keyof typeof productCategories),
}));

export default function Footer() {
  const content = useSiteContent();
  const { brand, contact, socials } = content;

  return (
    <footer style={{ backgroundColor: '#2d2926' }} className="pt-16 pb-6">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img
              src="/images/brand/jaosef-wordmark.svg"
              alt="Jaosef Agro Supplies logo"
              className="h-10 w-auto mb-3"
            />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#8b7d6b' }}>
              Quality agricultural inputs and farm supplies for Kenyan farmers, with a focus on responsible use and environmental protection.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.facebook && socials.facebook !== '#' && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)', color: '#f5f0e8' }}
                >
                  <Facebook size={16} />
                </a>
              )}
              {socials.instagram && socials.instagram !== '#' && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)', color: '#f5f0e8' }}
                >
                  <Instagram size={16} />
                </a>
              )}
              {socials.tiktok && socials.tiktok !== '#' && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)', color: '#f5f0e8' }}
                >
                  <TikTokIcon size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[#f5f0e8] font-semibold text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#f5f0e8]"
                    style={{ color: '#8b7d6b' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#f5f0e8] font-semibold text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Product Categories
            </h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#f5f0e8]"
                    style={{ color: '#8b7d6b' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#f5f0e8] font-semibold text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={14} style={{ color: '#8b7d6b' }} />
                <a href={contact.phoneHref} className="text-sm hover:text-[#f5f0e8]" style={{ color: '#8b7d6b' }}>{contact.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} style={{ color: '#8b7d6b' }} />
                <a href={`mailto:${contact.email}`} className="text-sm hover:text-[#f5f0e8]" style={{ color: '#8b7d6b' }}>{contact.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#8b7d6b' }} />
                <span className="text-sm" style={{ color: '#8b7d6b' }}>{contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs text-center" style={{ color: '#8b7d6b' }}>
            © 2026 {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
