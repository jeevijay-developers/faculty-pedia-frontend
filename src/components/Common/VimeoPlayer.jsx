"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

const extractVimeoId = (value) => {
  if (!value) return null;
  const s = String(value).trim();
  if (/^\d+$/.test(s)) return s;
  const match =
    s.match(/player\.vimeo\.com\/video\/(\d+)/) ||
    s.match(/vimeo\.com\/(?:video\/|videos\/|manage\/videos\/)?(\d+)/);
  return match?.[1] ?? null;
};

/**
 * Props:
 *   url      – Vimeo video URL or numeric ID (required)
 *   poster   – optional thumbnail/poster image URL
 *   title    – accessible title for the iframe
 *   autoplay – skip the poster and load the iframe immediately (for in-course players)
 *   className – extra classes applied to the root container
 */
export default function VimeoPlayer({
  url,
  poster,
  title = "Video",
  autoplay = false,
  className = "",
}) {
  const [playing, setPlaying] = useState(autoplay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const videoId = extractVimeoId(url);

  // Track fullscreen changes so the button icon/label stays in sync.
  // Checks both the standard and Safari-prefixed fullscreen element so the
  // icon doesn't get stuck after exiting fullscreen on Safari/desktop.
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement || document.webkitFullscreenElement)
      );
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  if (!videoId) return null;

  const embedUrl =
    `https://player.vimeo.com/video/${videoId}` +
    `?autoplay=1&controls=1&pip=1&responsive=1&playsinline=1` +
    `&title=0&byline=0&portrait=0&color=231fe5`;

  const toggleFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen)?.call(el);
    }
  };

  return (
    // "group" enables child elements to respond to hover on the container
    <div
      className={`group relative w-full aspect-video bg-black overflow-hidden ${className}`}
    >
      {playing ? (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />

          {/*
            Fullscreen toggle button
            - Mobile (< sm): always visible
            - Desktop: hidden by default, revealed when the player is hovered
          */}
          <button
            onClick={toggleFullscreen}
            className={`
              absolute bottom-3 right-3 z-20
              flex items-center gap-1
              bg-black/70 hover:bg-black
              text-white text-xs font-semibold
              px-2.5 py-1.5 rounded-lg
              transition-opacity duration-200
              focus:opacity-100
              ${isFullscreen
                ? "opacity-100"
                : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              }
            `}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <MdFullscreenExit className="text-lg shrink-0" />
            ) : (
              <MdFullscreen className="text-lg shrink-0" />
            )}
            <span className="sm:hidden">
              {isFullscreen ? "Exit" : "Fullscreen"}
            </span>
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full group/play"
          aria-label={`Play ${title}`}
        >
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          )}

          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 group-hover/play:bg-white p-5 rounded-full shadow-2xl group-active/play:scale-90 transition-transform">
              <FaPlay className="text-[#231fe5] dark:text-indigo-400 text-3xl ml-1" />
            </span>
          </span>

          <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-[11px] font-medium px-2 py-1 rounded">
            <MdFullscreen className="text-sm shrink-0" />
            Tap to play · fullscreen available
          </span>
        </button>
      )}
    </div>
  );
}
