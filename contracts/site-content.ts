import { z } from "zod";

export const siteContentSchema = z.object({
  brand: z.object({
    name: z.string(),
    navName: z.string(),
    navTagline: z.string(),
  }),
  contact: z.object({
    phoneDisplay: z.string(),
    phoneHref: z.string(),
    email: z.string(),
    whatsappNumber: z.string(),
    whatsappUrl: z.string(),
    location: z.string(),
    hours: z.string(),
  }),
  socials: z.object({
    facebook: z.string(),
    instagram: z.string(),
    tiktok: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subtext: z.string(),
    ctaLabel: z.string(),
  }),
  homeMission: z.object({
    eyebrow: z.string(),
    statement: z.string(),
  }),
  about: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    imageUrl: z.string(),
    story: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
    }),
    mission: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    vision: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    sustainability: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      intro: z.string(),
      pillars: z.array(
        z.object({
          iconKey: z.string(),
          title: z.string(),
          description: z.string(),
        }),
      ),
    }),
  }),
  services: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    items: z.array(
      z.object({
        iconKey: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  whyChooseUs: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    subtext: z.string(),
    items: z.array(
      z.object({
        iconKey: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  enquiryProcess: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    steps: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  faq: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    items: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
  ctaBanner: z.object({
    heading: z.string(),
    body: z.string(),
    primaryLabel: z.string(),
    secondaryLabel: z.string(),
  }),
  categoryDescriptions: z.object({
    crop_nutrition: z.string(),
    seeds: z.string(),
    crop_protection: z.string(),
    soil_health: z.string(),
    irrigation: z.string(),
    tools: z.string(),
    nursery: z.string(),
    safety: z.string(),
    post_harvest: z.string(),
    livestock_feeds: z.string(),
    animal_health: z.string(),
    livestock_equipment: z.string(),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const enquiryImageLimits = {
  maxFiles: 5,
  maxFileSizeBytes: 5 * 1024 * 1024,
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp"] as const,
};

export const defaultSiteContent: SiteContent = {
  brand: {
    name: "Jaosef Agro Supplies",
    navName: "JAOSEF",
    navTagline: "AGRO SUPPLIES",
  },
  contact: {
    phoneDisplay: "+254 746 804 727",
    phoneHref: "tel:+254746804727",
    email: "jaosefagrosupplies@gmail.com",
    whatsappNumber: "254746804727",
    whatsappUrl: "https://wa.me/254746804727",
    location: "Nairobi, Kenya",
    hours: "Monday – Saturday: 8:00 AM – 6:00 PM\nSunday: Closed",
  },
  socials: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
  hero: {
    eyebrow: "QUALITY INPUTS FOR A FOOD-SECURE KENYA",
    headline: "Growing Better Harvests, Together",
    subtext:
      "Quality crop and livestock supplies for Kenyan farms — from seeds, fertilisers, crop protection, and irrigation to poultry, dairy, animal feeds, and farm equipment.",
    ctaLabel: "BROWSE PRODUCTS",
  },
  homeMission: {
    eyebrow: "OUR PROMISE",
    statement:
      "We supply trusted crop and livestock inputs, plus practical guidance to help Kenyan farmers improve productivity, animal care, soil health, and farm resilience.",
  },
  about: {
    eyebrow: "ABOUT JAOSEF",
    heading: "Supporting Productive, Responsible Farming in Kenya",
    intro:
      "We exist to help Kenyan farmers grow more, waste less, and farm in a way that protects soil, water, and the people who work the land.",
    imageUrl: "/images/about.webp",
    story: {
      heading: "Our Story",
      paragraphs: [
        "Jaosef Agro Supplies was built around a simple belief: farmers do better when they have both quality inputs and someone they can ask the hard questions.",
        "We work with smallholders and larger commercial farms across Kenya — supplying fertilisers, certified seed, crop protection products, irrigation equipment, and post-harvest essentials. Every product we stock is chosen with the Kenyan farmer in mind: matched to local crops, common pests, regional rainfall patterns, and the realities of working in the field.",
        "Beyond the catalogue, we focus on guidance. The right fertiliser at the wrong stage is wasted money. A pesticide used without proper protective gear is a health risk. We talk farmers through the choices so the inputs do what they're meant to do.",
      ],
    },
    mission: {
      heading: "Our Mission",
      body: "Enable productive, responsible farming by supplying quality agricultural inputs and the practical knowledge to use them safely and effectively.",
    },
    vision: {
      heading: "Our Vision",
      body: "Thriving Kenyan farms that contribute to national food security while protecting the soil, water, and ecosystems future generations depend on.",
    },
    sustainability: {
      eyebrow: "WHY IT MATTERS",
      heading: "Farming for Food Security and a Living Planet",
      intro:
        "Our work sits at the intersection of farm profitability and Kenya's long-term food future. These are the principles that guide what we stock and how we advise.",
      pillars: [
        {
          iconKey: "wheat",
          title: "Food Security",
          description:
            "Reliable access to quality fertilisers, certified seed, and crop protection so Kenyan farms produce consistent, healthy harvests — for households, markets, and the country's food supply.",
        },
        {
          iconKey: "users",
          title: "Sustainable Food Systems",
          description:
            "Supporting smallholders and commercial growers with practical inputs and guidance — strengthening the whole value chain from seed to storage.",
        },
        {
          iconKey: "leaf",
          title: "Climate-Aligned Farming",
          description:
            "Drought-tolerant seed options, drip irrigation, water-saving tools, and soil health products — helping farms cope with shifting rainfall and rising temperatures.",
        },
        {
          iconKey: "shield",
          title: "Responsible Product Use",
          description:
            "Label-based use of crop protection products, proper PPE, and care for soil and water sources — so today's harvest doesn't cost tomorrow's environment.",
        },
      ],
    },
  },
  services: {
    eyebrow: "WHAT WE DO",
    heading: "More Than Just a Shop",
    intro:
      "We help farmers choose the right inputs for crops and livestock, use them safely, and get better results from every season.",
    items: [
      {
        iconKey: "sprout",
        title: "Crop Input Guidance",
        description:
          "Suitable seeds, fertilisers, and crop protection matched to your crop, region, and growing season.",
      },
      {
        iconKey: "package",
        title: "Livestock & Poultry Supplies",
        description:
          "Feeds, mineral licks, poultry supplies, dairy equipment, and animal-care essentials for mixed farms.",
      },
      {
        iconKey: "shield",
        title: "Safe Product Use",
        description:
          "Practical, label-based advice on crop protection, acaricides, disinfectants, and PPE — for safer farms.",
      },
      {
        iconKey: "leaf",
        title: "Soil & Fertiliser Support",
        description:
          "Fertilisers, manure, lime, and soil nutrition options matched to your soil type and crop programme.",
      },
      {
        iconKey: "wheat",
        title: "Seed & Stocking Advice",
        description:
          "Certified seed and stocking guidance for crop farms, dairy units, poultry houses, and mixed farms.",
      },
      {
        iconKey: "truck",
        title: "Reliable Sourcing",
        description:
          "Trusted supply of quality farm inputs for smallholder, commercial, and livestock farmers alike.",
      },
    ],
  },
  whyChooseUs: {
    eyebrow: "WHY FARMERS CHOOSE US",
    heading: "Trusted Inputs, Practical Guidance",
    subtext:
      "We're not just selling products — we help you grow a better harvest, safely and sustainably.",
    items: [
      {
        iconKey: "badge",
        title: "Genuine Products",
        description:
          "Quality agricultural inputs sourced from reliable, recognised suppliers — no shortcuts on quality.",
      },
      {
        iconKey: "users",
        title: "Farmer-Focused Support",
        description:
          "Ask questions before you buy — we explain what works for your crop, soil, and conditions.",
      },
      {
        iconKey: "shield",
        title: "Safe Product Use",
        description:
          "We encourage label-based use, proper PPE, and responsible handling for every product we stock.",
      },
      {
        iconKey: "messageCircle",
        title: "Easy WhatsApp Enquiries",
        description:
          "Quick answers on stock, prices, and usage — straight to your phone, no checkout required.",
      },
    ],
  },
  enquiryProcess: {
    eyebrow: "HOW IT WORKS",
    heading: "Simple, Friendly, No Online Payments",
    steps: [
      {
        title: "Browse Products",
        description: "Explore our catalogue across categories.",
      },
      {
        title: "Send an Enquiry",
        description: "Click WhatsApp or fill the contact form.",
      },
      {
        title: "Confirm Availability",
        description: "We confirm stock, prices, and answer questions.",
      },
      {
        title: "Pickup or Delivery",
        description: "Arrange shop visit, pickup, or delivery.",
      },
    ],
  },
  faq: {
    eyebrow: "QUESTIONS",
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "Do you sell products online?",
        answer:
          "No. Customers enquire online via WhatsApp or our contact form, then complete the purchase offline at our shop or through arranged pickup/delivery.",
      },
      {
        question: "Do you deliver?",
        answer:
          "Delivery depends on your location and order size. Chat with us on WhatsApp and we'll let you know the available delivery options.",
      },
      {
        question: "Do you show prices online?",
        answer:
          "Prices change with market conditions and pack size, so we share current prices on enquiry. This way you always get accurate, up-to-date pricing.",
      },
      {
        question: "Can you help me choose the right fertiliser?",
        answer:
          "Yes. Tell us your crop, region, and farm conditions and we'll recommend suitable options. For best results we also encourage a soil test.",
      },
      {
        question: "Are pesticide products safe to use?",
        answer:
          "Pesticides are safe when used strictly according to the official product label, with proper protective gear (PPE), and following the pre-harvest interval.",
      },
      {
        question: "Do you stock certified seed?",
        answer:
          "Yes, we focus on certified seed options. Availability depends on season and region — please enquire for current stock.",
      },
    ],
  },
  ctaBanner: {
    heading: "Need farm inputs or honest advice?",
    body: "Talk to us about crop inputs, animal feeds, poultry and dairy supplies, irrigation, farm tools, and safe product use.",
    primaryLabel: "Chat on WhatsApp",
    secondaryLabel: "Browse Products",
  },
  categoryDescriptions: {
    crop_nutrition:
      "DAP, CAN, NPK, foliar feeds, lime, and soil nutrition products.",
    seeds: "Certified maize, vegetables, legumes, and pasture seed options.",
    crop_protection:
      "Pesticides, fungicides, herbicides, and safe-use guidance.",
    soil_health: "Organic manure, compost, poultry manure, and lime.",
    irrigation: "Drip kits, hoses, sprinklers, and water-saving tools.",
    tools: "Sprayers, nozzles, hand tools, and farm equipment.",
    nursery: "Seedling trays, cocopeat, and nursery supplies.",
    safety: "Gloves, masks, goggles, gumboots, and protective gear.",
    post_harvest: "Storage bags, drying sheets, and post-harvest essentials.",
    livestock_feeds:
      "Dairy meal, calf feeds, poultry feeds, mineral licks, and livestock nutrition products.",
    animal_health:
      "Dewormers, tick control, poultry vitamins, disinfectants, and animal-care supplies.",
    livestock_equipment:
      "Feeders, drinkers, milk cans, poultry equipment, dairy tools, and livestock handling supplies.",
  },
};
