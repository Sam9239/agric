// Generates PNG app icons from public/favicon.svg.
// iOS ignores SVG apple-touch-icons, and the web manifest needs raster sizes.
// Run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(path.join(appRoot, "public/favicon.svg"));

const jobs = [
  { size: 180, out: "public/apple-touch-icon.png" },
  { size: 192, out: "public/icon-192.png" },
  { size: 512, out: "public/icon-512.png" },
];

const background = "#1a3a2f";

for (const { size, out } of jobs) {
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background })
    .flatten({ background })
    .png()
    .toFile(path.join(appRoot, out));
  console.log("wrote", out);
}
