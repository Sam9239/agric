import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function FloatingWhatsApp() {
  const location = useLocation();
  const content = useSiteContent();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const message = `Hello, I would like to enquire about your agricultural products. Can you assist me?`;
  const href = `${content.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', damping: 12 }}
      className="fixed bottom-5 right-5 z-50 group flex items-center"
    >
      <motion.span
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.8, 1] }}
        className="relative hidden sm:inline-flex mr-3 px-3 py-2 text-xs font-semibold text-white rounded-sm shadow-lg pointer-events-none"
        style={{ backgroundColor: '#1a3a2f' }}
      >
        Chat with us
        <span
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
          style={{
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid #1a3a2f',
          }}
        />
      </motion.span>

      <span className="relative flex items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: '#25d366' }}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: '#25d366' }}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
        />
        <motion.span
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl"
          style={{ backgroundColor: '#25d366' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.08 }}
        >
          <MessageCircle size={28} className="text-white" strokeWidth={2.2} />
        </motion.span>
      </span>
    </motion.a>
  );
}
