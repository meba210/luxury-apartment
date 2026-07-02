export function normalizeImageUrl(img, baseUrl = import.meta.env.VITE_API_URL) {
  if (!img) return img;

  const value = String(img).trim();
  if (!value) return value;

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith('/uploads/')) {
        const apiBase =
          baseUrl ||
          (typeof window !== 'undefined' ? window.location.origin : '');
        if (apiBase) {
          return new URL(parsed.pathname + parsed.search, apiBase).toString();
        }
      }
      return value;
    } catch {
      return value;
    }
  }

  if (value.startsWith('/uploads/') || value.startsWith('uploads/')) {
    const normalizedPath = value.startsWith('/') ? value : `/${value}`;
    if (!baseUrl) return normalizedPath;

    try {
      return new URL(normalizedPath, baseUrl).toString();
    } catch {
      return normalizedPath;
    }
  }

  return value;
}
