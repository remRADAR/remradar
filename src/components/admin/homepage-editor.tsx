"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { HomepageComponentReplacement } from "@/lib/native-content";

type Props = {
  initialComponents: HomepageComponentReplacement[];
};

export function HomepageEditor({ initialComponents }: Props) {
  const [components, setComponents] = useState(initialComponents);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const dirty = useMemo(() => components.some((component, index) => component.updatedAt !== initialComponents[index]?.updatedAt), [components, initialComponents]);

  function update(componentKey: string, patch: Partial<HomepageComponentReplacement>) {
    setComponents((current) => current.map((component) => component.componentKey === componentKey ? { ...component, ...patch } : component));
  }

  async function save() {
    setStatus("Saving...");
    const response = await fetch("/api/homepage-components", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-native-admin-token": token },
      body: JSON.stringify({ components }),
    });
    setStatus(response.ok ? "Saved. Refresh the homepage to see the replacement." : (await response.json()).error ?? "Save failed");
  }

  return (
    <main className="radar-editor-shell">
      <header className="radar-editor-header">
        <div>
          <p className="radar-editor-eyebrow">RADARMATRIX / HOMEPAGE ENGINE</p>
          <h1>Component replacement channel</h1>
          <p>Inspect and edit the registered Framer image, video, and text slots without touching the authored layout.</p>
        </div>
        <Link href="/" className="radar-editor-back">View homepage</Link>
      </header>
      <section className="radar-editor-toolbar" aria-label="Editor controls">
        <label>Native admin token<input type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Enter NATIVE_ADMIN_TOKEN" /></label>
        <button type="button" onClick={save} disabled={!token || !dirty}>{status || "Save replacements"}</button>
      </section>
      <section className="radar-editor-grid" aria-label="Homepage components">
        {components.map((component) => (
          <article className="radar-editor-card" key={component.componentKey}>
            <div className="radar-editor-card-heading"><div><p>{component.componentKey}</p><h2>{component.label}</h2></div><span>{component.selector}</span></div>
            <div className="radar-editor-preview">
              {component.imageUrl ? (component.mediaType === "video" ? <video src={component.imageUrl} poster="/framer-site/_deps/images/aktiv-section-poster.jpg" muted loop autoPlay playsInline /> : <Image src={component.imageUrl} alt="" width={640} height={360} />) : <div>No replacement media configured</div>}
            </div>
            <div className="radar-editor-fields">
              <label>Text<textarea value={component.text} onChange={(event) => update(component.componentKey, { text: event.target.value })} /></label>
              <label>Image or video URL<input value={component.imageUrl} onChange={(event) => update(component.componentKey, { imageUrl: event.target.value })} /></label>
              <label>Fit<select value={component.imageFit} onChange={(event) => update(component.componentKey, { imageFit: event.target.value as HomepageComponentReplacement["imageFit"] })}><option value="cover">Cover</option><option value="contain">Contain</option></select></label>
              <label>Position<input value={component.imagePosition} onChange={(event) => update(component.componentKey, { imagePosition: event.target.value })} /></label>
              <label>Media<select value={component.mediaType} onChange={(event) => update(component.componentKey, { mediaType: event.target.value as HomepageComponentReplacement["mediaType"] })}><option value="image">Image</option><option value="video">Video</option></select></label>
              <label className="radar-editor-toggle"><input type="checkbox" checked={component.enabled} onChange={(event) => update(component.componentKey, { enabled: event.target.checked })} /> Enabled</label>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
