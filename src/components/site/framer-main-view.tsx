"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NativeComponentReplacement } from "@/lib/native-content";

const FRAME_SRC = "/framer-site/aktiv-section-v4.html?v=aktiv-section-10";

function injectStyles(document: Document, replacement: NativeComponentReplacement) {
  const styleId = "radar-native-component-replacement-styles";
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = [
    "@keyframes radarAktivDepth { 0%, 100% { transform: perspective(720px) rotateX(0deg) rotateY(0deg) translateZ(0); } 50% { transform: perspective(720px) rotateX(4deg) rotateY(-3deg) translateZ(16px); } }",
    ".radar-aktiv-3d { display: inline-block !important; transform-style: preserve-3d; will-change: transform; text-shadow: 0 1px 0 rgba(255,255,255,.55), 0 2px 0 rgba(255,255,255,.25), 0 4px 0 rgba(0,0,0,.18), 0 8px 18px rgba(0,0,0,.35) !important; animation: radarAktivDepth 4.8s ease-in-out infinite; }",
    ".radar-aktiv-frame-container { width: 100% !important; height: auto !important; min-height: 0 !important; aspect-ratio: 16 / 9 !important; }",
    ".radar-aktiv-frame-container > *, .radar-aktiv-frame-container > * > *, .radar-aktiv-frame-container > * > * > * { height: 100% !important; min-height: 0 !important; }",
    ".radar-aktiv-image-layer { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; transform: none !important; }",
    ".radar-aktiv-image-frame { position: relative !important; inset: auto !important; width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; }",
    ".radar-aktiv-image, .radar-aktiv-video { position: relative !important; inset: auto !important; display: block !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; object-fit: cover !important; object-position: 50% 50% !important; transform: none !important; }",
    ".framer-hz7xvy { position: relative !important; top: -14px !important; }",
    "@media (prefers-reduced-motion: reduce) { .radar-aktiv-3d { animation: none !important; } .radar-aktiv-video { display: none !important; } }",
  ].join("\n");
  document.head.appendChild(style);
}

function applyReplacement(frame: HTMLIFrameElement, replacement: NativeComponentReplacement) {
  const innerDocument = frame.contentDocument;
  if (!innerDocument) return;
  const copy = [...innerDocument.querySelectorAll("p")].find((paragraph) =>
    paragraph.textContent?.includes("Experience the perfect fusion") || paragraph.textContent?.trim() === "AKT!V",
  );
  const frameContainer = (innerDocument.querySelector(".framer-50j9t5-container") || copy?.closest(".framer-50j9t5-container")) as HTMLElement | null;
  if (copy) {
    copy.textContent = replacement.text;
    copy.dataset.radarComponent = replacement.componentKey;
    copy.classList.toggle("radar-aktiv-3d", Boolean(replacement.text));
  }
  if (frameContainer) {
    frameContainer.classList.add("radar-aktiv-frame-container");
    const existingImage = frameContainer.querySelector("img");
    const existingVideo = frameContainer.querySelector("video");
    const isVideo = replacement.mediaType === "video" || /\.(webm|mp4)(?:$|\?)/i.test(replacement.imageUrl);
    if (isVideo && existingVideo) {
      existingVideo.src = replacement.imageUrl;
      existingVideo.autoplay = true;
      existingVideo.loop = true;
      existingVideo.muted = true;
      existingVideo.defaultMuted = true;
      existingVideo.playsInline = true;
      existingVideo.preload = "auto";
      existingVideo.classList.add("radar-aktiv-video");
      existingVideo.parentElement?.classList.add("radar-aktiv-image-frame");
      existingVideo.parentElement?.parentElement?.classList.add("radar-aktiv-image-layer");
      void existingVideo.play().catch(() => undefined);
    } else if (isVideo && existingImage) {
      const video = innerDocument.createElement("video");
      video.src = replacement.imageUrl;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("aria-hidden", "true");
      video.className = "radar-aktiv-video";
      existingImage.replaceWith(video);
      video.parentElement?.classList.add("radar-aktiv-image-frame");
      video.parentElement?.parentElement?.classList.add("radar-aktiv-image-layer");
      void video.play().catch(() => undefined);
    } else if (!isVideo && existingImage) {
      existingImage.src = replacement.imageUrl;
      existingImage.removeAttribute("srcset");
      existingImage.removeAttribute("sizes");
      existingImage.classList.add("radar-aktiv-image");
      existingImage.parentElement?.classList.add("radar-aktiv-image-frame");
    }
  }
  injectStyles(innerDocument, replacement);
}

function syncFrameHeight(frame: HTMLIFrameElement) {
  const innerDocument = frame.contentDocument;
  const body = innerDocument?.body;
  const root = innerDocument?.documentElement;
  if (!body || !root) return;
  const height = Math.max(root.scrollHeight, root.offsetHeight, body.scrollHeight, body.offsetHeight);
  if (height > 0) frame.style.height = `${Math.ceil(height)}px`;
}

export function FramerMainView({ replacement }: { replacement: NativeComponentReplacement }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    let settleTimer = 0;
    let observer: ResizeObserver | undefined;
    let mutations: MutationObserver | undefined;

    const measure = () => {
      try {
        applyReplacement(frame, replacement);
        syncFrameHeight(frame);
      } catch {
        setHasError(true);
      }
    };
    const onLoad = () => {
      measure();
      const document = frame.contentDocument;
      if (document?.documentElement && "ResizeObserver" in window) {
        observer = new ResizeObserver(measure);
        observer.observe(document.documentElement);
        if (document.body) observer.observe(document.body);
      }
      if (document?.body && "MutationObserver" in window) {
        mutations = new MutationObserver(measure);
        mutations.observe(document.body, { subtree: true, childList: true, characterData: true });
      }
      let remaining = 80;
      const settle = () => {
        measure();
        remaining -= 1;
        if (remaining > 0) settleTimer = window.setTimeout(settle, 250);
      };
      settle();
    };

    frame.addEventListener("load", onLoad);
    frame.addEventListener("error", () => setHasError(true), { once: true });
    if (frame.contentDocument?.readyState === "complete") onLoad();
    return () => {
      frame.removeEventListener("load", onLoad);
      if (settleTimer) window.clearTimeout(settleTimer);
      observer?.disconnect();
      mutations?.disconnect();
    };
  }, [replacement]);

  return (
    <div className="radar-framer-frame-shell">
      <iframe
        ref={iframeRef}
        data-radar-framer="true"
        title="RADARCharts Framer homepage"
        src={FRAME_SRC}
        loading="eager"
        allow="autoplay"
        scrolling="no"
        className="block min-h-screen w-full overflow-hidden border-0 bg-transparent"
      />
      <div data-radar-framer-error hidden={!hasError} className="radar-framer-error" role="status">
        <strong>RADARCharts is still loading.</strong>
        <span>Refresh the page if the homepage does not appear.</span>
        <Link href="/">Refresh homepage</Link>
      </div>
    </div>
  );
}
