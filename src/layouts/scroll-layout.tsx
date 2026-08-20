"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { scrollTo } from "@/utils/scroll-to";
import { useShallow } from "zustand/react/shallow";

export const scrollSpeed = { current: 1 };

export function ScrollLayout({ children }: { children: React.ReactNode }) {
  // Server-safe rendering
  return (
    <div className="scroll-layout">
      {/* Static content that can be rendered on server */}
      <div className="scroll-layout-content">{children}</div>

      {/* Client-only functionality */}
      <ScrollController />
      <GlassScrollbar />
    </div>
  );
}

function GlassScrollbar() {
  const [progress, setProgress] = useState(0);
  const [thumbSize, setThumbSize] = useState(0.24);
  const [active, setActive] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const update = (scrollTop: number, limit: number) => {
      const viewport = window.innerHeight;
      const documentHeight = Math.max(document.documentElement.scrollHeight, viewport);
      const nativeLimit = Math.max(documentHeight - viewport, 0);
      const effectiveLimit = limit > 0 ? limit : nativeLimit;
      const ratio = effectiveLimit > 0 ? Math.min(1, Math.max(0, viewport / (viewport + effectiveLimit))) : 1;

      setProgress(effectiveLimit > 0 ? Math.min(1, Math.max(0, scrollTop / effectiveLimit)) : 0);
      setThumbSize(Math.min(0.42, Math.max(0.12, ratio)));
      setActive(true);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setActive(false), 720);
    };

    const onWindowScroll = () => update(window.scrollY, 0);
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("resize", onWindowScroll, { passive: true });
    onWindowScroll();

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("resize", onWindowScroll);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const usableTrack = 1 - thumbSize;

  return (
    <div className={`radar-glass-scrollbar ${active ? "is-active" : ""}`} aria-hidden="true">
      <span
        className="radar-glass-scrollbar__thumb"
        style={{ height: `${thumbSize * 100}%`, transform: `translateY(${progress * usableTrack * 100}%)` }}
      />
    </div>
  );
}

function ScrollController() {
  const isEnableScroll = useScroll((state) => state.isEnableScroll);
  const [hash, setHash] = useState<string>("");
  const [lenis, setLenis] = useScroll(
    useShallow((state) => [state.lenis, state.setLenis]),
  );
  const pathname = usePathname();
  const savedPathname = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
    const lenis = new Lenis({
      smoothWheel: true,
      // syncTouch: true,
    });
    (window as typeof window & { lenis: Lenis }).lenis = lenis;
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      // Cancel the loop before destroying Lenis — otherwise it keeps calling
      // `raf` on a destroyed instance after unmount/HMR.
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  useEffect(() => {
    if (isEnableScroll) {
      lenis?.start();
      enableNativeScroll(true);
    } else {
      lenis?.stop();
      enableNativeScroll(false);
    }
  }, [isEnableScroll, lenis]);

  useEffect(() => {
    if (lenis && hash) {
      setTimeout(() => {
        scrollTo(hash, true);
      }, 300);
    }
  }, [lenis, hash]);

  useEffect(() => {
    if (savedPathname.current !== pathname) {
      savedPathname.current = pathname;
      if (pathname.includes("#")) {
        const hash = pathname.split("#").pop();
        if (hash) {
          setHash(hash);
        }
      }
    }
  }, [pathname, setHash]);

  return null; // This component doesn't render anything visible
}

const enableNativeScroll = (value: boolean) => {
  if (typeof document === "undefined") return;
  if (!document) return;
  const html = document.querySelector("html");
  if (!html) return;
  if (!value) {
    html.style.position = "relative";
    html.style.overflow = "hidden";
    html.style.height = "100%";
  } else {
    html.style.removeProperty("position");
    html.style.removeProperty("overflow");
    html.style.removeProperty("height");
  }
};
