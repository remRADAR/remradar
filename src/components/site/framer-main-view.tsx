"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HomepageComponentReplacement } from "@/lib/native-content";

const FRAME_SRC = "/framer-site/aktiv-section-v4.html?v=liberty-panel-1";

function injectStyles(document: Document, replacement: HomepageComponentReplacement) {
  const styleId = "radar-native-component-replacement-styles";
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = [
    "@keyframes radarAktivDepth { 0%, 100% { transform: perspective(720px) rotateX(0deg) rotateY(0deg) translateZ(0); } 50% { transform: perspective(720px) rotateX(4deg) rotateY(-3deg) translateZ(16px); } }",
    ".radar-aktiv-3d { display: inline-block !important; transform-style: preserve-3d; will-change: transform; text-shadow: 0 1px 0 rgba(255,255,255,.55), 0 2px 0 rgba(255,255,255,.25), 0 4px 0 rgba(0,0,0,.18), 0 8px 18px rgba(0,0,0,.35) !important; animation: radarAktivDepth 4.8s ease-in-out infinite; }",
    ".radar-aktiv-frame-container { box-sizing: border-box !important; width: calc(100% - clamp(1.5rem, 4vw, 3.5rem)) !important; margin-inline: auto !important; height: auto !important; min-height: 0 !important; aspect-ratio: 16 / 9 !important; overflow: hidden !important; border: 1px solid rgba(255,237,222,.14) !important; border-radius: clamp(1rem, 2.4vw, 1.75rem) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.10), 0 18px 46px rgba(0,0,0,.16) !important; }",
    `.rc-liberty-panel { box-sizing: border-box !important; position: relative !important; aspect-ratio: 16 / 9 !important; height: auto !important; min-height: 420px !important; overflow: hidden !important; border-radius: 32px !important; background: #2a2224 !important; }
    .rc-liberty-layer { position: absolute !important; inset: 0 !important; display: flex !important; align-items: flex-end !important; justify-content: center !important; pointer-events: none !important; overflow: hidden !important; }
    .rc-liberty-img { display: block !important; width: auto !important; height: auto !important; max-width: 100% !important; max-height: 100% !important; object-fit: contain !important; object-position: bottom center !important; filter: grayscale(0%) drop-shadow(0 24px 60px rgba(0,0,0,.55)) !important; }
    .rc-liberty-panel > div[style*='z-index: 10'] { padding: 40px clamp(20px, 4vw, 80px) !important; }
    @media (min-width: 1024px) { .rc-liberty-img { transform: translateX(8%) !important; } }
    @media (max-width: 640px) { .rc-liberty-panel { aspect-ratio: 3 / 4 !important; min-height: 320px !important; border-radius: 24px !important; } .rc-liberty-img { transform: none !important; max-height: 88% !important; } .rc-liberty-panel > div[style*='z-index: 10'] { padding: 40px 20px !important; } }`,
    ".radar-aktiv-frame-container > *, .radar-aktiv-frame-container > * > *, .radar-aktiv-frame-container > * > * > * { height: 100% !important; min-height: 0 !important; }",
    ".radar-aktiv-image-layer { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; transform: none !important; }",
    ".radar-aktiv-image-frame { position: relative !important; inset: auto !important; width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; background: #05070a url('/framer-site/_deps/images/radarmatrix-home-poster.jpg') center / cover no-repeat !important; }",
    ".radar-aktiv-image, .radar-aktiv-video { position: relative !important; inset: auto !important; display: block !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; object-fit: cover !important; object-position: 50% 50% !important; transform: none !important; }",
    ".framer-hz7xvy { position: relative !important; top: -14px !important; }",
    "html, body { background: transparent !important; }",
    "[data-framer-name='Now Reading'], [data-framer-name='RADARMusic'], [data-framer-name='Section - Category'] { position: relative !important; overflow: hidden !important; border: 1px solid rgba(221,228,236,.22) !important; border-radius: 24px !important; background: linear-gradient(145deg, rgba(225,231,238,.12), rgba(120,130,145,.035)) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(8,12,18,.20), 0 24px 70px rgba(0,0,0,.18) !important; -webkit-backdrop-filter: blur(16px) saturate(112%) !important; backdrop-filter: blur(16px) saturate(112%) !important; }",
    "[data-framer-name='Now Reading']::before, [data-framer-name='RADARMusic']::before, [data-framer-name='Section - Category']::before { position: absolute !important; z-index: 0 !important; inset: 0 !important; content: '' !important; pointer-events: none !important; background: linear-gradient(118deg, rgba(255,255,255,.12), transparent 28%, transparent 72%, rgba(165,177,195,.07)) !important; opacity: .72 !important; }",
    "[data-framer-name='Now Reading'] > *, [data-framer-name='RADARMusic'] > *, [data-framer-name='Section - Category'] > * { position: relative !important; z-index: 1 !important; }",
    "@media (max-width: 809px) { [data-framer-name='Now Reading'], [data-framer-name='RADARMusic'], [data-framer-name='Section - Category'] { border-radius: 18px !important; -webkit-backdrop-filter: blur(12px) saturate(108%) !important; backdrop-filter: blur(12px) saturate(108%) !important; } }",
    "[data-framer-name='Mobile App Dock'], [data-framer-name='Floating Music Player'] { display: none !important; }",
    ".radar-aktiv-plain-image { aspect-ratio: 4 / 3 !important; height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; }",
    ".radar-aktiv-plain-ancestor { height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; }",
    ".radar-aktiv-plain-image, .radar-aktiv-plain-image .radar-aktiv-image-frame { border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }",
    ".radar-aktiv-plain-image .radar-aktiv-image { object-fit: contain !important; object-position: 50% 50% !important; }",
    "@media (max-width: 809px) { .radar-aktiv-frame-container { width: calc(100% - 1.25rem) !important; border-radius: 1rem !important; } }",
    "@media (prefers-reduced-motion: reduce) { .radar-aktiv-3d { animation: none !important; } .radar-aktiv-video { display: none !important; } }",
  ].join("\n");
  document.head.appendChild(style);
}

