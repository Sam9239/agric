import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';

const ADMIN_PASSWORD = 'jaosef2026';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        const now = Date.now();
        if (parsed.authenticated && now - parsed.timestamp < 24 * 60 * 60 * 1000) {
          navigate('/admin/dashboard');
        }
      } catch {
        localStorage.removeItem('admin_auth');
      }
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', JSON.stringify({ authenticated: true, timestamp: Date.now() }));
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
      toast.error('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a3a2f' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] p-10 md:p-12"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        <div className="text-center">
          <span className="text-[#1a3a2f] font-bold text-base tracking-[3px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {siteConfig.name.toUpperCase()}
          </span>
          <h1 className="font-display text-[28px] mt-6" style={{ color: '#1a3a2f' }}>
            Admin Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              aria-label="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-underline pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2"
              style={{ color: '#8b7d6b' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm" style={{ color: '#c75c2e' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: '#c75c2e' }}
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
