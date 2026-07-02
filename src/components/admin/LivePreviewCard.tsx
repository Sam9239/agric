import { ArrowRight, MessageCircle, Eye } from 'lucide-react';

/**
 * Renders a pixel-faithful copy of the public site's product / farming-tip
 * card so admins can see exactly how their edits will look before saving.
 * Keep the markup in sync with Home.tsx (featured products) and
 * FarmingTips.tsx (tips grid).
 */

type ProductPreview = {
  variant: 'product';
  imageUrl: string;
  name: string;
  categoryLabel: string;
  shortDescription: string;
};

type TipPreview = {
  variant: 'tip';
  imageUrl: string;
  title: string;
  excerpt: string;
  date: string;
};

type LivePreviewCardProps = ProductPreview | TipPreview;

export default function LivePreviewCard(props: LivePreviewCardProps) {
  return (
    <div>
      <p
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2"
        style={{ color: '#6b5f4f' }}
      >
        <Eye size={12} />
        Live preview — how this will look on the website
      </p>
      <div className="max-w-[280px]" style={{ backgroundColor: '#f5f0e8' }}>
        {props.variant === 'product' ? (
          <div style={{ border: '1px solid #d4c9b8' }}>
            <div
              className="p-4 flex items-center justify-center"
              style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1' }}
            >
              {props.imageUrl ? (
                <img
                  src={props.imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs" style={{ color: '#6b5f4f' }}>
                  No image yet
                </span>
              )}
            </div>
            <div className="p-4">
              <p
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: '#4a6339' }}
              >
                {props.categoryLabel}
              </p>
              <h3 className="font-display text-lg font-medium mt-1" style={{ color: '#1a3a2f' }}>
                {props.name || 'Product name'}
              </h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#3d3d3d' }}>
                {props.shortDescription || 'Short description appears here.'}
              </p>
              <div
                className="mt-3 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: '#25d366', color: '#0b3b28' }}
              >
                <MessageCircle size={16} />
                Enquire on WhatsApp
              </div>
            </div>
          </div>
        ) : (
          <div>
            {props.imageUrl ? (
              <img
                src={props.imageUrl}
                alt="Tip preview"
                className="w-full object-cover"
                style={{ aspectRatio: '16/10' }}
              />
            ) : (
              <div
                className="w-full flex items-center justify-center"
                style={{ aspectRatio: '16/10', backgroundColor: '#e8dfd1' }}
              >
                <span className="text-xs" style={{ color: '#6b5f4f' }}>
                  No image yet
                </span>
              </div>
            )}
            <div className="pt-4">
              <p className="text-xs" style={{ color: '#6b5f4f' }}>
                {props.date || 'Date'}
              </p>
              <h3 className="font-display text-lg mt-1" style={{ color: '#1a3a2f' }}>
                {props.title || 'Tip title'}
              </h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#3d3d3d' }}>
                {(props.excerpt || 'Excerpt appears here.').slice(0, 120)}
                {props.excerpt.length > 120 ? '…' : ''}
              </p>
              <span
                className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
                style={{ color: '#9e451a' }}
              >
                Read More <ArrowRight size={12} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
