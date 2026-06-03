import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, ImagePlus, X, Loader2 } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import { useSiteContent } from '@/hooks/useSiteContent';
import { enquiryImageLimits } from '@contracts/site-content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type StagedImage = {
  id: string;
  file: File;
  previewUrl: string;
  status: 'staged' | 'uploading' | 'uploaded' | 'failed';
  uploadedUrl?: string;
  error?: string;
};

function makeId() {
  return Math.random().toString(36).slice(2);
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch('/api/upload-enquiry-image', {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || 'Upload failed');
  }
  const json = (await res.json()) as { url: string };
  return json.url;
}

export default function Contact() {
  const content = useSiteContent();
  const { contact, socials, faq } = content;
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [images, setImages] = useState<StagedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createEnquiry = trpc.enquiry.create.useMutation();

  const acceptAttr = enquiryImageLimits.acceptedExtensions.join(',');
  const maxFileMb = Math.round(enquiryImageLimits.maxFileSizeBytes / (1024 * 1024));

  function handleFilesPicked(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remainingSlots = enquiryImageLimits.maxFiles - images.length;
    if (remainingSlots <= 0) {
      toast.error(`You can attach up to ${enquiryImageLimits.maxFiles} images.`);
      return;
    }

    const incoming = Array.from(files).slice(0, remainingSlots);
    const accepted: StagedImage[] = [];
    for (const file of incoming) {
      if (!enquiryImageLimits.acceptedMimeTypes.includes(file.type as never)) {
        toast.error(`${file.name}: unsupported file type.`);
        continue;
      }
      if (file.size > enquiryImageLimits.maxFileSizeBytes) {
        toast.error(`${file.name}: exceeds ${maxFileMb}MB.`);
        continue;
      }
      accepted.push({
        id: makeId(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'staged',
      });
    }

    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in name, email, and message.');
      return;
    }
    setSubmitting(true);

    try {
      const uploadedUrls: string[] = [];
      for (const img of images) {
        if (img.status === 'uploaded' && img.uploadedUrl) {
          uploadedUrls.push(img.uploadedUrl);
          continue;
        }
        setImages((prev) =>
          prev.map((p) => (p.id === img.id ? { ...p, status: 'uploading', error: undefined } : p)),
        );
        try {
          const url = await uploadImage(img.file);
          uploadedUrls.push(url);
          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id ? { ...p, status: 'uploaded', uploadedUrl: url } : p,
            ),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id ? { ...p, status: 'failed', error: message } : p,
            ),
          );
          throw new Error(`Failed to upload ${img.file.name}: ${message}`);
        }
      }

      await createEnquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        imageUrls: uploadedUrls.length ? uploadedUrls : undefined,
      });

      toast.success('Enquiry sent — we will reply soon.');
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setImages([]);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <Navigation />

      {/* Contact Hero */}
      <section
        className="relative pt-32 pb-12 md:pt-44 md:pb-16 overflow-hidden"
        style={{ backgroundColor: '#1a3a2f' }}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[760px]"
          >
            <p className="section-label-light mb-4" style={{ color: '#c75c2e' }}>
              GET IN TOUCH
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#f5f0e8]">
              Let's talk farming
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.78)' }}>
              Send us a message with your crop, location, and what you need — attach photos if helpful — and we'll respond with stock, prices, and guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form + contact info */}
      <section className="py-12 md:py-20" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-[32px]" style={{ color: '#1a3a2f' }}>
                Send an enquiry
              </h2>
              <p className="mt-2 text-sm" style={{ color: '#8b7d6b' }}>
                Fields marked * are required.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-base bg-white outline-none transition-colors duration-200 focus:border-[#c75c2e]"
                    style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-base bg-white outline-none transition-colors duration-200 focus:border-[#c75c2e]"
                      style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 text-base bg-white outline-none transition-colors duration-200 focus:border-[#c75c2e]"
                      style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-base bg-white outline-none transition-colors duration-200 focus:border-[#c75c2e] resize-none"
                    style={{ border: '1px solid #d4c9b8', color: '#1a3a2f' }}
                    rows={6}
                    placeholder="Tell us about your farm — crop, region, what you need…"
                    required
                  />
                </div>

                {/* Image attachments */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
                    Attach photos (optional)
                  </label>
                  <p className="text-xs mb-3" style={{ color: '#8b7d6b' }}>
                    Up to {enquiryImageLimits.maxFiles} images, {maxFileMb}MB each. JPG, PNG, or WebP. Useful for showing pests, crops, or product references.
                  </p>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className="relative group aspect-square overflow-hidden"
                          style={{ border: '1px solid #d4c9b8', backgroundColor: '#e8dfd1' }}
                        >
                          <img
                            src={img.previewUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {img.status === 'uploading' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Loader2 size={20} className="text-white animate-spin" />
                            </div>
                          )}
                          {img.status === 'failed' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-600/50">
                              <span className="text-xs text-white px-1 text-center">{img.error || 'Failed'}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            disabled={submitting && img.status === 'uploading'}
                            className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full text-white transition-opacity disabled:opacity-40"
                            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {images.length < enquiryImageLimits.maxFiles && (
                    <label
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold cursor-pointer transition-all hover:opacity-90"
                      style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f', border: '1px solid #d4c9b8' }}
                    >
                      <ImagePlus size={16} />
                      Add photos
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptAttr}
                        multiple
                        onChange={(e) => handleFilesPicked(e.target.files)}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  style={{ backgroundColor: '#c75c2e' }}
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {submitting ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            </motion.div>

            {/* Contact info card */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 sm:p-8 h-fit space-y-5"
              style={{ backgroundColor: '#1a3a2f', color: '#f5f0e8' }}
            >
              <h3 className="font-display text-2xl">Reach us directly</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(245, 240, 232, 0.75)' }}>
                Prefer a quick chat? Use any of these — WhatsApp is usually the fastest.
              </p>

              <div className="space-y-4 pt-2">
                <a href={contact.phoneHref} className="flex items-start gap-3 group">
                  <Phone size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#c75c2e' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>Phone</p>
                    <p className="text-base group-hover:opacity-80 transition-opacity">{contact.phoneDisplay}</p>
                  </div>
                </a>

                <a href={`mailto:${contact.email}`} className="flex items-start gap-3 group">
                  <Mail size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#c75c2e' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>Email</p>
                    <p className="text-base group-hover:opacity-80 transition-opacity break-all">{contact.email}</p>
                  </div>
                </a>

                <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <MessageCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#25d366' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>WhatsApp</p>
                    <p className="text-base group-hover:opacity-80 transition-opacity" style={{ color: '#25d366' }}>Chat with us</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#c75c2e' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>Location</p>
                    <p className="text-base">{contact.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#c75c2e' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>Hours</p>
                    <p className="text-base whitespace-pre-line">{contact.hours}</p>
                  </div>
                </div>
              </div>

              {(socials.facebook !== '#' || socials.instagram !== '#' || socials.tiktok !== '#') && (
                <div className="pt-4" style={{ borderTop: '1px solid rgba(245, 240, 232, 0.12)' }}>
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'rgba(245, 240, 232, 0.55)' }}>Social</p>
                  <div className="flex gap-2 flex-wrap">
                    {socials.facebook !== '#' && (
                      <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80" style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)' }}>Facebook</a>
                    )}
                    {socials.instagram !== '#' && (
                      <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80" style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)' }}>Instagram</a>
                    )}
                    {socials.tiktok !== '#' && (
                      <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80" style={{ backgroundColor: 'rgba(245, 240, 232, 0.08)' }}>TikTok</a>
                    )}
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#e8dfd1' }}>
        <div className="max-w-[820px] mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-12"
          >
            <p className="section-label mb-3">{faq.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ color: '#1a3a2f' }}>
              {faq.heading}
            </h2>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {faq.items.map((item, i) => (
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

      <Footer />
    </div>
  );
}
