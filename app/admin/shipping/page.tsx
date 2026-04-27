"use client";

import { useEffect, useState } from "react";
import { Truck, RefreshCw, Package, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { showSuccess, showError, showConfirm } from "@/lib/swal";

type Order = {
  _id: string;
  customerDetails: { name: string; address: string; city?: string; pincode?: string; phone: string };
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  deliveryStatus: string;
  trackingId?: string;
  courierPartner?: string;
  nimbusOrderId?: string;
  estimatedDelivery?: string;
  createdAt: string;
};

export default function AdminShippingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<Record<string, any>>({});
  const [rateResult, setRateResult] = useState<Record<string, any>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [weight, setWeight] = useState<Record<string, string>>({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders?status=PROCESSING&page=1&limit=50");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleShip = async (orderId: string) => {
    const confirmed = await showConfirm("Ship Order?", "Create Nimbus Post shipment for this order?");
    if (!confirmed) return;
    setProcessing(orderId);
    try {
      const res = await fetch("/api/shipping/nimbus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, weight: parseInt(weight[orderId] || "500") }),
      });
      const data = await res.json();
      if (res.ok) {
        await showSuccess("Shipment Created!", `AWB: ${data.trackingId}`);
        fetchOrders();
      } else {
        showError("Shipping Error", data.error);
      }
    } catch (err: any) {
      showError("Connection Failed", err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleTrack = async (awb: string) => {
    const res = await fetch(`/api/shipping/track/${awb}`);
    const data = await res.json();
    setTrackResult((p) => ({ ...p, [awb]: data }));
  };

  const handleRateCheck = async (orderId: string, pincode: string, value: number) => {
    const res = await fetch(`/api/shipping/nimbus?destination=${pincode}&weight=${parseInt(weight[orderId] || "500")}&value=${value}`);
    const data = await res.json();
    setRateResult((p) => ({ ...p, [orderId]: data }));
  };

  const filtered = orders.filter((o) =>
    o.customerDetails.name.toLowerCase().includes(search.toLowerCase()) ||
    o._id.includes(search)
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif flex items-center gap-3">
            <Truck className="w-8 h-8 text-brand-primary" /> Shipping — Nimbus Post
          </h1>
          <p className="text-brand-text-muted font-medium mt-1">Create shipments and track parcels via Nimbus Post</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2.5 bg-brand-bg border border-[#E8E6E1] text-brand-text-muted hover:text-brand-primary rounded-xl font-bold transition-all text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6E1] rounded-xl text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
        />
      </div>

      {/* Orders awaiting shipment */}
      <div className="bg-white rounded-[2rem] border border-[#E8E6E1] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E8E6E1] flex items-center gap-3">
          <Package className="w-5 h-5 text-brand-primary" />
          <h2 className="font-black text-brand-text">Orders Ready to Ship ({filtered.length})</h2>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <RefreshCw className="w-8 h-8 text-brand-text-muted animate-spin mx-auto mb-3" />
            <p className="text-brand-text-muted font-bold">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="w-12 h-12 text-brand-primary mx-auto mb-4 opacity-30" />
            <p className="font-black text-brand-text text-lg">All orders shipped!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EDE8]">
            {filtered.map((order) => (
              <div key={order._id}>
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-brand-bg/40 transition-colors"
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-brand-text">#{order._id.slice(-8).toUpperCase()} — {order.customerDetails.name}</p>
                    <p className="text-xs text-brand-text-muted font-medium mt-0.5">
                      {order.customerDetails.address}{order.customerDetails.city ? `, ${order.customerDetails.city}` : ""}
                      {order.customerDetails.pincode ? ` - ${order.customerDetails.pincode}` : ""}
                    </p>
                    {order.trackingId && (
                      <p className="text-xs font-black text-brand-primary mt-1">AWB: {order.trackingId} · {order.courierPartner}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black text-brand-primary">₹{order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-brand-text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0 ${
                    order.trackingId ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {order.trackingId ? "Shipped" : "Pending"}
                  </span>
                </div>

                {expandedId === order._id && (
                  <div className="px-6 pb-6 pt-4 bg-brand-bg/30 border-t border-[#F0EDE8] space-y-5">
                    
                    {/* Products */}
                    <div>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-2">Products</p>
                      <div className="flex flex-wrap gap-2">
                        {order.products.map((p, i) => (
                          <span key={i} className="text-xs font-bold bg-white border border-[#E8E6E1] px-3 py-1.5 rounded-full text-brand-text">
                            {p.name} × {p.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Create shipment */}
                      {!order.trackingId && (
                        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4 space-y-3">
                          <p className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Create Nimbus Post Shipment</p>
                          <div>
                            <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest block mb-1.5">Package Weight (grams)</label>
                            <input
                              type="number"
                              placeholder="500"
                              value={weight[order._id] || ""}
                              onChange={(e) => setWeight((p) => ({ ...p, [order._id]: e.target.value }))}
                              className="w-full px-3 py-2.5 text-sm font-bold bg-brand-bg border border-[#E8E6E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            />
                          </div>
                          {order.customerDetails.pincode && (
                            <button
                              onClick={() => handleRateCheck(order._id, order.customerDetails.pincode!, order.totalAmount)}
                              className="w-full py-2 text-xs font-black text-brand-primary border border-brand-primary/30 bg-brand-primary/5 rounded-xl hover:bg-brand-primary/10 transition-colors uppercase tracking-widest"
                            >
                              Check Rates First
                            </button>
                          )}
                          {rateResult[order._id] && (
                            <pre className="text-[10px] bg-brand-bg rounded-xl p-3 overflow-auto max-h-32 font-mono">
                              {JSON.stringify(rateResult[order._id], null, 2)}
                            </pre>
                          )}
                          <button
                            onClick={() => handleShip(order._id)}
                            disabled={processing === order._id}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-[#164a20] disabled:opacity-50 transition-colors text-sm uppercase tracking-widest"
                          >
                            {processing === order._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                            {processing === order._id ? "Creating..." : "Create Shipment"}
                          </button>
                        </div>
                      )}

                      {/* Track */}
                      {order.trackingId && (
                        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4 space-y-3">
                          <p className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Track Shipment</p>
                          <p className="text-sm font-black text-brand-primary">AWB: {order.trackingId}</p>
                          <button
                            onClick={() => handleTrack(order.trackingId!)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-[#164a20] transition-colors text-sm uppercase tracking-widest"
                          >
                            <Truck className="w-4 h-4" /> Track Live
                          </button>
                          {trackResult[order.trackingId] && (
                            <pre className="text-[10px] bg-brand-bg rounded-xl p-3 overflow-auto max-h-40 font-mono">
                              {JSON.stringify(trackResult[order.trackingId], null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
