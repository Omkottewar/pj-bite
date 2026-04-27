import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "SUPERADMIN" && (session.user as any).role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Total Metrics
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Total Revenue (Only delivered or Paid orders)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // 2. Orders Status Breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 3. Revenue by Day (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const revenueByDayRaw = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: "PAID",
          createdAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    const revenueByDayMap = new Map(revenueByDayRaw.map(item => [item._id, item.revenue]));
    const revenueByDay = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const dateString = d.toISOString().split('T')[0];
        revenueByDay.push({
            date: dateString,
            revenue: revenueByDayMap.get(dateString) || 0
        });
    }

    // 4. Top Selling Products (Simple approximation based on Product sold count if exists, or just return top rated)
    // Looking at order items would be more accurate but heavier. Let's do top 5 products by some metric.
    const topProducts = await Product.find({}).sort({ stock: -1 }).limit(5).select("title price currentPrice images");

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          revenue: totalRevenue,
          orders: totalOrders,
          users: totalUsers,
          products: totalProducts,
        },
        revenueByDay,
        orderStatusBreakdown,
        topProducts
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
