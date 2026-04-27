"use client";

import { useState } from "react";
import { addAddress, removeAddress } from "@/app/actions/user";
import { ISavedAddress } from "@/models/User";
import { Plus, Trash, MapPin } from "lucide-react";
import { showToast, showConfirm } from "@/lib/swal";

export default function AddressManagerClient({ addresses }: { addresses: (ISavedAddress & { _id: string })[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await addAddress(formData);
      setIsAdding(false);
      showToast("Address saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to add address", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    const confirmed = await showConfirm("Delete Address", "Are you sure you want to remove this address?");
    if (!confirmed) return;
    try {
      await removeAddress(id);
      showToast("Address removed", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to remove address", "error");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {addresses.map((addr) => (
          <div key={addr._id} className="border border-gray-200 rounded-xl p-5 relative group">
            <button 
              onClick={() => handleRemove(addr._id)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-brand-green)]" /> {addr.label}
            </h3>
            <p className="text-gray-600 space-y-1 text-sm">
              <span className="block">{addr.street}</span>
              <span className="block">{addr.city}, {addr.state}</span>
              <span className="block">ZIP: {addr.zip}</span>
              <span className="block pt-2 font-medium text-gray-900">Tel: {addr.phone}</span>
            </p>
          </div>
        ))}
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-500 hover:border-[var(--color-brand-green)] hover:text-[var(--color-brand-green)] hover:bg-green-50 transition-all min-h-[160px]"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-bold">Add New Address</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-900 mb-2">New Address Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g. Home, Office)</label>
              <input type="text" name="label" required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" name="street" required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" name="state" required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input type="text" name="zip" required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
