import { describe, it, expect } from "vitest";
import {
  getYouTubeEmbedUrl,
  getVimeoEmbedUrl,
  getEmbedUrl,
  pickImageUrl,
  resolveAssetUrl,
} from "@/lib/media";

describe("media utilities", () => {

  // ─── getYouTubeEmbedUrl ────────────────────────────────────────────────────

  describe("getYouTubeEmbedUrl", () => {
    it("returns null for null/undefined", () => {
      expect(getYouTubeEmbedUrl(null)).toBeNull();
      expect(getYouTubeEmbedUrl(undefined)).toBeNull();
    });

    it("passes through an already-embedded URL", () => {
      const url = "https://www.youtube.com/embed/abc123";
      expect(getYouTubeEmbedUrl(url)).toBe(url);
    });

    it("converts watch?v= URL", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("converts watch?v= URL with extra params", () => {
      expect(
        getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s")
      ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("converts youtu.be short URL", () => {
      expect(getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("returns null for non-YouTube URLs", () => {
      expect(getYouTubeEmbedUrl("https://vimeo.com/12345")).toBeNull();
    });
  });

  // ─── getVimeoEmbedUrl ─────────────────────────────────────────────────────

  describe("getVimeoEmbedUrl", () => {
    it("returns null for null/undefined", () => {
      expect(getVimeoEmbedUrl(null)).toBeNull();
      expect(getVimeoEmbedUrl(undefined)).toBeNull();
    });

    it("passes through a player.vimeo.com URL", () => {
      const url = "https://player.vimeo.com/video/123456789";
      expect(getVimeoEmbedUrl(url)).toBe(url);
    });

    it("converts vimeo.com/ID URL", () => {
      expect(getVimeoEmbedUrl("https://vimeo.com/123456789")).toBe(
        "https://player.vimeo.com/video/123456789"
      );
    });

    it("converts vimeo.com/video/ID URL", () => {
      expect(getVimeoEmbedUrl("https://vimeo.com/video/123456789")).toBe(
        "https://player.vimeo.com/video/123456789"
      );
    });

    it("returns null for non-Vimeo URLs", () => {
      expect(getVimeoEmbedUrl("https://www.youtube.com/watch?v=abc")).toBeNull();
    });
  });

  // ─── getEmbedUrl ──────────────────────────────────────────────────────────

  describe("getEmbedUrl", () => {
    it("returns null for null/undefined", () => {
      expect(getEmbedUrl(null)).toBeNull();
      expect(getEmbedUrl(undefined)).toBeNull();
    });

    it("converts YouTube URL via YouTube path", () => {
      expect(getEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("converts Vimeo URL via Vimeo path", () => {
      expect(getEmbedUrl("https://vimeo.com/123456789")).toBe(
        "https://player.vimeo.com/video/123456789"
      );
    });

    it("returns raw URL unchanged for unknown platforms", () => {
      expect(getEmbedUrl("https://example.com/video.mp4")).toBe(
        "https://example.com/video.mp4"
      );
    });
  });

  // ─── pickImageUrl ─────────────────────────────────────────────────────────

  describe("pickImageUrl", () => {
    it("returns null for null/undefined", () => {
      expect(pickImageUrl(null)).toBeNull();
      expect(pickImageUrl(undefined)).toBeNull();
    });

    it("returns a plain string URL directly", () => {
      expect(pickImageUrl("https://cdn.example.com/img.jpg")).toBe(
        "https://cdn.example.com/img.jpg"
      );
    });

    it("trims whitespace from string URLs", () => {
      expect(pickImageUrl("  https://cdn.example.com/img.jpg  ")).toBe(
        "https://cdn.example.com/img.jpg"
      );
    });

    it("returns null for empty string", () => {
      expect(pickImageUrl("")).toBeNull();
      expect(pickImageUrl("   ")).toBeNull();
    });

    it("extracts .url from an asset object", () => {
      expect(pickImageUrl({ url: "https://cdn.example.com/img.jpg" })).toBe(
        "https://cdn.example.com/img.jpg"
      );
    });

    it("prefers .url over .secure_url", () => {
      expect(
        pickImageUrl({ url: "http://primary.com/img.jpg", secure_url: "https://fallback.com/img.jpg" })
      ).toBe("http://primary.com/img.jpg");
    });

    it("falls back to .secure_url when .url is missing", () => {
      expect(pickImageUrl({ secure_url: "https://cdn.example.com/img.jpg" })).toBe(
        "https://cdn.example.com/img.jpg"
      );
    });

    it("returns null for empty object", () => {
      expect(pickImageUrl({})).toBeNull();
    });
  });

  // ─── resolveAssetUrl ──────────────────────────────────────────────────────

  describe("resolveAssetUrl", () => {
    it("returns null for null/undefined", () => {
      expect(resolveAssetUrl(null)).toBeNull();
      expect(resolveAssetUrl(undefined)).toBeNull();
    });

    it("returns .url directly when present", () => {
      expect(resolveAssetUrl({ url: "https://cdn.example.com/file.pdf" })).toBe(
        "https://cdn.example.com/file.pdf"
      );
    });

    it("returns .link when present and no .url", () => {
      expect(resolveAssetUrl({ link: "https://cdn.example.com/file.pdf" })).toBe(
        "https://cdn.example.com/file.pdf"
      );
    });

    it("returns null when publicId is present but CLOUDINARY env var is missing", () => {
      // NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in test env
      expect(resolveAssetUrl({ publicId: "my-folder/file" })).toBeNull();
    });
  });
});
