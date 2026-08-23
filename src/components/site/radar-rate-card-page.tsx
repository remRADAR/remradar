import Image from "next/image";
import Link from "next/link";
import { FloatingDockFooter } from "@/components/site/floating-dock-footer";

const phases = [
  ["01", "Pre-Production", "Concept development, scriptwriting, storyboarding, talent, locations, and production planning."],
  ["02", "Production", "Cinematography, drone videography, live streaming, gimbal work, multi-camera setups, and capture."],
  ["03", "Post-Production", "Editing, colour grading, audio enhancement, 3D animation, captions, archiving, and delivery."],
];

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
        <p className="radar-route-eyebrow">RADAR RATE CARD</p>
        <h1>Ideas made tangible.</h1>
        <p className="radar-route-intro">Join us on a journey where ideas transform into captivating cultural products, with creativity and a whole lot of fun.</p>
      </section>
      <section className="radar-rate-card-grid" aria-label="Rate card production phases">
        {phases.map(([number, title, body]) => <article className="radar-rate-card" key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p><Link href="/contact">Discuss a project ↗</Link></article>)}
      </section>
      <section className="radar-rate-card-note"><p className="radar-route-eyebrow">THE NEXT FRAME</p><h2>Tell us what you want to make.</h2><Link href="/contact">Start a conversation ↗</Link></section>
      <FloatingDockFooter />
    </main>
  );
}
