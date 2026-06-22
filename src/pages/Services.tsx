import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Truck,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useSiteContent } from '@/hooks/useSiteContent';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const iconMap: Record<string, LucideIcon> = {
  sprout: Sprout,
  shield: ShieldCheck,
  leaf: Leaf,
  wheat: Wheat,
  truck: Truck,
  badge: BadgeCheck,
  messageCircle: MessageCircle,
  package: PackageCheck,
};

const serviceDetails = [
  {
    title: 'Farm Input Supply',
    body: 'We help farmers find practical crop and livestock inputs, including fertilisers, certified seed, crop protection, animal feeds, poultry supplies, dairy equipment, irrigation tools, and farm equipment.',
  },
  {
    title: 'Crop Nutrition Guidance',
    body: 'Farmers can ask about DAP, CAN, urea, NPK, foliar feeds, lime, manure, and soil nutrition options based on crop stage, soil condition, rainfall, and local farm goals.',
  },
  {
    title: 'Crop Protection Guidance',
    body: 'We support label-based enquiry for insecticides, fungicides, herbicides, biopesticides, PPE, and responsible handling so products are used safely and only where appropriate.',
  },
  {
    title: 'Livestock & Poultry Supplies',
    body: 'We supply and advise on dairy meal, calf feeds, layers mash, chick mash, broiler feed, mineral licks, poultry vitamins, disinfectants, acaricides, feeders, drinkers, milk cans, and feed troughs.',
  },
  {
    title: 'Irrigation & Watering Supplies',
    body: 'We help farmers choose drip kits, hoses, sprinklers, tanks, pumps, and watering tools for nurseries, vegetable plots, orchards, and livestock water needs.',
  },
  {
    title: 'Farmer Enquiry Support',
    body: 'Customers can ask about current availability, pack sizes, product suitability, safe-use notes, pickup, and delivery options before committing to a purchase.',
  },
];

export default function Services() {
  const content = useSiteContent();
  const { services } = content;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jaosefagrosupplies.co.ke/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://jaosefagrosupplies.co.ke/services',
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <SEO
        title="Services | Jaosef Agro Supplies"
        description="Jaosef Agro Supplies supports Kenyan farmers with farm input supply, crop nutrition guidance, crop protection guidance, livestock feeds, poultry supplies, dairy equipment, irrigation, and farmer enquiry support."
        path="/services"
        image="/images/hero/hero-01-agro-shop-desktop.webp"
        jsonLd={breadcrumbJsonLd}
      />
      <Navigation />

      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden" style={{ backgroundColor: '#1a3a2f' }}>
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #f5f0e8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[760px]"
          >
            <p className="section-label-light mb-4" style={{ color: '#c75c2e' }}>
              {services.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#f5f0e8]">
              Services
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.78)' }}>
              {services.intro}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2">
                Browse Farm Inputs
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{
                  border: '1px solid rgba(245, 240, 232, 0.35)',
                  color: '#f5f0e8',
                  backgroundColor: 'rgba(245, 240, 232, 0.05)',
                }}
              >
                Contact Jaosef Agro Supplies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.items.map((item, index) => {
              const Icon = iconMap[item.iconKey] ?? BadgeCheck;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="p-6 sm:p-7 h-full"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d4c9b8' }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center mb-5"
                    style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f' }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h2 className="font-display text-xl" style={{ color: '#1a3a2f' }}>
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[720px] mb-10">
            <p className="section-label mb-3">HOW WE HELP</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              Practical support before farmers buy
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
              Jaosef Agro Supplies is designed for enquiry-led buying. Farmers can first explain their crop, livestock unit, location, season, and product need, then confirm availability and suitable options before purchasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {serviceDetails.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="p-5 sm:p-6"
                style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}
              >
                <h3 className="font-display text-xl" style={{ color: '#1a3a2f' }}>
                  {service.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                  {service.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 overflow-hidden" style={{ backgroundColor: '#c75c2e' }}>
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white">
            Need help choosing the right input?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/90 max-w-[640px] mx-auto">
            Send us your crop or livestock need and we will help you confirm practical options.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#1a3a2f', color: '#ffffff' }}
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: '#f5f0e8', color: '#1a3a2f' }}
            >
              View Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

