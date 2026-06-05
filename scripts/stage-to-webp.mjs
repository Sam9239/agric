// One-shot image conversion: copy numbered staging PNGs to proper destinations as WebP.
// Run: node scripts/stage-to-webp.mjs
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const STAGE = "public/images/_staging";
const ROOT = "public/images";

const mapping = [
  // Logos
  { src: "02.png", dest: "brand/jaosef-logo-light.webp", maxWidth: 600 },
  { src: "01.png", dest: "brand/jaosef-logo-dark.webp", maxWidth: 600 },

  // Hero scenes (desktop: max 1920w, mobile: max 1080w)
  { src: "12.png", dest: "hero/hero-01-agro-shop-desktop.webp", maxWidth: 1920 },
  { src: "05.png", dest: "hero/hero-01-agro-shop-mobile.webp", maxWidth: 1080 },
  { src: "09.png", dest: "hero/hero-02-maize-consultation-desktop.webp", maxWidth: 1920 },
  { src: "19.png", dest: "hero/hero-02-maize-consultation-mobile.webp", maxWidth: 1080 },
  { src: "03.png", dest: "hero/hero-03-greenhouse-vegetables-desktop.webp", maxWidth: 1920 },
  { src: "04.png", dest: "hero/hero-03-greenhouse-vegetables-mobile.webp", maxWidth: 1080 },
  { src: "11.png", dest: "hero/hero-04-nursery-seedlings-desktop.webp", maxWidth: 1920 },
  { src: "08.png", dest: "hero/hero-04-nursery-seedlings-mobile.webp", maxWidth: 1080 },
  { src: "10.png", dest: "hero/hero-05-tomato-harvest-desktop.webp", maxWidth: 1920 },
  { src: "07.png", dest: "hero/hero-05-tomato-harvest-mobile.webp", maxWidth: 1080 },
  { src: "16.png", dest: "hero/hero-06-poultry-farm-desktop.webp", maxWidth: 1920 },
  { src: "21.png", dest: "hero/hero-06-poultry-farm-mobile.webp", maxWidth: 1080 },
  { src: "17.png", dest: "hero/hero-07-dairy-farm-desktop.webp", maxWidth: 1920 },
  { src: "22.png", dest: "hero/hero-07-dairy-farm-mobile.webp", maxWidth: 1080 },
  { src: "23.png", dest: "hero/hero-08-livestock-grazing-desktop.webp", maxWidth: 1920 },
  { src: "25.png", dest: "hero/hero-08-livestock-grazing-mobile.webp", maxWidth: 1080 },

  // New livestock & animal product shots
  { src: "26.png", dest: "products/dairy-meal.webp", maxWidth: 1000 },
  { src: "27.png", dest: "products/calf-starter-pellets.webp", maxWidth: 1000 },
  { src: "28.png", dest: "products/mineral-lick.webp", maxWidth: 1000 },
  { src: "29.png", dest: "products/layers-mash.webp", maxWidth: 1000 },
  { src: "30.png", dest: "products/chick-mash.webp", maxWidth: 1000 },
  { src: "31.png", dest: "products/broiler-feed.webp", maxWidth: 1000 },
  { src: "32.png", dest: "products/poultry-vitamins-electrolytes.webp", maxWidth: 1000 },
  { src: "33.png", dest: "products/poultry-disinfectant.webp", maxWidth: 1000 },
  { src: "34.png", dest: "products/tick-fly-control-acaricide.webp", maxWidth: 1000 },
  { src: "36.png", dest: "products/poultry-feeder.webp", maxWidth: 1000 },
  { src: "37.png", dest: "products/poultry-drinker.webp", maxWidth: 1000 },
  { src: "38.png", dest: "products/milk-can.webp", maxWidth: 1000 },
  { src: "39.png", dest: "products/feed-trough.webp", maxWidth: 1000 },

  // Category cards (reuse product shots)
  { src: "29.png", dest: "categories/livestock-feeds.webp", maxWidth: 1000 },
  { src: "34.png", dest: "categories/animal-health.webp", maxWidth: 1000 },
  { src: "36.png", dest: "categories/livestock-equipment.webp", maxWidth: 1000 },

  // Additional hero pairs requested
  { src: "13.png", dest: "hero/hero-09-shop-counter-desktop.webp", maxWidth: 1920 },
  { src: "18.png", dest: "hero/hero-09-shop-counter-mobile.webp", maxWidth: 1080 },
  { src: "14.png", dest: "hero/hero-10-maize-couple-desktop.webp", maxWidth: 1920 },
  { src: "15.png", dest: "hero/hero-11-tomato-vines-desktop.webp", maxWidth: 1920 },
  { src: "20.png", dest: "hero/hero-11-tomato-vines-mobile.webp", maxWidth: 1080 },
];

async function run() {
  for (const { src, dest, maxWidth } of mapping) {
    const inputPath = path.join(STAGE, src);
    const outputPath = path.join(ROOT, dest);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(outputPath);
    console.log(`✓ ${src} → ${dest}`);
  }
  console.log(`\nDone. Converted ${mapping.length} images.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
