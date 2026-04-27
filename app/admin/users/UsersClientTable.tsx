"use client";



import { useState } from "react";
import { Search, ShieldAlert, Shield, ShieldCheck, MoreVertical, Ban, CheckCircle } from "lucide-react";
import { showToast, showConfirm } from "@/lib/swal";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked?: boolean;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function UsersClientTable({ initialUsers, currentUserRole }: { initialUsers: UserType[], currentUserRole: string }) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdate = async (userId: string, updates: { role?: string, isBlocked?: boolean }) => {
    // If blocking/unblocking, ask for confirmation
    if (updates.isBlocked !== undefined) {
      const action = updates.isBlocked ? "Block" : "Unblock";
      const confirmed = await showConfirm(`${action} User?`, `Are you sure you want to ${action.toLowerCase()} this user?`);
      if (!confirmed) return;
    }

    setLoadingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setUsers(users.map(u => u._id === userId ? { ...u, ...updates } : u));
      showToast("User updated successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update user", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E6E1] flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-bg/50 border border-[#E8E6E1] rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-brand-text"
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-[#E8E6E1] bg-white rounded-lg text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary"
        >
          <option value="ALL">All Roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="VENDOR">Vendors</option>
          <option value="ADMIN">Admins</option>
          <option value="SUPERADMIN">Super Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden min-h-[400px]">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <ShieldAlert className="w-12 h-12 text-brand-text-muted/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No users found</h3>
            <p className="text-brand-text-muted">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-bg border-b border-[#E8E6E1] text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status & Role</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4 text-right">Total Spent</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMIN";
                  const isVendor = user.role === "VENDOR";
                  const isBlocked = user.isBlocked;
                  
                  // Logic: ADMIN cannot edit SUPERADMIN
                  const canEdit = currentUserRole === "SUPERADMIN" || user.role !== "SUPERADMIN";
                  const isSelf = false; // Add robust self-check if needed

                  return (
                    <tr key={user._id} className={`transition-colors group ${isBlocked ? "bg-red-50/30" : "hover:bg-brand-bg/50"}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border ${isBlocked ? "bg-red-100 text-red-700 border-red-200" : "bg-brand-bg text-brand-text border-[#E8E6E1]"}`}>
                             {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${isBlocked ? "text-red-900 line-through decoration-red-300" : "text-brand-text"}`}>{user.name}</p>
                            <p className="text-xs text-brand-text-muted font-medium mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1.5 items-start">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                             isAdmin ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
                             isVendor ? "bg-blue-50 text-blue-700 border-blue-200" :
                             "bg-gray-100 text-gray-700 border-gray-200"
                           }`}>
                             {user.role}
                           </span>
                           {isBlocked && (
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold shadow-[0_2px_4px_rgba(220,38,38,0.15)] uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                               <Ban className="w-3 h-3" /> Blocked
                             </span>
                           )}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-white border border-[#E8E6E1] shadow-sm rounded-lg text-xs font-bold text-brand-text">
                           {user.ordersCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-brand-text">
                        ₹{user.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            disabled={!canEdit || loadingId === user._id}
                            value={user.role}
                            onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                            className="px-2 py-1.5 text-xs font-bold border border-[#E8E6E1] rounded-lg bg-white text-brand-text focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:opacity-50 cursor-pointer"
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="VENDOR">Vendor</option>
                            <option value="ADMIN">Admin</option>
                            {currentUserRole === "SUPERADMIN" && <option value="SUPERADMIN">Super Admin</option>}
                          </select>
                          
                          <button
                            disabled={!canEdit || loadingId === user._id || user.role === "SUPERADMIN"}
                            onClick={() => handleUpdate(user._id, { isBlocked: !user.isBlocked })}
                            title={isBlocked ? "Unblock User" : "Block User"}
                            className={`p-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                              isBlocked 
                                ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" 
                                : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>
                        </div>
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
