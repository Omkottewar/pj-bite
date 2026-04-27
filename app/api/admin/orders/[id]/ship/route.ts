import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { createNimbusShipment } from "@/lib/nimbus";

/**
 * POST /api/admin/orders/[id]/ship
 * 
 * Invoked by Admin to push an order to Nimbus Post API
 * and mark it as SHIPPED.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SUPERADMIN", "VENDOR"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const order = await Order.findById(id).populate("products");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.deliveryStatus === "CANCELLED" || order.cancellationRequested) {
      return NextResponse.json({ error: "Cannot ship a cancelled order." }, { status: 400 });
    }

    if (order.trackingId) {
      return NextResponse.json({ error: "Order already shipped. AWB: " + order.trackingId }, { status: 400 });
    }

    // Attempt to create shipment via Nimbus Post
    const shipResult = await createNimbusShipment({
      _id: order._id,
      customerDetails: order.customerDetails,
      products: order.products,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
    } as any);

    if (!shipResult.success) {
      return NextResponse.json({ error: shipResult.error || "Nimbus Api Error" }, { status: 502 });
    }

    // Success! Update Order Details
    order.trackingId = shipResult.awbNumber;
    if (shipResult.shipmentId) order.shipmentId = shipResult.shipmentId;
    
    order.deliveryStatus = "SHIPPED";
    await order.save();

    return NextResponse.json({
      success: true,
      awb: shipResult.awbNumber,
      message: "Order successfully pushed to Nimbus Post.",
    });

  } catch (error: any) {
    console.error("[NIMBUS_SHIPMENT_API]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
