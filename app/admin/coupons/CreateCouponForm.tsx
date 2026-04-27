"use client";

import { useState } from "react";
import { showSuccess, showError } from "@/lib/swal";
import { createCoupon } from "@/app/actions/admin";
import { CopyPlus, Loader2 } from "lucide-react";

export default function CreateCouponForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createCoupon(formData);
      (e.target as HTMLFormElement).reset();
      showSuccess("Voucher Created", "New coupon has been broadcasted successfully.");
    } catch (err: any) {
      showError("Creation Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <CopyPlus className="w-48 h-48" />
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Generate Voucher</h2>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Voucher Code</label>
            <input name="code" required type="text" placeholder="e.g. SUMMER20" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold uppercase focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Type</label>
              <select name="discountType" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-gray-900 focus:outline-none">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Value</label>
              <input name="discountValue" required type="number" min="1" step="0.01" placeholder="e.g. 20" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Min Order Value (₹)</label>
              <input name="minOrderValue" defaultValue="0" type="number" min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Expiry Date</label>
              <input name="expiryDate" required type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900" />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Set as Active Immediately</label>
          </div>
        </div>
      </div>

      <button disabled={loading} type="submit" className="mt-8 w-full py-3.5 bg-gray-900 text-white rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 z-10">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CopyPlus className="w-4 h-4" />}
        Broadcast Voucher
      </button>
    </form>
  );
}
