import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
  fullWidth?: boolean;
}

const WHATSAPP_NUMBER = "254700123456";

export default function WhatsAppButton({ productName, className = '', fullWidth = true }: WhatsAppButtonProps) {
  const message = productName
    ? `Hello, I'm interested in ${productName} from Kilimo Essentials. Can you share more details and pricing?`
    : `Hello, I would like to enquire about your agricultural products. Can you assist me?`;

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
