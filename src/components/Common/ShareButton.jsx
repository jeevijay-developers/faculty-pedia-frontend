"use client";

import { useCallback, useMemo, useState } from "react";
import { FiAlertCircle, FiCheck, FiCopy, FiShare2, FiX } from "react-icons/fi";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const VARIANT_CLASSNAMES = {
  solid: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  outline:
    "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  ghost: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
};

const SIZE_CLASSNAMES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const FALLBACK_BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  ""
).replace(/\/$/, "");

const ShareButton = ({
  title = "",
  text,
  url,
  path,
  variant = "outline",
  size = "md",
  className = "",
  idleLabel = "",
  copiedLabel = "Link copied",
  sharedLabel = "Shared",
  errorLabel = "Try again",
  onShared,
  useCurrentUrl = false,
}) => {
  const [copyStatus, setCopyStatus] = useState("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      if (useCurrentUrl) {
        return window.location.href;
      }

      if (url) return url;
      if (path) {
        const origin = window.location.origin;
        return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
      }
      return window.location.href;
    }

    if (url) return url;

    if (path) {
      return `${FALLBACK_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    }

    return FALLBACK_BASE_URL;
  }, [url, path, useCurrentUrl]);

  const handleOpenModal = useCallback(() => {
    if (!shareUrl) {
      setCopyStatus("error");
      return;
    }
    setCopyStatus("idle");
    setIsModalOpen(true);
  }, [shareUrl]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) {
      setCopyStatus("error");
      return;
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } else {
        throw new Error("Clipboard not available");
      }

      setCopyStatus("copied");
      onShared?.({ method: "clipboard", url: shareUrl });
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  }, [shareUrl, onShared]);

  const encodedUrl = useMemo(
    () => encodeURIComponent(shareUrl || ""),
    [shareUrl]
  );
  const encodedText = useMemo(
    () => encodeURIComponent(text || title || ""),
    [text, title]
  );

  const socialLinks = useMemo(() => {
    if (!shareUrl) {
      return [];
    }

    return [
      {
        name: "WhatsApp",
        href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        icon: FaWhatsapp,
        color: "text-green-600",
      },
      {
        name: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: FaFacebookF,
        color: "text-blue-600",
      },
      {
        name: "Twitter",
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        icon: FaTwitter,
        color: "text-sky-500",
      },
      {
        name: "LinkedIn",
        href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`,
        icon: FaLinkedinIn,
        color: "text-blue-500",
      },
    ];
  }, [shareUrl, encodedUrl, encodedText]);

  const variantClasses =
    VARIANT_CLASSNAMES[variant] || VARIANT_CLASSNAMES.outline;
  const sizeClasses = SIZE_CLASSNAMES[size] || SIZE_CLASSNAMES.md;

  const displayLabel = idleLabel;
  const Icon = copyStatus === "error" ? FiAlertCircle : FiShare2;

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${variantClasses} ${sizeClasses} ${className}`.trim()}
        aria-label={displayLabel}
      >
        <Icon className="h-4 w-4" />
        <span>{displayLabel}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={handleCloseModal}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close share dialog"
            >
              <FiX className="h-5 w-5" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Share this page
              </h2>
              <p className="text-sm text-gray-600">
                Copy the link or choose a platform to share directly.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Page URL
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 overflow-hidden"
                  title={shareUrl}
                >
                  <div className="truncate">{shareUrl}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center h-10 w-10 rounded-lg border-2 border-gray-300 bg-white text-gray-600 transition-all hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 active:scale-95"
                  title={copyStatus === "copied" ? "Copied!" : "Copy to clipboard"}
                  aria-label={copyStatus === "copied" ? "Copied" : "Copy link"}
                >
                  {copyStatus === "copied" ? (
                    <FiCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <FiCopy className="h-5 w-5" />
                  )}
                </button>
              </div>
              {copyStatus === "error" && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <FiAlertCircle className="h-4 w-4" />
                  <span>{errorLabel}</span>
                </div>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Share via social media
                </p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map(
                      ({ name, href, icon: SocialIcon, color }) => (
                        <a
                          key={name}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 transition-all hover:scale-110 hover:border-blue-500 hover:shadow-lg"
                          title={`Share on ${name}`}
                          onClick={() =>
                            onShared?.({
                              method: name.toLowerCase(),
                              url: shareUrl,
                            })
                          }
                        >
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50 shadow-sm hover:border-blue-200">
                            <SocialIcon className={`h-5 w-5 ${color}`} />
                          </span>
                          <span className="text-xs font-medium">{name}</span>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
};

export default ShareButton;
