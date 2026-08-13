export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const {
      amount,
      services,
      customer
    } = body;

    /* ==========================================
       VALIDATION
    ========================================== */

    if (!amount || Number(amount) <= 0) {
      return jsonResponse(
        {
          status: "error",
          message: "Invalid payment amount."
        },
        400
      );
    }

    if (
      !Array.isArray(services) ||
      services.length === 0
    ) {
      return jsonResponse(
        {
          status: "error",
          message: "No RADARStore services selected."
        },
        400
      );
    }

    /* ==========================================
       SECURITY
       The Flutterwave secret key NEVER goes
       into the browser.
    ========================================== */

    const secretKey =
      context.env.FLW_SECRET_KEY;

    if (!secretKey) {
      console.error(
        "RADARStore: FLW_SECRET_KEY is missing."
      );

      return jsonResponse(
        {
          status: "error",
          message:
            "Payment system is not configured."
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
      customer?.name ||
      "RADARStore Client";

    const customerEmail =
      customer?.email ||
      "payments@radarcharts.net";

    const customerPhone =
      customer?.phone ||
      "";

    /* ==========================================
       RADARSTORE SERVICE SUMMARY
    ========================================== */

    const serviceNames =
      services
        .map(
          (service) =>
            service.name
        )
        .join(", ");

    /* ==========================================
       FLUTTERWAVE PAYMENT REQUEST
    ========================================== */

    const flutterwaveResponse =
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

            amount:
              Number(amount),

            currency:
              "NGN",

            redirect_url:
              "https://radarcharts.net/radarstore/payment-success",

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
                "RADARStore — RADARCharts by REM",

              description:
                `RADARStore services: ${serviceNames}`,

              logo:
                "https://radarcharts.net/favicon.ico"
            },

            meta: {
              source:
                "RADARStore",

              services:
                serviceNames,

              amount:
                Number(amount)
            }
          })
        }
      );

    const result =
      await flutterwaveResponse.json();

    /* ==========================================
       FLUTTERWAVE ERROR
    ========================================== */

    if (
      !flutterwaveResponse.ok ||
      result.status !== "success" ||
      !result.data?.link
    ) {
      console.error(
        "Flutterwave payment creation failed:",
        result
      );

      return jsonResponse(
        {
          status: "error",
          message:
            "Unable to create Flutterwave checkout."
        },
        502
      );
    }

    /* ==========================================
       SUCCESS
    ========================================== */

    return jsonResponse({
      status:
        "success",

      tx_ref:
        txRef,

      payment_link:
        result.data.link
    });

  } catch (error) {

    console.error(
      "RADARStore payment server error:",
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

/* ==========================================
   JSON RESPONSE HELPER
========================================== */

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