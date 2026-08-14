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
    const secretKey = context.env.FLW_SECRET_KEY;

    if (!secretKey) {
      return jsonResponse(
        {
          status: "error",
          message: "Payment system is not configured."
        },
        500
      );
    }

    const body = await context.request.json();

    const serviceIds = Array.isArray(body.serviceIds)
      ? body.serviceIds
      : [];

    if (serviceIds.length === 0) {
      return jsonResponse(
        {
          status: "error",
          message: "No services were selected."
        },
        400
      );
    }

    /*
      SECURITY / INTEGRITY CHECK

      A service may only appear once in a
      payment request.
    */

    const uniqueServiceIds =
      new Set(serviceIds);

    if (
      uniqueServiceIds.size !==
      serviceIds.length
    ) {
      return jsonResponse(
        {
          status: "error",
          message:
            "Duplicate services are not allowed."
        },
        400
      );
    }

    /*
      SERVER-AUTHORITATIVE SERVICE LOOKUP

      Never trust prices supplied by
      the browser.
    */

    const services = serviceIds
      .map(
        (id) =>
          RADAR_SERVICES[id]
      )
      .filter(Boolean);

    if (
      services.length !==
      serviceIds.length
    ) {
      return jsonResponse(
        {
          status: "error",
          message:
            "One or more selected services are invalid."
        },
        400
      );
    }

    /*
      SERVER-AUTHORITATIVE TOTAL
    */

    const total = services.reduce(
      (sum, service) =>
        sum + service.price,
      0
    );

    const serviceNames = services
      .map(
        (service) =>
          service.name
      )
      .join(", ");

    /*
      TRANSACTION REFERENCE
    */

    const txRef =
      `RADARSTORE-${Date.now()}-${crypto.randomUUID()}`;

    /*
      CUSTOMER
    */

    const customerName =
      body.customer?.name ||
      "RADARStore Client";

    const customerEmail =
      body.customer?.email ||
      "payments@radarcharts.net";

    const customerPhone =
      body.customer?.phone ||
      "";

    /*
      FLUTTERWAVE CHECKOUT
    */

    const response =
      await fetch(
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
              "https://radarcharts.net/radarstore/payment-success.html",

            customer: {
              name:
                customerName,

              email:
                customerEmail,

              phonenumber:
                customerPhone
            },

            customizations: {
              title:
                "RADARStore - RADARCharts by REM",

              description:
                `RADARStore services: ${serviceNames}`
            },

            meta: {
              source:
                "RADARStore",

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

    /*
      FLUTTERWAVE RESPONSE VALIDATION
    */

    if (
      !response.ok ||
      result.status !==
        "success" ||
      !result.data?.link
    ) {
      console.error(
        "Flutterwave checkout error:",
        result
      );

      return jsonResponse(
        {
          status:
            "error",

          message:
            "Flutterwave could not create the payment."
        },
        502
      );
    }

    /*
      RETURN HOSTED CHECKOUT
    */

    return jsonResponse({
      status:
        "success",

      tx_ref:
        txRef,

      amount:
        total,

      currency:
        "NGN",

      payment_link:
        result.data.link
    });

  } catch (error) {

    console.error(
      "RADARStore payment error:",
      error
    );

    return jsonResponse(
      {
        status:
          "error",

        message:
          "Unable to start payment."
      },
      500
    );
  }
}


/*
  JSON RESPONSE HELPER
*/

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
          "application/json"
      }
    }
  );
}