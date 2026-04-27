import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from "next/link";
import { Search, ShoppingBag, TrendingUp, CheckCircle, Package } from "lucide-react";
import OrderSearch from "@/components/admin/orders/OrderSearch";

export const revalidate = 0;

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    import("next/navigation").then((nav) => nav.redirect("/api/auth/signin?callbackUrl=/admin/orders"));
    return null;
  }

  const role = (session.user as any).role;
  const isSuperAdmin = role === "SUPERADMIN";

  await dbConnect();

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <Package className="w-16 h-16 text-brand-text-muted/50 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-brand-text font-serif tracking-tight mb-2">Restricted Access</h2>
          <p className="text-brand-text-muted font-medium">Only Super Admins have global visibility over platform transactions.</p>
        </div>
      </div>
    );
  }

  let orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.paymentStatus === "PAID").length;

  const resolvedParams = await searchParams;
  const qStr = (resolvedParams?.q || "").toLowerCase().trim();

  if (qStr) {
     orders = orders.filter(o => {
        const id = o._id.toString().toLowerCase();
        const date = new Date(o.createdAt).toLocaleDateString().toLowerCase();
        const name = o.customerDetails.name.toLowerCase();
        const email = o.customerDetails.email.toLowerCase();
        const phone = o.customerDetails.phone.toLowerCase();
        
        return id.includes(qStr) || date.includes(qStr) || name.includes(qStr) || email.includes(qStr) || phone.includes(qStr);
     });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">Manage Orders</h1>
          <p className="text-brand-text-muted mt-1 font-medium">View transaction history and manage fulfillments.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <TrendingUp className="w-24 h-24 text-brand-primary" />
          </div>
          <p className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">Total Platform Revenue</p>
          <p className="text-3xl font-black text-brand-text">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <ShoppingBag className="w-24 h-24 text-brand-accent" />
          </div>
          <p className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">Total Orders</p>
          <p className="text-3xl font-black text-brand-text">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <CheckCircle className="w-24 h-24 text-green-600" />
          </div>
          <p className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-2">Delivered Safely</p>
          <p className="text-3xl font-black text-brand-text">{completedOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E8E6E1] flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-brand-bg/50">
          <h2 className="text-lg font-bold text-brand-text">Transaction History</h2>
          <OrderSearch />
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-brand-text-muted/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No orders found</h3>
            <p className="text-brand-text-muted">{qStr ? `No orders found matching "${qStr}".` : "No orders have been recorded yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#E8E6E1]/30">
                <tr className="border-b border-[#E8E6E1] text-[12px] uppercase tracking-wider font-bold text-brand-text-muted">
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1] text-sm">
                {orders.map((order: any) => (
                  <tr key={order._id.toString()} className="hover:bg-brand-bg/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-text font-mono">#{order._id.toString().substring(0, 8)}</p>
                      <p className="text-xs text-brand-text-muted font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-text">{order.customerDetails.name}</p>
                      <p className="text-xs text-brand-text-muted font-medium mt-0.5">{order.customerDetails.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border
                          ${order.paymentStatus === 'PAID' ? 'bg-[#1E5C2A]/10 text-[#1E5C2A] border-[#1E5C2A]/20' : 'bg-orange-50 text-orange-700 border-orange-200'}
                        `}>
                          {order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING'}
                        </span>
                        
                        <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border
                          ${order.deliveryStatus === 'DELIVERED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            order.deliveryStatus === 'SHIPPED' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                            order.deliveryStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#E8E6E1]/50 text-brand-text-muted border-[#E8E6E1]'}
                        `}>
                          {order.deliveryStatus || 'PROCESSING'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.products.slice(0, 3).map((p: any, i: number) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-brand-bg border-2 border-white flex items-center justify-center overflow-hidden shadow-sm shadow-black/5" title={p.name}>
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={p.image && p.image !== "undefined" ? p.image : "https://placehold.co/100x100/f8f9fa/a0a0a0?text=No+Image"} alt={p.name} className="w-full h-full object-cover" />
                           </div>
                        ))}
                        {order.products.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#E8E6E1] flex items-center justify-center text-xs font-bold text-brand-text-muted shadow-sm shadow-black/5 z-10 relative">
                            +{order.products.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-brand-text">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/orders/${order._id.toString()}`} 
                        className="inline-flex items-center px-4 py-2 bg-white border border-[#E8E6E1] text-brand-text text-xs font-bold rounded-lg shadow-sm hover:border-brand-primary hover:text-brand-primary transition-all"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
