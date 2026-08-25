import Image from "next/image";
import Link from "next/link";
import { FloatingDockFooter } from "@/components/site/floating-dock-footer";
import { ScrollReveal } from "@/components/site/scroll-reveal";

const playlistId = "0OTvZDRVlumuI34bsTDvmD";

const tracks = [
  ["01", "Trouble", "Keziah Mallam, Tim Lyre"],
  ["02", "EAZY", "Rhatti"],
  ["03", "JAIYE EVERYDAY", "KIING LU, DAPO TUBURNA, Alpha Ojini"],
  ["05", "E Aye", "Vherse"],
  ["06", "E Amnesia", "President Zik, Hotyce"],
  ["07", "E PARANOiD", "Icebeatzz, Venom, Fozter"],
  ["09", "E Cheffing", "AfroSelecta-BBK, ODUMODUBLVCK"],
  ["10", "E Old Ways", "Mannie Tseayo, ODUMODUBLVCK"],
] as const;

const archiveGroups = [
  { label: "Platform", links: [["Home", "/"], ["Charts", "/charts"], ["Platforms", "/platforms"], ["Playlists", "/playlists"], ["Store", "/store"]] },
  { label: "Discover", links: [["Articles", "/ontheradar"], ["Magazine", "/magazine"], ["Spotlights", "/spotlights"], ["RADARMusic", "/radarmusic"], ["Motherland", "/motherland"]] },
  { label: "Network", links: [["About", "/about"], ["Contact", "/about"], ["Editorial archive", "/ontheradar"]] },
] as const;

export function MotherlandPage() {
  return (
    <main className="motherland-page">
      <header className="motherland-page__header">
        <Link href="/" aria-label="RADARCharts by REM home" className="motherland-page__logo">
          <Image src="/radarcharts-logo-transparent.png" alt="RADARCharts by REM" width={180} height={120} priority />
        </Link>
        <span className="motherland-page__status">RADARCharts / 2025</span>
        <Link href="/" className="motherland-page__home">Home ↗</Link>
      </header>

      <ScrollReveal as="section" className="motherland-hero" aria-labelledby="motherland-title">
        <div className="motherland-hero__visual" aria-hidden="true">
          <Image src="/framer-site/_deps/images/radarmatrix-home-poster.jpg" alt="" fill priority sizes="(max-width: 700px) 100vw, 90vw" />
          <span className="motherland-hero__orb motherland-hero__orb--one" />
          <span className="motherland-hero__orb motherland-hero__orb--two" />
          <div className="motherland-hero__grid" />
        </div>
        <div className="motherland-hero__copy">
          <p className="motherland-kicker">A RADARCharts cultural sanctuary</p>
          <h1 id="motherland-title">The<br /><em>MOTHER</em>Land</h1>
          <p className="motherland-hero__edition">[ RADARCharts 2025 ]</p>
          <div className="motherland-hero__scroll" aria-hidden="true"><span /> Scroll to enter</div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="motherland-manifesto" aria-labelledby="motherland-manifesto-title">
        <div className="motherland-manifesto__index">01 / THE MOVEMENT</div>
        <div>
          <h2 id="motherland-manifesto-title">Born from the heart of RADARCharts.</h2>
          <p> The MOTHERLand is a vibrant creative sanctuary dedicated to uplifting, uniting, and unleashing the full potential of women in the entertainment industry. This is more than a platform — it is a movement that honours the resilience, brilliance, and influence of female artists, storytellers, visionaries, and culture-shapers.</p>
          <p>From the frontlines of music and media to the stages of innovation and leadership, The MOTHERLand exists to amplify her voice, celebrate her journey, and fuel her rise.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="motherland-playlist" aria-labelledby="motherland-playlist-title">
        <div className="motherland-playlist__heading">
          <p className="motherland-kicker">The soundtrack of the movement</p>
          <h2 id="motherland-playlist-title">Protect the music.<br /><span>Protect the fans.</span></h2>
          <p>Listen to the women, artists, and culture-shapers moving the signal forward.</p>
        </div>
        <div className="motherland-playlist__frame">
          <iframe title="The MOTHERLand playlist on Spotify" src={`https://open.spotify.com/embed/playlist/${playlistId}?theme=1`} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
        </div>
        <div className="motherland-tracklist" aria-label="Featured MOTHERLand tracks">
          {tracks.map(([number, title, artist]) => (
            <div className="motherland-track" key={number}>
              <span>{number}</span><strong>{title}</strong><small>{artist}</small><span aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="motherland-cta" aria-labelledby="motherland-cta-title">
        <div className="motherland-cta__poster"><Image src="/framer-site/_deps/images/radarmatrix-home-poster.jpg" alt="RADARCharts stadium and Statue of Liberty visual" fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
        <div className="motherland-cta__copy">
          <p className="motherland-kicker">Culture in motion</p>
          <h2 id="motherland-cta-title">Her voice<br /><em>moves next.</em></h2>
          <div className="motherland-cta__actions"><Link href="/charts">Explore charts ↗</Link><Link href="/ontheradar">Read articles ↗</Link></div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="motherland-network" aria-labelledby="motherland-network-title">
        <div><p className="motherland-kicker">02 / The network</p><h2 id="motherland-network-title">Stay close<br />to culture.</h2></div>
        <div className="motherland-network__groups">
          {archiveGroups.map((group) => <div key={group.label}><p>{group.label}</p>{group.links.map(([label, href]) => <Link key={href + label} href={href}>{label} <span>↗</span></Link>)}</div>)}
        </div>
      </ScrollReveal>

      <footer className="motherland-page__footer"><span>© 2026 RADARCharts. Built for culture in motion.</span><strong>The RADAR never sleeps.</strong></footer>
      <FloatingDockFooter />
    </main>
  );
}
