import { useState } from 'react';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import { defaultSiteContent, type SiteContent } from '@contracts/site-content';
import { productCategories, type ProductCategory } from '@contracts/product-catalog';
import { RotateCcw, Save } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 text-sm bg-white outline-none transition-colors duration-200 focus:border-[#c75c2e]';
const inputStyle = { border: '1px solid #d4c9b8', color: '#1a3a2f' } as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 mb-6" style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}>
      <h3 className="font-display text-xl mb-5" style={{ color: '#1a3a2f' }}>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8b7d6b' }}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[11px]" style={{ color: '#8b7d6b' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

const iconOptions = [
  { value: 'sprout', label: 'Sprout' },
  { value: 'shield', label: 'Shield' },
  { value: 'leaf', label: 'Leaf' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'truck', label: 'Truck' },
  { value: 'badge', label: 'Badge' },
  { value: 'users', label: 'Users' },
  { value: 'messageCircle', label: 'Message Circle' },
  { value: 'package', label: 'Package' },
];

export default function SiteContentEditor() {
  const { data: serverContent, isLoading } = trpc.siteContent.get.useQuery();

  if (isLoading && !serverContent) {
    return (
      <div className="p-6" style={{ backgroundColor: '#f5f0e8', border: '1px solid #d4c9b8' }}>
        <p className="text-sm" style={{ color: '#8b7d6b' }}>
          Loading site content...
        </p>
      </div>
    );
  }

  return <SiteContentForm initialContent={serverContent ?? defaultSiteContent} />;
}

function SiteContentForm({ initialContent }: { initialContent: SiteContent }) {
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState<SiteContent>(() => clone(initialContent));

  const updateMutation = trpc.siteContent.update.useMutation({
    onSuccess: (data) => {
      utils.siteContent.get.invalidate();
      setDraft(clone(data));
      toast.success('Site content saved');
    },
    onError: () => toast.error('Failed to save site content'),
  });

  const resetMutation = trpc.siteContent.reset.useMutation({
    onSuccess: (data) => {
      utils.siteContent.get.invalidate();
      setDraft(clone(data));
      toast.success('Reset to defaults');
    },
    onError: () => toast.error('Failed to reset'),
  });

  function handleSave() {
    updateMutation.mutate(draft);
  }

  function handleReset() {
    if (!window.confirm('Reset all site content to defaults? This cannot be undone.')) return;
    resetMutation.mutate();
  }

  function setField<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl" style={{ color: '#1a3a2f' }}>
            Site Content
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8b7d6b' }}>
            Edit any text on the public website — contact info, hero, services, FAQ, and more. Changes go live after save.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f', border: '1px solid #d4c9b8' }}
          >
            <RotateCcw size={14} />
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ backgroundColor: '#c75c2e' }}
          >
            <Save size={14} />
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <Section title="Brand">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Full Name">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.brand.name}
              onChange={(e) => setField('brand', { ...draft.brand, name: e.target.value })}
            />
          </Field>
          <Field label="Nav Name">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.brand.navName}
              onChange={(e) => setField('brand', { ...draft.brand, navName: e.target.value })}
            />
          </Field>
          <Field label="Nav Tagline">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.brand.navTagline}
              onChange={(e) => setField('brand', { ...draft.brand, navTagline: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Phone (display)" hint="e.g. +254 746 804 727">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.contact.phoneDisplay}
              onChange={(e) => setField('contact', { ...draft.contact, phoneDisplay: e.target.value })}
            />
          </Field>
          <Field label="Phone (link)" hint="e.g. tel:+254746804727">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.contact.phoneHref}
              onChange={(e) => setField('contact', { ...draft.contact, phoneHref: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              style={inputStyle}
              value={draft.contact.email}
              onChange={(e) => setField('contact', { ...draft.contact, email: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.contact.location}
              onChange={(e) => setField('contact', { ...draft.contact, location: e.target.value })}
            />
          </Field>
          <Field label="Opening Hours" hint="Line breaks are preserved.">
            <textarea
              className={`${inputClass} resize-none`}
              style={inputStyle}
              rows={3}
              value={draft.contact.hours}
              onChange={(e) => setField('contact', { ...draft.contact, hours: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp Number" hint="Digits only, with country code (e.g. 254746804727)">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.contact.whatsappNumber}
              onChange={(e) => setField('contact', { ...draft.contact, whatsappNumber: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp URL" hint="e.g. https://wa.me/254746804727">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.contact.whatsappUrl}
              onChange={(e) => setField('contact', { ...draft.contact, whatsappUrl: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Social Links">
        <p className="text-xs -mt-3 mb-2" style={{ color: '#8b7d6b' }}>
          Leave as <code>#</code> to hide an icon.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Facebook URL">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.socials.facebook}
              onChange={(e) => setField('socials', { ...draft.socials, facebook: e.target.value })}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.socials.instagram}
              onChange={(e) => setField('socials', { ...draft.socials, instagram: e.target.value })}
            />
          </Field>
          <Field label="TikTok URL">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.socials.tiktok}
              onChange={(e) => setField('socials', { ...draft.socials, tiktok: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Hero Section">
        <Field label="Eyebrow Text">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.hero.eyebrow}
            onChange={(e) => setField('hero', { ...draft.hero, eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline" hint="Words animate in one at a time on the homepage.">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.hero.headline}
            onChange={(e) => setField('hero', { ...draft.hero, headline: e.target.value })}
          />
        </Field>
        <Field label="Subtext">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={3}
            value={draft.hero.subtext}
            onChange={(e) => setField('hero', { ...draft.hero, subtext: e.target.value })}
          />
        </Field>
        <Field label="CTA Button Label">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.hero.ctaLabel}
            onChange={(e) => setField('hero', { ...draft.hero, ctaLabel: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Homepage Mission Strip">
        <Field label="Eyebrow">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.homeMission.eyebrow}
            onChange={(e) => setField('homeMission', { ...draft.homeMission, eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Mission Statement" hint="One sentence shown below the hero on the homepage.">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={3}
            value={draft.homeMission.statement}
            onChange={(e) => setField('homeMission', { ...draft.homeMission, statement: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="About Page — Hero">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.about.eyebrow}
              onChange={(e) => setField('about', { ...draft.about, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Image URL" hint="Used in the Our Story section.">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.about.imageUrl}
              onChange={(e) => setField('about', { ...draft.about, imageUrl: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Heading">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.about.heading}
            onChange={(e) => setField('about', { ...draft.about, heading: e.target.value })}
          />
        </Field>
        <Field label="Intro">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={3}
            value={draft.about.intro}
            onChange={(e) => setField('about', { ...draft.about, intro: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="About Page — Our Story">
        <Field label="Story Heading">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.about.story.heading}
            onChange={(e) => setField('about', { ...draft.about, story: { ...draft.about.story, heading: e.target.value } })}
          />
        </Field>
        <div className="space-y-3 mt-2">
          {draft.about.story.paragraphs.map((para, idx) => (
            <div key={idx} className="p-3" style={{ border: '1px dashed #d4c9b8' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                  Paragraph {idx + 1}
                </span>
                {draft.about.story.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const paragraphs = draft.about.story.paragraphs.filter((_, i) => i !== idx);
                      setField('about', { ...draft.about, story: { ...draft.about.story, paragraphs } });
                    }}
                    className="text-xs"
                    style={{ color: '#c75c2e' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                className={`${inputClass} resize-none`}
                style={inputStyle}
                rows={3}
                value={para}
                onChange={(e) => {
                  const paragraphs = [...draft.about.story.paragraphs];
                  paragraphs[idx] = e.target.value;
                  setField('about', { ...draft.about, story: { ...draft.about.story, paragraphs } });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const paragraphs = [...draft.about.story.paragraphs, ''];
              setField('about', { ...draft.about, story: { ...draft.about.story, paragraphs } });
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
            style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f', border: '1px solid #d4c9b8' }}
          >
            + Add Paragraph
          </button>
        </div>
      </Section>

      <Section title="About Page — Mission & Vision">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3" style={{ borderRight: '1px dashed #d4c9b8', paddingRight: '1rem' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#c75c2e' }}>Mission</p>
            <Field label="Heading">
              <input
                type="text"
                className={inputClass}
                style={inputStyle}
                value={draft.about.mission.heading}
                onChange={(e) => setField('about', { ...draft.about, mission: { ...draft.about.mission, heading: e.target.value } })}
              />
            </Field>
            <Field label="Body">
              <textarea
                className={`${inputClass} resize-none`}
                style={inputStyle}
                rows={3}
                value={draft.about.mission.body}
                onChange={(e) => setField('about', { ...draft.about, mission: { ...draft.about.mission, body: e.target.value } })}
              />
            </Field>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5c7a4a' }}>Vision</p>
            <Field label="Heading">
              <input
                type="text"
                className={inputClass}
                style={inputStyle}
                value={draft.about.vision.heading}
                onChange={(e) => setField('about', { ...draft.about, vision: { ...draft.about.vision, heading: e.target.value } })}
              />
            </Field>
            <Field label="Body">
              <textarea
                className={`${inputClass} resize-none`}
                style={inputStyle}
                rows={3}
                value={draft.about.vision.body}
                onChange={(e) => setField('about', { ...draft.about, vision: { ...draft.about.vision, body: e.target.value } })}
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="About Page — Sustainability Pillars">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.about.sustainability.eyebrow}
              onChange={(e) => setField('about', { ...draft.about, sustainability: { ...draft.about.sustainability, eyebrow: e.target.value } })}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.about.sustainability.heading}
              onChange={(e) => setField('about', { ...draft.about, sustainability: { ...draft.about.sustainability, heading: e.target.value } })}
            />
          </Field>
        </div>
        <Field label="Intro">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={2}
            value={draft.about.sustainability.intro}
            onChange={(e) => setField('about', { ...draft.about, sustainability: { ...draft.about.sustainability, intro: e.target.value } })}
          />
        </Field>
        <div className="space-y-4 mt-2">
          {draft.about.sustainability.pillars.map((pillar, idx) => (
            <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3" style={{ border: '1px dashed #d4c9b8' }}>
              <Field label={`Pillar ${idx + 1} Icon`}>
                <select
                  className={inputClass}
                  style={inputStyle}
                  value={pillar.iconKey}
                  onChange={(e) => {
                    const pillars = [...draft.about.sustainability.pillars];
                    pillars[idx] = { ...pillars[idx], iconKey: e.target.value };
                    setField('about', { ...draft.about, sustainability: { ...draft.about.sustainability, pillars } });
                  }}
                >
                  {iconOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <div className="space-y-3">
                <Field label="Title">
                  <input
                    type="text"
                    className={inputClass}
                    style={inputStyle}
                    value={pillar.title}
                    onChange={(e) => {
                      const pillars = [...draft.about.sustainability.pillars];
                      pillars[idx] = { ...pillars[idx], title: e.target.value };
                      setField('about', { ...draft.about, sustainability: { ...draft.about.sustainability, pillars } });
                    }}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const pillars = [...draft.about.sustainability.pillars];
                      pillars[idx] = { ...pillars[idx], description: e.target.value };
                      setField('about', { ...draft.about, sustainability: { ...draft.about.sustainability, pillars } });
                    }}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Services Section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.services.eyebrow}
              onChange={(e) => setField('services', { ...draft.services, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.services.heading}
              onChange={(e) => setField('services', { ...draft.services, heading: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Intro Text">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={2}
            value={draft.services.intro}
            onChange={(e) => setField('services', { ...draft.services, intro: e.target.value })}
          />
        </Field>
        <div className="space-y-4 mt-2">
          {draft.services.items.map((item, idx) => (
            <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3" style={{ border: '1px dashed #d4c9b8' }}>
              <Field label={`Card ${idx + 1} Icon`}>
                <select
                  className={inputClass}
                  style={inputStyle}
                  value={item.iconKey}
                  onChange={(e) => {
                    const items = [...draft.services.items];
                    items[idx] = { ...items[idx], iconKey: e.target.value };
                    setField('services', { ...draft.services, items });
                  }}
                >
                  {iconOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <div className="space-y-3">
                <Field label="Title">
                  <input
                    type="text"
                    className={inputClass}
                    style={inputStyle}
                    value={item.title}
                    onChange={(e) => {
                      const items = [...draft.services.items];
                      items[idx] = { ...items[idx], title: e.target.value };
                      setField('services', { ...draft.services, items });
                    }}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...draft.services.items];
                      items[idx] = { ...items[idx], description: e.target.value };
                      setField('services', { ...draft.services, items });
                    }}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why Choose Us">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.whyChooseUs.eyebrow}
              onChange={(e) => setField('whyChooseUs', { ...draft.whyChooseUs, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.whyChooseUs.heading}
              onChange={(e) => setField('whyChooseUs', { ...draft.whyChooseUs, heading: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Subtext">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={2}
            value={draft.whyChooseUs.subtext}
            onChange={(e) => setField('whyChooseUs', { ...draft.whyChooseUs, subtext: e.target.value })}
          />
        </Field>
        <div className="space-y-4 mt-2">
          {draft.whyChooseUs.items.map((item, idx) => (
            <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3" style={{ border: '1px dashed #d4c9b8' }}>
              <Field label={`Card ${idx + 1} Icon`}>
                <select
                  className={inputClass}
                  style={inputStyle}
                  value={item.iconKey}
                  onChange={(e) => {
                    const items = [...draft.whyChooseUs.items];
                    items[idx] = { ...items[idx], iconKey: e.target.value };
                    setField('whyChooseUs', { ...draft.whyChooseUs, items });
                  }}
                >
                  {iconOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <div className="space-y-3">
                <Field label="Title">
                  <input
                    type="text"
                    className={inputClass}
                    style={inputStyle}
                    value={item.title}
                    onChange={(e) => {
                      const items = [...draft.whyChooseUs.items];
                      items[idx] = { ...items[idx], title: e.target.value };
                      setField('whyChooseUs', { ...draft.whyChooseUs, items });
                    }}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...draft.whyChooseUs.items];
                      items[idx] = { ...items[idx], description: e.target.value };
                      setField('whyChooseUs', { ...draft.whyChooseUs, items });
                    }}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How Enquiries Work">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.enquiryProcess.eyebrow}
              onChange={(e) => setField('enquiryProcess', { ...draft.enquiryProcess, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.enquiryProcess.heading}
              onChange={(e) => setField('enquiryProcess', { ...draft.enquiryProcess, heading: e.target.value })}
            />
          </Field>
        </div>
        <div className="space-y-3 mt-2">
          {draft.enquiryProcess.steps.map((step, idx) => (
            <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3" style={{ border: '1px dashed #d4c9b8' }}>
              <Field label={`Step ${idx + 1} Title`}>
                <input
                  type="text"
                  className={inputClass}
                  style={inputStyle}
                  value={step.title}
                  onChange={(e) => {
                    const steps = [...draft.enquiryProcess.steps];
                    steps[idx] = { ...steps[idx], title: e.target.value };
                    setField('enquiryProcess', { ...draft.enquiryProcess, steps });
                  }}
                />
              </Field>
              <Field label="Description">
                <input
                  type="text"
                  className={inputClass}
                  style={inputStyle}
                  value={step.description}
                  onChange={(e) => {
                    const steps = [...draft.enquiryProcess.steps];
                    steps[idx] = { ...steps[idx], description: e.target.value };
                    setField('enquiryProcess', { ...draft.enquiryProcess, steps });
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      <Section title="FAQ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.faq.eyebrow}
              onChange={(e) => setField('faq', { ...draft.faq, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.faq.heading}
              onChange={(e) => setField('faq', { ...draft.faq, heading: e.target.value })}
            />
          </Field>
        </div>
        <div className="space-y-3 mt-2">
          {draft.faq.items.map((item, idx) => (
            <div key={idx} className="p-4" style={{ border: '1px dashed #d4c9b8' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7d6b' }}>
                  Question {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const items = draft.faq.items.filter((_, i) => i !== idx);
                    setField('faq', { ...draft.faq, items });
                  }}
                  className="text-xs"
                  style={{ color: '#c75c2e' }}
                >
                  Remove
                </button>
              </div>
              <Field label="Question">
                <input
                  type="text"
                  className={inputClass}
                  style={inputStyle}
                  value={item.question}
                  onChange={(e) => {
                    const items = [...draft.faq.items];
                    items[idx] = { ...items[idx], question: e.target.value };
                    setField('faq', { ...draft.faq, items });
                  }}
                />
              </Field>
              <div className="mt-3">
                <Field label="Answer">
                  <textarea
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    rows={3}
                    value={item.answer}
                    onChange={(e) => {
                      const items = [...draft.faq.items];
                      items[idx] = { ...items[idx], answer: e.target.value };
                      setField('faq', { ...draft.faq, items });
                    }}
                  />
                </Field>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const items = [...draft.faq.items, { question: 'New question?', answer: 'Answer here.' }];
              setField('faq', { ...draft.faq, items });
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
            style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f', border: '1px solid #d4c9b8' }}
          >
            + Add Question
          </button>
        </div>
      </Section>

      <Section title="CTA Banner">
        <Field label="Heading">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            value={draft.ctaBanner.heading}
            onChange={(e) => setField('ctaBanner', { ...draft.ctaBanner, heading: e.target.value })}
          />
        </Field>
        <Field label="Body">
          <textarea
            className={`${inputClass} resize-none`}
            style={inputStyle}
            rows={2}
            value={draft.ctaBanner.body}
            onChange={(e) => setField('ctaBanner', { ...draft.ctaBanner, body: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Primary Button Label">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.ctaBanner.primaryLabel}
              onChange={(e) => setField('ctaBanner', { ...draft.ctaBanner, primaryLabel: e.target.value })}
            />
          </Field>
          <Field label="Secondary Button Label">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={draft.ctaBanner.secondaryLabel}
              onChange={(e) => setField('ctaBanner', { ...draft.ctaBanner, secondaryLabel: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Category Short Descriptions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(productCategories) as ProductCategory[]).map((key) => (
            <Field key={key} label={productCategories[key]}>
              <input
                type="text"
                className={inputClass}
                style={inputStyle}
                value={draft.categoryDescriptions[key]}
                onChange={(e) =>
                  setField('categoryDescriptions', {
                    ...draft.categoryDescriptions,
                    [key]: e.target.value,
                  })
                }
              />
            </Field>
          ))}
        </div>
      </Section>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={resetMutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
          style={{ backgroundColor: '#e8dfd1', color: '#1a3a2f', border: '1px solid #d4c9b8' }}
        >
          <RotateCcw size={14} />
          Reset to Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ backgroundColor: '#c75c2e' }}
        >
          <Save size={14} />
          {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
