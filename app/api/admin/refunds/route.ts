import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

/**
 * GET /api/admin/refunds
 * Returns all orders with cancellation requests or refund statuses.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SUPERADMIN", "VENDOR"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {
      $or: [
        { cancellationRequested: true },
        { refundStatus: { $in: ["PENDING", "PROCESSED", "FAILED"] } },
        { deliveryStatus: { $in: ["CANCELLED", "RETURN_REQUESTED", "RETURNED"] } },
      ],
    };

    if (status === "pending") query.refundStatus = "PENDING";
    if (status === "processed") query.refundStatus = "PROCESSED";
    if (status === "cancelled") query.deliveryStatus = "CANCELLED";

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ cancellationRequestedAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[ADMIN_REFUNDS_LIST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
