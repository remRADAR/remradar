import Image from "next/image";
import Link from "next/link";
import { FloatingDockFooter } from "@/components/site/floating-dock-footer";
import { RADAR_RATE_CARD_SECTIONS, RADAR_RATE_CARD_SOURCE } from "@/lib/radar-ratecard";

export function RadarRateCardPage() {
  return (
    <main className="radar-route-shell radar-rate-card-page">
      <header className="radar-route-header">
        <Link className="radar-route-header__logo" href="/" aria-label="RADARCharts by REM home">
          <Image src="/radarcharts-logo-transparent.png" alt="RADARCharts by REM" width={180} height={120} priority />
        </Link>
        <Link className="radar-route-header__home" href="/store">Official store</Link>
      </header>
      <section className="radar-route-hero">
        <p className="radar-route-eyebrow">THE RADAR RATECARD</p>
        <h1>Your ultimate music marketing & promotion hub.</h1>
        <p className="radar-route-intro">Strategic promotion, airplay, content creation, consultation, distribution, and playlist campaigns for artists and music projects.</p>
        <p className="radar-rate-card-source">Source of truth: <a href={RADAR_RATE_CARD_SOURCE} target="_blank" rel="noreferrer">radarcharts.net/ratecard ↗</a></p>
      </section>
      <div className="radar-rate-card-sections">
        {RADAR_RATE_CARD_SECTIONS.map((section, index) => (
          <section className="radar-rate-card-section" aria-labelledby={`ratecard-section-${index}`} key={section.title}>
            <div className="radar-rate-card-section__heading">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><p className="radar-route-eyebrow">{section.eyebrow || "RADAR SERVICES"}</p><h2 id={`ratecard-section-${index}`}>{section.title}</h2></div>
            </div>
            <div className="radar-rate-card-list">
              {section.items.map((item) => <article className="radar-rate-card" key={item.name}><div><h3>{item.name}</h3>{item.detail ? <p>{item.detail}</p> : null}</div>{item.price ? <strong>{item.price}</strong> : null}</article>)}
            </div>
          </section>
        ))}
      </div>
      <section className="radar-rate-card-note"><p className="radar-route-eyebrow">LET’S TALK</p><h2>Contact RADARCharts for consultation.</h2><a href="https://instagram.com/remradar" target="_blank" rel="noreferrer">Consult via Instagram ↗</a></section>
      <FloatingDockFooter />
    </main>
  );
}
