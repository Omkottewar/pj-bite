"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError, showConfirm } from "@/lib/swal";
import {
  Truck, XCircle, FileText, RefreshCw, CheckCircle, Package,
} from "lucide-react";

interface TimelineItem {
  status: string;
  timestamp: string;
  description: string;
}

interface ShipmentOrder {
  awbNumber?: string;
  courierName?: string;
  labelUrl?: string;
  trackingUrl?: string;
  statusTimeline?: TimelineItem[];
}

interface ShipmentPanelProps {
  orderId: string;
  order: ShipmentOrder;
}

export default function ShipmentPanel({
  orderId,
  order: initialOrder,
}: ShipmentPanelProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [dims, setDims] = useState({
    weight: 500,
    length: 15,
    breadth: 12,
    height: 10,
  });

  const handleShip = async () => {
    const confirmed = await showConfirm(
      "Create Shipment?",
      "Are you sure you want to create a NimbusPost shipment for this order?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/shipping/nimbus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...dims }),
      });
      const data = await res.json();

      if (res.ok) {
        await showSuccess("Shipment Created!", `AWB: ${data.awbNumber}`);
        router.refresh();
      } else {
        showError("Shipping Error", data.error ?? "Unknown error");
      }
    } catch {
      showError("Connection Failed", "Failed to connect to the shipping server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = await showConfirm(
      "Cancel Shipment?",
      "CRITICAL: This will cancel the NimbusPost shipment and AWB. Proceed?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/shipping/nimbuspost/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      if (res.ok) {
        await showSuccess("Cancelled", "Shipment cancelled successfully.");
        router.refresh();
      } else {
        showError("Cancellation Failed", data.error ?? "Unknown error");
      }
    } catch {
      showError("Connection Failed", "Failed to connect to the shipping server.");
    } finally {
      setLoading(false);
    }
  };

  const isShipped = !!order.awbNumber;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-8">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <Truck className="w-5 h-5 text-brand-primary" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
          NimbusPost Shipping Manager
        </h3>
      </div>

      <div className="p-6">
        {!isShipped ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(
                [
                  { key: "weight", label: "Weight (g)" },
                  { key: "length", label: "Length (cm)" },
                  { key: "breadth", label: "Breadth (cm)" },
                  { key: "height", label: "Height (cm)" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={dims[key]}
                    onChange={(e) =>
                      setDims({ ...dims, [key]: Number(e.target.value) })
                    }
                    min={1}
                    className="w-full px-3 py-2 border rounded-md text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleShip}
              disabled={loading}
              className="w-full py-3 bg-brand-primary text-white text-sm font-black rounded-md hover:bg-[#164a20] transition-colors flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Package className="w-4 h-4" />
              )}
              Create NimbusPost Shipment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-100 w-fit">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Active Shipment Found
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Courier Partner
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {order.courierName || "NimbusPost"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Tracking AWB
                    </p>
                    <p className="text-sm font-mono font-bold text-brand-primary">
                      {order.awbNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 sm:w-48">
                {order.labelUrl && (
                  <a
                    href={order.labelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-md hover:bg-black transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Download Label
                  </a>
                )}
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-50 transition-colors"
                >
                    <Truck className="w-4 h-4" /> Track Live
                  </a>
                )}
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 text-xs font-bold rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Cancel Shipment
                </button>
              </div>
            </div>

            {/* Timeline */}
            {order.statusTimeline && order.statusTimeline.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                  Status Log & Timeline
                </p>
                <div className="space-y-4">
                  {[...order.statusTimeline].reverse().map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start pb-4 last:pb-0 border-l-2 border-gray-100 pl-4 relative ml-2"
                    >
                      <div className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-gray-900">
                            {item.status}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400">
                            {new Date(item.timestamp).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}