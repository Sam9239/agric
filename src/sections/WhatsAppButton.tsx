import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function WhatsAppButton({ productName, className = '', fullWidth = true }: WhatsAppButtonProps) {
  const message = productName
    ? `Hello, I'm interested in ${productName} from ${siteConfig.name}. Can you share more details and pricing?`
    : `Hello, I would like to enquire about your agricultural products. Can you assist me?`;

  const handleClick = () => {
    const url = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`btn-whatsapp ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-label={productName ? `Enquire about ${productName} on WhatsApp` : 'Enquire on WhatsApp'}
    >
      <MessageCircle size={16} />
      Enquire on WhatsApp
    </button>
  );
}
