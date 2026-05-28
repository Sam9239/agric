import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.77a8.16 8.16 0 0 0 4.77 1.52V6.84a4.85 4.85 0 0 1-1.84-.15z" />
    </svg>
  );
}

export default function TopBar() {
  const content = useSiteContent();
  const { contact, socials } = content;

  const socialIconClass =
    'flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 hover:scale-110';

  return (
    <div
      className="hidden md:block fixed top-0 left-0 right-0 z-[51] h-9 text-[12px]"
      style={{ backgroundColor: '#0f2a20', color: '#c4b9a4' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} style={{ color: '#5c7a4a' }} />
            <span>{contact.location}</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5">
            <Phone size={12} style={{ color: '#5c7a4a' }} />
            <a href={contact.phoneHref} className="hover:text-[#f5f0e8] transition-colors">
              {contact.phoneDisplay}
            </a>
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${contact.email}`}
            className="hidden lg:flex items-center gap-1.5 hover:text-[#f5f0e8] transition-colors"
          >
            <Mail size={12} style={{ color: '#5c7a4a' }} />
            <span>{contact.email}</span>
          </a>
          <div className="flex items-center gap-2">
            {socials.facebook && socials.facebook !== '#' && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialIconClass}
                style={{ color: '#c4b9a4' }}
              >
                <Facebook size={14} />
              </a>
            )}
            {socials.instagram && socials.instagram !== '#' && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialIconClass}
                style={{ color: '#c4b9a4' }}
              >
                <Instagram size={14} />
              </a>
            )}
            {socials.tiktok && socials.tiktok !== '#' && (
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={socialIconClass}
                style={{ color: '#c4b9a4' }}
              >
                <TikTokIcon size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
