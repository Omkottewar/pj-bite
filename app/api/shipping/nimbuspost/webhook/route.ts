import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

/**
 * NIMBUSPOST WEBHOOK ENDPOINT
 * POST /api/shipping/nimbuspost/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("[NIMBUS_WEBHOOK_RECEIVED]", JSON.stringify(payload, null, 2));

    const { awb_number, status, history, shipment_id } = payload;

    if (!awb_number) {
      return NextResponse.json({ error: "No AWB number provided" }, { status: 400 });
    }

    await dbConnect();

    // Find order by AWB or Shipment ID
    const order = await Order.findOne({
      $or: [{ awbNumber: awb_number }, { shipmentId: shipment_id }]
    });

    if (!order) {
      console.warn(`[NIMBUS_WEBHOOK] Order not found for AWB: ${awb_number}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.currentShipmentStatus;
    const previousOrderStatus = order.orderStatus;

    // Map Statuses
    let newOrderStatus = order.orderStatus;
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes("delivered")) {
      newOrderStatus = "Delivered";
    } else if (lowerStatus.includes("out for delivery")) {
      newOrderStatus = "OutForDelivery";
    } else if (lowerStatus.includes("transit") || lowerStatus.includes("pickup done")) {
      newOrderStatus = "Shipped";
    } else if (lowerStatus.includes("manifest") || lowerStatus.includes("scheduled")) {
      newOrderStatus = "Processing";
    } else if (lowerStatus.includes("rto")) {
      newOrderStatus = "RTO";
    } else if (lowerStatus.includes("cancel")) {
      newOrderStatus = "Cancelled";
    }

    // Idempotency: Check if this status/timestamp is already recorded
    const timestamp = payload.timestamp || new Date();
    const isDuplicate = order.statusTimeline.some(t => 
      t.status === status && 
      Math.abs(new Date(t.timestamp).getTime() - new Date(timestamp).getTime()) < 5000
    );

    if (isDuplicate) {
      return NextResponse.json({ success: true, message: "Duplicate status ignored" });
    }

    // Update Order
    order.currentShipmentStatus = status;
    order.orderStatus = newOrderStatus as any;
    
    order.statusTimeline.push({
      status: status,
      description: payload.message || `Status updated to ${status}`,
      timestamp: new Date(timestamp),
      location: payload.location || ""
    });

    await order.save();

    // Trigger Notifications on Status Change
    if (newOrderStatus !== previousOrderStatus) {
      await triggerStatusEmail(order, newOrderStatus);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NIMBUS_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function triggerStatusEmail(order: any, status: string) {
  const customerEmail = order.customerDetails.email;
  const orderId = order._id.toString().substring(0, 8).toUpperCase();
  
  let subject = "";
  let message = "";

  switch (status) {
    case "Shipped":
      subject = `Your Order #${orderId} is on its way!`;
      message = `Great news! Your package has been picked up and is in transit. Tracking AWB: ${order.awbNumber}`;
      break;
    case "OutForDelivery":
      subject = `Order #${orderId} is Out for Delivery`;
      message = `Your treats are arriving today! Our courier partner is on their way to your address.`;
      break;
    case "Delivered":
      subject = `Delivered: Your Order #${orderId}`;
      message = `Hope you enjoy your fresh dry fruits! Your order has been marked as delivered.`;
      break;
    case "RTO":
      subject = `Undelivered: Order #${orderId}`;
      message = `We noticed a delivery issue. Your order is being returned to our warehouse. Please contact support.`;
      break;
    default:
      return; // No email for intermediate statuses
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #27ae60;">${subject}</h2>
      <p>Hi ${order.customerDetails.name},</p>
      <p>${message}</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> #${order._id}</p>
        <p><strong>Courier:</strong> ${order.courierName || "NimbusPost"}</p>
        <p><strong>AWB:</strong> ${order.awbNumber}</p>
      </div>
      <a href="https://pjbite.com/dashboard" style="display: inline-block; padding: 12px 25px; background: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Order Live</a>
      <p style="margin-top: 30px; font-size: 12px; color: #888;">If you have any questions, reply to this email or call us.</p>
    </div>
  `;

  await sendOrderEmail({ to: customerEmail, subject, html });
}
