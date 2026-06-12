import { put, del } from "@vercel/blob";
import sharp from "sharp";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 82;

export async function uploadImage(
  file: File,
  folder: string = "menu"
): Promise<string> {
  const buffer = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const filename = `${folder}/${Date.now()}.jpg`;
  const blob = await put(filename, buffer, {
    access: "public",
    contentType: "image/jpeg",
  });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  await del(url);
}
