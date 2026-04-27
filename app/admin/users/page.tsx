import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { Users, Search, Download } from "lucide-react";


import UsersClientTable from "@/app/admin/users/UsersClientTable";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;
  const role = (session.user as any).role;
  if (role !== "SUPERADMIN" && role !== "ADMIN") {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  await dbConnect();
  
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const allOrders = await Order.find({}, { "customerDetails.email": 1, totalAmount: 1 }).lean();

  const userStats = users.map(user => {
    const userOrders = allOrders.filter(o => o.customerDetails?.email === user.email);
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      ...user,
      _id: String((user as any)._id),
      ordersCount: userOrders.length,
      totalSpent
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">Customers & Users</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Manage all platform users, roles, and access.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-text-muted text-sm font-bold rounded-xl shadow-sm border border-[#E8E6E1] hover:text-brand-primary transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <UsersClientTable initialUsers={JSON.parse(JSON.stringify(userStats))} currentUserRole={role} />
    </div>
  );
}
