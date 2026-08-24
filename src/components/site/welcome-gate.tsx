"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DISPLAY_MS = 8000;
const EXIT_MS = 1200;
const WELCOME_GIF = "/media/welcome/remradar-opening.gif";
const WELCOME_POSTER = "/media/welcome/remradar-opening-poster.jpg";

export function WelcomeGate() {
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
    const timer = window.setTimeout(() => dismiss(), reducedMotion ? 550 : DISPLAY_MS);
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
      <link rel="preload" as="image" href={WELCOME_GIF} type="image/gif" fetchPriority="high" />
      <link rel="preload" as="image" href={WELCOME_POSTER} type="image/jpeg" fetchPriority="high" />
      <div
        className={`radar-welcome-gate ${exiting ? "is-exiting" : ""}`}
        role="dialog"
        aria-label="RADARCharts welcome animation"
        aria-modal="true"
      >
        <div className="radar-welcome-gate__backdrop" aria-hidden="true" />
        {reducedMotion ? (
          <Image
            className="radar-welcome-gate__poster"
            src={WELCOME_POSTER}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            className="radar-welcome-gate__gif"
            src={WELCOME_GIF}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
          />
        )}
        <div className="radar-welcome-gate__scrim" aria-hidden="true" />
      </div>
    </>
  );
}
