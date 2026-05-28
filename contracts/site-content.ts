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
  about: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    paragraph1: z.string(),
    paragraph2: z.string(),
    ctaLabel: z.string(),
    imageUrl: z.string(),
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
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

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
  },
  socials: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
  hero: {
    eyebrow: "TRUSTED AGRICULTURAL SUPPLIES IN KENYA",
    headline: "Quality Farm Inputs for Better Harvests",
    subtext:
      "We supply pesticides, fertilizers, manure, farm inputs, and crop protection products for Kenyan farmers.",
    ctaLabel: "BROWSE PRODUCTS",
  },
  about: {
    eyebrow: "ABOUT US",
    heading: "Supporting Productive, Responsible Farming",
    paragraph1:
      "We supply quality agricultural inputs to farmers across Kenya. From smallholders to larger operations, our products help protect crops, enrich soil, and improve yields.",
    paragraph2:
      "Our message to farmers is simple: better harvests should go hand in hand with responsible product use, soil care, water efficiency, safe handling, and environmental protection.",
    ctaLabel: "Explore Products",
    imageUrl: "/images/about.jpg",
  },
  services: {
    eyebrow: "WHAT WE DO",
    heading: "More Than Just a Shop",
    intro:
      "We help farmers choose the right inputs, use them safely, and get better results from every season.",
    items: [
      {
        iconKey: "sprout",
        title: "Product Guidance",
        description:
          "We help farmers choose suitable farm inputs based on crop type, season, and farm conditions.",
      },
      {
        iconKey: "shield",
        title: "Crop Protection Advice",
        description:
          "Guidance on safe, label-based use of pesticides, fungicides, and herbicides for healthier crops.",
      },
      {
        iconKey: "leaf",
        title: "Soil & Fertiliser Support",
        description:
          "Advice on fertilisers, manure, lime, and soil nutrition options matched to your farm needs.",
      },
      {
        iconKey: "wheat",
        title: "Seed Selection",
        description:
          "Help choosing certified seed suited to your region, rainfall, altitude, and growing season.",
      },
      {
        iconKey: "truck",
        title: "Farm Input Sourcing",
        description:
          "Reliable supply of quality farm inputs for smallholder and commercial farmers alike.",
      },
    ],
  },
  whyChooseUs: {
    eyebrow: "WHY FARMERS CHOOSE US",
    heading: "Built on Trust, Backed by Knowledge",
    subtext:
      "We're not just selling products — we're helping you grow a better harvest, safely and responsibly.",
    items: [
      {
        iconKey: "badge",
        title: "Genuine Products",
        description:
          "Quality agricultural inputs sourced from reliable, recognised suppliers.",
      },
      {
        iconKey: "users",
        title: "Farmer-Focused Support",
        description:
          "Ask questions before you buy — we explain what works for your crop and conditions.",
      },
      {
        iconKey: "shield",
        title: "Safe Product Use",
        description:
          "We encourage label-based use, proper PPE, and responsible handling for every product.",
      },
      {
        iconKey: "messageCircle",
        title: "Easy WhatsApp Enquiries",
        description:
          "Quick answers on stock, prices, and usage guidance — straight to your phone.",
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
    heading: "Need farm inputs or product advice?",
    body: "Talk to us today about seeds, fertilisers, manure, crop protection products, and farm tools.",
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
  },
};
