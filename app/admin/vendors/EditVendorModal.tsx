"use client";

import { useState } from "react";
import { Edit, X, Loader2 } from "lucide-react";
import { editVendor } from "@/app/actions/admin";
import { showSuccess, showError } from "@/lib/swal";

export default function EditVendorModal({ vendor }: { vendor: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await editVendor(formData);
      setIsOpen(false);
      showSuccess("Vendor Updated", "Vendor details have been saved successfully.");
    } catch (err: any) {
      showError("Save Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-[var(--color-brand-green)] hover:bg-green-50 rounded-lg transition-colors"
        title="Edit Vendor"
      >
        <Edit className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full premium-shadow z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Vendor</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={vendor._id.toString()} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company / Vendor Name</label>
                <input type="text" name="name" defaultValue={vendor.name} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Login ID)</label>
                <input type="email" name="email" defaultValue={vendor.email} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                <input type="text" name="password" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75 flex justify-center items-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
