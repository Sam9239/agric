import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Sprout } from 'lucide-react';
import SEO from '@/components/SEO';
import PageBackButton from '@/components/PageBackButton';
import { trpc } from '@/providers/trpc';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import WhatsAppButton from '@/sections/WhatsAppButton';
import { productCategories, type ProductCategory } from '@contracts/product-catalog';
import { categoryLandings, categoryPath, siteUrl } from '@contracts/seo-content';

type ProductCategoryProps = {
  categoryKey: ProductCategory;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' as const },
  }),
};

function breadcrumbJsonLd(category: ProductCategory) {
  const landing = categoryLandings[category];
  return {
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
        name: landing.title,
        item: `${siteUrl}${categoryPath(category)}`,
      },
    ],
  };
}

export default function ProductCategory({ categoryKey }: ProductCategoryProps) {
  const landing = categoryLandings[categoryKey];
  const { data: products, isLoading } = trpc.product.byCategory.useQuery({
    category: categoryKey,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <SEO
        title={landing.seoTitle}
        description={landing.seoDescription}
        path={categoryPath(categoryKey)}
        image={products?.[0]?.imageUrl ?? '/images/brand/jaosef-logo-light.webp'}
        jsonLd={breadcrumbJsonLd(categoryKey)}
      />
      <Navigation />

      <section className="pt-24 pb-14 md:pt-28 md:pb-16" style={{ backgroundColor: '#1a3a2f' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <PageBackButton light fallback="/products" className="mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[760px]"
          >
            <p className="section-label-light mb-4" style={{ color: '#c75c2e' }}>
              PRODUCT CATEGORY
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#f5f0e8]">
              {landing.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.78)' }}>
              {landing.seoDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-base sm:text-lg leading-[1.8]" style={{ color: '#3d3d3d' }}>
                {landing.intro}
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {landing.highlights.map((highlight) => (
                  <div key={highlight} className="p-4" style={{ backgroundColor: '#e8dfd1', border: '1px solid #d4c9b8' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#1a3a2f' }}>
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8' }}>
              <h2 className="font-display text-xl" style={{ color: '#1a3a2f' }}>
                Related Categories
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                {landing.related.map((category) => (
                  <Link
                    key={category}
                    to={categoryPath(category)}
                    className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-[#e8dfd1]"
                    style={{ color: '#1a3a2f', border: '1px solid #d4c9b8' }}
                  >
                    {productCategories[category]}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="section-label mb-2">AVAILABLE PRODUCTS</p>
              <h2 className="text-2xl sm:text-3xl" style={{ color: '#1a3a2f' }}>
                {landing.title}
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: '#c75c2e' }}
            >
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-[420px]" style={{ backgroundColor: '#f5f0e8' }} />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="h-full flex flex-col"
                >
                  <Link to={`/products/${product.id}`} className="block group flex-1">
                    <div className="card-hover overflow-hidden h-full flex flex-col" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                      <div className="p-4 flex items-center justify-center aspect-[4/3]" style={{ backgroundColor: '#e8dfd1' }}>
                        <img
                          src={product.imageUrl}
                          alt={`${product.name} from Jaosef Agro Supplies`}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#5c7a4a' }}>
                          {productCategories[product.category]}
                        </p>
                        <h3 className="font-display text-lg font-medium mt-1" style={{ color: '#1a3a2f' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm mt-2 leading-relaxed" style={{ color: '#3d3d3d' }}>
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4" style={{ border: '1px solid #d4c9b8', borderTop: 'none', marginTop: '-1px', backgroundColor: '#f5f0e8' }}>
                    <WhatsAppButton productName={product.name} fullWidth />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sprout size={44} className="mx-auto mb-4" style={{ color: '#8b7d6b' }} />
              <h3 className="font-display text-2xl" style={{ color: '#1a3a2f' }}>
                Products coming soon
              </h3>
              <p className="mt-2 text-base" style={{ color: '#8b7d6b' }}>
                Contact us for current availability in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

