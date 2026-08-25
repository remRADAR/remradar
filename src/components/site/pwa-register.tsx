"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js?v=4", { scope: "/", updateViaCache: "none" }).then((registration) => {
        void registration.update();
      }).catch(() => {
        // PWA support is progressive; the site remains fully usable without it.
      });
    };

    const requestIdleCallback = (window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
    }).requestIdleCallback;

    if (requestIdleCallback) {
      requestIdleCallback(register, { timeout: 2500 });
    } else {
      window.setTimeout(register, 1200);
    }
  }, []);

  return null;
}
