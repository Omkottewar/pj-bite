import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintInvoiceButton from "@/components/admin/orders/PrintInvoiceButton";
import DeliveryStatusToggle from "./DeliveryStatusToggle";
import ShipmentPanel from "./ShipmentPanel";

export const revalidate = 0;
const VALID_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type DeliveryStatus = (typeof VALID_STATUSES)[number];
interface OrderProduct {
  name: string;
  productId: string;
  image?: string;
  price: number;
  quantity: number;
}
interface OrderDoc {
  _id: string;
  paymentStatus: string;
  deliveryStatus?: DeliveryStatus;
  totalAmount: number;
  createdAt: string;
  razorpayPaymentId?: string;
  awbNumber?: string;
  labelUrl?: string;

  trackingUrl?: string;
  courierName?: string;
  statusTimeline?: { status: string; timestamp: string; description: string }[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: OrderProduct[];
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role: string }).role !== "SUPERADMIN") {
    redirect("/api/auth/signin?callbackUrl=/admin/orders");
  }

  await dbConnect();
  const rawOrder = await Order.findById(id).lean();

  if (!rawOrder) notFound();

  // Safe serialization for client components
  const o = JSON.parse(JSON.stringify(rawOrder)) as OrderDoc;

  const dateStr = new Date(o.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <PrintInvoiceButton />
      </div>

      {/* Invoice */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">

        {/* Header */}
        <div className="p-8 sm:p-12 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <h1
              className="text-3xl font-normal tracking-tight text-gray-900 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Order{" "}
              <span className="font-bold">
                #{o._id.substring(0, 8).toUpperCase()}
              </span>
            </h1>
            <p className="text-sm text-gray-500 font-medium">{dateStr}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <span
              className={`inline-flex w-fit items-center px-3 py-1 rounded-sm text-[11px] uppercase tracking-widest font-bold ${o.paymentStatus === "PAID"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
                }`}
            >
              Payment: {o.paymentStatus}
            </span>
            <span
              className={`inline-flex w-fit items-center px-3 py-1 rounded-sm text-[11px] uppercase tracking-widest font-bold ${o.deliveryStatus === "DELIVERED"
                ? "bg-blue-100 text-blue-800"
                : o.deliveryStatus === "SHIPPED"
                  ? "bg-purple-100 text-purple-800"
                  : o.deliveryStatus === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              Delivery: {o.deliveryStatus || "PROCESSING"}
            </span>
            {o.razorpayPaymentId && (
              <p className="text-xs text-gray-400 font-mono mt-1">
                Txn: {o.razorpayPaymentId}
              </p>
            )}
          </div>
        </div>

        {/* Customer & Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-100 bg-gray-50/30">
          <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              Customer Details
            </h3>
            <p className="text-base font-semibold text-gray-900 mb-1">
              {o.customerDetails.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">{o.customerDetails.email}</p>
            <p className="text-sm text-gray-600">{o.customerDetails.phone}</p>
          </div>

          <div className="p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Shipping Address
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {o.customerDetails.address}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200/60">
              <DeliveryStatusToggle
                orderId={o._id}
                currentStatus={o.deliveryStatus || "PROCESSING"}
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-8 sm:p-12">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Line Items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-gray-900 text-[11px] uppercase tracking-widest text-gray-900">
                  <th className="pb-4 font-bold w-12">Item</th>
                  <th className="pb-4 font-bold">Description</th>
                  <th className="pb-4 font-bold text-center">Qty</th>
                  <th className="pb-4 font-bold text-right">Unit Price</th>
                  <th className="pb-4 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {o.products.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-6">
                      <div className="w-12 h-12 bg-[#fbfbfb] border border-gray-100 flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.image && item.image !== "undefined"
                              ? item.image
                              : "https://placehold.co/400x400/f8f9fa/a0a0a0?text=No+Image"
                          }
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <p
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {item.productId}
                      </p>
                    </td>
                    <td className="py-6 text-center text-sm font-semibold text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="py-6 text-right text-sm text-gray-600">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-6 text-right text-sm font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end">
            <div className="w-full sm:w-80 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{o.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-900 pt-4 border-t border-gray-900">
                <span>Total</span>
                <span>₹{o.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ShipmentPanel orderId={o._id} order={o} />
      </div>
    </div>
  );
}