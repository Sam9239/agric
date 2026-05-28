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
  const initialCategory = isProductCategoryFilter(categoryParam)
    ? categoryParam
    : 'all';
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilter>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading } = trpc.product.list.useQuery(
    activeCategory === 'all' ? undefined : { category: activeCategory }
  );

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const handleCategoryChange = (cat: ProductCategoryFilter) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bestSuitedFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
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
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-[250px] flex-shrink-0"
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a3a2f' }}>
                Categories
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                {(Object.entries(categoryLabels) as [ProductCategoryFilter, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className="text-sm px-3 py-2 text-left whitespace-nowrap transition-all duration-200 flex-shrink-0 lg:flex-shrink"
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
              <div className="mt-6 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8b7d6b' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm outline-none transition-colors duration-200"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse" style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1.2' }} />
                  ))}
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      custom={i}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link to={`/products/${product.id}`} className="block group">
                        <div
                          className="card-hover overflow-hidden"
                          style={{ border: '1px solid #d4c9b8' }}
                        >
                          <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1' }}>
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: '#5c7a4a' }}>
                              {categoryLabels[product.category]}
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
                      <div className="px-4 pb-4" style={{ border: '1px solid #d4c9b8', borderTop: 'none', marginTop: '-1px' }}>
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
