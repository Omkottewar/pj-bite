"use client";

import { useState, useEffect } from "react";
import { 
  Settings, Save, Truck, Banknote, ShieldCheck, 
  Info, Loader2, RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/lib/swal";

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showSuccess("Settings Updated", "Your storefront logic has been synchronized.");
        setMessage("✅ Settings updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (err: any) {
      showError("Update Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-brand-text flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-primary" />
            Store Configuration
          </h1>
          <p className="text-brand-text-muted font-medium mt-1">Manage global shipping and payment rules.</p>
        </div>
        <button 
          onClick={fetchSettings}
          className="p-2.5 rounded-xl border border-[#E8E6E1] hover:bg-white transition-all text-brand-text-muted hover:text-brand-primary"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Shipping Strategy */}
        <div className="bg-white rounded-[2rem] p-8 premium-shadow border border-[#E8E6E1]">
          <h2 className="text-lg font-bold text-brand-text mb-6 flex items-center gap-2.5">
            <div className="p-2 bg-brand-primary/10 rounded-xl">
              <Truck className="w-5 h-5 text-brand-primary" />
            </div>
            Shipping & Logistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-brand-text-muted uppercase tracking-widest mb-3">Free Shipping Threshold</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-brand-text/40">₹</span>
                <input 
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({...settings, freeShippingThreshold: +e.target.value})}
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-[#E8E6E1] bg-brand-bg/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-black"
                />
              </div>
              <p className="text-[10px] text-brand-text-muted mt-2.5 font-medium flex items-center gap-1.5"><Info className="w-3 h-3" /> Orders above this amount get free delivery.</p>
            </div>

            <div>
              <label className="block text-xs font-black text-brand-text-muted uppercase tracking-widest mb-3">Standard Shipping Cost</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-brand-text/40">₹</span>
                <input 
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) => setSettings({...settings, shippingCost: +e.target.value})}
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-[#E8E6E1] bg-brand-bg/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-black"
                />
              </div>
              <p className="text-[10px] text-brand-text-muted mt-2.5 font-medium flex items-center gap-1.5"><Info className="w-3 h-3" /> Flat fee applied to orders below threshold.</p>
            </div>
          </div>
        </div>

        {/* Payment Rules */}
        <div className="bg-white rounded-[2rem] p-8 premium-shadow border border-[#E8E6E1]">
          <h2 className="text-lg font-bold text-brand-text mb-6 flex items-center gap-2.5">
            <div className="p-2 bg-brand-primary/10 rounded-xl">
              <Banknote className="w-5 h-5 text-brand-primary" />
            </div>
            Payment Policy
          </h2>

          <div className="space-y-8">
            <div className="flex items-center justify-between p-5 bg-brand-bg/50 rounded-2xl border border-[#E8E6E1]">
              <div>
                <p className="text-sm font-black text-brand-text">Enable Cash On Delivery (COD)</p>
                <p className="text-xs text-brand-text-muted font-medium mt-0.5">Toggle availability of COD at checkout.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({...settings, isCodEnabled: !settings.isCodEnabled})}
                className={`relative w-14 h-7 rounded-full transition-colors ${settings.isCodEnabled ? "bg-brand-primary" : "bg-brand-text-muted/40"}`}
              >
                <motion.div 
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full premium-shadow"
                  animate={{ x: settings.isCodEnabled ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${!settings.isCodEnabled ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}>
               <div>
                  <label className="block text-xs font-black text-brand-text-muted uppercase tracking-widest mb-3">Extra COD Handling Fee</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-brand-text/40">₹</span>
                    <input 
                      type="number"
                      value={settings.codCharge}
                      onChange={(e) => setSettings({...settings, codCharge: +e.target.value})}
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-[#E8E6E1] bg-brand-bg/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-black"
                    />
                  </div>
                  <p className="text-[10px] text-brand-text-muted mt-2.5 font-medium flex items-center gap-1.5"><Info className="w-3 h-3" /> Additional fee added during COD checkout.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions Bar */}
        <div className="sticky bottom-6 z-10 flex items-center gap-4 bg-brand-text text-white p-4 rounded-2xl border border-white/10 premium-shadow">
          <div className="flex-1 px-2">
            <p className="text-sm font-black flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              Dynamic Sync Enabled
            </p>
            {message ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-green-400 mt-0.5">{message}</motion.p>
            ) : (
              <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest mt-0.5">Control global storefront logic</p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`px-8 py-3 bg-brand-primary hover:bg-[#164a20] text-white font-black text-sm rounded-xl transition-all flex items-center gap-2.5 disabled:opacity-50 premium-shadow ${saving ? "cursor-wait" : ""}`}
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
