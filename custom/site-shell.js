/*
 * RADARCharts by REM
 * Site Shell
 *
 * Purpose:
 * - Provide a controlled global shell for custom RADAR pages.
 * - Keep navigation and shared behavior outside generated Framer HTML.
 * - Prepare the frontend for progressive page migration.
 *
 * This file intentionally has no WordPress dependency.
 * WordPress will become a content source later.
 */

(() => {
  "use strict";

  const CONFIG = Object.freeze({
    brand: "RADARCharts by REM",

    navigation: [
      {
        label: "Charts",
        href: "/charts"
      },
      {
        label: "On The Radar",
        href: "/ontheradar"
      },
      {
        label: "Magazine",
        href: "/magazine"
      },
      {
        label: "RADAR Music",
        href: "/radarmusic"
      },
      {
        label: "Spotlights",
        href: "/spotlights"
      },
      {
        label: "Motherland",
        href: "/motherland"
      },
      {
        label: "Platforms",
        href: "/platforms"
      },
      {
        label: "Playlists",
        href: "/playlists"
      }
    ],

    secondaryNavigation: [
      {
        label: "Store",
        href: "/store"
      },
      {
        label: "About",
        href: "/about"
      }
    ]
  });

  function normalizePath(pathname) {
    const path = pathname || "/";

    if (path === "/") {
      return "/";
    }

    return path.replace(/\/+$/, "");
  }

  function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (key === "class") {
        element.className = value;
        return;
      }

      if (key === "text") {
        element.textContent = value;
        return;
      }

      element.setAttribute(key, value);
    });

    children.forEach((child) => {
      if (child) {
        element.appendChild(child);
      }
    });

    return element;
  }

  function getCurrentPath() {
    return normalizePath(window.location.pathname);
  }

  function isActive(href) {
    return normalizePath(href) === getCurrentPath();
  }

  function createBrand() {
    return createElement(
      "a",
      {
        class: "radar-shell-brand",
        href: "/",
        "aria-label": CONFIG.brand
      },
      [
        createElement("span", {
          class: "radar-shell-brand-mark",
          "aria-hidden": "true",
          text: "R"
        }),
        createElement("span", {
          class: "radar-shell-brand-name",
          text: "RADAR"
        })
      ]
    );
  }

  function createNavigation(items) {
    const nav = createElement("nav", {
      class: "radar-shell-navigation",
      "aria-label": "Primary navigation"
    });

    items.forEach((item) => {
      const link = createElement(
        "a",
        {
          class: [
            "radar-shell-link",
            isActive(item.href)
              ? "is-active"
              : ""
          ]
            .filter(Boolean)
            .join(" "),
          href: item.href,
          ...(isActive(item.href)
            ? { "aria-current": "page" }
            : {})
        },
        [
          createElement("span", {
            text: item.label
          })
        ]
      );

      nav.appendChild(link);
    });

    return nav;
  }

  function createHeader() {
    const header = createElement("header", {
      class: "radar-shell-header"
    });

    const inner = createElement("div", {
      class: "radar-shell-header-inner"
    });

    const left = createElement("div", {
      class: "radar-shell-header-left"
    });

    const right = createElement("div", {
      class: "radar-shell-header-right"
    });

    const menuButton = createElement("button", {
      class: "radar-shell-menu-button",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "radar-shell-mobile-navigation",
      "aria-label": "Open navigation"
    });

    menuButton.appendChild(
      createElement("span", {
        class: "radar-shell-menu-icon",
        "aria-hidden": "true"
      })
    );

    left.appendChild(createBrand());
    left.appendChild(createNavigation(CONFIG.navigation));

    right.appendChild(
      createNavigation(CONFIG.secondaryNavigation)
    );

    right.appendChild(menuButton);

    inner.appendChild(left);
    inner.appendChild(right);
    header.appendChild(inner);

    return {
      header,
      menuButton
    };
  }

  function createMobileNavigation() {
    const wrapper = createElement("div", {
      id: "radar-shell-mobile-navigation",
      class: "radar-shell-mobile-navigation",
      hidden: true
    });

    const navigation = createNavigation([
      ...CONFIG.navigation,
      ...CONFIG.secondaryNavigation
    ]);

    wrapper.appendChild(navigation);

    return wrapper;
  }

  function createFooter() {
    const footer = createElement("footer", {
      class: "radar-shell-footer"
    });

    const inner = createElement("div", {
      class: "radar-shell-footer-inner"
    });

    const brand = createElement("div", {
      class: "radar-shell-footer-brand"
    });

    brand.appendChild(
      createElement("span", {
        class: "radar-shell-footer-title",
        text: "RADARCharts by REM"
      })
    );

    brand.appendChild(
      createElement("span", {
        class: "radar-shell-footer-note",
        text: "Music discovery. Culture. Intelligence."
      })
    );

    const links = createElement("nav", {
      class: "radar-shell-footer-links",
      "aria-label": "Footer navigation"
    });

    [
      ...CONFIG.secondaryNavigation,
      {
        label: "Home",
        href: "/"
      }
    ].forEach((item) => {
      links.appendChild(
        createElement(
          "a",
          {
            href: item.href,
            text: item.label
          }
        )
      );
    });

    const copyright = createElement("small", {
      class: "radar-shell-footer-copyright",
      text: `© ${new Date().getFullYear()} RADARCharts by REM`
    });

    inner.appendChild(brand);
    inner.appendChild(links);
    inner.appendChild(copyright);

    footer.appendChild(inner);

    return footer;
  }

  function injectStyles() {
    if (document.getElementById("radar-shell-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "radar-shell-styles";

    style.textContent = `
      :root {
        --radar-shell-black: #050505;
        --radar-shell-white: #ffffff;
        --radar-shell-muted: rgba(255, 255, 255, 0.62);
        --radar-shell-border: rgba(255, 255, 255, 0.14);
        --radar-shell-surface: rgba(255, 255, 255, 0.045);
        --radar-shell-max-width: 1440px;
      }

      .radar-shell-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        width: 100%;
        border-bottom: 1px solid var(--radar-shell-border);
        background: rgba(5, 5, 5, 0.82);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }

      .radar-shell-header-inner {
        width: min(
          calc(100% - 48px),
          var(--radar-shell-max-width)
        );
        min-height: 72px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
      }

      .radar-shell-header-left,
      .radar-shell-header-right {
        display: flex;
        align-items: center;
        gap: 28px;
        min-width: 0;
      }

      .radar-shell-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex: 0 0 auto;
        color: var(--radar-shell-white);
        text-decoration: none;
      }

      .radar-shell-brand-mark {
        width: 30px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--radar-shell-white);
        border-radius: 50%;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: -0.04em;
      }

      .radar-shell-brand-name {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.14em;
      }

      .radar-shell-navigation {
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .radar-shell-link {
        position: relative;
        display: inline-flex;
        align-items: center;
        min-height: 40px;
        color: var(--radar-shell-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-decoration: none;
        white-space: nowrap;
        transition:
          color 160ms ease,
          opacity 160ms ease;
      }

      .radar-shell-link:hover,
      .radar-shell-link.is-active {
        color: var(--radar-shell-white);
      }

      .radar-shell-link.is-active::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 3px;
        height: 1px;
        background: currentColor;
      }

      .radar-shell-menu-button {
        display: none;
        width: 42px;
        height: 42px;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 1px solid var(--radar-shell-border);
        border-radius: 50%;
        background: var(--radar-shell-surface);
        color: var(--radar-shell-white);
      }

      .radar-shell-menu-icon,
      .radar-shell-menu-icon::before,
      .radar-shell-menu-icon::after {
        width: 16px;
        height: 1px;
        display: block;
        background: currentColor;
        transition:
          transform 160ms ease,
          opacity 160ms ease;
      }

      .radar-shell-menu-icon {
        position: relative;
      }

      .radar-shell-menu-icon::before,
      .radar-shell-menu-icon::after {
        content: "";
        position: absolute;
        left: 0;
      }

      .radar-shell-menu-icon::before {
        top: -5px;
      }

      .radar-shell-menu-icon::after {
        top: 5px;
      }

      .radar-shell-mobile-navigation {
        width: min(
          calc(100% - 48px),
          var(--radar-shell-max-width)
        );
        margin: 0 auto;
        padding: 12px 0 24px;
      }

      .radar-shell-mobile-navigation[hidden] {
        display: none;
      }

      .radar-shell-mobile-navigation
        .radar-shell-navigation {
        display: grid;
        gap: 2px;
      }

      .radar-shell-mobile-navigation
        .radar-shell-link {
        min-height: 48px;
        padding: 0 8px;
        border-bottom: 1px solid var(--radar-shell-border);
      }

      .radar-shell-mobile-navigation
        .radar-shell-link.is-active::after {
        display: none;
      }

      .radar-shell-footer {
        margin-top: 96px;
        border-top: 1px solid var(--radar-shell-border);
        background: var(--radar-shell-black);
      }

      .radar-shell-footer-inner {
        width: min(
          calc(100% - 48px),
          var(--radar-shell-max-width)
        );
        margin: 0 auto;
        padding: 48px 0 32px;
        display: grid;
        grid-template-columns: 1.5fr 1fr auto;
        gap: 32px;
        align-items: end;
      }

      .radar-shell-footer-brand {
        display: grid;
        gap: 8px;
      }

      .radar-shell-footer-title {
        color: var(--radar-shell-white);
        font-size: 14px;
        font-weight: 800;
        letter-spacing: 0.04em;
      }

      .radar-shell-footer-note,
      .radar-shell-footer-copyright {
        color: var(--radar-shell-muted);
        font-size: 11px;
      }

      .radar-shell-footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 14px 20px;
      }

      .radar-shell-footer-links a {
        color: var(--radar-shell-muted);
        font-size: 11px;
        text-decoration: none;
      }

      .radar-shell-footer-links a:hover {
        color: var(--radar-shell-white);
      }

      @media (max-width: 1120px) {
        .radar-shell-header-left
          .radar-shell-navigation {
          display: none;
        }

        .radar-shell-menu-button {
          display: inline-flex;
        }
      }

      @media (max-width: 720px) {
        .radar-shell-header-inner {
          width: min(
            calc(100% - 32px),
            var(--radar-shell-max-width)
          );
          min-height: 64px;
        }

        .radar-shell-header-right
          > .radar-shell-navigation {
          display: none;
        }

        .radar-shell-footer-inner {
          width: min(
            calc(100% - 32px),
            var(--radar-shell-max-width)
          );
          grid-template-columns: 1fr;
          align-items: start;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .radar-shell-link,
        .radar-shell-menu-icon,
        .radar-shell-menu-icon::before,
        .radar-shell-menu-icon::after {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function mount() {
    if (!document.body) {
      return;
    }

    if (document.documentElement.dataset.radarShell === "mounted") {
      return;
    }

    document.documentElement.dataset.radarShell = "mounted";

    injectStyles();

    const headerData = createHeader();
    const mobileNavigation = createMobileNavigation();
    const footer = createFooter();

    document.body.prepend(
      headerData.header,
      mobileNavigation
    );

    document.body.appendChild(footer);

    headerData.menuButton.addEventListener(
      "click",
      () => {
        const isOpen =
          headerData.menuButton.getAttribute(
            "aria-expanded"
          ) === "true";

        const nextState = !isOpen;

        headerData.menuButton.setAttribute(
          "aria-expanded",
          String(nextState)
        );

        headerData.menuButton.setAttribute(
          "aria-label",
          nextState
            ? "Close navigation"
            : "Open navigation"
        );

        mobileNavigation.hidden = !nextState;
      }
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          headerData.menuButton.getAttribute(
            "aria-expanded"
          ) === "true"
        ) {
          headerData.menuButton.click();
        }
      }
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      mount,
      { once: true }
    );
  } else {
    mount();
  }
})();