function applyRepeatedCloneAccessibility(innerDocument: Document) {
  const marqueeRoots = [
    ...innerDocument.querySelectorAll<HTMLElement>("[data-framer-name='Now Reading'], [data-framer-name='RADARMusic'], [data-framer-name='Section - Category']"),
  ];
  const seenImages = new Set<string>();
  for (const root of marqueeRoots) {
    for (const image of root.querySelectorAll<HTMLImageElement>("img")) {
      const key = image.currentSrc || image.src || image.alt;
      if (seenImages.has(key)) {
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
      } else {
        seenImages.add(key);
        if (!image.hasAttribute("alt")) image.alt = "";
      }
    }
    const textNodes = [...root.querySelectorAll<HTMLElement>("p, span, div")].filter((element) => element.textContent?.trim());
    const seenText = new Set<string>();
    for (const element of textNodes) {
      const text = element.textContent?.trim() ?? "";
      if (!text || text.length > 80) continue;
      if (seenText.has(text)) element.setAttribute("aria-hidden", "true");
      else seenText.add(text);
    }
  }
}

function applyHomepageComponentReplacements(frame: HTMLIFrameElement, components: HomepageComponentReplacement[]) {
  const innerDocument = frame.contentDocument;
  if (!innerDocument) return;

  for (const component of components) {
    if (!component.enabled || component.componentKey === "aktiv-section" || !component.selector) continue;
    innerDocument.querySelectorAll(component.selector).forEach((node) => {
      const element = node as HTMLElement;
      if (component.text && element.matches("p, h1, h2, h3, span") && element.textContent !== component.text) element.textContent = component.text;
      const media = element.matches("img, video") ? element : element.querySelector("img, video");
      if (media?.tagName === "IMG" && component.imageUrl) {
        const image = media as HTMLImageElement;
        image.src = component.imageUrl;
        image.removeAttribute("srcset");
        image.removeAttribute("sizes");
        image.style.objectFit = component.imageFit;
        image.style.objectPosition = component.imagePosition;
      }
      if (media?.tagName === "VIDEO" && component.imageUrl) {
        const video = media as HTMLVideoElement;
        configureLoopingVideo(
          video,
          component.imageUrl,
          component.videoFallbackUrl,
          component.posterUrl ?? "/framer-site/_deps/images/radarmatrix-home-poster.jpg",
        );
      }
    });
  }
}

