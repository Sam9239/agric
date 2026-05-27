import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { trpc } from '@/providers/trpc';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function FarmingTips() {
  const { data: tips, isLoading } = trpc.tip.list.useQuery();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      {/* Page Header */}
      <section style={{ backgroundColor: '#1a3a2f' }} className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl text-[#f5f0e8]">Farming Tips</h1>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: '#8b7d6b' }}>
              Practical advice for better yields
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div style={{ backgroundColor: '#e8dfd1', aspectRatio: '16/10' }} />
                  <div className="mt-4 space-y-2">
                    <div style={{ backgroundColor: '#e8dfd1', height: 16, width: '30%' }} />
                    <div style={{ backgroundColor: '#e8dfd1', height: 24, width: '80%' }} />
                    <div style={{ backgroundColor: '#e8dfd1', height: 60, width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tips?.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Link to={`/farming-tips/${tip.id}`} className="block group">
                    <div className="overflow-hidden">
                      <img
                        src={tip.imageUrl}
                        alt={tip.title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{ aspectRatio: '16/10' }}
                      />
                    </div>
                    <div className="pt-5">
                      <p className="text-xs" style={{ color: '#8b7d6b' }}>
                        {tip.date}
                      </p>
                      <h3 className="font-display text-xl md:text-[22px] mt-2 transition-colors duration-300 group-hover:text-[#c75c2e]" style={{ color: '#1a3a2f' }}>
                        {tip.title}
                      </h3>
                      <p className="text-[15px] mt-2 leading-relaxed" style={{ color: '#3d3d3d' }}>
                        {tip.excerpt?.slice(0, 150)}...
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold" style={{ color: '#c75c2e' }}>
                        Read More <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
