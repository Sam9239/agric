import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import WhatsAppButton from '../sections/WhatsAppButton';
import PageBackButton from '@/components/PageBackButton';
import { trpc } from '@/providers/trpc';
import { productCategories } from '@contracts/product-catalog';
import { categoryPath, siteUrl } from '@contracts/seo-content';
import SEO from '@/components/SEO';

const categoryLabels = productCategories;

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
    { id: productId, category: product?.category ?? 'crop_nutrition' },
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
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${siteUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabels[product.category],
        item: `${siteUrl}${categoryPath(product.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${siteUrl}/products/${product.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <SEO
        title={`${product.name} | Jaosef Agro Supplies`}
        description={`${product.shortDescription || product.description} Enquire from Jaosef Agro Supplies for current availability and product guidance in Kenya.`}
        path={`/products/${product.id}`}
        image={product.imageUrl}
        type="product"
        jsonLd={breadcrumbJsonLd}
      />
      <Navigation />

      {/* Product Header */}
      <section className="pt-24 pb-12 md:pt-28 md:pb-16" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <PageBackButton fallback="/products" className="mb-8" />
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
                alt={`${product.name} available from Jaosef Agro Supplies`}
                className="max-w-full max-h-full object-contain"
                fetchPriority="high"
                decoding="async"
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
              <p className="text-lg font-medium mt-3" style={{ color: '#c75c2e' }}>
                Enquire for current availability
              </p>
              <p className="mt-5 text-base leading-[1.7]" style={{ color: '#3d3d3d' }}>
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  ['Specs', product.specs],
                  ['Best suited for', product.bestSuitedFor],
                  ['Usage tip', product.usageTip],
                  ['Pack sizes', product.packSizes],
                ].filter(([, value]) => value).map(([label, value]) => (
                  <div key={label} className="p-4" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                    <p className="text-[10px] uppercase tracking-[2px]" style={{ color: '#8b7d6b' }}>{label}</p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#3d3d3d' }}>{value}</p>
                  </div>
                ))}
              </div>
              {product.category === 'crop_protection' && (
                <div className="mt-5 p-4" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                  <p className="text-[10px] uppercase tracking-[2px]" style={{ color: '#c75c2e' }}>Crop protection safety</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm" style={{ color: '#3d3d3d' }}>
                    {[
                      ['Active ingredient', product.activeIngredient],
                      ['Formulation', product.formulation],
                      ['Target use', product.targetUse],
                      ['Registered crop use', product.registeredCropUse],
                      ['PCPB status', product.pcpbStatus],
                      ['PHI', product.phi],
                      ['REI', product.rei],
                      ['PPE', product.ppe],
                      ['Storage', product.storageWarning],
                    ].filter(([, value]) => value).map(([label, value]) => (
                      <p key={label}><span className="font-semibold">{label}:</span> {value}</p>
                    ))}
                  </div>
                </div>
              )}
              {product.category === 'animal_health' && (
                <div className="mt-5 p-4" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                  <p className="text-[10px] uppercase tracking-[2px]" style={{ color: '#c75c2e' }}>Animal health safety</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm" style={{ color: '#3d3d3d' }}>
                    {[
                      ['Active ingredient', product.activeIngredient],
                      ['Formulation', product.formulation],
                      ['Target use', product.targetUse],
                      ['Labelled animal use', product.registeredCropUse],
                      ['Registration status', product.pcpbStatus],
                      ['Withdrawal period', product.phi],
                      ['PPE', product.ppe],
                      ['Storage', product.storageWarning],
                    ].filter(([, value]) => value).map(([label, value]) => (
                      <p key={label}><span className="font-semibold">{label}:</span> {value}</p>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed" style={{ color: '#8b7d6b' }}>
                    Veterinary medicines, vaccines, acaricides, and animal-health products should be used only as directed on the official label and under qualified animal-health guidance where required.
                  </p>
                </div>
              )}
              {product.category === 'livestock_feeds' && (
                <div className="mt-5 p-4" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                  <p className="text-[10px] uppercase tracking-[2px]" style={{ color: '#5c7a4a' }}>Feed quality note</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>
                    Buy properly labelled feed from reliable suppliers. Store feeds in a dry, clean place away from moisture, pests, and chemicals.
                  </p>
                </div>
              )}
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#8b7d6b' }}>
                {product.safetyNote || 'Use as directed on the official product label. Product information is for enquiry purposes only and does not replace professional agronomic advice.'}
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
                  className="h-full flex flex-col"
                >
                  <Link to={`/products/${rp.id}`} className="block group flex-1">
                    <div
                      className="card-hover overflow-hidden h-full flex flex-col"
                      style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                    >
                      <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1' }}>
                        <img
                          src={rp.imageUrl}
                          alt={`${rp.name} available from Jaosef Agro Supplies`}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#5c7a4a' }}>
                          {categoryLabels[rp.category]}
                        </p>
                        <h3 className="font-display text-base font-medium mt-1" style={{ color: '#1a3a2f' }}>
                          {rp.name}
                        </h3>
                        <p className="text-sm mt-2 leading-relaxed" style={{ color: '#3d3d3d' }}>
                          {rp.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4" style={{ border: '1px solid #d4c9b8', borderTop: 'none', marginTop: '-1px', backgroundColor: '#f5f0e8' }}>
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
