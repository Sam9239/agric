import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { products, farmingTips, enquiries } from "./schema";
import { starterProducts } from "@contracts/product-catalog";

const dbUrl = process.env.DATABASE_URL || "";
if (!dbUrl) {
  throw new Error("DATABASE_URL is not set");
}
const pool = createPool(dbUrl);
const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  // Seed products
  const existingProducts = await db.select().from(products);
  if (existingProducts.length === 0) {
    console.log("Seeding products...");
    await db.insert(products).values(
      starterProducts.map((product) => ({
        name: product.name,
        category: product.category,
        shortDescription: product.shortDescription,
        description: product.description,
        specs: product.specs,
        bestSuitedFor: product.bestSuitedFor,
        usageTip: product.usageTip,
        safetyNote: product.safetyNote,
        packSizes: product.packSizes,
        imageUrl: product.imageUrl,
        featured: product.featured,
        activeIngredient: product.activeIngredient,
        formulation: product.formulation,
        targetUse: product.targetUse,
        registeredCropUse: product.registeredCropUse,
        pcpbStatus: product.pcpbStatus,
        phi: product.phi,
        rei: product.rei,
        ppe: product.ppe,
        storageWarning: product.storageWarning,
        price: "",
      })),
    );
    console.log("Products seeded.");
  }

  // Seed farming tips
  const existingTips = await db.select().from(farmingTips);
  if (existingTips.length === 0) {
    console.log("Seeding farming tips...");
    await db.insert(farmingTips).values([
      {
        title: "Best Practices for Tomato Farming in Kenya",
        content:
          "Tomato farming can be highly profitable when done right. Start with certified seeds from reputable suppliers. Prepare raised beds with well-drained soil and mix in organic compost. Plant seedlings at 60cm by 45cm spacing. Apply DAP fertilizer at planting and top dress with CAN after 3 weeks. Monitor regularly for pests like Tuta absoluta and apply Thunder insecticide at first sight. Water consistently but avoid wetting foliage. Stake plants early to prevent fruit rot and improve air circulation. Harvest when fruits are firm and fully colored for strong market quality.",
        excerpt:
          "Tomato farming can be highly profitable when done right. Start with certified seeds from reputable suppliers. Prepare raised beds with well-drained soil...",
        imageUrl: "/images/tip-3.webp",
        date: "May 15, 2025",
      },
      {
        title: "Water Management for Optimal Crop Yields",
        content:
          "Water is the most critical input after seeds. Implement drip irrigation for water efficiency — it can reduce water use by 40% while increasing yields by 20-30%. Water early morning or late evening to minimize evaporation. Monitor soil moisture regularly; most crops need consistent moisture during flowering and fruiting stages. Consider collecting rainwater during wet seasons for dry season farming. Mulching helps retain soil moisture and reduces irrigation frequency. Never let soil completely dry out during critical growth stages.",
        excerpt:
          "Water is the most critical input after seeds. Implement drip irrigation for water efficiency — it can reduce water use by 40% while increasing yields...",
        imageUrl: "/images/tip-2.webp",
        date: "May 10, 2025",
      },
      {
        title: "Soil Health: The Foundation of Good Farming",
        content:
          "Healthy soil is the foundation of productive farming. Test your soil annually to understand pH and nutrient levels. Most Kenyan soils are acidic — apply agricultural lime if pH is below 5.5. Incorporate organic matter through compost or green manure to improve soil structure and microbial activity. Practice crop rotation to break pest cycles and maintain soil fertility. Legumes like beans and peas fix nitrogen naturally — include them in your rotation. Avoid over-tilling as it destroys soil structure and beneficial organisms. Cover crops during off-seasons prevent erosion and add organic matter.",
        excerpt:
          "Healthy soil is the foundation of productive farming. Test your soil annually to understand pH and nutrient levels. Most Kenyan soils are acidic...",
        imageUrl: "/images/tip-1.webp",
        date: "May 5, 2025",
      },
      {
        title: "Integrated Pest Management Strategies",
        content:
          "Effective pest management starts with prevention. Use certified seeds and resistant varieties where available. Practice crop rotation and intercropping to disrupt pest life cycles. Maintain field hygiene by removing crop residues after harvest. Scout fields weekly for early pest detection. Use biological controls like beneficial insects and neem-based products before resorting to chemical pesticides. When using pesticides, rotate between different chemical groups to prevent resistance development. Always follow label instructions and observe pre-harvest intervals for food safety.",
        excerpt:
          "Effective pest management starts with prevention. Use certified seeds and resistant varieties where available. Practice crop rotation and intercropping...",
        imageUrl: "/images/cat-pesticides.webp",
        date: "April 28, 2025",
      },
      {
        title: "Maize Production Tips for Kenyan Farmers",
        content:
          "Maize remains Kenya's staple crop. For best results, plant at the onset of rains. Space plants 75cm between rows and 25cm within rows. Apply DAP fertilizer at planting rate of 50kg per acre. Top dress with CAN or urea when plants are knee-high. Control weeds early — the first 6 weeks are critical. Watch for fall armyworm and stalk borers; scout weekly and treat promptly. Harvest when husks turn brown and grains are hard. Proper drying to 13% moisture prevents aflatoxin contamination. Store in hermetic bags like PICS bags for long-term storage without chemicals.",
        excerpt:
          "Maize remains Kenya's staple crop. For best results, plant at the onset of rains. Space plants 75cm between rows and 25cm within rows...",
        imageUrl: "/images/hero.webp",
        date: "April 20, 2025",
      },
      {
        title: "Choosing the Right Fertilizer for Your Crops",
        content:
          "Selecting the correct fertilizer maximizes your investment. For cereals like maize and wheat, use DAP at planting for strong root development, then top dress with urea or CAN for vegetative growth. For vegetables, a balanced NPK fertilizer works well at planting, followed by calcium nitrate during fruiting. Legumes need less nitrogen but benefit from phosphorous-rich fertilizers. Always apply based on soil test recommendations. Apply fertilizers when soil is moist but not waterlogged. Band placement near roots is more efficient than broadcasting. Split applications reduce nutrient losses and improve uptake.",
        excerpt:
          "Selecting the correct fertilizer maximizes your investment. For cereals like maize and wheat, use DAP at planting for strong root development...",
        imageUrl: "/images/cat-fertilizers.webp",
        date: "April 15, 2025",
      },
    ]);
    console.log("Farming tips seeded.");
  }

  // Seed sample enquiries
  const existingEnquiries = await db.select().from(enquiries);
  if (existingEnquiries.length === 0) {
    console.log("Seeding sample enquiries...");
    await db.insert(enquiries).values([
      {
        name: "John Kamau",
        email: "john.kamau@email.com",
        phone: "+254712345678",
        message:
          "Hello, I am interested in DAP Fertilizer and CAN Fertilizer for my 2-acre maize farm. Can you share availability and recommended pack sizes? I am located in Nakuru.",
        status: "new",
      },
      {
        name: "Mary Wanjiku",
        email: "mary.w@email.com",
        phone: "+254723456789",
        message:
          "I need Roundup Herbicide for my farm. How many liters would I need for 1 acre? Also, do you deliver to Kiambu?",
        status: "new",
      },
    ]);
    console.log("Sample enquiries seeded.");
  }

  console.log("Seeding complete!");
  await pool.end();
}

seed().catch(console.error);
