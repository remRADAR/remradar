"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
};

export function ScrollReveal({ children, className = "", delay = 0, as: Component = "div" }: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--radar-reveal-delay", `${delay}ms`);
    if (!("IntersectionObserver" in window)) {
      node.dataset.revealed = "true";
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      node.dataset.revealed = "true";
      observer.unobserve(node);
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return <Component ref={ref} data-scroll-reveal="true" className={className}>{children}</Component>;
}
