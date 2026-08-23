"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DISPLAY_MS = 8000;
const EXIT_MS = 1200;

export function WelcomeGate() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(mediaQuery.matches);
    updateMotion();
    mediaQuery.addEventListener?.("change", updateMotion);

    document.documentElement.classList.add("radar-welcome-active");
    document.body.classList.add("radar-welcome-active");

    return () => {
      mediaQuery.removeEventListener?.("change", updateMotion);
      document.documentElement.classList.remove("radar-welcome-active");
      document.body.classList.remove("radar-welcome-active");
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => dismiss(), 550);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => dismiss(), DISPLAY_MS);
    const video = videoRef.current;
    video?.play().catch(() => {
      window.setTimeout(() => dismiss(), 850);
    });

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  function dismiss() {
    setExiting(true);
    window.setTimeout(() => {
      setMounted(false);
      document.documentElement.classList.remove("radar-welcome-active");
      document.body.classList.remove("radar-welcome-active");
    }, EXIT_MS);
  }

  if (!mounted) return null;

  return (
    <>
      <link
        rel="preload"
        as="video"
        href="/media/welcome/remradar-opening.webm"
        type="video/webm"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/media/welcome/remradar-opening-poster.jpg"
        type="image/jpeg"
        fetchPriority="high"
      />
      <div
        className={`radar-welcome-gate ${exiting ? "is-exiting" : ""}`}
      role="dialog"
      aria-label="RADARCharts welcome animation"
      aria-modal="true"
    >
      <div className="radar-welcome-gate__backdrop" aria-hidden="true" />
      {!reducedMotion ? (
        <video
          ref={videoRef}
          className="radar-welcome-gate__video"
          autoPlay
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          poster="/media/welcome/remradar-opening-poster.jpg"
          onEnded={dismiss}
          onError={() => window.setTimeout(() => dismiss(), 650)}
        >
          <source src="/media/welcome/remradar-opening.webm" type="video/webm" />
          <source src="/media/welcome/remradar-opening.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          className="radar-welcome-gate__poster"
          src="/media/welcome/remradar-opening-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      )}
        <div className="radar-welcome-gate__scrim" aria-hidden="true" />
      </div>
    </>
  );
}
