/*
 * RADARCharts by REM
 * Visual Refinement Layer
 *
 * PURPOSE
 * - Preserve the existing Framer page structure.
 * - Add RADAR's global dark-silver visual treatment.
 * - Establish responsive visual variables.
 * - Provide the welcome animation once per browser session.
 *
 * IMPORTANT
 * - This file does NOT rebuild Framer pages.
 * - This file does NOT connect to WordPress.
 * - This file does NOT modify RADARStore/payment logic.
 * - The welcome video is optional and fails open if unavailable.
 */

(() => {
  "use strict";

  const CONFIG = {
    welcomeVideo: "/assets/remRADAR.mp4",
    welcomeSessionKey: "radarcharts:welcome-seen:v1",
    transitionDuration: 700
  };

  /*
   * ==========================================
   * REDUCED MOTION
   * ==========================================
   */

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    );
  }

  /*
   * ==========================================
   * GLOBAL VISUAL SYSTEM
   * ==========================================
   */

  function injectStyles() {
    if (
      document.getElementById(
        "radar-visual-layer-styles"
      )
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id =
      "radar-visual-layer-styles";

    style.textContent = `
      :root {

        /* RADAR graphite / silver palette */

        --radar-black:
          #030405;

        --radar-graphite:
          #080a0c;

        --radar-charcoal:
          #101316;

        --radar-silver:
          #c9ced3;

        --radar-white:
          #f4f5f6;


        /* Responsive layout system */

        --radar-page-gutter:
          clamp(
            18px,
            3.5vw,
            64px
          );

        --radar-content-width:
          1440px;

        --radar-section-spacing:
          clamp(
            64px,
            8vw,
            144px
          );


        /* Surface system */

        --radar-surface:
          rgba(
            255,
            255,
            255,
            0.035
          );

        --radar-surface-strong:
          rgba(
            255,
            255,
            255,
            0.055
          );

        --radar-border:
          rgba(
            255,
            255,
            255,
            0.11
          );
      }


      /*
       * ======================================
       * BASE PAGE
       * ======================================
       */

      html {
        background:
          var(--radar-black);
      }


      body {

        background:
          radial-gradient(
            75% 55%
            at 50% -10%,
            rgba(
              255,
              255,
              255,
              0.075
            ) 0%,
            rgba(
              200,
              205,
              210,
              0.035
            ) 28%,
            transparent 68%
          ),

          radial-gradient(
            65% 50%
            at 85% 35%,
            rgba(
              190,
              198,
              205,
              0.035
            ) 0%,
            transparent 70%
          ),

          linear-gradient(
            145deg,
            #030405 0%,
            #080a0c 35%,
            #111417 62%,
            #070809 100%
          );

        background-attachment:
          fixed;

        color:
          var(--radar-white);
      }


      /*
       * ======================================
       * GLOBAL BACKGROUND ATMOSPHERE
       * ======================================
       */

      .radar-visual-background {

        position:
          fixed;

        inset:
          0;

        z-index:
          -1;

        pointer-events:
          none;

        overflow:
          hidden;

        background:
          radial-gradient(
            55% 42%
            at 50% 0%,
            rgba(
              255,
              255,
              255,
              0.035
            ),
            transparent 72%
          );
      }


      .radar-visual-background::before {

        content:
          "";

        position:
          absolute;

        inset:
          -20%;

        background:
          radial-gradient(
            ellipse
            at 50% 15%,
            rgba(
              210,
              215,
              220,
              0.035
            ),
            transparent 48%
          );

        filter:
          blur(30px);
      }


      .radar-visual-background::after {

        content:
          "";

        position:
          absolute;

        inset:
          -25%;

        background:
          linear-gradient(
            115deg,
            transparent 25%,
            rgba(
              255,
              255,
              255,
              0.012
            ) 48%,
            transparent 68%
          );

        transform:
          rotate(-6deg);
      }


      /*
       * ======================================
       * WELCOME EXPERIENCE
       * ======================================
       */

      .radar-welcome {

        position:
          fixed;

        inset:
          0;

        z-index:
          2147483000;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        overflow:
          hidden;

        background:
          #020303;

        opacity:
          1;

        visibility:
          visible;

        transition:
          opacity
          ${CONFIG.transitionDuration}ms
          cubic-bezier(
            0.22,
            1,
            0.36,
            1
          );
      }


      .radar-welcome.is-leaving {

        opacity:
          0;

        visibility:
          hidden;

        pointer-events:
          none;
      }


      .radar-welcome-video {

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

        object-position:
          center;

        background:
          #020303;
      }


      /*
       * Desktop:
       * preserve the portrait composition
       * rather than stretching it.
       */

      @media (min-width: 810px) {

        .radar-welcome-video {

          width:
            100vw;

          height:
            100vh;

          object-fit:
            contain;
        }
      }


      /*
       * Mobile:
       * native portrait format is ideal.
       */

      @media (max-width: 809px) {

        .radar-welcome-video {

          width:
            100%;

          height:
            100%;

          object-fit:
            cover;
        }
      }


      /*
       * INTRO SCRIM
       */

      .radar-welcome-scrim {

        position:
          absolute;

        inset:
          0;

        pointer-events:
          none;

        background:
          radial-gradient(
            75% 75%
            at 50% 50%,
            transparent 42%,
            rgba(
              0,
              0,
              0,
              0.20
            ) 100%
          );
      }


      /*
       * SKIP BUTTON
       */

      .radar-welcome-skip {

        position:
          absolute;

        right:
          max(
            18px,
            env(
              safe-area-inset-right
            )
          );

        bottom:
          max(
            18px,
            env(
              safe-area-inset-bottom
            )
          );

        padding:
          10px 15px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            0.25
          );

        border-radius:
          999px;

        background:
          rgba(
            5,
            6,
            7,
            0.48
          );

        color:
          rgba(
            255,
            255,
            255,
            0.86
          );

        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;

        font-size:
          11px;

        font-weight:
          500;

        line-height:
          1;

        letter-spacing:
          0.08em;

        text-transform:
          uppercase;

        cursor:
          pointer;

        backdrop-filter:
          blur(12px);

        -webkit-backdrop-filter:
          blur(12px);
      }


      .radar-welcome-skip:hover {

        background:
          rgba(
            255,
            255,
            255,
            0.10
          );

        border-color:
          rgba(
            255,
            255,
            255,
            0.40
          );
      }


      .radar-welcome-skip:focus-visible {

        outline:
          2px solid
          rgba(
            255,
            255,
            255,
            0.85
          );

        outline-offset:
          3px;
      }


      /*
       * Prevent page scrolling while intro is active.
       */

      body.radar-welcome-active {

        overflow:
          hidden;
      }


      /*
       * ======================================
       * MOBILE RESPONSIVE VARIABLES
       * ======================================
       */

      @media (max-width: 809px) {

        :root {

          --radar-page-gutter:
            clamp(
              16px,
              5vw,
              28px
            );

          --radar-section-spacing:
            clamp(
              56px,
              13vw,
              96px
            );
        }
      }


      /*
       * ======================================
       * REDUCED MOTION
       * ======================================
       */

      @media (prefers-reduced-motion: reduce) {

        .radar-welcome {

          transition:
            none;
        }

        .radar-welcome-skip {

          display:
            none;
        }
      }
    `;

    document.head.appendChild(style);
  }


  /*
   * ==========================================
   * BACKGROUND LAYER
   * ==========================================
   */

  function createBackgroundLayer() {

    if (
      document.querySelector(
        ".radar-visual-background"
      )
    ) {
      return;
    }

    const background =
      document.createElement(
        "div"
      );

    background.className =
      "radar-visual-background";

    background.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.prepend(
      background
    );
  }


  /*
   * ==========================================
   * SESSION STATE
   * ==========================================
   */

  function hasSeenWelcome() {

    try {

      return (
        window.sessionStorage.getItem(
          CONFIG.welcomeSessionKey
        ) === "1"
      );

    } catch (error) {

      return false;
    }
  }


  function markWelcomeSeen() {

    try {

      window.sessionStorage.setItem(
        CONFIG.welcomeSessionKey,
        "1"
      );

    } catch (error) {

      /*
       * Some privacy configurations
       * can block sessionStorage.
       *
       * The site must remain usable.
       */
    }
  }


  /*
   * ==========================================
   * REMOVE INTRO
   * ==========================================
   */

  function removeWelcome(
    overlay
  ) {

    if (!overlay) {
      return;
    }

    if (
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
      () => {

        if (
          overlay.parentNode
        ) {

          overlay.parentNode.removeChild(
            overlay
          );
        }

      },
      CONFIG.transitionDuration + 50
    );
  }


  /*
   * ==========================================
   * WELCOME INTRO
   * ==========================================
   */

  function createWelcome() {

    /*
     * Once per browser session.
     */

    if (
      hasSeenWelcome()
    ) {

      return;
    }


    /*
     * Respect accessibility settings.
     */

    if (
      prefersReducedMotion()
    ) {

      markWelcomeSeen();

      return;
    }


    const overlay =
      document.createElement(
        "div"
      );

    overlay.className =
      "radar-welcome";

    overlay.setAttribute(
      "role",
      "dialog"
    );

    overlay.setAttribute(
      "aria-label",
      "RADARCharts welcome"
    );


    /*
     * Video
     */

    const video =
      document.createElement(
        "video"
      );

    video.className =
      "radar-welcome-video";

    video.src =
      CONFIG.welcomeVideo;

    video.autoplay =
      true;

    video.muted =
      true;

    video.playsInline =
      true;

    video.preload =
      "auto";

    video.setAttribute(
      "aria-hidden",
      "true"
    );


    /*
     * Scrim
     */

    const scrim =
      document.createElement(
        "div"
      );

    scrim.className =
      "radar-welcome-scrim";

    scrim.setAttribute(
      "aria-hidden",
      "true"
    );


    /*
     * Skip
     */

    const skip =
      document.createElement(
        "button"
      );

    skip.className =
      "radar-welcome-skip";

    skip.type =
      "button";

    skip.textContent =
      "Skip intro";

    skip.addEventListener(
      "click",
      () => {

        markWelcomeSeen();

        removeWelcome(
          overlay
        );
      }
    );


    /*
     * Assemble
     */

    overlay.appendChild(
      video
    );

    overlay.appendChild(
      scrim
    );

    overlay.appendChild(
      skip
    );

    document.body.appendChild(
      overlay
    );

    document.body.classList.add(
      "radar-welcome-active"
    );


    /*
     * If the video cannot load,
     * fail open rather than trapping
     * the visitor behind the intro.
     */

    const fallbackTimer =
      window.setTimeout(
        () => {

          if (
            video.readyState < 2
          ) {

            markWelcomeSeen();

            removeWelcome(
              overlay
            );
          }

        },
        5000
      );


    /*
     * Video successfully starts.
     */

    video.addEventListener(
      "playing",
      () => {

        window.clearTimeout(
          fallbackTimer
        );

        markWelcomeSeen();

      },
      {
        once: true
      }
    );


    /*
     * Natural completion.
     */

    video.addEventListener(
      "ended",
      () => {

        removeWelcome(
          overlay
        );

      },
      {
        once: true
      }
    );


    /*
     * Loading error.
     */

    video.addEventListener(
      "error",
      () => {

        window.clearTimeout(
          fallbackTimer
        );

        markWelcomeSeen();

        removeWelcome(
          overlay
        );

      },
      {
        once: true
      }
    );


    /*
     * Explicit autoplay attempt.
     */

    video
      .play()
      .catch(
        () => {

          window.clearTimeout(
            fallbackTimer
          );

          markWelcomeSeen();

          removeWelcome(
            overlay
          );

        }
      );
  }


  /*
   * ==========================================
   * INITIALISE
   * ==========================================
   */

  function init() {

    injectStyles();

    createBackgroundLayer();

    createWelcome();
  }


  /*
   * ==========================================
   * SAFE START
   * ==========================================
   */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();
  }

})();