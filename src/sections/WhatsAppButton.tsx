import { MessageCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function WhatsAppButton({ productName, className = '', fullWidth = true }: WhatsAppButtonProps) {
  const content = useSiteContent();
  const message = productName
    ? `Hello, I'm interested in ${productName} from ${content.brand.name}. Can you share availability and more details?`
    : `Hello, I would like to enquire about your agricultural products. Can you assist me?`;

  const handleClick = () => {
    const url = `${content.contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
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
