const RADAR_SERVICES = {
  "page-post": {
    name: "Page Post",
    price: 50000
  },

  "artist-spotlight": {
    name: "Artist Spotlight",
    price: 100000
  },

  "release-campaign": {
    name: "Release Campaign",
    price: 250000
  },

  "premium-campaign": {
    name: "Premium Campaign",
    price: 500000
  }
};

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const serviceIds = Array.isArray(body.serviceIds)
      ? body.serviceIds
      : [];

    if (serviceIds.length === 0) {
      return jsonResponse(
        {
          status: "error",
          message: "No RADARStore services selected."
        },
        400
      );
    }

    /* ==========================================
       SERVER-SIDE PRICE CALCULATION
    ========================================== */

    const services = [];

    for (const serviceId of serviceIds) {
      const service = RADAR_SERVICES[serviceId];

      if (!service) {
        return jsonResponse(
          {
            status: "error",
            message: `Invalid RADARStore service: ${serviceId}`
          },
          400
        );
      }

      services.push({
        id: serviceId,
        name: service.name,
        price: service.price
      });
    }

    const total = services.reduce(
      (sum, service) => sum + service.price,
      0
    );

    if (total <= 0) {
      return jsonResponse(
        {
          status: "error",
          message: "Invalid payment amount."
        },
        400
      );
    }

    /* ==========================================
       FLUTTERWAVE SECRET
    ========================================== */

    const secretKey =
      context.env.FLW_SECRET_KEY;

    if (!secretKey) {
      console.error(
        "RADARStore: FLW_SECRET_KEY is not configured."
      );

      return jsonResponse(
        {
          status: "error",
          message: "Payment system is not configured."
        },
        500
      );
    }

    /* ==========================================
       TRANSACTION REFERENCE
    ========================================== */

    const txRef =
      `RADARSTORE-${Date.now()}-${crypto.randomUUID()}`;

    /* ==========================================
       CUSTOMER
    ========================================== */

    const customerName =
      body.customer?.name ||
      "RADARStore Client";

    const customerEmail =
      body.customer?.email ||
      "payments@radarcharts.net";

    const customerPhone =
      body.customer?.phone ||
      "";

    /* ==========================================
       SERVICE SUMMARY
    ========================================== */

    const serviceNames = services
      .map((service) => service.name)
      .join(", ");

    /* ==========================================
       FLUTTERWAVE CHECKOUT
    ========================================== */

    const response = await fetch(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${secretKey}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          tx_ref: txRef,

          amount: total,

          currency: "NGN",

          redirect_url:
            "https://radarcharts.net/radarstore/payment-success",

          customer: {
            name: customerName,
            email: customerEmail,
            phonenumber: customerPhone
          },

          customizations: {
            title:
              "RADARStore — RADARCharts by REM",

            description:
              `RADARStore services: ${serviceNames}`
          },

          meta: {
            source: "RADARStore",

            service_ids:
              serviceIds.join(","),

            services:
              serviceNames,

            amount:
              total
          }
        })
      }
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      result.status !== "success" ||
      !result.data?.link
    ) {
      console.error(
        "Flutterwave checkout error:",
        result
      );

      return jsonResponse(
        {
          status: "error",
          message:
            "Flutterwave could not create the payment."
        },
        502
      );
    }

    return jsonResponse({
      status: "success",
      tx_ref: txRef,
      amount: total,
      currency: "NGN",
      payment_link: result.data.link
    });

  } catch (error) {
    console.error(
      "RADARStore payment error:",
      error
    );

    return jsonResponse(
      {
        status: "error",
        message:
          "Unable to start payment."
      },
      500
    );
  }
}

function jsonResponse(
  data,
  status = 200
) {
  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        "Content-Type":
          "application/json",

        "Cache-Control":
          "no-store"
      }
    }
  );
}