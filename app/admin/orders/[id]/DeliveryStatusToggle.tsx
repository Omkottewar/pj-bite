"use client";

import { useState, useTransition } from "react";
import { showError, showSuccess } from "@/lib/swal";
import { updateOrderStatus } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

const VALID_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type DeliveryStatus = (typeof VALID_STATUSES)[number];

interface DeliveryStatusToggleProps {
  orderId: string;
  currentStatus: DeliveryStatus;
}

export default function DeliveryStatusToggle({
  orderId,
  currentStatus,
}: DeliveryStatusToggleProps) {
  const [status, setStatus] = useState<DeliveryStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as DeliveryStatus;

    if (!VALID_STATUSES.includes(newStatus)) {
      showError("Invalid Status", "That status is not allowed.");
      return;
    }

    setStatus(newStatus);

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        showSuccess("Status Updated", `Order status set to ${newStatus}`);
      } catch (err: unknown) {
        setStatus(currentStatus);
        const message = err instanceof Error ? err.message : "Failed to update status";
        showError("Status Update Failed", message);
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
        Update Fulfillment:
      </label>
      <div className="relative">
        <select
          disabled={isPending}
          value={status}
          onChange={handleStatusChange}
          className="appearance-none bg-white border border-gray-200 text-[13px] sm:text-sm font-semibold text-gray-900 rounded-md px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 transition-all cursor-pointer min-w-[160px]"
        >
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        ) : (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}