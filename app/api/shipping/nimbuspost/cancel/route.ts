import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { cancelNimbusShipment } from "@/lib/nimbus";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SUPERADMIN", "VENDOR"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.awbNumber) {
      return NextResponse.json({ error: "No active shipment found for this order" }, { status: 400 });
    }

    const result = await cancelNimbusShipment(order.awbNumber);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "NimbusPost cancellation failed." }, { status: 502 });
    }

    order.orderStatus = "Cancelled";
    order.currentShipmentStatus = "Cancelled";
    order.statusTimeline.push({
      status: "Cancelled",
      description: "Shipment cancelled by admin",
      timestamp: new Date()
    });

    await order.save();

    return NextResponse.json({ success: true, message: "Shipment cancelled successfully" });
  } catch (error) {
    console.error("[NIMBUS_CANCEL_API_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