function configureLoopingVideo(
  video: HTMLVideoElement,
  primaryUrl: string,
  fallbackUrl: string | undefined,
  posterUrl: string,
) {
  const resolvedPrimary = new URL(primaryUrl, document.baseURI).href;
  const resolvedFallback = fallbackUrl ? new URL(fallbackUrl, document.baseURI).href : undefined;
  const alreadyConfigured = video.dataset.radarPrimary === resolvedPrimary && video.poster === new URL(posterUrl, document.baseURI).href;
  if (alreadyConfigured) {
    if (video.paused && video.readyState >= HTMLMediaElement.HAVE_METADATA) void video.play().catch(() => undefined);
    return;
  }

  video.dataset.radarPrimary = resolvedPrimary;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.poster = posterUrl;
  video.setAttribute("aria-hidden", "true");
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.onerror = null;
  video.onerror = () => {
    if (resolvedFallback && video.src !== resolvedFallback) {
      video.dataset.radarPrimary = resolvedFallback;
      video.src = resolvedFallback;
      video.load();
      void video.play().catch(() => undefined);
    }
  };
  video.src = primaryUrl;
  video.load();
  void video.play().catch(() => undefined);
}

function replaceLibertyParallaxLayer(frameContainer: HTMLElement) {
  frameContainer.classList.add("rc-liberty-panel");
  frameContainer.classList.remove("radar-aktiv-plain-image");
  for (const element of [...frameContainer.querySelectorAll<HTMLElement>("*")]) {
    if (getComputedStyle(element).position === "fixed") element.remove();
  }
  for (const media of [...frameContainer.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video")]) {
    media.setAttribute("aria-hidden", "true");
    media.style.display = "none";
  }
  const existing = frameContainer.querySelector<HTMLElement>(".rc-liberty-layer");
  existing?.remove();
  const layer = frameContainer.ownerDocument.createElement("div");
  layer.className = "rc-liberty-layer";
  layer.setAttribute("aria-hidden", "true");
  const image = frameContainer.ownerDocument.createElement("img");
  image.className = "rc-liberty-img";
  image.src = "/media/liberty-statue.png";
  image.alt = "Statue of Liberty crown and face, monochrome";
  image.width = 2016;
  image.height = 1512;
  image.loading = "eager";
  image.decoding = "async";
  image.style.objectFit = "contain";
  image.style.objectPosition = "bottom center";
  image.style.maxWidth = "100%";
  image.style.maxHeight = "100%";
  layer.appendChild(image);
  frameContainer.prepend(layer);
}

function applyReplacement(frame: HTMLIFrameElement, replacement: HomepageComponentReplacement, components: HomepageComponentReplacement[]) {
  const innerDocument = frame.contentDocument;
  if (!innerDocument) return;

  applyHomepageComponentReplacements(frame, components);
  applyRepeatedCloneAccessibility(innerDocument);

  const copy = [...innerDocument.querySelectorAll("p")].find((paragraph) =>
    paragraph.textContent?.includes("Experience the perfect fusion") || paragraph.textContent?.trim() === "AKT!V",
  );
  const frameContainer = (innerDocument.querySelector(".framer-50j9t5-container") || copy?.closest(".framer-50j9t5-container")) as HTMLElement | null;
  if (copy) {
    if (copy.textContent !== replacement.text) copy.textContent = replacement.text;
    copy.dataset.radarComponent = replacement.componentKey;
    copy.classList.toggle("radar-aktiv-3d", Boolean(replacement.text));
  }
  if (frameContainer) {
    frameContainer.classList.add("radar-aktiv-frame-container");
    if (replacement.componentKey === "aktiv-section") {
      replaceLibertyParallaxLayer(frameContainer);
      injectStyles(innerDocument, replacement);
      return;
    }
    const isPlainImage = replacement.mediaType === "image";
    frameContainer.classList.toggle("radar-aktiv-plain-image", isPlainImage);
    if (isPlainImage) {
      let ancestor = frameContainer.parentElement;
      for (let depth = 0; ancestor && ancestor !== innerDocument.body && depth < 4; depth += 1) {
        ancestor.classList.add("radar-aktiv-plain-ancestor");
        ancestor = ancestor.parentElement;
      }
    }
    const existingImage = frameContainer.querySelector("img");
    const existingVideo = frameContainer.querySelector("video");
    const isVideo = replacement.mediaType === "video" || /\.(webm|mp4)(?:$|\?)/i.test(replacement.imageUrl);
    const posterUrl = replacement.posterUrl ?? "/framer-site/_deps/images/radarmatrix-home-poster.jpg";
    if (isVideo && existingVideo) {
      configureLoopingVideo(existingVideo, replacement.imageUrl, replacement.videoFallbackUrl, posterUrl);
      existingVideo.classList.add("radar-aktiv-video");
      existingVideo.parentElement?.classList.add("radar-aktiv-image-frame");
      existingVideo.parentElement?.parentElement?.classList.add("radar-aktiv-image-layer");
    } else if (isVideo && existingImage) {
      const video = innerDocument.createElement("video");
      configureLoopingVideo(video, replacement.imageUrl, replacement.videoFallbackUrl, posterUrl);
      video.className = "radar-aktiv-video";
      existingImage.replaceWith(video);
      video.parentElement?.classList.add("radar-aktiv-image-frame");
      video.parentElement?.parentElement?.classList.add("radar-aktiv-image-layer");
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
  const nextHeight = height > 0 ? `${Math.ceil(height)}px` : "";
  if (nextHeight && frame.style.height !== nextHeight) frame.style.height = nextHeight;
}

export function FramerMainView({ replacement, components = [replacement] }: { replacement: HomepageComponentReplacement; components?: HomepageComponentReplacement[] }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    let settleTimer = 0;
    let hydrationTimer = 0;
    let scheduledMeasure = 0;
    let isMeasuring = false;
    let observer: ResizeObserver | undefined;
    let mutations: MutationObserver | undefined;

    const measure = () => {
      if (isMeasuring) return;
      isMeasuring = true;
      try {
        applyReplacement(frame, replacement, components);
        syncFrameHeight(frame);
      } catch (error) {
        // A transient Framer DOM update should not blank the homepage. The iframe
        // error listener below remains the only path that shows the hard fallback.
        console.warn("RADAR homepage bridge retrying after a transient update", error);
      } finally {
        isMeasuring = false;
      }
    };

    const scheduleMeasure = () => {
      if (scheduledMeasure || isMeasuring) return;
      scheduledMeasure = window.requestAnimationFrame(() => {
        scheduledMeasure = 0;
        measure();
      });
    };
    const onLoad = () => {
      const document = frame.contentDocument;
      // Apply critical visual overrides immediately so the old Framer media and
      // dock cannot flash while the embedded document hydrates.
      measure();
      hydrationTimer = window.setTimeout(() => {
        measure();
        if (document?.documentElement && "ResizeObserver" in window) {
        observer = new ResizeObserver(scheduleMeasure);
        observer.observe(document.documentElement);
          if (document.body) observer.observe(document.body);
        }
        if (document?.body && "MutationObserver" in window) {
        mutations = new MutationObserver(scheduleMeasure);
          mutations.observe(document.body, { subtree: true, childList: true, characterData: true });
        }
        let remaining = 8;
        const settle = () => {
          measure();
          remaining -= 1;
          if (remaining > 0) settleTimer = window.setTimeout(settle, 400);
        };
        settle();
      }, 1800);
    };

    frame.addEventListener("load", onLoad);
    frame.addEventListener("error", () => setHasError(true), { once: true });
    if (frame.contentDocument?.readyState === "complete") onLoad();
    return () => {
      frame.removeEventListener("load", onLoad);
      if (settleTimer) window.clearTimeout(settleTimer);
      if (hydrationTimer) window.clearTimeout(hydrationTimer);
      if (scheduledMeasure) window.cancelAnimationFrame(scheduledMeasure);
      observer?.disconnect();
      mutations?.disconnect();
    };
  }, [replacement, components]);

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
