"use client";

import { useEffect } from "react";

type Rgb = readonly [number, number, number];

type SkyState = {
  top: Rgb;
  horizon: Rgb;
  glow: Rgb;
  haze: number;
  stars: number;
  exposure: number;
};

const states: Record<"night" | "morning" | "afternoon" | "dusk", SkyState> = {
  night: { top: [8, 12, 27], horizon: [33, 37, 58], glow: [110, 88, 116], haze: 0.18, stars: 0.32, exposure: 0.74 },
  morning: { top: [17, 35, 57], horizon: [142, 125, 120], glow: [225, 170, 128], haze: 0.34, stars: 0.02, exposure: 0.9 },
  afternoon: { top: [26, 47, 61], horizon: [178, 139, 111], glow: [235, 162, 111], haze: 0.27, stars: 0, exposure: 0.96 },
  dusk: { top: [31, 23, 47], horizon: [135, 83, 82], glow: [218, 127, 89], haze: 0.3, stars: 0.16, exposure: 0.82 },
};

const stops = [
  { hour: 0, state: "night" as const },
  { hour: 5.5, state: "night" as const },
  { hour: 8, state: "morning" as const },
  { hour: 15, state: "afternoon" as const },
  { hour: 19, state: "dusk" as const },
  { hour: 22, state: "night" as const },
  { hour: 24, state: "night" as const },
];

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * amount),
    Math.round(a[1] + (b[1] - a[1]) * amount),
    Math.round(a[2] + (b[2] - a[2]) * amount),
  ];
}

function smoothstep(amount: number) {
  return amount * amount * (3 - 2 * amount);
}

function getSkyState(hour: number) {
  const current = stops.find((stop, index) => hour >= stop.hour && hour <= (stops[index + 1]?.hour ?? 24)) ?? stops[0];
  const next = stops[stops.indexOf(current) + 1] ?? stops[0];
  const span = Math.max(next.hour - current.hour, 0.01);
  const amount = smoothstep(Math.min(1, Math.max(0, (hour - current.hour) / span)));
  const from = states[current.state];
  const to = states[next.state];
  return {
    top: mix(from.top, to.top, amount),
    horizon: mix(from.horizon, to.horizon, amount),
    glow: mix(from.glow, to.glow, amount),
    haze: from.haze + (to.haze - from.haze) * amount,
    stars: from.stars + (to.stars - from.stars) * amount,
    exposure: from.exposure + (to.exposure - from.exposure) * amount,
    phase: current.state,
  };
}

function rgb(color: Rgb) {
  return color.join(", ");
}

export function TimeOfDayBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60;
      const sky = getSkyState(hour);
      root.style.setProperty("--radar-sky-top", rgb(sky.top));
      root.style.setProperty("--radar-sky-horizon", rgb(sky.horizon));
      root.style.setProperty("--radar-sky-glow", rgb(sky.glow));
      root.style.setProperty("--radar-atmosphere-haze", sky.haze.toFixed(3));
      root.style.setProperty("--radar-atmosphere-stars", sky.stars.toFixed(3));
      root.style.setProperty("--radar-atmosphere-exposure", sky.exposure.toFixed(3));
      root.dataset.radarPhase = sky.phase;
    };

    apply();
    const interval = window.setInterval(apply, reducedMotion.matches ? 300_000 : 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return <div className="radar-atmosphere" aria-hidden="true"><span className="radar-atmosphere__grain" /></div>;
}
