import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/hooks/useSiteContent';
import TopBar from './TopBar';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Farming Tips', href: '/farming-tips' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const content = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);

    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 76;
          window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        }
      } else {
        navigate(href);
      }
    }
  };

  return (
    <>
      <TopBar />
      <nav
        className="fixed top-0 md:top-9 left-0 right-0 z-50 h-[60px] md:h-[68px] flex items-center transition-all duration-300"
        style={{
          backgroundColor: '#1a3a2f',
          boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-5 md:px-6 flex items-center justify-between gap-3">
          {/* Brand lockup */}
          <Link
            to="/"
            aria-label={`${content.brand.name} home`}
            className="flex items-center shrink-0"
          >
            <img
              src="/images/brand/jaosef-wordmark.svg"
              alt={content.brand.name}
              className="h-9 sm:h-10 md:h-11 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center px-5 py-2 text-xs font-semibold text-white rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#c75c2e' }}
            >
              ENQUIRE
            </Link>
            <button
              className="md:hidden text-[#f5f0e8]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 flex flex-col p-8"
              style={{ backgroundColor: '#1a3a2f' }}
            >
              <button
                className="self-end text-[#f5f0e8] mb-8"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-[#f5f0e8] text-lg font-medium opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/#contact"
                  onClick={(e) => handleAnchorClick(e, '/#contact')}
                  className="mt-4 inline-flex items-center justify-center px-5 py-3 text-xs font-semibold text-white rounded-sm"
                  style={{ backgroundColor: '#c75c2e' }}
                >
                  ENQUIRE
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
