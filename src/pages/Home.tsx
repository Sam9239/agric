import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Sprout,
  ShieldCheck,
  Leaf,
  Wheat,
  Truck,
  BadgeCheck,
  Users,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import WhatsAppButton from '../sections/WhatsAppButton';
import { trpc } from '@/providers/trpc';
import { useEffect, useState } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { productCategories, type ProductCategory } from '@contracts/product-catalog';

const categoryImages: Record<ProductCategory, string> = {
  crop_nutrition: '/images/cat-fertilizers.webp',
  seeds: '/images/products/certified-maize-seed.webp',
  crop_protection: '/images/cat-crop-protection.webp',
  soil_health: '/images/cat-manure.webp',
  irrigation: '/images/cat-farm-inputs.webp',
  tools: '/images/products/knapsack-sprayer.webp',
  nursery: '/images/products/seedling-trays-cocopeat.webp',
  safety: '/images/products/ppe-kit.webp',
  post_harvest: '/images/cat-farm-inputs.webp',
};

const categoryLabels = productCategories;

const iconMap: Record<string, LucideIcon> = {
  sprout: Sprout,
  shield: ShieldCheck,
  leaf: Leaf,
  wheat: Wheat,
  truck: Truck,
  badge: BadgeCheck,
  users: Users,
  messageCircle: MessageCircle,
  package: PackageCheck,
};

