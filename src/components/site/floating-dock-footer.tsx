"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { RadarNavigationItem } from "@/lib/wordpress";

type DockLink = { label: string; href: string; glyph: string };

const fallbackLinks: DockLink[] = [
  { label: "Home", href: "/", glyph: "⌂" },
  { label: "Charts", href: "/charts", glyph: "↗" },
  { label: "Articles", href: "/ontheradar", glyph: "▤" },
  { label: "Magazine", href: "/magazine", glyph: "▧" },
  { label: "RADARMusic", href: "/radarmusic", glyph: "♫" },
  { label: "RadarStore", href: "/store", glyph: "▣" },
  { label: "Spotlights", href: "/spotlights", glyph: "✦" },
  { label: "Motherland", href: "/motherland", glyph: "◈" },
  { label: "Explore", href: "/platforms", glyph: "◎" },
];

export function FloatingDockFooter({ navigation }: { navigation?: RadarNavigationItem[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const links = navigation?.length
    ? navigation.map((item) => ({ label: item.label, href: item.href, glyph: fallbackLinks.find((link) => link.href === item.href)?.glyph ?? "◎" }))
    : fallbackLinks;

  return (
    <footer className="radar-floating-footer" aria-label="RADARCharts floating navigation">
      <nav className="radar-floating-dock" aria-label="Primary navigation">
        {links.map((link) => {
          const distance = active ? Math.abs(links.findIndex((candidate) => candidate.href === active) - links.findIndex((candidate) => candidate.href === link.href)) : 99;
          const scale = active === link.href ? 1.22 : distance === 1 ? 1.1 : 1;
          return (
            <Link
              href={link.href}
              key={link.href}
              className={`radar-floating-dock__item${pathname === link.href ? " is-current" : ""}`}
              aria-current={pathname === link.href ? "page" : undefined}
              aria-label={link.label}
              title={link.label}
              onMouseEnter={() => setActive(link.href)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(link.href)}
              onBlur={() => setActive(null)}
              style={{ transform: `translateY(${active === link.href ? -7 : 0}px) scale(${scale})` }}
            >
              <span className="radar-floating-dock__glyph" aria-hidden="true">{link.glyph}</span>
              <small>{link.label}</small>
            </Link>
          );
        })}
      </nav>
      <p className="radar-floating-footer__note">RADAR is AKT!V. ©2026</p>
    </footer>
  );
}
