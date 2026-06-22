import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, Sprout } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import WhatsAppButton from '../sections/WhatsAppButton';
import PageBackButton from '@/components/PageBackButton';
import { trpc } from '@/providers/trpc';
import { productCategories } from '@contracts/product-catalog';
import SEO from '@/components/SEO';
import { siteUrl } from '@contracts/seo-content';

const categoryLabels = {
  all: 'All Products',
  ...productCategories,
} as const;

type ProductCategoryFilter = keyof typeof categoryLabels;

function isProductCategoryFilter(value: string | null): value is ProductCategoryFilter {
  return Boolean(value && value in categoryLabels);
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search') ?? '';
  const initialCategory = isProductCategoryFilter(categoryParam)
    ? categoryParam
    : 'all';
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilter>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  const { data: products, isLoading } = trpc.product.list.useQuery(
    activeCategory === 'all' ? undefined : { category: activeCategory }
  );
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
    ],
  };

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const updateProductParams = (category: ProductCategoryFilter, search: string) => {
    const next = new URLSearchParams();
    if (category !== 'all') next.set('category', category);
    if (search.trim()) next.set('search', search.trim());
    setSearchParams(next);
  };

  const handleCategoryChange = (cat: ProductCategoryFilter) => {
    setActiveCategory(cat);
    updateProductParams(cat, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateProductParams(activeCategory, value);
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bestSuitedFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <SEO
        title="Farm Inputs & Agro Products in Kenya | Jaosef Agro Supplies"
        description="Browse farm inputs and agro products from Jaosef Agro Supplies, including fertilisers, certified seeds, crop protection, irrigation supplies, livestock feeds, animal health products, and farm tools."
        path="/products"
        image="/images/brand/jaosef-logo-light.webp"
        jsonLd={breadcrumbJsonLd}
      />
      <Navigation />

      {/* Page Header */}
      <section style={{ backgroundColor: '#1a3a2f' }} className="pt-24 pb-14 md:pt-28 md:pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <PageBackButton light fallback="/" className="mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl text-[#f5f0e8]">Our Products</h1>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: '#8b7d6b' }}>
              Browse quality agricultural inputs and enquire directly for current availability and product guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Grid with Sidebar */}
      <section className="py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-7 xl:gap-8">
            {/* Mobile category dropdown + search (visible below lg) */}
            <div className="lg:hidden flex flex-col gap-3 mb-2">
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
                  Category
                </span>
                <select
                  value={activeCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as ProductCategoryFilter)}
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{
                    border: '1px solid #d4c9b8',
                    backgroundColor: '#f5f0e8',
                    color: '#1a3a2f',
                  }}
                >
                  {(Object.entries(categoryLabels) as [ProductCategoryFilter, string][]).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8b7d6b' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm outline-none transition-colors duration-200"
                  style={{
                    border: '1px solid #d4c9b8',
                    backgroundColor: '#f5f0e8',
                    color: '#1a3a2f',
                  }}
                />
              </div>
            </div>

            {/* Desktop sidebar (lg+) — sticky vertical list */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block sticky top-32 max-h-[calc(100vh-9rem)] w-[220px] xl:w-[240px] overflow-y-auto pr-1 flex-shrink-0 self-start"
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a3a2f' }}>
                Categories
              </h3>
              <div className="flex flex-col gap-1.5">
                {(Object.entries(categoryLabels) as [ProductCategoryFilter, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className="text-sm px-3 py-1.5 text-left transition-all duration-200"
                    style={{
                      backgroundColor: activeCategory === key ? '#1a3a2f' : 'transparent',
                      color: activeCategory === key ? '#f5f0e8' : '#3d3d3d',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="mt-5 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8b7d6b' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm outline-none transition-colors duration-200"
                  style={{
                    border: '1px solid #d4c9b8',
                    backgroundColor: '#f5f0e8',
                    color: '#1a3a2f',
                  }}
                />
              </div>
            </motion.aside>

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse" style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1.08' }} />
                  ))}
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      custom={i}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="h-full flex flex-col"
                    >
                      <Link to={`/products/${product.id}`} className="block group flex-1">
                        <div
                          className="card-hover overflow-hidden h-full flex flex-col"
                          style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}
                        >
                          <div className="p-4 flex items-center justify-center aspect-[4/3]" style={{ backgroundColor: '#e8dfd1' }}>
                            <img
                              src={product.imageUrl}
                              alt={`${product.name} available from Jaosef Agro Supplies`}
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#5c7a4a' }}>
                              {categoryLabels[product.category]}
                            </p>
                            <h3 className="font-display text-base sm:text-lg font-medium mt-1" style={{ color: '#1a3a2f' }}>
                              {product.name}
                            </h3>
                            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#3d3d3d' }}>
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
                <div className="text-center py-20">
                  <Sprout size={48} className="mx-auto mb-4" style={{ color: '#8b7d6b' }} />
                  <h3 className="font-display text-2xl" style={{ color: '#1a3a2f' }}>
                    No products found
                  </h3>
                  <p className="mt-2 text-base" style={{ color: '#8b7d6b' }}>
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Check back soon for new arrivals.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
