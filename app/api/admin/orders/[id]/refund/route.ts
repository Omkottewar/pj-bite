import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

/**
 * POST /api/admin/orders/[id]/refund
 * Admin manually triggers a Razorpay refund for a specific order.
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
    const { amount, note } = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.razorpayPaymentId) {
      return NextResponse.json({ error: "No payment ID found for this order." }, { status: 400 });
    }

    if (["REFUNDED", "PARTIALLY_REFUNDED"].includes(order.paymentStatus)) {
      return NextResponse.json({ error: "This order is already refunded." }, { status: 400 });
    }

    const refundAmount = amount ?? order.totalAmount;

    const key = process.env.RAZORPAY_KEY_ID!;
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

    const razorRes = await fetch(
      `https://api.razorpay.com/v1/payments/${order.razorpayPaymentId}/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          amount: Math.round(refundAmount * 100),
          speed: "normal",
          notes: { reason: note || "Admin initiated refund" },
        }),
      }
    );

    const razorData = await razorRes.json();

    if (!razorRes.ok) {
      return NextResponse.json(
        { error: razorData?.error?.description || "Razorpay refund failed." },
        { status: 502 }
      );
    }

    // Update order
    order.refundStatus = "PROCESSED";
    order.razorpayRefundId = razorData.id;
    order.refundAmount = refundAmount;
    order.refundProcessedAt = new Date();
    order.refundNote = note || "Refunded by admin";
    order.paymentStatus = refundAmount >= order.totalAmount ? "REFUNDED" : "PARTIALLY_REFUNDED";
    await order.save();

    return NextResponse.json({
      success: true,
      refundId: razorData.id,
      refundAmount,
      message: "Refund processed successfully.",
    });
  } catch (error) {
    console.error("[ADMIN_REFUND]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
