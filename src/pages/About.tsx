import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowRight,
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
import { useSiteContent } from '@/hooks/useSiteContent';
import SEO from '@/components/SEO';
import { siteUrl } from '@contracts/seo-content';

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

export default function About() {
  const content = useSiteContent();
  const { about, enquiryProcess, whyChooseUs } = content;
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
        name: 'About',
        item: `${siteUrl}/about`,
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <SEO
        title="About Jaosef Agro Supplies | Agricultural Supply Shop in Kenya"
        description="Learn about Jaosef Agro Supplies, a Kenyan agricultural supply business supporting productive farming with quality crop inputs, livestock supplies, and practical guidance."
        path="/about"
        image="/images/brand/jaosef-logo-light.webp"
        jsonLd={breadcrumbJsonLd}
      />
      <Navigation />

      {/* About Hero */}
      <section
        className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden"
        style={{ backgroundColor: '#1a3a2f' }}
      >
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
              {about.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#f5f0e8]">
              {about.heading}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.78)' }}>
              {about.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <p className="section-label mb-3">OUR STORY</p>
              <h2 className="text-2xl sm:text-3xl md:text-[32px] leading-[1.3]" style={{ color: '#1a3a2f' }}>
                {about.story.heading}
              </h2>
              <div className="mt-5 space-y-4">
                {about.story.paragraphs.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="order-1 md:order-2"
            >
              <img
                src={about.imageUrl}
                alt="Jaosef Agro Supplies agricultural supply shop in Kenya"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3', border: '1px solid #d4c9b8' }}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {[
              { eyebrow: 'MISSION', heading: about.mission.heading, body: about.mission.body, accent: '#c75c2e' },
              { eyebrow: 'VISION', heading: about.vision.heading, body: about.vision.body, accent: '#5c7a4a' },
            ].map((card, i) => (
              <motion.div
                key={card.eyebrow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 sm:p-8 md:p-10"
                style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}
              >
                <div
                  className="absolute top-0 left-0 h-1 w-full"
                  style={{ backgroundColor: card.accent }}
                />
                <p className="section-label" style={{ color: card.accent }}>{card.eyebrow}</p>
                <h3 className="font-display text-2xl mt-3" style={{ color: '#1a3a2f' }}>
                  {card.heading}
                </h3>
                <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Pillars */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: '#1a3a2f' }}>
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
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
            className="text-center max-w-[760px] mx-auto mb-12 md:mb-14"
          >
            <p className="section-label-light mb-3" style={{ color: '#c75c2e' }}>
              {about.sustainability.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#f5f0e8]">
              {about.sustainability.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.75)' }}>
              {about.sustainability.intro}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {about.sustainability.pillars.map((pillar, i) => {
              const Icon = iconMap[pillar.iconKey] ?? Leaf;
              const accents = ['#c75c2e', '#5c7a4a', '#d4a444', '#25d366'];
              const accent = accents[i % accents.length];
              return (
                <motion.div
                  key={`${pillar.title}-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative group p-6 md:p-8"
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
                  <h3 className="font-display text-xl text-[#f5f0e8]">{pillar.title}</h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.72)' }}>
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[640px] mx-auto mb-12 md:mb-14"
          >
            <p className="section-label mb-3">{enquiryProcess.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              {enquiryProcess.heading}
            </h2>
          </motion.div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px"
              style={{ backgroundColor: '#d4c9b8' }}
            />
            {enquiryProcess.steps.map((step, i) => {
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

      {/* Why Farmers Choose Us */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-[640px] mx-auto mb-12"
          >
            <p className="section-label mb-3">{whyChooseUs.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              {whyChooseUs.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
              {whyChooseUs.subtext}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.items.map((item, i) => {
              const Icon = iconMap[item.iconKey] ?? BadgeCheck;
              return (
                <motion.div
                  key={`${item.title}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="p-6 flex flex-col"
                  style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 mb-4 rounded-full"
                    style={{ backgroundColor: '#1a3a2f' }}
                  >
                    <Icon size={22} strokeWidth={1.8} className="text-[#f5f0e8]" />
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

      {/* Closing CTA */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ backgroundColor: '#c75c2e' }}>
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 30%, #f5f0e8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl text-white"
          >
            Talk to us about your farm
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-base sm:text-lg text-white/90 max-w-[640px] mx-auto"
          >
            Whether you need inputs, advice, or both — send us a message and we'll get back to you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
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
              Browse Products
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
