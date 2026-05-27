import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <h1 className="font-display text-6xl" style={{ color: '#1a3a2f' }}>404</h1>
        <p className="mt-4 text-lg" style={{ color: '#8b7d6b' }}>
          Page not found
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ backgroundColor: '#c75c2e' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
