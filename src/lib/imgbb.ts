/**
 * Upload an image to imgbb and return its public URL.
 * Needs NEXT_PUBLIC_IMGBB_API_KEY (free key at https://api.imgbb.com).
 * When the key is missing the upload UI falls back to an image-URL input —
 * see isImgbbConfigured() and the ImageUpload component.
 */
export function isImgbbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_IMGBB_API_KEY);
}

export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Image upload is not configured — paste an image URL instead.",
    );
  }
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.data?.display_url) {
    throw new Error(
      json?.error?.message || "Image upload failed. Please try again.",
    );
  }
  return json.data.display_url as string;
}
