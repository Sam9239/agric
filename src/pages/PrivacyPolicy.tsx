import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { siteConfig } from '@/config/site';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />
      <main className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="section-label mb-4">PRIVACY POLICY</p>
          <h1 className="font-display text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
            Privacy Policy
          </h1>
          <div className="mt-8 space-y-6 text-base leading-[1.8]" style={{ color: '#3d3d3d' }}>
            <p>
              {siteConfig.name} collects only the contact details needed to respond to customer enquiries, such as names, phone numbers, email addresses, and enquiry messages.
            </p>
            <p>
              Information submitted through this website is used to respond to enquiries about agricultural products and services. We do not sell customer contact information.
            </p>
            <p>
              Customers may also contact us directly through phone, email, or WhatsApp. Those services may process information according to their own privacy policies.
            </p>
            <p>
              To request correction or deletion of enquiry information, contact us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold hover:opacity-80" style={{ color: '#c75c2e' }}>
                {siteConfig.email}
              </a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
