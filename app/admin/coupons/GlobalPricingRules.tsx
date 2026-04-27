"use client";

import { useState } from "react";
import { Truck, Banknote, Save, Loader2, Info } from "lucide-react";
import { showSuccess, showError } from "@/lib/swal";
import { motion } from "framer-motion";

interface GlobalPricingRulesProps {
  initialSettings: {
    freeShippingThreshold: number;
    shippingCost: number;
    codCharge: number;
    isCodEnabled: boolean;
    prepaidDiscountPercentage: number;
  };
}

export default function GlobalPricingRules({ initialSettings }: GlobalPricingRulesProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      
      if (res.ok) {
        showSuccess("Pricing Updated", "Global shipping and COD rules have been synchronized.");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (err: any) {
      showError("Update Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-[#E8E6E1] bg-brand-bg/30 flex items-center justify-between">
        <h2 className="text-sm font-black text-brand-text uppercase tracking-widest flex items-center gap-2">
          <Truck className="w-4 h-4 text-brand-primary" /> Global Logistical Rules
        </h2>
        <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
          Live Sync
        </span>
      </div>

      <form onSubmit={handleUpdate} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Shipping */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
              Free Shipping Above
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40 font-bold text-xs">₹</span>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: +e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Shipping Cost */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
              Standard Shipping Fee
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40 font-bold text-xs">₹</span>
              <input
                type="number"
                value={settings.shippingCost}
                onChange={(e) => setSettings({ ...settings, shippingCost: +e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* COD Charge */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
              COD Handling Fee
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40 font-bold text-xs">₹</span>
              <input
                type="number"
                value={settings.codCharge}
                onChange={(e) => setSettings({ ...settings, codCharge: +e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Prepaid Discount */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-1.5">
              Prepaid Discount (%)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40 font-bold text-xs">%</span>
              <input
                type="number"
                value={settings.prepaidDiscountPercentage || 0}
                onChange={(e) => setSettings({ ...settings, prepaidDiscountPercentage: +e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E8E6E1] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button
                type="button"
                onClick={() => setSettings({...settings, isCodEnabled: !settings.isCodEnabled})}
                className={`relative w-10 h-5 rounded-full transition-colors ${settings.isCodEnabled ? "bg-brand-primary" : "bg-brand-text-muted/40"}`}
              >
                <motion.div 
                  className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: settings.isCodEnabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className="text-[10px] font-black text-brand-text uppercase tracking-widest">
                {settings.isCodEnabled ? "COD Enabled" : "COD Disabled"}
              </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-text text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Rules
          </button>
        </div>
      </form>
    </div>
  );
}
