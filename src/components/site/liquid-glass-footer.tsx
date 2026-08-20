import Link from "next/link";
import type { RadarNavigationItem } from "@/lib/wordpress";

type FooterIcon = "home" | "charts" | "articles" | "magazine" | "music" | "store" | "motherland" | "spotlights" | "more";

type FooterLink = {
  label: string;
  href: string;
  icon: FooterIcon;
};

const waveOffsets = ["-translate-y-1", "translate-y-0", "translate-y-1", "translate-y-0", "-translate-y-1", "translate-y-0", "translate-y-1", "translate-y-0", "-translate-y-1"] as const;

const footerLinks: FooterLink[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Charts", href: "/charts", icon: "charts" },
  { label: "Articles", href: "/ontheradar", icon: "articles" },
  { label: "Magazine", href: "/magazine", icon: "magazine" },
  { label: "RADARMusic", href: "/radarmusic", icon: "music" },
  { label: "RadarStore", href: "/store", icon: "store" },
  { label: "Spotlights", href: "/spotlights", icon: "spotlights" },
  { label: "Motherland", href: "/motherland", icon: "motherland" },
  { label: "Explore", href: "/platforms", icon: "more" },
];

function FooterIcon({ name }: { name: FooterIcon }) {
  const iconProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...iconProps}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "charts":
      return (
        <svg {...iconProps}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-6" />
        </svg>
      );
    case "articles":
      return (
        <svg {...iconProps}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "magazine":
      return (
        <svg {...iconProps}>
          <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2Z" />
          <path d="M5 18a2 2 0 0 0 2 2" />
          <path d="M8 8h7M8 12h7" />
        </svg>
      );
    case "music":
      return (
        <svg {...iconProps}>
          <path d="M9 18V5l10-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      );
    case "store":
      return (
        <svg {...iconProps}>
          <path d="M4 10v10h16V10" />
          <path d="M3 10h18l-2-6H5Z" />
          <path d="M8 20v-6h8v6" />
        </svg>
      );
    case "motherland":
      return (
        <svg {...iconProps}>
          <path d="M12 3 4 7v5c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V7Z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      );
    case "spotlights":
      return (
        <svg {...iconProps}>
          <path d="m9 3 6 0 3 7H6Z" />
          <path d="M12 10v8M8 21h8M9 18h6" />
        </svg>
      );
    case "more":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z" />
        </svg>
      );
  }
}

function iconForNavigation(item: RadarNavigationItem): FooterIcon {
  const allowed: FooterIcon[] = ["home", "charts", "articles", "magazine", "music", "store", "motherland", "spotlights", "more"];
  return allowed.includes(item.icon as FooterIcon) ? item.icon as FooterIcon : "more";
}

export function LiquidGlassFooter({ navigation }: { navigation?: RadarNavigationItem[] }) {
  const links: FooterLink[] = navigation?.length
    ? navigation.map((item) => ({ label: item.label, href: item.href, icon: iconForNavigation(item) }))
    : footerLinks;

  return (
    <footer className="mx-auto mt-8 w-full min-w-0 max-w-3xl px-4 pb-5 sm:mt-12 sm:px-6 sm:pb-8" aria-label="RADARCharts footer navigation">
      <div className="radar-circular-footer mx-auto flex w-full min-w-0 items-center justify-center overflow-hidden rounded-full border border-border-footer bg-surface-footer px-2 py-2 shadow-2xl backdrop-blur-xl">
        <nav aria-label="Footer navigation" className="radar-circular-footer-scroll flex min-w-0 max-w-full items-center justify-center gap-1 overflow-x-auto px-1 py-1 sm:gap-2">
          {links.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className={`radar-circular-footer-link group relative flex size-10 shrink-0 ${waveOffsets[index] ?? "translate-y-0"} items-center justify-center rounded-full border border-border-footer bg-surface-footer-inset text-footer-muted radar-transition hover:border-footer-accent hover:bg-footer-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-footer-accent sm:size-11`}

            >
              <FooterIcon name={link.icon} />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-border-footer bg-surface-footer px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-footer-foreground opacity-0 shadow-lg radar-transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-3 text-center text-xs uppercase tracking-[0.18em] text-footer-muted">RADAR is AKT!V. ©2026</p>
    </footer>
  );
}
