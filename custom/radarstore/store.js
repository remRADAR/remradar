const radarServices = [
  {
    id: "page-post",
    name: "Page Post",
    category: "Visibility",
    description: "Strategic placement across RADARCharts editorial channels.",
    price: 50000,
    featured: true
  },
  {
    id: "artist-spotlight",
    name: "Artist Spotlight",
    category: "Editorial",
    description: "A dedicated editorial feature designed to introduce an artist to the RADAR audience.",
    price: 100000,
    featured: true
  },
  {
    id: "release-campaign",
    name: "Release Campaign",
    category: "Campaigns",
    description: "Strategic promotional support built around a music release.",
    price: 250000,
    featured: true
  },
  {
    id: "premium-campaign",
    name: "Premium Campaign",
    category: "Campaigns",
    description: "A larger-scale campaign pathway for artists, brands and projects.",
    price: 500000,
    featured: false
  }
];

let selectedServices = [];

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function getSelectedTotal() {
  return selectedServices.reduce((total, service) => {
    return total + service.price;
  }, 0);
}

const serviceGrid = document.getElementById("service-grid");
const selectedServicesContainer = document.getElementById("selected-services");
const selectionCount = document.getElementById("selection-count");
const selectionTotal = document.getElementById("selection-total");
const checkoutButton = document.getElementById("checkout-button");

function renderServices() {
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
              ? `<span class="service-card-category">FEATURED</span>`
              : ""
          }
        </div>

        <h3>${service.name}</h3>

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

function updateServiceCard(serviceId) {
  const card = document.querySelector(
    `.service-card[data-service-id="${serviceId}"]`
  );

  if (!card) return;

  const button = card.querySelector(".service-select");

  const isSelected = selectedServices.some(
    (service) => service.id === serviceId
  );

  card.classList.toggle("selected", isSelected);

  button.textContent = isSelected ? "✓ Added" : "+ Add";
}

function renderSelection() {
  const total = getSelectedTotal();

  selectionCount.textContent =
    `${selectedServices.length} ${
      selectedServices.length === 1 ? "service" : "services"
    }`;

  selectionTotal.textContent = formatNaira(total);

  checkoutButton.disabled = selectedServices.length === 0;

  if (selectedServices.length === 0) {
    selectedServicesContainer.innerHTML = `
      <p class="empty-selection">
        Select services above to begin building your package.
      </p>
    `;

    return;
  }

  selectedServicesContainer.innerHTML = selectedServices
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
  const service = radarServices.find(
    (item) => item.id === serviceId
  );

  if (!service) return;

  const existingIndex = selectedServices.findIndex(
    (item) => item.id === serviceId
  );

  if (existingIndex >= 0) {
    selectedServices.splice(existingIndex, 1);
  } else {
    selectedServices.push(service);
  }

  updateServiceCard(serviceId);
  renderSelection();
}

serviceGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".service-select");

  if (!button) return;

  toggleService(button.dataset.serviceId);
});

checkoutButton.addEventListener("click", () => {
  const total = getSelectedTotal();

  if (total <= 0) return;

  alert(
    `RADARStore checkout\n\nTotal: ${formatNaira(total)}\n\nPayment integration will be connected in the next phase.`
  );
});

renderServices();
renderSelection();