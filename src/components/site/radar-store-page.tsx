"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatNaira,
  RADAR_STORE_SERVICES,
  RADAR_STORE_WHATSAPP_URL,
  type RadarStoreService,
} from "@/lib/radar-store";
import type { RadarManagedService } from "@/lib/wordpress";

export function RadarStorePage({ services = [] }: { services?: RadarManagedService[] }) {
  const catalog = useMemo<RadarStoreService[]>(
    () => services.length
      ? services.map((service) => ({ id: service.slug as RadarStoreService["id"], name: service.name, category: service.category as RadarStoreService["category"], description: service.description, priceNgn: service.priceNgn, featured: service.featured }))
      : [...RADAR_STORE_SERVICES],
    [services],
  );
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<RadarStoreService["id"]>>(new Set());

  const selectedServices = useMemo(
    () => catalog.filter((service) => selectedIds.has(service.id)),
    [catalog, selectedIds],
  );
  const total = selectedServices.reduce((sum, service) => sum + service.priceNgn, 0);

  function toggleService(id: RadarStoreService["id"]) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="radar-store-page">
      <header className="radar-store-header">
        <Link className="radar-store-brand" href="/" aria-label="RADARCharts by REM home">
          <Image src="/radarcharts-logo-transparent.png" alt="RADARCharts by REM" width={180} height={120} priority />
        </Link>
        <Link className="radar-store-back" href="/">Back to RADAR</Link>
      </header>

      <section className="radar-store-hero" aria-labelledby="radar-store-title">
        <div className="radar-store-hero__content">
          <p className="radar-store-eyebrow">RADARCHARTS BY REM</p>
          <h1 id="radar-store-title">RadarStore</h1>
          <p className="radar-store-hero__description">Strategic visibility, editorial support, and campaign pathways built for the next generation of music.</p>
          <div className="radar-store-hero__meta" aria-label="RadarStore focus areas">
            <span>Music discovery</span>
            <span>Artist intelligence</span>
            <span>Strategic growth</span>
          </div>
        </div>
      </section>

      <section className="radar-store-section" aria-labelledby="radar-store-services-title">
        <div className="radar-store-section-heading">
          <div>
            <p className="radar-store-eyebrow">THE STORE</p>
            <h2 id="radar-store-services-title">Put your work <span>on the radar.</span></h2>
          </div>
          <p>Select the services that fit your current objective and build your RADAR package.</p>
        </div>

        <div className="radar-store-service-grid">
          {catalog.map((service) => {
            const selected = selectedIds.has(service.id);
            return (
              <article className={`radar-store-service-card ${selected ? "is-selected" : ""}`} key={service.id}>
                <div>
                  <div className="radar-store-service-card__top">
                    <span>{service.category}</span>
                    {service.featured ? <span>Featured</span> : null}
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="radar-store-service-card__bottom">
                  <strong>{formatNaira(service.priceNgn)}</strong>
                  <button type="button" onClick={() => toggleService(service.id)} aria-pressed={selected}>
                    {selected ? "Added" : "+ Add"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="radar-store-selection" aria-labelledby="radar-store-selection-title">
        <div className="radar-store-selection__header">
          <div>
            <p className="radar-store-eyebrow">PACKAGE BUILDER</p>
            <h2 id="radar-store-selection-title">Build your package.</h2>
          </div>
          <span>{selectedServices.length} {selectedServices.length === 1 ? "service" : "services"}</span>
        </div>
        <div className="radar-store-selected" aria-live="polite">
          {selectedServices.length === 0 ? <p>Select services above to begin building your package.</p> : selectedServices.map((service) => <div key={service.id}><span>{service.name}</span><span>{formatNaira(service.priceNgn)}</span></div>)}
        </div>
        <div className="radar-store-selection__footer">
          <div><span>Total</span><strong>{formatNaira(total)}</strong></div>
          <div className="radar-store-actions">
            <button className="radar-store-primary" type="button" disabled={!selectedServices.length} title="Payment integration will be enabled after the server checkout endpoint is configured">Proceed to payment</button>
            <a className="radar-store-secondary" href={RADAR_STORE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Discuss my budget</a>
          </div>
        </div>
      </section>

      <section className="radar-store-section" aria-labelledby="radar-store-audience-title">
        <div className="radar-store-section-heading">
          <div><p className="radar-store-eyebrow">BUILT FOR</p><h2 id="radar-store-audience-title">Where you are.</h2></div>
          <p>RADARStore gives artists, projects, and creative teams access to strategic pathways across the RADARCharts ecosystem.</p>
        </div>
        <div className="radar-store-audience-grid">
          {[
            ["01", "Emerging Artists", "For artists seeking discovery, visibility, development, and audience growth."],
            ["02", "Music Professionals", "For teams and professionals building releases, campaigns, and stronger industry positioning."],
            ["03", "Brands & Projects", "For cultural projects seeking strategic music, media, and audience opportunities."],
          ].map(([number, title, body]) => <article className="radar-store-audience-card" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="radar-store-ratecard" aria-labelledby="radar-store-ratecard-title">
        <div><p className="radar-store-eyebrow">RADAR RATE CARD</p><h2 id="radar-store-ratecard-title">Need the full picture?</h2></div>
        <a href="https://radarcharts.net/ratecard" target="_blank" rel="noopener noreferrer">View rate card <span aria-hidden="true">→</span></a>
      </section>
    </main>
  );
}
