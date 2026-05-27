import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Sprout } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import WhatsAppButton from '../sections/WhatsAppButton';
import { trpc } from '@/providers/trpc';
import { useState } from 'react';
import { toast } from 'sonner';

const categoryImages: Record<string, string> = {
  pesticides: '/images/cat-pesticides.jpg',
  manure: '/images/cat-manure.jpg',
  fertilizers: '/images/cat-fertilizers.jpg',
  farm_inputs: '/images/cat-farm-inputs.jpg',
  crop_protection: '/images/cat-crop-protection.jpg',
};

const categoryLabels: Record<string, string> = {
  pesticides: 'Pesticides',
  manure: 'Manure',
  fertilizers: 'Fertilizers',
  farm_inputs: 'Farm Inputs',
  crop_protection: 'Crop Protection',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Home() {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    createEnquiry.mutate(formData);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      {/* Hero Section */}
      <section style={{ backgroundColor: '#1a3a2f' }} className="pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="section-label-light mb-6">
                KENYA'S TRUSTED AGRICULTURAL PARTNER
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#f5f0e8]">
                Quality Farm Inputs for Better Harvests
              </h1>
              <p className="mt-5 text-lg max-w-[480px]" style={{ color: '#a09080' }}>
                Premium pesticides, fertilizers, and crop protection products sourced for Kenyan farmers since 2010.
              </p>
              <Link
                to="/products"
                className="btn-primary mt-8 inline-flex items-center gap-2"
              >
                BROWSE PRODUCTS
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              <img
                src="/images/hero.jpg"
                alt="Farmer in field"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.1)' }}
              />
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
              <p className="section-label mb-4">ABOUT US</p>
              <h2 className="text-3xl md:text-[32px] leading-[1.3]" style={{ color: '#1a3a2f' }}>
                Supporting Kenyan Agriculture
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                We supply quality agricultural inputs to farmers across Kenya. From smallholders to large-scale operations, our products help protect crops, enrich soil, and improve yields.
              </p>
              <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                Our mission is to make premium farm inputs accessible and affordable, empowering Kenyan farmers to achieve better harvests and sustainable livelihoods.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors duration-200 hover:opacity-80"
                style={{ color: '#c75c2e' }}
              >
                Explore Products <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img
                src="/images/about.jpg"
                alt="Agricultural supply store"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3', border: '1px solid #d4c9b8' }}
              />
            </motion.div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {Object.entries(categoryLabels).map(([key, label], i) => (
              <motion.div
                key={key}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link to={`/products?category=${key}`} className="block group">
                  <div className="overflow-hidden" style={{ border: '1px solid #d4c9b8', backgroundColor: '#f5f0e8' }}>
                    <div className="overflow-hidden" style={{ height: '60%' }}>
                      <img
                        src={categoryImages[key]}
                        alt={label}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="py-4 text-center">
                      <p className="font-display text-lg font-medium" style={{ color: '#1a3a2f' }}>
                        {label}
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
              <motion.div
                key={product.id}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
                      <p className="text-base font-semibold mt-1" style={{ color: '#c75c2e' }}>
                        {product.price}
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
            <h2 className="text-3xl md:text-4xl text-[#f5f0e8]">
              Farming Tips & Advice
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTips?.slice(0, 3).map((tip, i) => (
              <motion.div
                key={tip.id}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link to={`/farming-tips/${tip.id}`} className="block group">
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{ aspectRatio: '16/10' }}
                  />
                  <div className="pt-5">
                    <p className="text-xs" style={{ color: '#8b7d6b' }}>
                      {tip.date}
                    </p>
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
                  <span className="text-base" style={{ color: '#3d3d3d' }}>+254 700 123 456</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} style={{ color: '#5c7a4a' }} />
                  <span className="text-base" style={{ color: '#3d3d3d' }}>info@kilimoessentials.co.ke</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sprout size={18} style={{ color: '#25d366' }} />
                  <a
                    href="https://wa.me/254700123456"
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
                  <span className="text-base" style={{ color: '#3d3d3d' }}>Nairobi, Kenya</span>
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-underline"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-underline"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-underline"
                />
                <textarea
                  placeholder="Your Message *"
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
