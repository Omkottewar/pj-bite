"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw, RotateCcw, CheckCircle2, XCircle, Clock,
  ChevronDown, IndianRupee, PackageX, Search, Filter
} from "lucide-react";
import { showSuccess, showError, showConfirm } from "@/lib/swal";

type RefundOrder = {
  _id: string;
  customerDetails: { name: string; email: string; phone: string };
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  cancellationRequested: boolean;
  cancellationReason?: string;
  cancellationRequestedAt?: string;
  refundStatus: string;
  refundAmount?: number;
  razorpayPaymentId?: string;
  razorpayRefundId?: string;
  refundProcessedAt?: string;
  refundNote?: string;
  createdAt: string;
};

const STATUS_BADGE: Record<string, string> = {
  NOT_REQUESTED: "bg-gray-100 text-gray-600",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  PROCESSED: "bg-green-50 text-brand-primary border border-green-200",
  FAILED: "bg-red-50 text-red-700 border border-red-200",
};

const DELIVERY_BADGE: Record<string, string> = {
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  RETURN_REQUESTED: "bg-amber-50 text-amber-700",
  RETURNED: "bg-gray-100 text-gray-600",
};

export default function AdminRefundsPage() {
  const [orders, setOrders] = useState<RefundOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [refundNote, setRefundNote] = useState<Record<string, string>>({});
  const [refundAmount, setRefundAmount] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/refunds?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleRefund = async (orderId: string) => {
    const confirmed = await showConfirm("Process Refund?", "Are you sure you want to process a refund for this order via Razorpay?");
    if (!confirmed) return;
    setProcessing(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: refundNote[orderId] || undefined,
          amount: refundAmount[orderId] ? parseFloat(refundAmount[orderId]) : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await showSuccess("Refund Processed!", `₹${data.refundAmount} refunded successfully. ID: ${data.refundId}`);
        fetchOrders();
      } else {
        showError("Refund Failed", data.error);
      }
    } catch (err: any) {
      showError("Connection Error", err.message);
    } finally {
      setProcessing(null);
    }
  };

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    return (
      o.customerDetails.name.toLowerCase().includes(term) ||
      o.customerDetails.email.toLowerCase().includes(term) ||
      o._id.includes(term)
    );
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.refundStatus === "PENDING").length,
    processed: orders.filter((o) => o.refundStatus === "PROCESSED").length,
    cancelled: orders.filter((o) => o.deliveryStatus === "CANCELLED").length,
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif">Refunds & Returns</h1>
          <p className="text-brand-text-muted font-medium mt-1">Manage cancellations, refunds, and returns</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-bg border border-[#E8E6E1] text-brand-text-muted hover:text-brand-primary rounded-xl font-bold transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: stats.total, icon: RotateCcw, color: "text-brand-primary bg-brand-primary/10" },
          { label: "Pending Refunds", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Processed", value: stats.processed, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
          { label: "Cancelled Orders", value: stats.cancelled, icon: PackageX, color: "text-red-500 bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[1.5rem] border border-[#E8E6E1] p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-text">{stat.value}</p>
              <p className="text-xs font-bold text-brand-text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6E1] rounded-xl text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "processed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-sm font-black capitalize transition-all ${
                filter === f
                  ? "bg-brand-primary text-white"
                  : "bg-white border border-[#E8E6E1] text-brand-text-muted hover:text-brand-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] border border-[#E8E6E1] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <RefreshCw className="w-8 h-8 text-brand-text-muted animate-spin mx-auto mb-3" />
            <p className="text-brand-text-muted font-bold">Loading refund requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center">
            <CheckCircle2 className="w-12 h-12 text-brand-primary mx-auto mb-4 opacity-30" />
            <p className="text-brand-text font-black text-lg">No refund requests</p>
            <p className="text-brand-text-muted font-medium mt-1">All clear — no pending cancellations or refunds.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EDE8]">
            {filtered.map((order) => (
              <div key={order._id} className="hover:bg-brand-bg/50 transition-colors">
                {/* Main row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm font-black text-brand-text">#{order._id.slice(-8).toUpperCase()}</p>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${DELIVERY_BADGE[order.deliveryStatus] || "bg-gray-100 text-gray-600"}`}>
                        {order.deliveryStatus.replace("_", " ")}
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${STATUS_BADGE[order.refundStatus] || "bg-gray-100 text-gray-600"}`}>
                        Refund: {order.refundStatus.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-brand-text-muted font-medium mt-1">{order.customerDetails.name} · {order.customerDetails.email}</p>
                    {order.cancellationReason && (
                      <p className="text-xs text-amber-700 font-bold mt-1">Reason: {order.cancellationReason}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-brand-primary flex items-center gap-0.5 justify-end">
                      <IndianRupee className="w-4 h-4" />{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-brand-text-muted font-medium mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <ChevronDown className={`w-5 h-5 text-brand-text-muted shrink-0 transition-transform ${expandedId === order._id ? "rotate-180" : ""}`} />
                </div>

                {/* Expanded detail */}
                {expandedId === order._id && (
                  <div className="px-6 pb-6 border-t border-[#F0EDE8] pt-5 bg-brand-bg/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Order Info */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Order Details</h3>
                        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4 space-y-2">
                          <InfoRow label="Order ID" value={order._id} mono />
                          <InfoRow label="Payment Status" value={order.paymentStatus} />
                          <InfoRow label="Razorpay Payment ID" value={order.razorpayPaymentId || "—"} mono />
                          {order.razorpayRefundId && <InfoRow label="Refund ID" value={order.razorpayRefundId} mono />}
                          {order.refundAmount != null && (
                            <InfoRow label="Refund Amount" value={`₹${order.refundAmount.toFixed(2)}`} />
                          )}
                          {order.refundProcessedAt && (
                            <InfoRow label="Refunded At" value={new Date(order.refundProcessedAt).toLocaleString("en-IN")} />
                          )}
                          {order.refundNote && <InfoRow label="Note" value={order.refundNote} />}
                          {order.cancellationRequestedAt && (
                            <InfoRow label="Cancelled At" value={new Date(order.cancellationRequestedAt).toLocaleString("en-IN")} />
                          )}
                        </div>
                      </div>

                      {/* Manual Refund Panel */}
                      {order.paymentStatus === "PAID" && order.refundStatus !== "PROCESSED" && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Process Refund</h3>
                          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4 space-y-3">
                            <div>
                              <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest block mb-1.5">Amount (₹) — leave blank for full refund</label>
                              <input
                                type="number"
                                placeholder={`Max: ₹${order.totalAmount}`}
                                value={refundAmount[order._id] || ""}
                                onChange={(e) => setRefundAmount((p) => ({ ...p, [order._id]: e.target.value }))}
                                className="w-full px-3 py-2.5 text-sm font-bold bg-brand-bg border border-[#E8E6E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest block mb-1.5">Internal Note</label>
                              <input
                                type="text"
                                placeholder="Reason for refund..."
                                value={refundNote[order._id] || ""}
                                onChange={(e) => setRefundNote((p) => ({ ...p, [order._id]: e.target.value }))}
                                className="w-full px-3 py-2.5 text-sm font-bold bg-brand-bg border border-[#E8E6E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                              />
                            </div>
                            <button
                              onClick={() => handleRefund(order._id)}
                              disabled={processing === order._id}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-[#164a20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-widest"
                            >
                              {processing === order._id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <IndianRupee className="w-4 h-4" />
                              )}
                              {processing === order._id ? "Processing..." : "Process Refund via Razorpay"}
                            </button>
                          </div>
                        </div>
                      )}

                      {order.refundStatus === "PROCESSED" && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Refund Status</h3>
                          <div className="bg-green-50 rounded-2xl border border-green-200 p-5 flex items-center gap-4">
                            <CheckCircle2 className="w-8 h-8 text-brand-primary shrink-0" />
                            <div>
                              <p className="font-black text-brand-primary">Refund Processed</p>
                              <p className="text-sm text-brand-text-muted mt-0.5">₹{order.refundAmount?.toFixed(2)} refunded to customer's original payment method.</p>
                            </div>
                          </div>
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

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-bold text-brand-text-muted shrink-0">{label}</span>
      <span className={`text-xs font-bold text-brand-text text-right break-all ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
