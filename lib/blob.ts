import { put, del } from "@vercel/blob";

export async function uploadImage(
  file: File,
  folder: string = "menu"
): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  await del(url);
}
