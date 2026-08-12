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

let selectedServices = [];


/* ==========================================
   RADAR WHATSAPP
========================================== */

const RADAR_WHATSAPP_LINK =
  "https://wa.me/message/XSNQAJYPTVEEJ1";


/* ==========================================
   CURRENCY
========================================== */

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}


/* ==========================================
   TOTAL
========================================== */

function getSelectedTotal() {
  return selectedServices.reduce(
    (total, service) => total + service.price,
    0
  );
}


/* ==========================================
   DOM ELEMENTS
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


/* ==========================================
   OPEN RADAR WHATSAPP
========================================== */

function openRadarWhatsApp() {
  /*
    Use direct navigation instead of window.open().
    This is more reliable inside the GitHub Codespaces
    preview and on mobile browsers.
  */
  window.location.href = RADAR_WHATSAPP_LINK;
}


/* ==========================================
   RENDER SERVICES
========================================== */

function renderServices() {
  if (!serviceGrid) return;

  serviceGrid.innerHTML = "";

  radarServices.forEach((service) => {
    const card =
      document.createElement("article");

    card.className = "service-card";

    card.dataset.serviceId =
      service.id;

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
        >
          + Add
        </button>

      </div>
    `;

    serviceGrid.appendChild(card);
  });
}


/* ==========================================
   UPDATE SERVICE CARD
========================================== */

function updateServiceCard(serviceId) {
  const card =
    document.querySelector(
      `.service-card[data-service-id="${serviceId}"]`
    );

  if (!card) return;

  const button =
    card.querySelector(".service-select");

  if (!button) return;

  const isSelected =
    selectedServices.some(
      (service) =>
        service.id === serviceId
    );

  card.classList.toggle(
    "selected",
    isSelected
  );

  button.textContent =
    isSelected
      ? "✓ Added"
      : "+ Add";
}


/* ==========================================
   RENDER SELECTION
========================================== */

function renderSelection() {
  if (
    !selectedServicesContainer ||
    !selectionCount ||
    !selectionTotal
  ) {
    return;
  }

  const total =
    getSelectedTotal();

  selectionCount.textContent =
    `${selectedServices.length} ${
      selectedServices.length === 1
        ? "service"
        : "services"
    }`;

  selectionTotal.textContent =
    formatNaira(total);

  if (checkoutButton) {
    checkoutButton.disabled =
      selectedServices.length === 0;
  }

  if (
    selectedServices.length === 0
  ) {
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


/* ==========================================
   TOGGLE SERVICE
========================================== */

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
   SERVICE SELECTION CLICK
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
   PROCEED TO PAYMENT
========================================== */

if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    async () => {

      const total =
        getSelectedTotal();

      if (total <= 0) return;

      const selectedItems =
        selectedServices
          .map(
            (service) =>
              `• ${service.name} — ${formatNaira(
                service.price
              )}`
          )
          .join("\n");

      const message = `Hello RADARCharts by REM,

I'd like to proceed with the following RADARStore services:

${selectedItems}

Total package value: ${formatNaira(total)}

I'd like to discuss the next steps and payment process.

Thank you.`;

      try {
        await navigator.clipboard.writeText(
          message
        );
      } catch (error) {
        console.warn(
          "Could not copy RADARStore enquiry:",
          error
        );
      }

      /*
        PAYMENT INTEGRATION REMAINS
        FOR THE NEXT PHASE.
      */

      alert(
        `RADARStore checkout\n\nTotal: ${formatNaira(
          total
        )}\n\nPayment integration will be connected in the next phase.`
      );
    }
  );
}


/* ==========================================
   WHATSAPP CTA ACTIONS
========================================== */

document.addEventListener(
  "click",
  (event) => {

    const target =
      event.target.closest(
        "button, a"
      );

    if (!target) return;

    const text =
      target.textContent
        .trim()
        .toLowerCase();

    const isWhatsAppCTA =
      text.includes("discuss my budget") ||
      text.includes("talk to radar") ||
      text.includes("talk to radarcharts") ||
      text.includes("discuss budget") ||
      text.includes("get started");

    if (!isWhatsAppCTA) return;

    /*
      Do not intercept the rate-card link.
      Only handle actual RADAR communication CTAs.
    */

    event.preventDefault();
    event.stopPropagation();

    openRadarWhatsApp();
  }
);


/* ==========================================
   INITIALIZE
========================================== */

renderServices();

renderSelection();