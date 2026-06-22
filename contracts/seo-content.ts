import type { ProductCategory } from "./product-catalog";

export const siteUrl = "https://jaosefagrosupplies.co.ke";
export const brandName = "Jaosef Agro Supplies";

export const brandAlternateNames = [
  "Jaosef Agro",
  "Jaosef Supplies",
  "Jaosef Supply",
  "Jaosef Agro Supply",
  "Josef Agro Supplies",
  "Josef Agro",
  "Josef Agro Supply",
] as const;

export type CategoryLanding = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  highlights: string[];
  related: ProductCategory[];
};

export const categoryLandings: Record<ProductCategory, CategoryLanding> = {
  crop_nutrition: {
    slug: "fertilisers-crop-nutrition",
    title: "Fertilisers & Crop Nutrition",
    seoTitle: "Fertilisers & Crop Nutrition in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Shop fertilisers and crop nutrition products in Kenya, including DAP, CAN, NPK, urea, foliar feeds, calcium nitrate, lime, manure, and soil nutrition support from Jaosef Agro Supplies.",
    intro:
      "Jaosef Agro Supplies supports Kenyan farmers with fertilisers and crop nutrition products for planting, top dressing, flowering, fruiting, and soil improvement. Farmers can enquire about DAP, CAN, urea, NPK blends, foliar feeds, calcium nitrate, potassium nutrition, agricultural lime, manure, and related soil inputs. We help match each option to the crop stage, soil condition, rainfall pattern, and farm goal so inputs are used responsibly and not wasted.",
    highlights: [
      "Planting fertilisers, top-dressing fertilisers, and balanced NPK options",
      "Foliar feeds, calcium products, potassium products, lime, and manure",
      "Guidance based on crop stage, soil health, and responsible input use",
    ],
    related: ["seeds", "soil_health", "irrigation"],
  },
  seeds: {
    slug: "seeds-planting-material",
    title: "Seeds & Planting Material",
    seoTitle: "Certified Seeds & Planting Material in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Find certified seeds and planting material in Kenya, including maize seed, bean seed, vegetable seed, green gram seed, tomato seed, onion seed, cabbage seed, and watermelon seed.",
    intro:
      "Certified seed is one of the most important decisions before planting. Jaosef Agro Supplies helps farmers choose maize, beans, green grams, tomato, kale, cabbage, onion, watermelon, and other seed options based on region, rainfall, altitude, season, and market plan. We encourage farmers to use genuine certified seed and combine it with good nursery practice, correct spacing, soil fertility, and pest monitoring for stronger establishment.",
    highlights: [
      "Certified maize, bean, vegetable, legume, and horticulture seed options",
      "Support choosing varieties by region, rainfall, maturity, and market use",
      "Helpful links to fertiliser, nursery, irrigation, and crop protection inputs",
    ],
    related: ["crop_nutrition", "nursery", "crop_protection"],
  },
  crop_protection: {
    slug: "crop-protection",
    title: "Crop Protection",
    seoTitle: "Crop Protection Products in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Enquire about crop protection products in Kenya, including registered insecticides, fungicides, herbicides, biopesticides, PPE, and safe-use guidance from Jaosef Agro Supplies.",
    intro:
      "Crop protection works best when the product is matched to the correct crop, pest, disease, weed, and label instructions. Jaosef Agro Supplies helps farmers enquire about registered insecticides, fungicides, herbicides, biopesticides, and related safety items. We avoid blanket advice and encourage label-based use, proper PPE, correct pre-harvest intervals, safe storage, and responsible handling to protect the farmer, the crop, and the environment.",
    highlights: [
      "Insect, disease, and weed-control options for labelled crop uses",
      "Safe-use guidance, PPE reminders, and responsible handling support",
      "Useful alongside certified seed, soil nutrition, and irrigation planning",
    ],
    related: ["safety", "seeds", "crop_nutrition"],
  },
  soil_health: {
    slug: "soil-health-organic-inputs",
    title: "Soil Health & Organic Inputs",
    seoTitle: "Soil Health & Organic Inputs in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Improve soil health with organic manure, compost, poultry manure, agricultural lime, rhizobia inoculants, and soil fertility support from Jaosef Agro Supplies in Kenya.",
    intro:
      "Healthy soil improves water retention, nutrient availability, root growth, and long-term farm productivity. Jaosef Agro Supplies stocks and advises on organic manure, compost, poultry manure, agricultural lime, rhizobia inoculants, and related soil health inputs. We encourage soil testing where possible because lime, manure, fertiliser, and biofertiliser needs vary by farm history, crop type, pH, rainfall, and soil texture.",
    highlights: [
      "Organic manure, compost, poultry manure, lime, and inoculant options",
      "Soil-test-first guidance for pH and fertility decisions",
      "Complements fertiliser plans, irrigation, seed choice, and crop rotation",
    ],
    related: ["crop_nutrition", "seeds", "irrigation"],
  },
  irrigation: {
    slug: "irrigation-watering",
    title: "Irrigation & Watering",
    seoTitle: "Irrigation & Watering Supplies in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Find irrigation and watering supplies in Kenya, including drip irrigation kits, hoses, sprinklers, water tanks, solar pumps, and farm water-saving tools.",
    intro:
      "Reliable water management helps crops survive dry spells and improves performance during flowering, fruiting, nursery production, and vegetable growing. Jaosef Agro Supplies supplies drip irrigation kits, garden hoses, sprinklers, water tanks, solar pumps, and other watering tools for Kenyan farms. We help farmers think through plot size, water source, pressure, filtration, crop spacing, and maintenance before buying.",
    highlights: [
      "Drip kits, hoses, sprinklers, tanks, pumps, and water-saving tools",
      "Support for vegetable farms, nurseries, orchards, and livestock water needs",
      "Guidance on filtration, pressure, flushing, and practical maintenance",
    ],
    related: ["seeds", "nursery", "crop_nutrition"],
  },
  tools: {
    slug: "farm-tools-equipment",
    title: "Farm Tools & Equipment",
    seoTitle: "Farm Tools & Equipment in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Browse farm tools and equipment in Kenya, including knapsack sprayers, hand tools, nozzles, maize shellers, water tools, and practical farm equipment from Jaosef Agro Supplies.",
    intro:
      "Good tools reduce labour, improve timing, and make farm work safer and more consistent. Jaosef Agro Supplies helps farmers enquire about sprayers, nozzles, hand tools, post-harvest tools, maize shellers, irrigation fittings, and other practical farm equipment. We focus on useful, maintainable items that fit smallholder and commercial farm routines, not decorative products that do not solve a real field problem.",
    highlights: [
      "Sprayers, nozzles, hand tools, shellers, fittings, and farm equipment",
      "Practical equipment for crop care, irrigation, and post-harvest work",
      "Advice on safe use, cleaning, storage, and basic maintenance",
    ],
    related: ["safety", "irrigation", "post_harvest"],
  },
  nursery: {
    slug: "nursery-greenhouse-supplies",
    title: "Nursery & Greenhouse Supplies",
    seoTitle: "Nursery & Greenhouse Supplies in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Get nursery and greenhouse supplies in Kenya, including seedling trays, cocopeat, vegetable seed, watering tools, crop protection, and seedling support products.",
    intro:
      "Strong seedlings make the rest of the season easier. Jaosef Agro Supplies supports nurseries, greenhouse growers, and kitchen garden farmers with seedling trays, cocopeat, potting media, certified seed, watering supplies, nutrition products, and hygiene guidance. We help farmers think about clean media, water quality, spacing, hardening off, pest monitoring, and transplant timing before problems become expensive.",
    highlights: [
      "Seedling trays, cocopeat, potting media, seed, and nursery support inputs",
      "Helpful for tomatoes, cabbage, capsicum, sukuma wiki, and vegetables",
      "Pairs well with irrigation, fertiliser, and crop protection planning",
    ],
    related: ["seeds", "irrigation", "crop_protection"],
  },
  safety: {
    slug: "farm-safety-ppe",
    title: "Farm Safety & PPE",
    seoTitle: "Farm Safety & PPE in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Find farm safety and PPE supplies in Kenya, including gloves, masks, goggles, gumboots, protective clothing, and safe-use guidance for crop and animal products.",
    intro:
      "Farm productivity should not come at the cost of farmer safety. Jaosef Agro Supplies encourages the use of PPE when handling crop protection products, disinfectants, acaricides, fertilisers, and other farm inputs. Farmers can enquire about gloves, masks, goggles, gumboots, protective clothing, and practical safety guidance. We also remind customers to follow product labels, observe re-entry and pre-harvest intervals, and store products securely.",
    highlights: [
      "Gloves, masks, goggles, gumboots, and protective clothing",
      "Safe-use support for pesticides, disinfectants, acaricides, and inputs",
      "Guidance on label instructions, storage, and responsible farm handling",
    ],
    related: ["crop_protection", "animal_health", "tools"],
  },
  post_harvest: {
    slug: "post-harvest-storage",
    title: "Post-Harvest & Storage",
    seoTitle: "Post-Harvest & Storage Supplies in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Reduce losses with post-harvest and storage supplies in Kenya, including PICS bags, tarpaulins, drying sheets, storage crates, maize shellers, and grain handling tools.",
    intro:
      "A good harvest still needs careful handling after the crop leaves the field. Jaosef Agro Supplies supports farmers with PICS hermetic storage bags, tarpaulins, drying sheets, storage crates, maize shellers, and practical post-harvest tools. We encourage clean drying, correct moisture management, careful storage, and protection from contamination, pests, and avoidable losses during transport and marketing.",
    highlights: [
      "PICS bags, drying sheets, tarpaulins, crates, and maize shellers",
      "Useful for maize, beans, legumes, vegetables, and market produce",
      "Guidance on drying, handling, storage hygiene, and loss reduction",
    ],
    related: ["tools", "crop_nutrition", "seeds"],
  },
  livestock_feeds: {
    slug: "livestock-feeds",
    title: "Livestock & Poultry Feeds",
    seoTitle: "Livestock & Poultry Feeds in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Enquire about livestock and poultry feeds in Kenya, including dairy meal, calf starter pellets, layers mash, chick mash, broiler feed, mineral licks, and feed guidance.",
    intro:
      "Livestock productivity depends on clean water, good housing, healthy animals, and consistent nutrition. Jaosef Agro Supplies helps farmers enquire about dairy meal, calf starter pellets, mineral licks, layers mash, chick mash, broiler feed, and other feed options. We encourage proper storage, labelled feeds from reliable suppliers, and feeding decisions based on animal age, production stage, body condition, and available forage.",
    highlights: [
      "Dairy meal, calf feeds, poultry feeds, mineral licks, and feed support",
      "Guidance for dairy cows, calves, layers, broilers, chicks, goats, and sheep",
      "Safe storage reminders to prevent mould, moisture, pests, and contamination",
    ],
    related: ["animal_health", "livestock_equipment", "safety"],
  },
  animal_health: {
    slug: "animal-health-veterinary-supplies",
    title: "Animal Health & Veterinary Supplies",
    seoTitle: "Animal Health & Veterinary Supplies in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Find animal health and veterinary supplies in Kenya, including poultry vitamins, electrolytes, disinfectants, tick and fly control products, and responsible-use guidance.",
    intro:
      "Animal-health products should be handled carefully and used according to label instructions and qualified advice where required. Jaosef Agro Supplies helps livestock and poultry farmers enquire about poultry vitamins, electrolytes, disinfectants, tick and fly control products, acaricides, and related animal-care supplies. We encourage biosecurity, clean water, good housing, correct dosing, withdrawal-period awareness, and safe storage away from feed and children.",
    highlights: [
      "Poultry supplements, disinfectants, acaricides, tick and fly control options",
      "Support for poultry houses, dairy units, goats, sheep, and mixed farms",
      "Responsible-use reminders for labels, withdrawal periods, PPE, and storage",
    ],
    related: ["livestock_feeds", "livestock_equipment", "safety"],
  },
  livestock_equipment: {
    slug: "poultry-dairy-equipment",
    title: "Dairy, Poultry & Livestock Equipment",
    seoTitle: "Dairy, Poultry & Livestock Equipment in Kenya | Jaosef Agro Supplies",
    seoDescription:
      "Get poultry, dairy, and livestock equipment in Kenya, including poultry feeders, drinkers, milk cans, feed troughs, poultry supplies, and dairy handling essentials.",
    intro:
      "Practical livestock equipment improves hygiene, feeding, water access, milk handling, and daily farm routines. Jaosef Agro Supplies supplies poultry feeders, poultry drinkers, milk cans, feed troughs, and other dairy, poultry, and livestock essentials. We help farmers match equipment size and type to flock size, animal age, housing setup, cleaning routine, and the level of use expected on the farm.",
    highlights: [
      "Poultry feeders, drinkers, milk cans, feed troughs, and livestock essentials",
      "Useful for chicks, layers, broilers, dairy units, goats, sheep, and mixed farms",
      "Guidance on sizing, cleaning, hygiene, durability, and safe daily handling",
    ],
    related: ["livestock_feeds", "animal_health", "tools"],
  },
};

export const categorySlugToKey = Object.fromEntries(
  Object.entries(categoryLandings).map(([key, value]) => [value.slug, key]),
) as Record<string, ProductCategory>;

export function categoryPath(category: ProductCategory) {
  return `/products/${categoryLandings[category].slug}`;
}

