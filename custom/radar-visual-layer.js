/*
 * RADARCharts by REM — Visual Refinement Layer
 *
 * This layer enhances the existing Framer export.
 * It does NOT rebuild the Framer page.
 * It does NOT modify RADARStore/payment logic.
 */

(() => {
  "use strict";

  const CONFIG = Object.freeze({
    welcomeVideo: "/assets/remRADAR.mp4",
    welcomeSessionKey: "radarcharts:welcome-seen:v3",
    transitionDuration: 720,
    fallbackDelay: 9000
  });

  const reducedMotion = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function injectStyles() {
    if (document.getElementById("radar-visual-layer-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "radar-visual-layer-styles";

    style.textContent = `
      :root {
        color-scheme: dark;

        --radar-black: #020304;
        --radar-graphite-1: #07090b;
        --radar-graphite-2: #0d1114;
        --radar-graphite-3: #171c21;
        --radar-silver: #c8cdd2;
        --radar-white: #f4f5f6;

        --radar-page-gutter:
          clamp(16px, 3.2vw, 64px);

        --radar-content-width:
          min(
            1440px,
            calc(100vw - (2 * var(--radar-page-gutter)))
          );

        --radar-section-spacing:
          clamp(56px, 8vw, 144px);

        --radar-radius:
          clamp(18px, 2vw, 28px);
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      html {
        min-width: 320px;
        min-height: 100%;
        background: var(--radar-black);
        overflow-x: clip;
      }

      body {
        min-width: 320px;
        min-height: 100vh;
        min-height: 100svh;
        margin: 0;
        overflow-x: clip;

        color: var(--radar-white);

        background:
          radial-gradient(
            90% 58% at 50% -14%,
            rgba(235, 240, 244, 0.12) 0%,
            rgba(190, 198, 205, 0.065) 24%,
            rgba(120, 130, 140, 0.025) 45%,
            transparent 72%
          ),
          radial-gradient(
            58% 48% at 92% 30%,
            rgba(190, 198, 205, 0.055) 0%,
            transparent 72%
          ),
          radial-gradient(
            54% 44% at 8% 76%,
            rgba(160, 170, 180, 0.035) 0%,
            transparent 74%
          ),
          linear-gradient(
            132deg,
            #020304 0%,
            #080b0e 28%,
            #111519 52%,
            #080b0e 74%,
            #020304 100%
          );
      }

      /*
       * Subtle metallic light sweep.
       * Kept intentionally restrained so the
       * background does not compete with content.
       */

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;

        background:
          linear-gradient(
            112deg,
            transparent 0%,
            transparent 39%,
            rgba(255, 255, 255, 0.018) 47%,
            rgba(255, 255, 255, 0.032) 50%,
            rgba(255, 255, 255, 0.010) 54%,
            transparent 63%,
            transparent 100%
          );

        opacity: 0.72;
      }

      img,
      video,
      canvas,
      svg {
        max-width: 100%;
      }

      .radar-visual-background {
        position: fixed;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        overflow: hidden;

        background:
          radial-gradient(
            46% 36% at 50% 0%,
            rgba(255, 255, 255, 0.045),
            transparent 72%
          );
      }

      .radar-visual-background::before {
        content: "";
        position: absolute;
        inset: -18%;

        background:
          radial-gradient(
            ellipse at 50% 16%,
            rgba(215, 220, 225, 0.045),
            transparent 46%
          );

        filter: blur(34px);
      }

      .radar-visual-background::after {
        content: "";
        position: absolute;
        inset: -28%;

        background:
          linear-gradient(
            116deg,
            transparent 28%,
            rgba(255, 255, 255, 0.014) 49%,
            transparent 67%
          );

        transform: rotate(-6deg);
      }

      /*
       * Optional utility classes.
       * These do not alter Framer structure.
       */

      .radar-content-width {
        width: min(
          100%,
          var(--radar-content-width)
        );

        margin-inline: auto;
        padding-inline: var(--radar-page-gutter);
      }

      .radar-section-spacing {
        padding-block: var(--radar-section-spacing);
      }

      /*
       * Welcome animation.
       */

      .radar-welcome {
        position: fixed;
        inset: 0;
        z-index: 2147483000;

        display: grid;
        place-items: center;

        overflow: hidden;
        isolation: isolate;

        background: #020303;

        opacity: 1;
        visibility: visible;

        transition:
          opacity ${CONFIG.transitionDuration}ms
            cubic-bezier(0.22, 1, 0.36, 1),
          visibility ${CONFIG.transitionDuration}ms step-end;
      }

      .radar-welcome.is-leaving {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }

      .radar-welcome-video {
        display: block;

        width: 100vw;
        height: 100svh;

        /*
         * The supplied asset is portrait.
         * Cover is intentional on phones so the
         * welcome experience fills the viewport.
         */

        object-fit: cover;
        object-position: center center;

        background: #020303;
      }

      .radar-welcome-scrim {
        position: absolute;
        inset: 0;
        pointer-events: none;

        background:
          radial-gradient(
            76% 78% at 50% 50%,
            transparent 42%,
            rgba(0, 0, 0, 0.22) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.06),
            transparent 22%,
            transparent 78%,
            rgba(0, 0, 0, 0.18)
          );
      }

      .radar-welcome-skip {
        position: absolute;

        right:
          max(
            18px,
            env(safe-area-inset-right)
          );

        bottom:
          max(
            18px,
            env(safe-area-inset-bottom)
          );

        min-height: 38px;
        padding: 10px 15px;

        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 999px;

        background: rgba(5, 6, 7, 0.48);

        color: rgba(255, 255, 255, 0.88);

        font:
          500 11px/1
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;

        letter-spacing: 0.08em;
        text-transform: uppercase;

        cursor: pointer;

        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .radar-welcome-skip:hover {
        background: rgba(255, 255, 255, 0.10);
        border-color: rgba(255, 255, 255, 0.40);
      }

      .radar-welcome-skip:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.85);
        outline-offset: 3px;
      }

      body.radar-welcome-active {
        overflow: hidden;
      }

      /*
       * On larger screens, preserve the portrait
       * composition instead of aggressively cropping it.
       */

      @media (min-width: 600px) {
        .radar-welcome-video {
          object-fit: contain;
        }
      }

      @media (min-width: 810px) {
        :root {
          --radar-page-gutter:
            clamp(28px, 3.5vw, 64px);
        }
      }

      @media (max-width: 809px) {
        :root {
          --radar-page-gutter:
            clamp(16px, 5vw, 28px);

          --radar-section-spacing:
            clamp(52px, 12vw, 96px);
        }

        .radar-welcome-skip {
          right:
            max(
              14px,
              env(safe-area-inset-right)
            );

          bottom:
            max(
              14px,
              env(safe-area-inset-bottom)
            );
        }
      }

      @media (max-width: 380px) {
        .radar-welcome-skip {
          min-height: 36px;
          padding-inline: 13px;
          font-size: 10px;
        }
      }

      /*
       * Accessibility:
       * reduced-motion users skip the cinematic
       * introduction completely.
       */

      @media (prefers-reduced-motion: reduce) {
        .radar-welcome {
          transition: none;
        }

        .radar-welcome-skip {
          display: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createBackgroundLayer() {
    if (
      document.querySelector(
        ".radar-visual-background"
      )
    ) {
      return;
    }

    const background =
      document.createElement("div");

    background.className =
      "radar-visual-background";

    background.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.prepend(background);
  }

  function getSessionValue(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function setSessionValue(key, value) {
    try {
      window.sessionStorage.setItem(
        key,
        value
      );
    } catch (_) {
      /*
       * Fail open if storage is unavailable.
       */
    }
  }

  function hasSeenWelcome() {
    return (
      getSessionValue(
        CONFIG.welcomeSessionKey
      ) === "1"
    );
  }

  function markWelcomeSeen() {
    setSessionValue(
      CONFIG.welcomeSessionKey,
      "1"
    );
  }

  function removeWelcome(overlay) {
    if (
      !overlay ||
      overlay.classList.contains(
        "is-leaving"
      )
    ) {
      return;
    }

    document.body.classList.remove(
      "radar-welcome-active"
    );

    overlay.classList.add(
      "is-leaving"
    );

    window.setTimeout(
      () => overlay.remove(),
      CONFIG.transitionDuration + 60
    );
  }

  function createWelcome() {
    /*
     * Once per browser session.
     */

    if (hasSeenWelcome()) {
      return;
    }

    /*
     * Accessibility.
     */

    if (reducedMotion()) {
      markWelcomeSeen();
      return;
    }

    const overlay =
      document.createElement("div");

    overlay.className =
      "radar-welcome";

    overlay.setAttribute(
      "role",
      "dialog"
    );

    overlay.setAttribute(
      "aria-modal",
      "true"
    );

    overlay.setAttribute(
      "aria-label",
      "RADARCharts welcome"
    );

    const video =
      document.createElement("video");

    video.className =
      "radar-welcome-video";

    video.src =
      CONFIG.welcomeVideo;

    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.setAttribute(
      "aria-hidden",
      "true"
    );

    const scrim =
      document.createElement("div");

    scrim.className =
      "radar-welcome-scrim";

    scrim.setAttribute(
      "aria-hidden",
      "true"
    );

    const skip =
      document.createElement("button");

    skip.className =
      "radar-welcome-skip";

    skip.type = "button";
    skip.textContent = "Skip intro";

    skip.addEventListener(
      "click",
      () => {
        markWelcomeSeen();
        removeWelcome(overlay);
      }
    );

    overlay.append(
      video,
      scrim,
      skip
    );

    document.body.appendChild(
      overlay
    );

    document.body.classList.add(
      "radar-welcome-active"
    );

    /*
     * Fails safely if the asset cannot load
     * or autoplay is unavailable.
     */

    let fallbackTimer =
      window.setTimeout(
        () => {
          markWelcomeSeen();
          removeWelcome(overlay);
        },
        CONFIG.fallbackDelay
      );

    const clearFallback = () => {
      if (fallbackTimer) {
        window.clearTimeout(
          fallbackTimer
        );

        fallbackTimer = 0;
      }
    };

    video.addEventListener(
      "playing",
      () => {
        clearFallback();
        markWelcomeSeen();
      },
      { once: true }
    );

    video.addEventListener(
      "ended",
      () => {
        clearFallback();
        removeWelcome(overlay);
      },
      { once: true }
    );

    video.addEventListener(
      "error",
      () => {
        clearFallback();
        markWelcomeSeen();
        removeWelcome(overlay);
      },
      { once: true }
    );

    video
      .play()
      .catch(() => {
        clearFallback();
        markWelcomeSeen();
        removeWelcome(overlay);
      });
  }

  function init() {
    injectStyles();
    createBackgroundLayer();
    createWelcome();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();