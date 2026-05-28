import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sprout,
  ShieldCheck,
  Leaf,
  Wheat,
  Truck,
  BadgeCheck,
  Users,
  MessageCircle,
  MousePointerClick,
  MessageSquare,
  CheckCircle2,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import WhatsAppButton from '../sections/WhatsAppButton';
import { trpc } from '@/providers/trpc';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSiteContent } from '@/hooks/useSiteContent';
import { productCategories, type ProductCategory } from '@contracts/product-catalog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const categoryImages: Record<ProductCategory, string> = {
  crop_nutrition: '/images/cat-fertilizers.jpg',
  seeds: '/images/products/certified-maize-seed.png',
  crop_protection: '/images/cat-crop-protection.jpg',
  soil_health: '/images/cat-manure.jpg',
  irrigation: '/images/cat-farm-inputs.jpg',
  tools: '/images/products/knapsack-sprayer.webp',
  nursery: '/images/products/seedling-trays-cocopeat.webp',
  safety: '/images/products/ppe-kit.webp',
  post_harvest: '/images/cat-farm-inputs.jpg',
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

const stepIcons: LucideIcon[] = [MousePointerClick, MessageSquare, CheckCircle2, Truck];

const heroSlides = [
  { src: '/images/hero-slide-inputs.png', alt: 'Agricultural supplies arranged on a farm table' },
  { src: '/images/hero-slide-shop.png', alt: 'Agricultural supplies shop with farm inputs' },
  { src: '/images/hero-slide-greenhouse.png', alt: 'Farmer checking crops in a greenhouse' },
  { src: '/images/hero-slide-harvest.png', alt: 'Farmer harvesting tomatoes in a field' },
  { src: '/images/hero-slide-advice.png', alt: 'Agricultural advisor discussing farm inputs with a farmer' },
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
  const createEnquiry = trpc.enquiry.create.useMutation({
    onSuccess: () => {
      toast.success('Enquiry sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    },
    onError: () => {
      toast.error('Failed to send enquiry. Please try again.');
    },
  });

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    createEnquiry.mutate(formData);
  };

  const headlineWords = content.hero.headline.split(' ');
  const whatsappEnquiry = `${content.contact.whatsappUrl}?text=${encodeURIComponent(
    "Hello, I would like to enquire about your agricultural products. Can you assist me?",
  )}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      {/* Hero Section */}
      <section style={{ backgroundColor: '#1a3a2f' }} className="pt-24 pb-12 md:pt-32 md:pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="section-label-light mb-6"
              >
                {content.hero.eyebrow}
              </motion.p>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#f5f0e8] flex flex-wrap">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, y: 48, rotate: -4, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.25 + i * 0.07,
                      type: 'spring',
                      damping: 12,
                      stiffness: 110,
                    }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + headlineWords.length * 0.07 + 0.1, duration: 0.6 }}
                className="mt-5 text-lg max-w-[480px]"
                style={{ color: '#a09080' }}
              >
                {content.hero.subtext}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + headlineWords.length * 0.07 + 0.25, duration: 0.5 }}
              >
                <Link to="/products" className="btn-primary mt-8 inline-flex items-center gap-2">
                  {content.hero.ctaLabel}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', border: '1px solid rgba(255,255,255,0.1)' }}>
                {heroSlides.map((slide, index) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={slide.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                    style={{ opacity: activeHeroSlide === index ? 1 : 0 }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a2f]/35 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setActiveHeroSlide(index)}
                    className="h-2.5 w-2.5 rounded-full transition-all"
                    style={{
                      backgroundColor: activeHeroSlide === index ? '#f5f0e8' : 'rgba(245, 240, 232, 0.45)',
                      transform: activeHeroSlide === index ? 'scale(1.25)' : 'scale(1)',
                    }}
                    aria-label={`Show homepage image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section id="about" className="py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-label mb-4">{content.about.eyebrow}</p>
              <h2 className="text-3xl md:text-[32px] leading-[1.3]" style={{ color: '#1a3a2f' }}>
                {content.about.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                {content.about.paragraph1}
              </p>
              <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                {content.about.paragraph2}
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors duration-200 hover:opacity-80"
                style={{ color: '#c75c2e' }}
              >
                {content.about.ctaLabel} <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img
                src={content.about.imageUrl}
                alt="Agricultural supply store"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3', border: '1px solid #d4c9b8' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[640px] mx-auto mb-12"
          >
            <p className="section-label mb-3">{content.services.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              {content.services.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
              {content.services.intro}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {content.services.items.map((item, i) => {
              const Icon = iconMap[item.iconKey] ?? Sprout;
              return (
                <motion.div
                  key={`${item.title}-${i}`}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card-hover p-6 flex flex-col"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8' }}
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 mb-4"
                    style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f' }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-lg" style={{ color: '#1a3a2f' }}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed flex-1" style={{ color: '#3d3d3d' }}>
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="section-label-light mb-3" style={{ color: '#5c7a4a' }}>
              OUR CATEGORIES
            </p>
            <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              What We Offer
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(([key, label], i) => (
              <motion.div key={key} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/products?category=${key}`} className="block group">
                  <div className="overflow-hidden h-full flex flex-col" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                    <div className="overflow-hidden">
                      <img
                        src={categoryImages[key]}
                        alt={label}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 text-center flex-1 flex flex-col">
                      <p className="font-display text-lg font-medium" style={{ color: '#1a3a2f' }}>
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
      <section className="py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <p className="section-label mb-2">FEATURED PRODUCTS</p>
              <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
                Popular This Season
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: '#c75c2e' }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product, i) => (
              <motion.div key={product.id} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/products/${product.id}`} className="block group">
                  <div className="card-hover overflow-hidden" style={{ border: '1px solid #d4c9b8' }}>
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
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#1a3a2f' }}>
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #f5f0e8 1px, transparent 1px), radial-gradient(circle at 80% 60%, #c75c2e 1px, transparent 1px)',
            backgroundSize: '60px 60px, 80px 80px',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[640px] mx-auto mb-14"
          >
            <p className="section-label-light mb-3" style={{ color: '#c75c2e' }}>
              {content.whyChooseUs.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl text-[#f5f0e8]">
              {content.whyChooseUs.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.7)' }}>
              {content.whyChooseUs.subtext}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                    backdropFilter: 'blur(8px)',
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

      {/* Environmental Commitment */}
      <section className="py-16" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[760px]">
            <p className="section-label mb-3">RESPONSIBLE FARMING</p>
            <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              Focused on Productivity and Environmental Protection
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
              We encourage farmers to use agricultural inputs correctly, choose certified seed, follow official product labels, wear protective gear, care for soil health, and avoid unnecessary over-application. Good farming protects both the harvest and the environment that supports it.
            </p>
          </div>
        </div>
      </section>

      {/* How Enquiries Work */}
      <section className="py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[640px] mx-auto mb-14"
          >
            <p className="section-label mb-3">{content.enquiryProcess.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              {content.enquiryProcess.heading}
            </h2>
          </motion.div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px"
              style={{ backgroundColor: '#d4c9b8' }}
            />
            {content.enquiryProcess.steps.map((step, i) => {
              const Icon = stepIcons[i] ?? CheckCircle2;
              return (
                <motion.div
                  key={`${step.title}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div
                    className="relative flex items-center justify-center w-14 h-14 rounded-full mb-4 z-10"
                    style={{ backgroundColor: '#1a3a2f', color: '#f5f0e8' }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                    <span
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#c75c2e', color: '#ffffff' }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg" style={{ color: '#1a3a2f' }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed max-w-[220px]" style={{ color: '#3d3d3d' }}>
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Farming Tips Preview */}
      <section className="py-20" style={{ backgroundColor: '#1a3a2f' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="section-label-light mb-2" style={{ color: '#5c7a4a' }}>
              FROM THE FIELD
            </p>
            <h2 className="text-3xl md:text-4xl text-[#f5f0e8]">Farming Tips & Advice</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTips?.slice(0, 3).map((tip, i) => (
              <motion.div key={tip.id} custom={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={`/farming-tips/${tip.id}`} className="block group">
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{ aspectRatio: '16/10' }}
                  />
                  <div className="pt-5">
                    <p className="text-xs" style={{ color: '#8b7d6b' }}>{tip.date}</p>
                    <h3 className="font-display text-xl mt-2 text-[#f5f0e8] transition-colors duration-300 group-hover:text-[#c75c2e]">
                      {tip.title}
                    </h3>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: 'rgba(139, 125, 107, 0.8)' }}>
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
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[820px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="section-label mb-3">{content.faq.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              {content.faq.heading}
            </h2>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {content.faq.items.map((item, i) => (
              <AccordionItem
                key={`faq-${i}`}
                value={`faq-${i}`}
                className="border-b"
                style={{ borderColor: '#d4c9b8' }}
              >
                <AccordionTrigger
                  className="text-left font-display text-base md:text-lg py-5"
                  style={{ color: '#1a3a2f' }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#c75c2e' }}>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 30%, #f5f0e8 1px, transparent 1px), radial-gradient(circle at 90% 70%, #1a3a2f 1px, transparent 1px)',
            backgroundSize: '40px 40px, 70px 70px',
          }}
        />
        <div className="max-w-[1000px] mx-auto px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl text-white"
          >
            {content.ctaBanner.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base md:text-lg text-white/90 max-w-[640px] mx-auto"
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
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200 hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: '#25d366', color: '#ffffff' }}
            >
              <MessageCircle size={16} />
              {content.ctaBanner.primaryLabel}
            </a>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#1a3a2f', color: '#ffffff' }}
            >
              {content.ctaBanner.secondaryLabel}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-label mb-4">GET IN TOUCH</p>
              <h2 className="text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
                Let's Talk About Your Farm Needs
              </h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Phone size={18} style={{ color: '#5c7a4a' }} />
                  <a href={content.contact.phoneHref} className="text-base hover:opacity-80" style={{ color: '#3d3d3d' }}>{content.contact.phoneDisplay}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} style={{ color: '#5c7a4a' }} />
                  <a href={`mailto:${content.contact.email}`} className="text-base hover:opacity-80" style={{ color: '#3d3d3d' }}>{content.contact.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Sprout size={18} style={{ color: '#25d366' }} />
                  <a
                    href={content.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium transition-colors hover:opacity-80"
                    style={{ color: '#25d366' }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} style={{ color: '#5c7a4a' }} />
                  <span className="text-base" style={{ color: '#3d3d3d' }}>{content.contact.location}</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Name *"
                  aria-label="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-underline"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  aria-label="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-underline"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  aria-label="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-underline"
                />
                <textarea
                  placeholder="Your Message *"
                  aria-label="Your message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-underline resize-none"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={createEnquiry.isPending}
                  className="btn-primary disabled:opacity-50"
                >
                  {createEnquiry.isPending ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