const heroSlides = [
  { src: '/images/hero-slide-inputs.webp', alt: 'Agricultural supplies arranged on a farm table', objectPosition: '50% 50%' },
  { src: '/images/hero-slide-shop.webp', alt: 'Agricultural supplies shop with farm inputs', objectPosition: '50% 50%' },
  { src: '/images/hero-slide-greenhouse.webp', alt: 'Farmer checking crops in a greenhouse', objectPosition: '60% 30%' },
  { src: '/images/hero-slide-harvest.webp', alt: 'Farmer harvesting tomatoes in a field', objectPosition: '65% 30%' },
  { src: '/images/hero-slide-advice.webp', alt: 'Agricultural advisor discussing farm inputs with a farmer', objectPosition: '55% 30%' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Home() {
  const content = useSiteContent();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const { data: featuredProducts } = trpc.product.featured.useQuery();
  const { data: recentTips } = trpc.tip.recent.useQuery();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const headlineWords = content.hero.headline.split(' ');
  const whatsappEnquiry = `${content.contact.whatsappUrl}?text=${encodeURIComponent(
    "Hello, I would like to enquire about your agricultural products. Can you assist me?",
  )}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      {/* Hero Section — full-screen */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: '#1a3a2f', minHeight: '100svh' }}
      >
        {/* Background slideshow */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: activeHeroSlide === index ? 1 : 0,
                objectPosition: slide.objectPosition,
                transition: 'opacity 1200ms ease-in-out',
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding="async"
            />
          ))}
          {/* Vertical gradient (darkens top + bottom for legibility) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(15,30,24,0.7) 0%, rgba(15,30,24,0.45) 35%, rgba(15,30,24,0.65) 70%, rgba(15,30,24,0.92) 100%)',
            }}
          />
          {/* Left-side horizontal gradient — extra contrast for text on portrait phones */}
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                'linear-gradient(90deg, rgba(15,30,24,0.55) 0%, rgba(15,30,24,0.25) 55%, transparent 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative h-[100svh] min-h-[640px] flex flex-col justify-center px-5 sm:px-6 pt-28 md:pt-36 pb-20">
          <div className="max-w-[1200px] w-full mx-auto">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-label-light mb-5 sm:mb-6"
              style={{ color: '#f5e6d3' }}
            >
              {content.hero.eyebrow}
            </motion.p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.05] text-[#f5f0e8] max-w-[920px] flex flex-wrap">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 48, rotate: -3, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.25 + i * 0.07,
                    type: 'spring',
                    damping: 12,
                    stiffness: 110,
                  }}
                  className="inline-block mr-[0.22em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + headlineWords.length * 0.07 + 0.1, duration: 0.6 }}
              className="mt-6 text-base sm:text-lg md:text-xl max-w-[600px] leading-relaxed"
              style={{ color: 'rgba(245, 240, 232, 0.88)' }}
            >
              {content.hero.subtext}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + headlineWords.length * 0.07 + 0.25, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2">
                {content.hero.ctaLabel}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{
                  border: '1px solid rgba(245, 240, 232, 0.35)',
                  color: '#f5f0e8',
                  backgroundColor: 'rgba(245, 240, 232, 0.05)',
                }}
              >
                Learn About Us
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-20 sm:bottom-16 left-5 sm:left-6 flex gap-2 z-10">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveHeroSlide(index)}
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{
                backgroundColor: activeHeroSlide === index ? '#f5f0e8' : 'rgba(245, 240, 232, 0.4)',
                transform: activeHeroSlide === index ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Show homepage image ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-[10px] tracking-[3px] uppercase pointer-events-none"
          style={{ color: 'rgba(245, 240, 232, 0.7)' }}
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </motion.div>
      </section>

      {/* Mission strip */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            {content.homeMission.eyebrow}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-xl sm:text-2xl md:text-[28px] leading-[1.35]"
            style={{ color: '#1a3a2f' }}
          >
            {content.homeMission.statement}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: '#c75c2e' }}
            >
              More about us
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <p className="section-label-light mb-3" style={{ color: '#5c7a4a' }}>
              OUR CATEGORIES
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              What We Offer
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(([key, label], i) => (
              <motion.div key={key} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/products?category=${key}`} className="block group">
                  <div className="overflow-hidden h-full flex flex-col" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                    <div className="overflow-hidden">
                      <img
                        src={categoryImages[key]}
                        alt={label}
                        className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-3 sm:p-4 text-center flex-1 flex flex-col">
                      <p className="font-display text-base sm:text-lg font-medium" style={{ color: '#1a3a2f' }}>
                        {label}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: '#5a5a5a' }}>
                        {content.categoryDescriptions[key]}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-8 md:mb-10 gap-4"
          >
            <div>
              <p className="section-label mb-2">FEATURED PRODUCTS</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
                Popular This Season
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80 whitespace-nowrap"
              style={{ color: '#c75c2e' }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts?.map((product, i) => (
              <motion.div key={product.id} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/products/${product.id}`} className="block group">
                  <div className="card-hover overflow-hidden" style={{ border: '1px solid #d4c9b8' }}>
                    <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#e8dfd1', aspectRatio: '1/1' }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
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
          <div className="mt-8 sm:hidden text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#c75c2e' }}
            >
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#1a3a2f' }}>
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #f5f0e8 1px, transparent 1px), radial-gradient(circle at 80% 60%, #c75c2e 1px, transparent 1px)',
            backgroundSize: '60px 60px, 80px 80px',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[640px] mx-auto mb-12 md:mb-14"
          >
            <p className="section-label-light mb-3" style={{ color: '#c75c2e' }}>
              {content.whyChooseUs.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#f5f0e8]">
              {content.whyChooseUs.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.7)' }}>
              {content.whyChooseUs.subtext}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {content.whyChooseUs.items.map((item, i) => {
              const Icon = iconMap[item.iconKey] ?? BadgeCheck;
              const accentColors = ['#c75c2e', '#5c7a4a', '#d4a444', '#25d366'];
              const accent = accentColors[i % accentColors.length];
              return (
                <motion.div
                  key={`${item.title}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative group p-6 cursor-default"
                  style={{
                    backgroundColor: 'rgba(245, 240, 232, 0.04)',
                    border: '1px solid rgba(245, 240, 232, 0.1)',
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-1 w-full transition-all duration-300 group-hover:h-2"
                    style={{ backgroundColor: accent }}
                  />
                  <div
                    className="relative flex items-center justify-center w-14 h-14 mb-5 rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)' }}
                  >
                    <div
                      className="absolute inset-0 rounded-full blur-md opacity-50"
                      style={{ backgroundColor: accent }}
                    />
                    <Icon size={26} strokeWidth={1.8} className="relative" style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl text-[#f5f0e8]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.7)' }}>
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Farming Tips Preview */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-8 md:mb-10 gap-4"
          >
            <div>
              <p className="section-label mb-2">FROM THE FIELD</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
                Farming Tips & Advice
              </h2>
            </div>
            <Link
              to="/farming-tips"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80 whitespace-nowrap"
              style={{ color: '#c75c2e' }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {recentTips?.slice(0, 3).map((tip, i) => (
              <motion.div key={tip.id} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/farming-tips/${tip.id}`} className="block group">
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{ aspectRatio: '16/10' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pt-4 sm:pt-5">
                    <p className="text-xs" style={{ color: '#8b7d6b' }}>{tip.date}</p>
                    <h3 className="font-display text-lg sm:text-xl mt-2 transition-colors duration-300 group-hover:opacity-80" style={{ color: '#1a3a2f' }}>
                      {tip.title}
                    </h3>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: '#3d3d3d' }}>
                      {tip.excerpt?.slice(0, 120)}...
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: '#c75c2e' }}>
                      Read More <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 sm:hidden text-center">
            <Link
              to="/farming-tips"
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#c75c2e' }}
            >
              View All Tips <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ backgroundColor: '#c75c2e' }}>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 30%, #f5f0e8 1px, transparent 1px), radial-gradient(circle at 90% 70%, #1a3a2f 1px, transparent 1px)',
            backgroundSize: '40px 40px, 70px 70px',
          }}
        />
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white"
          >
            {content.ctaBanner.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-white/90 max-w-[640px] mx-auto"
          >
            {content.ctaBanner.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href={whatsappEnquiry}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200 hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: '#25d366', color: '#ffffff' }}
            >
              <MessageCircle size={16} />
              {content.ctaBanner.primaryLabel}
            </a>
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#1a3a2f', color: '#ffffff' }}
            >
              {content.ctaBanner.secondaryLabel}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
