import { Link } from 'react-router';
import { Phone, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { productCategories } from '@contracts/product-catalog';

const quickLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Farming Tips', href: '/farming-tips' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Disclaimer', href: '/terms-disclaimer' },
];

const categoryLinks = Object.entries(productCategories).map(([key, label]) => ({
  label,
  href: `/products?category=${key}`,
}));

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2d2926' }} className="pt-16 pb-6">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Brand */}
          <div>
            <span className="text-[#f5f0e8] font-bold text-base tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
              {siteConfig.name.toUpperCase()}
            </span>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#8b7d6b' }}>
              Quality agricultural inputs and farm supplies for Kenyan farmers, with a focus on responsible use and environmental protection.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
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

          {/* Column 3 - Categories */}
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

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-[#f5f0e8] font-semibold text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={14} style={{ color: '#8b7d6b' }} />
                <a href={siteConfig.phoneHref} className="text-sm hover:text-[#f5f0e8]" style={{ color: '#8b7d6b' }}>{siteConfig.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} style={{ color: '#8b7d6b' }} />
                <a href={`mailto:${siteConfig.email}`} className="text-sm hover:text-[#f5f0e8]" style={{ color: '#8b7d6b' }}>{siteConfig.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#8b7d6b' }} />
                <span className="text-sm" style={{ color: '#8b7d6b' }}>{siteConfig.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs text-center" style={{ color: '#8b7d6b' }}>
            © 2026 {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
