import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import CreateCouponForm from "./CreateCouponForm";
import DeleteButton from "@/components/admin/crud/DeleteButton";
import { deleteCoupon } from "@/app/actions/admin";
import { Ticket } from "lucide-react";
import StoreSettings from "@/models/StoreSettings";
import GlobalPricingRules from "./GlobalPricingRules";

export const revalidate = 0;

export default async function AdminCouponsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "SUPERADMIN") {
    import("next/navigation").then((nav) => nav.redirect("/api/auth/signin?callbackUrl=/admin/coupons"));
    return null;
  }

  await dbConnect();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  
  // Fetch global settings for the new pricing rules section
  let settings = await StoreSettings.findOne().lean();
  if (!settings) {
    settings = {
      freeShippingThreshold: 499,
      shippingCost: 50,
      codCharge: 50,
      isCodEnabled: true
    };
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">Rewards & Vouchers</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Create and manage discount codes.</p>
        </div>
      </div>

      {/* NEW: Global Pricing Rules Section */}
      <GlobalPricingRules initialSettings={JSON.parse(JSON.stringify(settings))} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Node */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm h-fit">
          <h2 className="text-lg font-bold text-brand-text mb-6 border-b border-[#E8E6E1] pb-3">Create Voucher</h2>
          <CreateCouponForm />
        </div>

        {/* Global Registry Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-[#E8E6E1] flex justify-between items-center bg-brand-bg/50">
              <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-primary" /> Global Vouchers
              </h2>
            </div>
            
            {coupons.length === 0 ? (
              <div className="p-16 text-center">
                <Ticket className="w-12 h-12 mx-auto text-brand-text-muted/50 mb-4" />
                <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No active vouchers</h3>
                <p className="text-brand-text-muted">Generate one to run a sale or special promotion.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-[#E8E6E1]/30">
                    <tr className="border-b border-[#E8E6E1] text-[12px] uppercase tracking-wider font-bold text-brand-text-muted">
                      <th className="px-6 py-4">Voucher Code</th>
                      <th className="px-6 py-4 text-center">Discount</th>
                      <th className="px-6 py-4 text-center">Min Order</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E6E1]">
                    {coupons.map((coupon: any) => {
                      const isExpired = new Date(coupon.expiryDate) < new Date();
                      return (
                      <tr key={coupon._id.toString()} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="px-6 py-4">
                           <span className="font-mono font-bold text-sm bg-[#E8E6E1]/50 border border-[#E8E6E1] px-2.5 py-1 rounded-md text-brand-text tracking-widest">{coupon.code}</span>
                           <p className="text-[10px] uppercase tracking-widest text-brand-text-muted mt-2 font-bold">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-black text-brand-text">
                           {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium text-brand-text-muted">
                           ₹{coupon.minOrderValue}
                        </td>
                        <td className="px-6 py-4 text-center">
                           {isExpired ? (
                             <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest bg-red-50 text-red-700 border border-red-200">Expired</span>
                           ) : coupon.isActive ? (
                             <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest bg-[#1E5C2A]/10 text-[#1E5C2A] border border-[#1E5C2A]/20">Active</span>
                           ) : (
                             <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest bg-gray-50 text-gray-700 border border-gray-200">Disabled</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <DeleteButton deleteAction={deleteCoupon} id={coupon._id.toString()} />
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
