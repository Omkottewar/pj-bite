import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { createNimbusShipment } from "@/lib/nimbus";

/**
 * POST: Create shipment for an order (Admin Only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SUPERADMIN", "VENDOR"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const { orderId, weight = 500, length = 15, breadth = 12, height = 10 } = body;

    const order = await Order.findById(orderId).populate("products.productId", "name price");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // New API uses orderStatus
    if (order.orderStatus !== "Pending" && order.orderStatus !== "Confirmed" && order.orderStatus !== "Processing") {
      return NextResponse.json({ error: `Order is in ${order.orderStatus} state, cannot create shipment.` }, { status: 400 });
    }

    const result = await createNimbusShipment(order, { weight, length, breadth, height });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Nimbus Post shipment creation failed." }, { status: 502 });
    }

    // Save tracking info to order
    order.trackingId = result.awbNumber; // Legacy
    order.awbNumber = result.awbNumber;
    order.shipmentId = result.shipmentId;
    order.courierName = result.courierName;
    order.labelUrl = result.labelUrl;
    order.trackingUrl = result.trackingUrl;
    order.orderStatus = "Shipped";
    order.currentShipmentStatus = "Manifested";

    // Initialize Timeline
    order.statusTimeline.push({
      status: "Shipped",
      description: `Shipment created via ${result.courierName}. AWB: ${result.awbNumber}`,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      awbNumber: result.awbNumber,
      courierName: result.courierName,
      trackingUrl: result.trackingUrl,
    });
  } catch (error) {
    console.error("[NIMBUS_SHIPMENT_API_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
