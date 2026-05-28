// Shared media URL utilities — replaces 29+ inline copies across the codebase.
// All functions are pure and safe to call with null/undefined.

// ─── YouTube ─────────────────────────────────────────────────────────────────

export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  return null;
}

// ─── Vimeo ───────────────────────────────────────────────────────────────────

export function getVimeoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("player.vimeo.com/video/")) return url;
  const match = url.match(/vimeo\.com\/(?:video\/|manage\/videos\/)?([0-9]+)/);
  const id = match?.[1];
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

// ─── Generic embed resolver ───────────────────────────────────────────────────
// Tries YouTube, then Vimeo, then returns the raw URL unchanged.

export function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return getYouTubeEmbedUrl(url) ?? getVimeoEmbedUrl(url) ?? url;
}

// ─── Image URL ───────────────────────────────────────────────────────────────
// Accepts a string URL or a Cloudinary-style asset object; returns a usable URL.

type ImageSource =
  | string
  | { url?: string; secure_url?: string; src?: string; link?: string; fileUrl?: string }
  | null
  | undefined;

export function pickImageUrl(source: ImageSource): string | null {
  if (!source) return null;
  if (typeof source === "string") return source.trim() || null;
  const candidate =
    source.url ?? source.secure_url ?? source.src ?? source.link ?? source.fileUrl;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

// ─── Cloudinary asset resolver ────────────────────────────────────────────────
// Handles the multi-field asset objects returned by the backend.

type AssetObject = {
  link?: string; url?: string; secure_url?: string; path?: string; fileUrl?: string;
  publicId?: string; public_id?: string;
  resourceType?: string; resource_type?: string;
  fileType?: string;
};

export function resolveAssetUrl(asset: AssetObject | null | undefined): string | null {
  if (!asset) return null;

  const direct = asset.link ?? asset.url ?? asset.secure_url ?? asset.path ?? asset.fileUrl;
  if (direct) return direct;

  const publicId = asset.publicId ?? asset.public_id;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!publicId || !cloudName) return null;

  const resourceType = (asset.resourceType ?? asset.resource_type ?? "raw").toLowerCase();
  const resTypePath = ["raw", "image", "video"].includes(resourceType)
    ? resourceType
    : "raw";

  const normalizedType = (asset.fileType ?? "pdf").toString().toLowerCase();
  const extMap: Record<string, string> = {
    pdf: "pdf", doc: "doc", docx: "docx",
    ppt: "ppt", pptx: "pptx", excel: "xlsx", xls: "xls", xlsx: "xlsx",
  };
  const hasExt = publicId.includes(".");
  const ext = hasExt ? "" : `.${extMap[normalizedType] ?? normalizedType}`;
  const normalizedId = publicId.startsWith("/") ? publicId.slice(1) : publicId;

  return `https://res.cloudinary.com/${cloudName}/${resTypePath}/upload/${normalizedId}${ext}`;
}
