import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { env } from "./lib/env";
import { enquiryImageLimits } from "@contracts/site-content";

const mimeToExtension = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function uploadDirectory() {
  return env.isProduction
    ? path.resolve(process.cwd(), "uploads/images/enquiries")
    : path.resolve(process.cwd(), "public/images/enquiries");
}

function uploadUrl(filename: string) {
  return env.isProduction
    ? `/uploads/images/enquiries/${filename}`
    : `/images/enquiries/${filename}`;
}

export async function handleEnquiryImageUpload(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (
    !file ||
    typeof file === "string" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return Response.json({ error: "Image file is required" }, { status: 400 });
  }

  const extension = mimeToExtension.get(file.type);
  if (!extension) {
    return Response.json(
      { error: "Only JPG, PNG, and WebP images are supported" },
      { status: 400 },
    );
  }

  if (file.size > enquiryImageLimits.maxFileSizeBytes) {
    const limitMb = Math.round(
      enquiryImageLimits.maxFileSizeBytes / (1024 * 1024),
    );
    return Response.json(
      { error: `Image must be ${limitMb}MB or smaller` },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const directory = uploadDirectory();
  await fs.mkdir(directory, { recursive: true });

  const filename = `${Date.now()}-${nanoid(8)}${extension}`;
  const filepath = path.join(directory, filename);
  await fs.writeFile(filepath, bytes);

  return Response.json({ url: uploadUrl(filename) });
}
