import type { Enquiry, FarmingTip } from "@db/schema";
import { starterProducts } from "@contracts/product-catalog";

const now = new Date("2025-05-27T09:00:00.000Z");

export const demoProducts = starterProducts.map((product) => ({ ...product }));

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
      "I am interested in DAP Fertilizer and CAN Fertilizer for my 2-acre maize farm. Can you share availability and recommended pack sizes?",
    status: "new",
    createdAt: new Date("2025-05-21T09:00:00.000Z"),
  },
];

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}
