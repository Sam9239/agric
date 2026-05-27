import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { trpc } from '@/providers/trpc';

export default function TipDetail() {
  const { id } = useParams<{ id: string }>();
  const tipId = Number(id);

  const { data: tip, isLoading } = trpc.tip.byId.useQuery(
    { id: tipId },
    { enabled: !isNaN(tipId) }
  );

  const { data: allTips } = trpc.tip.list.useQuery();

  const relatedTips = allTips
    ?.filter((t) => t.id !== tipId)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f0e8' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#1a3a2f' }} />
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#f5f0e8' }}>
        <h2 className="font-display text-2xl" style={{ color: '#1a3a2f' }}>Article not found</h2>
        <Link to="/farming-tips" className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: '#c75c2e' }}>
          <ArrowLeft size={14} /> Back to Tips
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      <article className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/farming-tips"
              className="inline-flex items-center gap-1 text-sm font-medium mb-8 transition-colors hover:opacity-80"
              style={{ color: '#5c7a4a' }}
            >
              <ArrowLeft size={14} /> Back to Farming Tips
            </Link>

            <img
              src={tip.imageUrl}
              alt={tip.title}
              className="w-full object-cover mb-8"
              style={{ aspectRatio: '16/9', border: '1px solid #d4c9b8' }}
            />

            <p className="text-xs font-medium tracking-[2px] uppercase" style={{ color: '#5c7a4a' }}>
              {tip.date}
            </p>
            <h1 className="font-display text-3xl md:text-4xl mt-3" style={{ color: '#1a3a2f' }}>
              {tip.title}
            </h1>

            <div className="mt-8 prose prose-lg max-w-none">
              {tip.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-base leading-[1.8] mb-6" style={{ color: '#3d3d3d' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Tips */}
      {relatedTips && relatedTips.length > 0 && (
        <section className="pb-16">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="font-display text-2xl mb-8" style={{ color: '#1a3a2f' }}>
              More Tips
            </h2>
            <div className="space-y-6">
              {relatedTips.map((rt) => (
                <Link
                  key={rt.id}
                  to={`/farming-tips/${rt.id}`}
                  className="flex gap-4 group"
                >
                  <img
                    src={rt.imageUrl}
                    alt={rt.title}
                    className="w-24 h-16 object-cover flex-shrink-0"
                    style={{ border: '1px solid #d4c9b8' }}
                  />
                  <div>
                    <p className="text-xs" style={{ color: '#8b7d6b' }}>{rt.date}</p>
                    <h4 className="font-display text-base font-medium mt-1 transition-colors duration-300 group-hover:text-[#c75c2e]" style={{ color: '#1a3a2f' }}>
                      {rt.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
