import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import WhatsAppButton from '../sections/WhatsAppButton';
import { trpc } from '@/providers/trpc';

const categoryLabels: Record<string, string> = {
  pesticides: 'Pesticides',
  manure: 'Manure',
  fertilizers: 'Fertilizers',
  farm_inputs: 'Farm Inputs',
  crop_protection: 'Crop Protection',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading } = trpc.product.byId.useQuery(
    { id: productId },
    { enabled: !isNaN(productId) }
  );

  const { data: relatedProducts } = trpc.product.related.useQuery(
    { id: productId, category: product?.category ?? 'fertilizers' },
    { enabled: !!product?.category }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f0e8' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#1a3a2f' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#f5f0e8' }}>
        <h2 className="font-display text-2xl" style={{ color: '#1a3a2f' }}>Product not found</h2>
        <Link to="/products" className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: '#c75c2e' }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>
    );
  }

  const filteredRelated = relatedProducts?.filter((p) => p.id !== productId).slice(0, 4);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      {/* Product Header */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
          >
            {/* Product Image */}
            <div className="p-6 md:p-8 flex items-center justify-center" style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8', aspectRatio: '1/1' }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-medium uppercase tracking-[2px]" style={{ color: '#5c7a4a' }}>
                {categoryLabels[product.category]}
              </p>
              <h1 className="font-display text-3xl md:text-4xl mt-3" style={{ color: '#1a3a2f' }}>
                {product.name}
              </h1>
              <p className="text-xl font-semibold mt-3" style={{ color: '#c75c2e' }}>
                {product.price}
              </p>
              <p className="mt-5 text-base leading-[1.7]" style={{ color: '#3d3d3d' }}>
                {product.description}
              </p>
              <div className="mt-6">
                <WhatsAppButton productName={product.name} fullWidth className="py-4 text-sm" />
              </div>
              <Link
                to="/products"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: '#5c7a4a' }}
              >
                <ArrowLeft size={14} /> Back to Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {filteredRelated && filteredRelated.length > 0 && (
        <section className="py-16" style={{ backgroundColor: '#f5f0e8' }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-display text-2xl md:text-[28px] mb-8" style={{ color: '#1a3a2f' }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Link to={`/products/${rp.id}`} className="block group">
                    <div
                      className="card-hover overflow-hidden"
                      style={{ border: '1px solid #d4c9b8' }}
                    >
                      <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1' }}>
                        <img
                          src={rp.imageUrl}
                          alt={rp.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#5c7a4a' }}>
                          {categoryLabels[rp.category]}
                        </p>
                        <h3 className="font-display text-base font-medium mt-1" style={{ color: '#1a3a2f' }}>
                          {rp.name}
                        </h3>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#c75c2e' }}>
                          {rp.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4" style={{ border: '1px solid #d4c9b8', borderTop: 'none', marginTop: '-1px' }}>
                    <WhatsAppButton productName={rp.name} fullWidth />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
