import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';
import { trpc } from '@/providers/trpc';

type Step = 'password' | 'totp';

export default function AdminLogin() {
  const [step, setStep] = useState<Step>('password');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const adminLogin = trpc.auth.adminLogin.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Login successful');
        navigate('/admin/dashboard');
        return;
      }
      if (result.requiresTotp) {
        // Password was correct, TOTP needed. Advance to step 2.
        setStep('totp');
        setError('');
        return;
      }
      const message = step === 'totp' ? 'Invalid authenticator code' : 'Invalid login details';
      setError(message);
      toast.error(message);
    },
    onError: () => {
      setError('Login failed. Please try again.');
      toast.error('Login failed');
    },
  });

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    adminLogin.mutate({ password });
  }

  function handleTotpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    adminLogin.mutate({ password, totpCode: totpCode.trim() });
  }

  function backToPassword() {
    setStep('password');
    setTotpCode('');
    setError('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: '#1a3a2f' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] p-8 sm:p-10 md:p-12"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        <div className="text-center">
          <span className="text-[#1a3a2f] font-bold text-base tracking-[3px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {siteConfig.name.toUpperCase()}
          </span>
          <h1 className="font-display text-[28px] mt-6" style={{ color: '#1a3a2f' }}>
            Admin Login
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#8b7d6b' }}>
            {step === 'password' ? 'Enter your password to continue' : 'Enter your 6-digit authenticator code'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'password' ? (
            <motion.form
              key="password-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handlePasswordSubmit}
              className="mt-8"
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  aria-label="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-underline pr-10"
                  autoFocus
                  autoComplete="current-password"
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
                disabled={adminLogin.isPending || !password}
                className="w-full mt-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                style={{ backgroundColor: '#c75c2e' }}
              >
                {adminLogin.isPending ? 'Verifying…' : 'Continue'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="totp-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleTotpSubmit}
              className="mt-8"
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123 456"
                aria-label="Authenticator code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-underline text-center text-2xl font-medium tracking-[0.4em]"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
              />

              {error && (
                <p className="mt-3 text-sm" style={{ color: '#c75c2e' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={adminLogin.isPending || totpCode.length !== 6}
                className="w-full mt-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                style={{ backgroundColor: '#c75c2e' }}
              >
                {adminLogin.isPending ? 'Verifying…' : 'Login'}
              </button>

              <div className="mt-5 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={backToPassword}
                  className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  style={{ color: '#8b7d6b' }}
                >
                  <ArrowLeft size={12} />
                  Back
                </button>
                <Link
                  to="/admin/lost-device"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  style={{ color: '#c75c2e' }}
                >
                  <HelpCircle size={12} />
                  Lost your phone?
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
