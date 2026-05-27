import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { products, farmingTips, enquiries } from "./schema";

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
    await db.insert(products).values([
      {
        name: "DAP Fertilizer 18-46-0",
        category: "fertilizers",
        price: "KSh 3,200",
        description:
          "Diammonium Phosphate fertilizer with high phosphorous content. Ideal for root development and early growth stages. Apply at planting for maximum effectiveness. Suitable for maize, wheat, and vegetable crops.",
        imageUrl: "/images/product-dap.jpg",
        featured: true,
      },
      {
        name: "CAN Fertilizer 26-0-0",
        category: "fertilizers",
        price: "KSh 2,800",
        description:
          "Calcium Ammonium Nitrate fertilizer for top dressing. Provides nitrogen and calcium for healthy leaf growth and strong plant structure. Best applied during vegetative growth stage.",
        imageUrl: "/images/cat-fertilizers.jpg",
        featured: true,
      },
      {
        name: "NPK 23-23-0 Fertilizer",
        category: "fertilizers",
        price: "KSh 3,500",
        description:
          "Balanced NPK fertilizer with equal nitrogen and phosphorous content. Excellent for basal application at planting. Suitable for a wide range of crops including cereals and horticultural crops.",
        imageUrl: "/images/cat-fertilizers.jpg",
        featured: false,
      },
      {
        name: "Roundup Herbicide",
        category: "pesticides",
        price: "KSh 1,800",
        description:
          "Glyphosate-based broad-spectrum herbicide for controlling annual and perennial weeds. Systemic action kills weeds from roots up. Use as directed on label for pre-planting weed control.",
        imageUrl: "/images/product-roundup.jpg",
        featured: true,
      },
      {
        name: "Thunder Insecticide",
        category: "pesticides",
        price: "KSh 2,400",
        description:
          "Broad-spectrum insecticide effective against aphids, thrips, caterpillars, and other common crop pests. Fast-acting contact and stomach poison. Suitable for vegetables, fruits, and field crops.",
        imageUrl: "/images/cat-pesticides.jpg",
        featured: true,
      },
      {
        name: "Redomil Fungicide",
        category: "crop_protection",
        price: "KSh 2,100",
        description:
          "Metalaxyl-based systemic fungicide for controlling downy mildew, late blight, and other fungal diseases. Provides both preventive and curative action. Essential for tomato, potato, and grape growers.",
        imageUrl: "/images/cat-crop-protection.jpg",
        featured: true,
      },
      {
        name: "Organic Compost Manure",
        category: "manure",
        price: "KSh 1,500",
        description:
          "Premium quality organic compost manure. Rich in organic matter and beneficial microorganisms. Improves soil structure, water retention, and nutrient availability. Perfect for vegetable gardens and organic farming.",
        imageUrl: "/images/cat-manure.jpg",
        featured: true,
      },
      {
        name: "Chicken Manure Pellets",
        category: "manure",
        price: "KSh 1,200",
        description:
          "Dried and pelleted chicken manure. High in nitrogen, phosphorous, and potassium. Convenient to apply and fast-acting. Suitable for all crops including vegetables, fruits, and ornamentals.",
        imageUrl: "/images/cat-manure.jpg",
        featured: false,
      },
      {
        name: "Seedling Trays (200 cells)",
        category: "farm_inputs",
        price: "KSh 450",
        description:
          "Durable plastic seedling trays with 200 cells. Perfect for starting vegetables, flowers, and tree seedlings. Reusable for multiple seasons. Ensures uniform germination and easy transplanting.",
        imageUrl: "/images/cat-farm-inputs.jpg",
        featured: true,
      },
      {
        name: "Knapsack Sprayer 16L",
        category: "farm_inputs",
        price: "KSh 3,800",
        description:
          "16-liter capacity knapsack sprayer with adjustable nozzle. Ergonomic design for comfortable carrying and operation. Essential for pesticide and foliar fertilizer application on small to medium farms.",
        imageUrl: "/images/cat-farm-inputs.jpg",
        featured: true,
      },
      {
        name: "Mulching Film (Black)",
        category: "farm_inputs",
        price: "KSh 2,600",
        description:
          "UV-stabilized black mulching film for weed control and moisture retention. Helps regulate soil temperature and reduce water evaporation. Ideal for vegetable production and horticultural crops.",
        imageUrl: "/images/cat-farm-inputs.jpg",
        featured: false,
      },
      {
        name: "Copper Oxychloride Fungicide",
        category: "crop_protection",
        price: "KSh 1,600",
        description:
          "Copper-based protective fungicide for bacterial and fungal disease control. Effective against blight, leaf spot, and bacterial wilt. Suitable for tomatoes, potatoes, beans, and other susceptible crops.",
        imageUrl: "/images/cat-crop-protection.jpg",
        featured: false,
      },
    ]);
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
          "Tomato farming can be highly profitable when done right. Start with certified seeds from reputable suppliers. Prepare raised beds with well-drained soil and mix in organic compost. Plant seedlings at 60cm by 45cm spacing. Apply DAP fertilizer at planting and top dress with CAN after 3 weeks. Monitor regularly for pests like Tuta absoluta and apply Thunder insecticide at first sight. Water consistently but avoid wetting foliage. Stake plants early to prevent fruit rot and improve air circulation. Harvest when fruits are firm and fully colored for best market prices.",
        excerpt:
          "Tomato farming can be highly profitable when done right. Start with certified seeds from reputable suppliers. Prepare raised beds with well-drained soil...",
        imageUrl: "/images/tip-3.jpg",
        date: "May 15, 2025",
      },
      {
        title: "Water Management for Optimal Crop Yields",
        content:
          "Water is the most critical input after seeds. Implement drip irrigation for water efficiency — it can reduce water use by 40% while increasing yields by 20-30%. Water early morning or late evening to minimize evaporation. Monitor soil moisture regularly; most crops need consistent moisture during flowering and fruiting stages. Consider collecting rainwater during wet seasons for dry season farming. Mulching helps retain soil moisture and reduces irrigation frequency. Never let soil completely dry out during critical growth stages.",
        excerpt:
          "Water is the most critical input after seeds. Implement drip irrigation for water efficiency — it can reduce water use by 40% while increasing yields...",
        imageUrl: "/images/tip-2.jpg",
        date: "May 10, 2025",
      },
      {
        title: "Soil Health: The Foundation of Good Farming",
        content:
          "Healthy soil is the foundation of productive farming. Test your soil annually to understand pH and nutrient levels. Most Kenyan soils are acidic — apply agricultural lime if pH is below 5.5. Incorporate organic matter through compost or green manure to improve soil structure and microbial activity. Practice crop rotation to break pest cycles and maintain soil fertility. Legumes like beans and peas fix nitrogen naturally — include them in your rotation. Avoid over-tilling as it destroys soil structure and beneficial organisms. Cover crops during off-seasons prevent erosion and add organic matter.",
        excerpt:
          "Healthy soil is the foundation of productive farming. Test your soil annually to understand pH and nutrient levels. Most Kenyan soils are acidic...",
        imageUrl: "/images/tip-1.jpg",
        date: "May 5, 2025",
      },
      {
        title: "Integrated Pest Management Strategies",
        content:
          "Effective pest management starts with prevention. Use certified seeds and resistant varieties where available. Practice crop rotation and intercropping to disrupt pest life cycles. Maintain field hygiene by removing crop residues after harvest. Scout fields weekly for early pest detection. Use biological controls like beneficial insects and neem-based products before resorting to chemical pesticides. When using pesticides, rotate between different chemical groups to prevent resistance development. Always follow label instructions and observe pre-harvest intervals for food safety.",
        excerpt:
          "Effective pest management starts with prevention. Use certified seeds and resistant varieties where available. Practice crop rotation and intercropping...",
        imageUrl: "/images/cat-pesticides.jpg",
        date: "April 28, 2025",
      },
      {
        title: "Maize Production Tips for Kenyan Farmers",
        content:
          "Maize remains Kenya's staple crop. For best results, plant at the onset of rains. Space plants 75cm between rows and 25cm within rows. Apply DAP fertilizer at planting rate of 50kg per acre. Top dress with CAN or urea when plants are knee-high. Control weeds early — the first 6 weeks are critical. Watch for fall armyworm and stalk borers; scout weekly and treat promptly. Harvest when husks turn brown and grains are hard. Proper drying to 13% moisture prevents aflatoxin contamination. Store in hermetic bags like PICS bags for long-term storage without chemicals.",
        excerpt:
          "Maize remains Kenya's staple crop. For best results, plant at the onset of rains. Space plants 75cm between rows and 25cm within rows...",
        imageUrl: "/images/hero.jpg",
        date: "April 20, 2025",
      },
      {
        title: "Choosing the Right Fertilizer for Your Crops",
        content:
          "Selecting the correct fertilizer maximizes your investment. For cereals like maize and wheat, use DAP at planting for strong root development, then top dress with urea or CAN for vegetative growth. For vegetables, a balanced NPK fertilizer works well at planting, followed by calcium nitrate during fruiting. Legumes need less nitrogen but benefit from phosphorous-rich fertilizers. Always apply based on soil test recommendations. Apply fertilizers when soil is moist but not waterlogged. Band placement near roots is more efficient than broadcasting. Split applications reduce nutrient losses and improve uptake.",
        excerpt:
          "Selecting the correct fertilizer maximizes your investment. For cereals like maize and wheat, use DAP at planting for strong root development...",
        imageUrl: "/images/cat-fertilizers.jpg",
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
          "Hello, I am interested in DAP Fertilizer and CAN Fertilizer for my 2-acre maize farm. Can you share bulk pricing for 10 bags each? I am located in Nakuru.",
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
