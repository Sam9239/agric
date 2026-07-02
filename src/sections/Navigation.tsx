import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import TopBar from './TopBar';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Farming Tips', href: '/farming-tips' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const content = useSiteContent();
  const autoHide = location.pathname === '/';
  const headerShown = !autoHide || headerVisible || mobileOpen || interacting;

  useEffect(() => {
    let hideTimer: number | undefined;

    const showHeaderBriefly = () => {
      setHeaderVisible(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        setHeaderVisible(false);
      }, 950);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      if (autoHide) {
        showHeaderBriefly();
      }
    };

    const handlePointerMove = () => {
      if (autoHide) {
        showHeaderBriefly();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.clearTimeout(hideTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [autoHide]);

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
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={{
        transform: headerShown ? 'translateY(0)' : 'translateY(-110%)',
        opacity: headerShown ? 1 : 0,
        pointerEvents: headerShown ? 'auto' : 'none',
      }}
      onMouseEnter={() => {
        setInteracting(true);
        setHeaderVisible(true);
      }}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => {
        setInteracting(true);
        setHeaderVisible(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setInteracting(false);
        }
      }}
    >
      <TopBar />
      <nav
        className="h-[60px] md:h-[68px] flex items-center transition-all duration-300"
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
              alt="Jaosef Agro Supplies logo"
              className="h-11 sm:h-12 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
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
              style={{ backgroundColor: '#b8511f' }}
            >
              ENQUIRE
            </Link>
            {/* Mobile drawer: Radix Sheet provides focus trap, Escape close,
                scroll lock, and dialog semantics out of the box. */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden text-[#f5f0e8]"
                  aria-label="Open navigation menu"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 border-l-0 p-8 gap-0 text-[#f5f0e8] [&>button]:text-[#f5f0e8] [&>button]:opacity-80 [&>button_svg]:size-6"
                style={{ backgroundColor: '#1a3a2f' }}
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Links to the main pages of Jaosef Agro Supplies
                </SheetDescription>
                <div className="flex flex-col gap-6 mt-10">
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
                    to="/contact"
                    onClick={(e) => handleAnchorClick(e, '/contact')}
                    className="mt-4 inline-flex items-center justify-center px-5 py-3 text-xs font-semibold text-white rounded-sm"
                    style={{ backgroundColor: '#b8511f' }}
                  >
                    ENQUIRE
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
