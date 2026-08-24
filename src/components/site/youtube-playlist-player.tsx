"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type YouTubePlayer = { playVideo: () => void; pauseVideo: () => void; destroy: () => void };
type YouTubeApi = { Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayer; PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; CUED: number } };

declare global { interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void } }

const PLAYLIST_ID = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID;
const PAUSE_RESET_MS = 3 * 60 * 1000;
const STORAGE_KEY = "remradar:playlist-player";

type PersistedState = { played: boolean; pausedAt: number | null; playing: boolean };

function readState(): PersistedState {
  if (typeof window === "undefined") return { played: false, pausedAt: null, playing: false };
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") || { played: false, pausedAt: null, playing: false }; } catch { return { played: false, pausedAt: null, playing: false }; }
}

function writeState(state: PersistedState) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage is optional. */ }
}

export function YouTubePlaylistPlayer({ mode = "secondary" }: { mode?: "homepage" | "secondary" }) {
  const pathname = usePathname();
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [state, setState] = useState<PersistedState>({ played: false, pausedAt: null, playing: false });
  const [apiReady, setApiReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [resetExpired, setResetExpired] = useState(false);

  useEffect(() => { setState(readState()); }, []);

  const isHomepage = mode === "homepage";
  const isSecondaryOnHomepage = mode === "secondary" && pathname === "/";

  useEffect(() => {
    if (isSecondaryOnHomepage || !PLAYLIST_ID || typeof window === "undefined") return;
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (window.YT) { setApiReady(true); return; }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); setApiReady(true); };
    if (!existing) { const script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api"; script.async = true; document.head.appendChild(script); }
    return () => { window.onYouTubeIframeAPIReady = previous; };
  }, [isSecondaryOnHomepage]);

  useEffect(() => {
    if (isSecondaryOnHomepage || !apiReady || !PLAYLIST_ID || !mountRef.current || playerRef.current) return;
    playerRef.current = new window.YT!.Player(mountRef.current, {
      width: "100%", height: "100%", playerVars: { listType: "playlist", list: PLAYLIST_ID, playsinline: 1, controls: 0, rel: 0, loop: 1, enablejsapi: 1, origin: window.location.origin },
      events: {
        onStateChange: (event: { data: number }) => {
          const next = readState();
          if (event.data === window.YT?.PlayerState.PLAYING) { const updated = { played: true, pausedAt: null, playing: true }; setState(updated); setResetExpired(false); writeState(updated); setOpen(true); }
          if (event.data === window.YT?.PlayerState.PAUSED) { const updated = { played: true, pausedAt: Date.now(), playing: false }; setState(updated); setResetExpired(false); writeState(updated); }
          if (event.data === window.YT?.PlayerState.ENDED) { const updated = { ...next, played: true, pausedAt: null, playing: false }; setState(updated); writeState(updated); }
        },
      },
    });
    return () => { playerRef.current?.destroy(); playerRef.current = null; };
  }, [apiReady, isSecondaryOnHomepage]);

  useEffect(() => {
    if (isSecondaryOnHomepage) return;
    const timer = window.setInterval(() => {
      const current = readState();
      if (current.pausedAt && Date.now() - current.pausedAt >= PAUSE_RESET_MS) {
        const reset = { played: false, pausedAt: null, playing: false };
        writeState(reset); setState(reset); setResetExpired(true); setOpen(false);
        if (pathname !== "/") playerRef.current?.pauseVideo();
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [pathname, isSecondaryOnHomepage]);

  if (!PLAYLIST_ID || isSecondaryOnHomepage) return null;
  const visible = isHomepage || (pathname !== "/" && state.played && !resetExpired);

  function togglePlayback() {
    if (!playerRef.current) return;
    if (state.playing) playerRef.current.pauseVideo(); else playerRef.current.playVideo();
  }

  if (!visible) return null;
  return (
    <aside className={`radar-playlist-player radar-playlist-player--${mode}${open ? " is-open" : ""}`} aria-label="RADAR playlist player">
      <div className="radar-playlist-player__frame" aria-hidden={!open}><div ref={mountRef} /></div>
      <div className="radar-playlist-player__bar">
        <span className="radar-playlist-player__label">Top10 RADARCharts</span>
        <div className="radar-playlist-player__actions">
          <button type="button" onClick={togglePlayback} aria-label={state.playing ? "Pause RADAR playlist" : "Play RADAR playlist"} title={state.playing ? "Pause" : "Play"}>{state.playing ? "Ⅱ" : "▶"}</button>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Minimize RADAR playlist" : "Open RADAR playlist"}>{open ? "⌄" : "⌃"}</button>
        </div>
      </div>
    </aside>
  );
}
