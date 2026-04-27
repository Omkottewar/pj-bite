import { IOrder } from "@/models/Order";

/**
 * NimbusPost New API Integration (2024 Unified flow)
 * Documentation: https://services.nimbuspost.com/api/swagger
 */

const NIMBUS_API_BASE = "https://api.nimbuspost.com/v1";

interface NimbusTokenResponse {
  status: boolean;
  data: string; // The JWT Token
  message?: string;
}

interface NimbusShipmentResponse {
  status: boolean;
  data?: {
    order_id: string;      // Internal shipment ID
    awb_number: string;    // Tracking number
    courier_id: string;
    courier_name: string;
    label: string;         // PDF label URL
    tracking_url: string;  // Direct tracking link
  };
  message?: string;
}

/**
 * Get JWT Token from NimbusPost
 * Cached in memory for the duration of the serverless function execution
 */
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getNimbusToken(): Promise<string> {
  const email = process.env.NIMBUS_EMAIL;
  const password = process.env.NIMBUS_PASSWORD;

  if (!email || !password) {
    throw new Error("NIMBUS_EMAIL and NIMBUS_PASSWORD must be defined in .env");
  }

  // Use cached token if valid (5-minute buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const res = await fetch(`${NIMBUS_API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: NimbusTokenResponse = await res.json();
  
  if (!data.status || !data.data) {
    throw new Error(`NimbusPost Auth Failed: ${data.message || "Unknown error"}`);
  }

  cachedToken = data.data;
  tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Assume 24h validity
  return cachedToken;
}

/**
 * Create a new shipment in NimbusPost
 */
export async function createNimbusShipment(order: IOrder, dimensions = { weight: 500, length: 15, breadth: 12, height: 10 }) {
  try {
    const token = await getNimbusToken();

    const payload = {
      order_number: order._id.toString(),
      shipping_charges: 0,
      discount: order.discountApplied || 0,
      cod_charges: 0,
      payment_type: order.paymentMethod === "COD" ? "cod" : "prepaid",
      order_amount: order.totalAmount,
      package_weight: dimensions.weight,
      package_length: dimensions.length,
      package_breadth: dimensions.breadth,
      package_height: dimensions.height,
      consignee: {
        name: order.customerDetails.name,
        address: order.customerDetails.address,
        city: order.customerDetails.city || "Wardha",
        state: order.customerDetails.state || "Maharashtra",
        zipcode: order.customerDetails.pincode || "442001",
        phone: order.customerDetails.phone,
      },
      pickup: {
        warehouse_name: process.env.WAREHOUSE_NAME || "Pranit Nagpure",
      },
      products: order.products.map((p: any) => ({
        name: p.name,
        qty: p.quantity,
        unit_price: p.price,
      })),
    };

    const res = await fetch(`${NIMBUS_API_BASE}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: NimbusShipmentResponse = await res.json();
    console.log("[NIMBUS_API_RESPONSE]", JSON.stringify(data));

    if (!data.status || !data.data) {
      const errorMessage = data.message || "Shipment creation failed";
      console.error("[NIMBUS_SHIPMENT_FAILED]", errorMessage, "Payload:", JSON.stringify(payload));
      return { success: false, error: errorMessage };
    }

    return {
      success: true,
      awbNumber: data.data.awb_number,
      shipmentId: data.data.order_id,
      courierName: data.data.courier_name,
      labelUrl: data.data.label,
      trackingUrl: data.data.tracking_url,
    };
  } catch (error: any) {
    console.error("[NIMBUS_CREATE_ERROR]", error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel a shipment in NimbusPost
 */
export async function cancelNimbusShipment(awbNumber: string) {
  try {
    const token = await getNimbusToken();

    const res = await fetch(`${NIMBUS_API_BASE}/shipments/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ awb_number: awbNumber }),
    });

    const data = await res.json();
    return { success: data.status, message: data.message };
  } catch (error: any) {
    console.error("[NIMBUS_CANCEL_ERROR]", error);
    return { success: false, error: error.message };
  }
}
