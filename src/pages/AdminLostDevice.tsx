import { motion } from 'framer-motion';
import { Phone, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const DEV_NAME = 'Sam (Developer)';
const DEV_PHONE_DISPLAY = '+254 745 933 241';
const DEV_PHONE_TEL = 'tel:+254745933241';
const DEV_WHATSAPP = 'https://wa.me/254745933241?text=Hello%20Sam%2C%20I%20cannot%20access%20my%20Jaosef%20Agro%20admin%20authenticator.%20Please%20help.';

export default function AdminLostDevice() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: '#1a3a2f' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] p-8 sm:p-10"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: '#c75c2e' }}
          >
            <AlertCircle size={20} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[3px]" style={{ color: '#8b7d6b' }}>
            Recover Access
          </span>
        </div>

        <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>
          Can't access your authenticator?
        </h1>
        <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
          Two-factor authentication on this admin panel is tied to a code from your authenticator app
          (Google Authenticator, Authy, or similar). If you've lost your phone, switched devices, or no
          longer have access to that app, you can't sign in until two-factor is reset for your account.
        </p>

        <div className="mt-6 p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8' }}>
          <h2 className="font-display text-lg" style={{ color: '#1a3a2f' }}>
            How to recover
          </h2>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed list-decimal list-inside" style={{ color: '#3d3d3d' }}>
            <li>Contact the developer using one of the options below.</li>
            <li>Confirm your identity (your name, the business name, and any details only you would know).</li>
            <li>The developer will disable two-factor for your account.</li>
            <li>Sign back in with just your password, then re-enable two-factor with a fresh authenticator app on your new device.</li>
          </ol>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8b7d6b' }}>
            Contact {DEV_NAME}
          </p>
          <div className="space-y-3">
            <a
              href={DEV_PHONE_TEL}
              className="flex items-center gap-3 p-4 transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#1a3a2f', color: '#f5f0e8' }}
            >
              <Phone size={18} style={{ color: '#c75c2e' }} />
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>
                  Call
                </p>
                <p className="text-base font-medium">{DEV_PHONE_DISPLAY}</p>
              </div>
            </a>
            <a
              href={DEV_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#25d366', color: '#ffffff' }}
            >
              <MessageCircle size={18} />
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider opacity-80">WhatsApp</p>
                <p className="text-base font-medium">{DEV_PHONE_DISPLAY}</p>
              </div>
            </a>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed" style={{ color: '#8b7d6b' }}>
          For security, the developer will not disable two-factor without confirming your identity. Please
          have some details ready to verify it's really you.
        </p>

        <div className="mt-6 pt-5" style={{ borderTop: '1px solid #d4c9b8' }}>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: '#c75c2e' }}
          >
            <ArrowLeft size={14} />
            Back to admin login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
