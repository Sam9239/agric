import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { siteConfig } from '@/config/site';

export default function TermsDisclaimer() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />
      <main className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="section-label mb-4">TERMS & DISCLAIMER</p>
          <h1 className="font-display text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
            Terms & Product Disclaimer
          </h1>
          <div className="mt-8 space-y-6 text-base leading-[1.8]" style={{ color: '#3d3d3d' }}>
            <p>
              This website is provided for company information, product browsing, and customer enquiries. It does not process online payments or complete online sales.
            </p>
            <p>
              Product information is provided for general enquiry purposes only. Customers must follow the instructions, safety guidelines, dosage information, and usage directions printed on the official product label.
            </p>
            <p>
              {siteConfig.name} is responsible for ensuring that listed agricultural inputs and pest-control products comply with applicable Kenyan laws and regulations.
            </p>
            <p>
              Customers should seek professional agronomic advice where needed before applying pesticides, fertilizers, or crop protection products.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
