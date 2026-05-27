import type { Enquiry, FarmingTip, Product } from "@db/schema";

const now = new Date("2025-05-27T09:00:00.000Z");

export const demoProducts: Product[] = [
  {
    id: 1,
    name: "DAP Fertilizer 18-46-0",
    category: "fertilizers",
    price: "KSh 3,200",
    description:
      "Diammonium Phosphate fertilizer with high phosphorous content. Ideal for root development and early growth stages. Apply at planting for maximum effectiveness. Suitable for maize, wheat, and vegetable crops.",
    imageUrl: "/images/product-dap.jpg",
    featured: true,
    createdAt: new Date("2025-05-20T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 2,
    name: "CAN Fertilizer 26-0-0",
    category: "fertilizers",
    price: "KSh 2,800",
    description:
      "Calcium Ammonium Nitrate fertilizer for top dressing. Provides nitrogen and calcium for healthy leaf growth and strong plant structure. Best applied during vegetative growth stage.",
    imageUrl: "/images/cat-fertilizers.jpg",
    featured: true,
    createdAt: new Date("2025-05-19T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 3,
    name: "Roundup Herbicide",
    category: "pesticides",
    price: "KSh 1,800",
    description:
      "Glyphosate-based broad-spectrum herbicide for controlling annual and perennial weeds. Systemic action kills weeds from roots up. Use as directed on label for pre-planting weed control.",
    imageUrl: "/images/product-roundup.jpg",
    featured: true,
    createdAt: new Date("2025-05-18T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 4,
    name: "Thunder Insecticide",
    category: "pesticides",
    price: "KSh 2,400",
    description:
      "Broad-spectrum insecticide effective against aphids, thrips, caterpillars, and other common crop pests. Fast-acting contact and stomach poison. Suitable for vegetables, fruits, and field crops.",
    imageUrl: "/images/cat-pesticides.jpg",
    featured: true,
    createdAt: new Date("2025-05-17T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 5,
    name: "Redomil Fungicide",
    category: "crop_protection",
    price: "KSh 2,100",
    description:
      "Metalaxyl-based systemic fungicide for controlling downy mildew, late blight, and other fungal diseases. Provides both preventive and curative action.",
    imageUrl: "/images/cat-crop-protection.jpg",
    featured: true,
    createdAt: new Date("2025-05-16T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 6,
    name: "Organic Compost Manure",
    category: "manure",
    price: "KSh 1,500",
    description:
      "Premium quality organic compost manure. Rich in organic matter and beneficial microorganisms. Improves soil structure, water retention, and nutrient availability.",
    imageUrl: "/images/cat-manure.jpg",
    featured: true,
    createdAt: new Date("2025-05-15T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 7,
    name: "Seedling Trays (200 cells)",
    category: "farm_inputs",
    price: "KSh 450",
    description:
      "Durable plastic seedling trays with 200 cells. Perfect for starting vegetables, flowers, and tree seedlings. Reusable for multiple seasons.",
    imageUrl: "/images/cat-farm-inputs.jpg",
    featured: true,
    createdAt: new Date("2025-05-14T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 8,
    name: "Knapsack Sprayer 16L",
    category: "farm_inputs",
    price: "KSh 3,800",
    description:
      "16-liter capacity knapsack sprayer with adjustable nozzle. Ergonomic design for comfortable carrying and operation.",
    imageUrl: "/images/cat-farm-inputs.jpg",
    featured: true,
    createdAt: new Date("2025-05-13T09:00:00.000Z"),
    updatedAt: now,
  },
];

export const demoTips: FarmingTip[] = [
  {
    id: 1,
    title: "Best Practices for Tomato Farming in Kenya",
    content:
      "Tomato farming can be highly profitable when done right. Start with certified seeds from reputable suppliers. Prepare raised beds with well-drained soil and mix in organic compost. Plant seedlings at 60cm by 45cm spacing. Apply DAP fertilizer at planting and top dress with CAN after 3 weeks. Monitor regularly for pests like Tuta absoluta and apply Thunder insecticide at first sight.",
    excerpt:
      "Tomato farming can be highly profitable when done right. Start with certified seeds from reputable suppliers and prepare raised beds with well-drained soil.",
    imageUrl: "/images/tip-3.jpg",
    date: "May 15, 2025",
    createdAt: new Date("2025-05-15T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 2,
    title: "Water Management for Optimal Crop Yields",
    content:
      "Water is the most critical input after seeds. Implement drip irrigation for water efficiency. Water early morning or late evening to minimize evaporation. Monitor soil moisture regularly; most crops need consistent moisture during flowering and fruiting stages.",
    excerpt:
      "Water is the most critical input after seeds. Implement drip irrigation for water efficiency and water early morning or late evening.",
    imageUrl: "/images/tip-2.jpg",
    date: "May 10, 2025",
    createdAt: new Date("2025-05-10T09:00:00.000Z"),
    updatedAt: now,
  },
  {
    id: 3,
    title: "Soil Health: The Foundation of Good Farming",
    content:
      "Healthy soil is the foundation of productive farming. Test your soil annually to understand pH and nutrient levels. Incorporate organic matter through compost or green manure to improve soil structure and microbial activity.",
    excerpt:
      "Healthy soil is the foundation of productive farming. Test your soil annually and incorporate organic matter to improve soil structure.",
    imageUrl: "/images/tip-1.jpg",
    date: "May 5, 2025",
    createdAt: new Date("2025-05-05T09:00:00.000Z"),
    updatedAt: now,
  },
];

export const demoEnquiries: Enquiry[] = [
  {
    id: 1,
    name: "John Kamau",
    email: "john.kamau@email.com",
    phone: "+254712345678",
    message:
      "I am interested in DAP Fertilizer and CAN Fertilizer for my 2-acre maize farm. Can you share bulk pricing?",
    status: "new",
    createdAt: new Date("2025-05-21T09:00:00.000Z"),
  },
];

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}
