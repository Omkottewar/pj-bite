import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { createVendor, deleteVendor } from "@/app/actions/admin";
import DeleteButton from "@/components/admin/crud/DeleteButton";
import EditVendorModal from "./EditVendorModal";

export default async function VendorsPage() {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any).role !== "SUPERADMIN") {
    redirect("/admin/dashboard");
  }

  await dbConnect();
  
  const vendors = await User.find({ role: "VENDOR" }).lean();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Vendors (Super Admin)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 premium-shadow h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Vendor Account</h2>
          <form action={createVendor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / Vendor Name</label>
              <input type="text" name="name" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Login ID)</label>
              <input type="email" name="email" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="text" name="password" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]" />
            </div>
            <button type="submit" className="w-full bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white font-bold py-3 rounded-xl transition-all">
              Initialize Vendor
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 premium-shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Registered Vendors</h2>
          {vendors.length === 0 ? (
            <p className="text-gray-500">No vendors created yet.</p>
          ) : (
             <div className="overflow-x-auto rounded-xl border border-gray-100 pb-2">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100 text-gray-500 text-[13px] uppercase tracking-wider">
                    <th className="px-5 py-4 font-bold">Vendor Identity</th>
                    <th className="px-5 py-4 font-bold">Email</th>
                    <th className="px-5 py-4 font-bold">Joined On</th>
                    <th className="px-5 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {vendors.map((vendor: any) => {
                    const vendorData = JSON.parse(JSON.stringify(vendor));
                    return (
                      <tr key={vendorData._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 text-gray-900 font-bold">{vendorData.name}</td>
                        <td className="px-5 py-4 text-gray-500 font-medium">{vendorData.email}</td>
                        <td className="px-5 py-4 text-gray-500 font-medium">{new Date(vendorData.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4 text-right flex justify-end gap-3 items-center">
                          <EditVendorModal vendor={vendorData} />
                          <DeleteButton id={vendorData._id} deleteAction={deleteVendor} />
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
    </div>
  );
}
