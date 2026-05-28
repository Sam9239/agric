import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { env } from "./lib/env";
import { verifyAdminSession } from "./admin-session";

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const maxUploadSize = 8 * 1024 * 1024;

function uploadDirectory() {
  return env.isProduction
    ? path.resolve(process.cwd(), "dist/public/images/uploads")
    : path.resolve(process.cwd(), "public/images/uploads");
}

export async function handleImageUpload(request: Request) {
  const authenticated = await verifyAdminSession(request.headers);
  if (!authenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return Response.json({ error: "Image file is required" }, { status: 400 });
  }

  const originalExtension = path.extname(file.name || "").toLowerCase();
  const extension = allowedImageTypes.get(file.type) || (allowedExtensions.has(originalExtension) ? originalExtension.replace(".jpeg", ".jpg") : undefined);
  if (!extension) {
    return Response.json({ error: "Only JPG, PNG, and WebP images are supported" }, { status: 400 });
  }

  if (file.size > maxUploadSize) {
    return Response.json({ error: "Image must be 8MB or smaller" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const directory = uploadDirectory();
  await fs.mkdir(directory, { recursive: true });

  const filename = `${Date.now()}-${nanoid(8)}${extension}`;
  const filepath = path.join(directory, filename);
  await fs.writeFile(filepath, bytes);

  return Response.json({
    url: `/images/uploads/${filename}`,
  });
}
