import { useEffect } from 'react';
import { useLocation } from 'react-router';

const NAV_OFFSET = 76;

export default function RouteScrollManager() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
          window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        }
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [pathname, search, hash]);

  return null;
}
