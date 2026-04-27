import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import {
  IndianRupee, ShoppingBag, TrendingUp, Package,
  ArrowUpRight, CheckCircle2,
} from "lucide-react";

export const revalidate = 0;

interface OrderDoc {
  _id: { toString(): string };
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  customerDetails: { name: string; email: string };
}

interface AggregateResult {
  _id: null;
  revenue: number;
  count: number;
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin?callbackUrl=/admin/dashboard");

  const user = session.user as { role: string; id: string };
  const isSuperAdmin = user.role === "SUPERADMIN";

  await dbConnect();

  const orderFilter = isSuperAdmin ? {} : { vendorId: user.id };
  const productFilter = isSuperAdmin ? {} : { vendorId: user.id };

  const [recentOrders, statsResult, productsCount] = await Promise.all([
    Order.find(orderFilter).sort({ createdAt: -1 }).limit(10).lean<OrderDoc[]>(),
    Order.aggregate<AggregateResult>([
      { $match: { ...orderFilter, paymentStatus: "PAID" } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]),
    Product.countDocuments(productFilter),
  ]);

  const totalRevenue = statsResult[0]?.revenue ?? 0;
  const totalSales = statsResult[0]?.count ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text tracking-tight font-serif">Overview</h1>
          <p className="text-brand-text-muted mt-1 font-medium">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-[#E8E6E1] rounded-xl shadow-sm text-sm font-bold text-brand-text flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            System Operational
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm relative overflow-hidden group hover:border-brand-primary hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-muted font-bold text-sm tracking-wide">Gross Revenue</h3>
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-text-muted group-hover:bg-brand-primary group-hover:text-brand-accent transition-colors">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-text tracking-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1 mt-2 text-sm font-semibold text-brand-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-brand-text-muted/70 font-medium">All time paid orders</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm relative overflow-hidden group hover:border-brand-accent hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-muted font-bold text-sm tracking-wide">Successful Orders</h3>
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-text-muted group-hover:bg-brand-accent group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-text tracking-tight">{totalSales}</p>
          <div className="flex items-center gap-1 mt-2 text-sm font-semibold text-brand-accent">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-brand-text-muted/70 font-medium">Total paid</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm relative overflow-hidden group hover:border-brand-primary-light hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-muted font-bold text-sm tracking-wide">Active Products</h3>
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-text-muted group-hover:bg-brand-primary-light group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-text tracking-tight">{productsCount}</p>
          <div className="flex items-center gap-1 mt-2 text-sm font-semibold text-brand-primary-light">
            <CheckCircle2 className="w-4 h-4" /> Operating Normally
          </div>
        </div>

        {/* Platform Status */}
        <div className="bg-gradient-to-br from-brand-primary-dark to-brand-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-brand-accent rounded-full blur-3xl opacity-30" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-white/80 font-bold text-sm tracking-wide">Platform Status</h3>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black tracking-tight text-white mb-2">Healthy</p>
            <p className="text-xs text-white/60 mt-2">
              {productsCount} products · {totalSales} completed orders
            </p>
          </div>
        </div>

      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E8E6E1] flex justify-between items-center bg-brand-bg/50">
          <h2 className="text-lg font-bold text-brand-text font-serif">Recent Transactions</h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-brand-text-muted/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No transactions yet</h3>
            <p className="text-brand-text-muted">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-bg border-b border-[#E8E6E1] text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {recentOrders.map((order) => {
                  const isPaid = order.paymentStatus === "PAID";
                  const isFailed = order.paymentStatus === "FAILED";
                  return (
                    <tr
                      key={order._id.toString()}
                      className="hover:bg-brand-bg/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-brand-text-muted bg-white px-2.5 py-1 rounded-md border border-[#E8E6E1] group-hover:border-brand-primary/20 transition-colors">
                          {order._id.toString().slice(-10).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-xs font-bold text-brand-text border border-[#E8E6E1]">
                            {order.customerDetails.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-text">
                              {order.customerDetails.name}
                            </p>
                            <p className="text-xs text-brand-text-muted font-medium">
                              {order.customerDetails.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-brand-text">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isPaid
                            ? "bg-[#1E5C2A]/10 text-[#1E5C2A] border-[#1E5C2A]/20"
                            : isFailed
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-[#C4951A]/10 text-[#C4951A] border-[#C4951A]/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPaid ? "bg-[#1E5C2A]" : isFailed ? "bg-red-500" : "bg-[#C4951A]"
                          }`} />
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-brand-text-muted font-medium whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}