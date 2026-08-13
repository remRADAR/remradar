const radarServices = [
  {
    id: "page-post",
    name: "Page Post",
    category: "Visibility",
    description:
      "Strategic placement across RADARCharts editorial channels.",
    price: 50000,
    featured: true
  },
  {
    id: "artist-spotlight",
    name: "Artist Spotlight",
    category: "Editorial",
    description:
      "A dedicated editorial feature designed to introduce an artist to the RADAR audience.",
    price: 100000,
    featured: true
  },
  {
    id: "release-campaign",
    name: "Release Campaign",
    category: "Campaigns",
    description:
      "Strategic promotional support built around a music release.",
    price: 250000,
    featured: true
  },
  {
    id: "premium-campaign",
    name: "Premium Campaign",
    category: "Campaigns",
    description:
      "A larger-scale campaign pathway for artists, brands and projects.",
    price: 500000,
    featured: false
  }
];

/* ==========================================
   CONFIGURATION
========================================== */

const RADAR_WHATSAPP_URL =
  "https://wa.me/message/XSNQAJYPTVEEJ1";

let selectedServices = [];

/* ==========================================
   HELPERS
========================================== */

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function getSelectedTotal() {
  return selectedServices.reduce(
    (total, service) => total + service.price,
    0
  );
}

/* ==========================================
   DOM
========================================== */

const serviceGrid =
  document.getElementById("service-grid");

const selectedServicesContainer =
  document.getElementById("selected-services");

const selectionCount =
  document.getElementById("selection-count");

const selectionTotal =
  document.getElementById("selection-total");

const checkoutButton =
  document.getElementById("checkout-button");

const consultationButton =
  document.getElementById("consultation-button");

/* ==========================================
   SAFETY CHECK
========================================== */

if (
  !serviceGrid ||
  !selectedServicesContainer ||
  !selectionCount ||
  !selectionTotal ||
  !checkoutButton
) {
  console.error(
    "RADARStore: required page elements are missing."
  );
}

/* ==========================================
   SERVICES
========================================== */

function renderServices() {
  if (!serviceGrid) return;

  serviceGrid.innerHTML = "";

  radarServices.forEach((service) => {
    const card = document.createElement("article");

    card.className = "service-card";
    card.dataset.serviceId = service.id;

    card.innerHTML = `
      <div>
        <div class="service-card-top">

          <span class="service-card-category">
            ${service.category}
          </span>

          ${
            service.featured
              ? `
                <span class="service-card-category">
                  FEATURED
                </span>
              `
              : ""
          }

        </div>

        <h3>
          ${service.name}
        </h3>

        <p class="service-card-description">
          ${service.description}
        </p>
      </div>

      <div class="service-card-bottom">

        <strong class="service-price">
          ${formatNaira(service.price)}
        </strong>

        <button
          class="service-select"
          type="button"
          data-service-id="${service.id}"
          aria-label="Add ${service.name}"
        >
          + Add
        </button>

      </div>
    `;

    serviceGrid.appendChild(card);
  });
}

/* ==========================================
   SERVICE CARD STATE
========================================== */

function updateServiceCard(serviceId) {
  const card = document.querySelector(
    `.service-card[data-service-id="${serviceId}"]`
  );

  if (!card) return;

  const button =
    card.querySelector(".service-select");

  const isSelected =
    selectedServices.some(
      (service) => service.id === serviceId
    );

  card.classList.toggle(
    "selected",
    isSelected
  );

  if (button) {
    button.textContent =
      isSelected
        ? "✓ Added"
        : "+ Add";

    button.setAttribute(
      "aria-label",
      isSelected
        ? `Remove ${card.querySelector("h3")?.textContent.trim()}`
        : `Add ${card.querySelector("h3")?.textContent.trim()}`
    );
  }
}

/* ==========================================
   PACKAGE SELECTION
========================================== */

function renderSelection() {
  if (
    !selectedServicesContainer ||
    !selectionCount ||
    !selectionTotal ||
    !checkoutButton
  ) {
    return;
  }

  const total =
    getSelectedTotal();

  const count =
    selectedServices.length;

  selectionCount.textContent =
    `${count} ${
      count === 1
        ? "service"
        : "services"
    }`;

  selectionTotal.textContent =
    formatNaira(total);

  checkoutButton.disabled =
    count === 0;

  if (count === 0) {
    selectedServicesContainer.innerHTML = `
      <p class="empty-selection">
        Select services above to begin building your package.
      </p>
    `;

    return;
  }

  selectedServicesContainer.innerHTML =
    selectedServices
      .map(
        (service) => `
          <div class="selected-service">

            <span class="selected-service-name">
              ${service.name}
            </span>

            <span class="selected-service-price">
              ${formatNaira(service.price)}
            </span>

          </div>
        `
      )
      .join("");
}

function toggleService(serviceId) {
  const service =
    radarServices.find(
      (item) =>
        item.id === serviceId
    );

  if (!service) return;

  const existingIndex =
    selectedServices.findIndex(
      (item) =>
        item.id === serviceId
    );

  if (existingIndex >= 0) {
    selectedServices.splice(
      existingIndex,
      1
    );
  } else {
    selectedServices.push(service);
  }

  updateServiceCard(serviceId);
  renderSelection();
}

/* ==========================================
   SERVICE GRID EVENTS
========================================== */

if (serviceGrid) {
  serviceGrid.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          ".service-select"
        );

      if (!button) return;

      toggleService(
        button.dataset.serviceId
      );
    }
  );
}

/* ==========================================
   WHATSAPP
========================================== */

function openRadarWhatsApp() {
  window.open(
    RADAR_WHATSAPP_URL,
    "_blank",
    "noopener,noreferrer"
  );
}

if (consultationButton) {
  consultationButton.addEventListener(
    "click",
    () => {
      openRadarWhatsApp();
    }
  );
}

/* ==========================================
   PAYMENT PLACEHOLDER
========================================== */

if (checkoutButton) {
  checkoutButton.addEventListener(
    "click",
    () => {
      const total =
        getSelectedTotal();

      if (total <= 0) return;

      /*
        PAYMENT INTEGRATION PLACEHOLDER

        The live payment provider will be
        connected here later.

        For now, deliberately do not
        redirect or pretend payment exists.
      */

      console.info(
        "RADARStore payment integration pending.",
        {
          services: selectedServices,
          total: total
        }
      );

      alert(
        "Payment integration will be attached here."
      );
    }
  );
}

/* ==========================================
   INITIALISE
========================================== */

renderServices();
renderSelection();