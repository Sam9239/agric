import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

type PageBackButtonProps = {
  fallback?: string;
  light?: boolean;
  className?: string;
};

export default function PageBackButton({ fallback = '/', light = false, className = '' }: PageBackButtonProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80 ${className}`}
      style={{ color: light ? '#f5f0e8' : '#5c7a4a' }}
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
