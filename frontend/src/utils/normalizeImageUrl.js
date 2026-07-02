export function normalizeImageUrl(img, baseUrl = import.meta.env.VITE_API_URL) {
  if (!img) return img;

  if (/^https?:\/\//i.test(img)) {
    return img;
  }

  if (img.startsWith('/uploads/')) {
    if (!baseUrl) return img;

    try {
      return new URL(img, baseUrl).toString();
    } catch {
      return img;
    }
  }

  return img;
}
