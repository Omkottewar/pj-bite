"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, MapPin, Settings, UserCircle, LogOut, TrendingUp, Calendar, CreditCard, ChevronRight, Activity, ShoppingBag, XCircle, Truck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewFormModalClient from "./ReviewFormModalClient";
import AddressManagerClient from "./AddressManagerClient";
import { showSuccess, showError, showConfirm } from "@/lib/swal";
import Swal from "sweetalert2";

export default function DashboardClient({ 
  userProfile, 
  orders, 
  totalSpent, 
  totalOrders 
}: { 
  userProfile: any, 
  orders: any[], 
  totalSpent: number, 
  totalOrders: number 
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [orderList, setOrderList] = useState<any[]>(orders);
  const router = useRouter();

  const cancelOrder = async (orderId: string) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Cancel Order?",
      text: "Please provide a reason for cancellation (optional):",
      input: "text",
      inputPlaceholder: "e.g. Changed my mind",
      showCancelButton: true,
      confirmButtonText: "Cancel Order",
      confirmButtonColor: "#C2410C", // Deep Amber for danger
      cancelButtonText: "Go Back",
      icon: "warning",
      customClass: {
        popup: "rounded-[2rem] border border-[#E8E6E1] p-8",
        title: "font-serif font-black text-brand-text",
        confirmButton: "bg-orange-700 text-white font-bold px-8 py-3 rounded-xl",
        cancelButton: "text-brand-text-muted font-bold px-8 py-3 rounded-xl",
      }
    });

    if (!isConfirmed) return;
    
    setCancelling(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "" }),
      });
      const data = await res.json();
      if (res.ok) {
        await showSuccess("Order Cancelled", `Successfully cancelled. ${data.refundStatus === "PROCESSED" ? "Refund initiated!" : data.refundStatus === "PENDING" ? "Refund pending admin review." : ""}`);
        setOrderList((prev) => prev.map((o) => o._id.toString() === orderId ? { ...o, deliveryStatus: "CANCELLED", cancellationRequested: true } : o));
      } else {
        showError("Cancellation Failed", data.error);
      }
    } catch (err: any) {
      showError("Connection Error", err.message);
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-16 font-sans">
      {/* SaaS Compact Header */}
      <div className="bg-white border-b border-[#E8E6E1] premium-shadow">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-gradient-to-tr from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-md text-white font-black text-xl border border-[#E8E6E1]/50">
                {userProfile?.name?.charAt(0) || "U"}
             </div>
             <div>
               <h1 className="text-2xl font-black text-brand-text font-serif tracking-tight leading-tight">{userProfile?.name}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-full w-full bg-brand-primary"></span>
                 </span>
                 <p className="text-sm text-brand-text-muted font-medium">Personal Account • {userProfile?.email}</p>
               </div>
             </div>
           </div>
           
           <div className="flex gap-3">
             <Link href="/products" className="bg-white border text-sm border-[#E8E6E1] text-brand-text hover:border-brand-primary/50 hover:bg-brand-bg px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 uppercase tracking-widest">
               Store <ChevronRight className="w-4 h-4 text-brand-primary" />
             </Link>
           </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SaaS Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[1.5rem] border border-[#E8E6E1] premium-shadow overflow-hidden sticky top-32 p-3">
                <nav className="flex flex-col gap-1">
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all rounded-xl ${
                      activeTab === "overview" 
                        ? "bg-brand-primary/10 text-brand-primary" 
                        : "text-brand-text-muted hover:bg-brand-bg hover:text-brand-text"
                    }`}
                  >
                    <Activity className={`w-4 h-4 ${activeTab === 'overview' ? 'text-brand-primary' : 'text-brand-text-muted'}`} /> 
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("addresses")}
                    className={`flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all rounded-xl ${
                      activeTab === "addresses" 
                        ? "bg-brand-primary/10 text-brand-primary" 
                        : "text-brand-text-muted hover:bg-brand-bg hover:text-brand-text"
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${activeTab === 'addresses' ? 'text-brand-primary' : 'text-brand-text-muted'}`} /> 
                    Address Book
                  </button>
                  <button 
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all rounded-xl ${
                      activeTab === "settings" 
                        ? "bg-brand-primary/10 text-brand-primary" 
                        : "text-brand-text-muted hover:bg-brand-bg hover:text-brand-text"
                    }`}
                  >
                    <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-brand-primary' : 'text-brand-text-muted'}`} /> 
                    Preferences
                  </button>
                </nav>
             </div>
          </div>

          {/* SaaS Content Area */}
          <div className="lg:col-span-3 min-h-[500px]">
            <AnimatePresence mode="wait">

              {activeTab === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-8"
                >
                  {/* Compact Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white rounded-[1.5rem] p-6 border border-[#E8E6E1] premium-shadow flex flex-col justify-between hover:border-brand-primary transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Lifetime Spend</p>
                        <CreditCard className="w-5 h-5 text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                      </div>
                      <p className="text-3xl font-black text-brand-text">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-white rounded-[1.5rem] p-6 border border-[#E8E6E1] premium-shadow flex flex-col justify-between hover:border-brand-primary transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-xs font-black text-brand-text-muted uppercase tracking-widest">Total Orders</p>
                        <ShoppingBag className="w-5 h-5 text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                      </div>
                      <p className="text-3xl font-black text-brand-text">{totalOrders}</p>
                    </div>

                    <div className="bg-brand-primary rounded-[1.5rem] p-6 border border-[#164a20] premium-shadow shadow-brand-primary/20 text-white flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="w-20 h-20" />
                      </div>
                      <p className="text-xs font-black text-brand-accent uppercase tracking-widest mb-4 z-10">Account Status</p>
                      <p className="text-2xl font-black text-white z-10 font-serif">Active Member</p>
                    </div>
                  </div>

                  {/* Orders Table - Compact */}
                  <div className="bg-white rounded-[1.5rem] border border-[#E8E6E1] premium-shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#E8E6E1] bg-brand-bg/50 flex justify-between items-center">
                      <h2 className="text-sm font-black text-brand-text uppercase tracking-widest">Purchase History</h2>
                    </div>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-16 px-4">
                        <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E6E1]">
                          <Package className="w-10 h-10 text-brand-primary/40" />
                        </div>
                        <h3 className="text-lg font-black text-brand-text mb-2 font-serif">No orders found</h3>
                        <p className="text-sm text-brand-text-muted mb-6 max-w-sm mx-auto">You haven't purchased anything yet. Explore our premium collection of nature's finest.</p>
                        <Link href="/products" className="bg-brand-primary text-white text-sm font-black py-3 px-6 rounded-xl hover:bg-[#164a20] transition-colors uppercase tracking-widest inline-flex premium-shadow">
                          Browse Store
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#E8E6E1]">
                        {orders.map((order: any) => (
                          <div key={order._id.toString()} className="hover:bg-brand-bg/50 transition-colors">
                            {/* Order Header Row */}
                            <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-5">
                                <div className="bg-brand-bg border border-[#E8E6E1] rounded-lg px-3 py-1.5 shadow-sm">
                                  <p className="text-xs font-mono font-bold text-brand-text">#{order._id.toString().substring(0, 8)}</p>
                                </div>
                                <div className="text-sm text-brand-text-muted font-medium flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-brand-primary/70" />
                                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-brand-text-muted uppercase tracking-widest bg-brand-bg/80 px-2 py-1 rounded-md border border-[#E8E6E1]">
                                   <CreditCard className="w-3.5 h-3.5" /> {order.paymentMethod || "Razorpay"}
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-start gap-5">
                                <div className="flex gap-2.5">
                                  <span className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border shadow-sm ${order.paymentStatus === 'PAID' ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]' : 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]'}`}>
                                    {order.paymentStatus}
                                  </span>
                                  <span className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border shadow-sm ${
                                    order.orderStatus === 'Delivered' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                    order.orderStatus === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                    order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                                    'bg-brand-bg text-brand-text-muted border-[#E8E6E1]'
                                  }`}>
                                    {order.orderStatus || 'Processing'}
                                  </span>
                                </div>
                                <p className="font-black text-lg text-brand-text sm:w-20 sm:text-right">₹{order.totalAmount}</p>
                              </div>
                              {/* Action buttons */}
                              <div className="flex items-center gap-2">
                                {((order.orderStatus === "Pending" || !order.orderStatus) && !order.cancellationRequested) && (
                                  <button
                                    onClick={() => cancelOrder(order._id.toString())}
                                    disabled={cancelling === order._id.toString()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-all disabled:opacity-50 uppercase tracking-widest shrink-0"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    {cancelling === order._id.toString() ? "Cancelling..." : "Cancel Order"}
                                  </button>
                                )}
                                {order.orderStatus === "Cancelled" && (
                                  <span className="text-xs font-black text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                    Cancelled
                                  </span>
                                )}
                                {order.awbNumber && (
                                  <a
                                    href={order.trackingUrl || `https://nimbuspost.com/tracking?awb=${order.awbNumber}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-brand-primary border border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-all uppercase tracking-widest shrink-0"
                                  >
                                    <Truck className="w-3.5 h-3.5" /> Track Live
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Shipment Status & Timeline (Amazon Style) */}
                            {order.orderStatus !== "Cancelled" && order.orderStatus !== "Pending" && (
                              <div className="px-6 py-4 bg-white/50 border-y border-[#E8E6E1]/50">
                                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                  {/* Delivery Visual Indicator */}
                                  <div className="flex-1">
                                    <div className="relative flex justify-between items-center mb-8">
                                      <div className="absolute h-0.5 w-full bg-gray-100 top-1/2 -translate-y-1/2 z-0"></div>
                                      <div className={`absolute h-0.5 bg-brand-primary top-1/2 -translate-y-1/2 z-0 transition-all duration-1000`} style={{ 
                                        width: order.orderStatus === 'Delivered' ? '100%' : 
                                               order.orderStatus === 'OutForDelivery' ? '75%' : 
                                               order.orderStatus === 'Shipped' ? '50%' : '25%' 
                                      }}></div>
                                      
                                      {['Placed', 'Shipped', 'Out', 'Delivered'].map((step, i) => {
                                        const isDone = (step === 'Placed') || 
                                                       (step === 'Shipped' && (['Shipped', 'OutForDelivery', 'Delivered'].includes(order.orderStatus))) ||
                                                       (step === 'Out' && (['OutForDelivery', 'Delivered'].includes(order.orderStatus))) ||
                                                       (step === 'Delivered' && order.orderStatus === 'Delivered');

                                        return (
                                          <div key={step} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isDone ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}>
                                              {isDone ? <CheckCircle className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-tight mt-2 ${isDone ? 'text-brand-text' : 'text-gray-400'}`}>{step}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    
                                    {order.currentShipmentStatus && (
                                      <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                          <Activity className="w-4 h-4 text-brand-primary" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-black text-brand-text">Latest Update: {order.currentShipmentStatus}</p>
                                          {order.statusTimeline && order.statusTimeline.length > 0 && (
                                            <p className="text-[11px] text-brand-text-muted mt-0.5 font-medium">
                                              {order.statusTimeline[order.statusTimeline.length - 1].description} • {new Date(order.statusTimeline[order.statusTimeline.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Shipment Metadata */}
                                  {order.awbNumber && (
                                    <div className="md:w-64 space-y-3 p-4 bg-brand-bg/40 rounded-2xl border border-[#E8E6E1]/50">
                                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-text-muted">
                                        <span>Courier</span>
                                        <span>Tracking ID</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs font-black text-brand-text">
                                        <span>{order.courierName || "NimbusPost"}</span>
                                        <span className="font-mono text-brand-primary">{order.awbNumber}</span>
                                      </div>
                                      <a href={order.labelUrl} target="_blank" className="block text-center text-[10px] font-black text-brand-primary underline uppercase tracking-widest hover:opacity-80 transition-opacity">
                                        View Shipment Label
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {/* Expandable Detailed History */}
                                <details className="group mt-4">
                                  <summary className="list-none cursor-pointer flex items-center justify-center gap-2 text-[10px] font-black text-brand-text-muted uppercase tracking-widest hover:text-brand-primary transition-colors">
                                    Show Detailed Journey <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                                  </summary>
                                  <div className="mt-4 pl-4 border-l-2 border-gray-100 flex flex-col gap-5 py-2">
                                    {order.statusTimeline?.map((evt: any, i: number) => (
                                      <div key={i} className="relative flex gap-4">
                                        <div className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white"></div>
                                        <div className="flex-1">
                                          <div className="flex justify-between items-start">
                                            <p className="text-xs font-black text-brand-text leading-tight">{evt.status}</p>
                                            <p className="text-[10px] font-bold text-brand-text-muted">{new Date(evt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                          </div>
                                          <p className="text-[11px] text-brand-text-muted mt-1 leading-relaxed">{evt.description}</p>
                                          {evt.location && <p className="text-[9px] font-black uppercase tracking-wider text-brand-primary mt-1 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {evt.location}</p>}
                                        </div>
                                      </div>
                                    )).reverse()}
                                  </div>
                                </details>
                              </div>
                            )}

                            {/* Line Items List */}
                            <div className="px-6 pb-6 pt-1">
                              <div className="bg-white border border-[#E8E6E1] rounded-xl overflow-hidden shadow-sm">
                                {order.products.map((item: any, idx: number) => (
                                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#E8E6E1] last:border-0 hover:bg-brand-bg/80 transition-colors">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-brand-bg rounded-lg flex items-center justify-center border border-[#E8E6E1] overflow-hidden shrink-0 p-1">
                                         {/* eslint-disable-next-line @next/next/no-img-element */}
                                         <img src={item.image && item.image !== "undefined" ? item.image : "https://placehold.co/100x100/f8f9fa/a0a0a0?text=No+Image"} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm text-brand-text leading-tight">{item.name}</p>
                                        <p className="text-brand-text-muted text-xs font-semibold mt-1">{item.quantity} × <span className="text-brand-primary">₹{item.price}</span></p>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 sm:mt-0 sm:text-right shrink-0">
                                      <ReviewFormModalClient productId={item.productId.toString()} productName={item.name} compact />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="bg-white rounded-[1.5rem] border border-[#E8E6E1] premium-shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#E8E6E1] bg-brand-bg/50">
                      <h2 className="text-sm font-black text-brand-text uppercase tracking-widest">Address Book</h2>
                    </div>
                    <div className="p-6">
                      <AddressManagerClient addresses={userProfile?.savedAddresses || []} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="bg-white rounded-[1.5rem] border border-[#E8E6E1] premium-shadow overflow-hidden">
                    <div className="px-6 py-5 border-b border-[#E8E6E1] bg-brand-bg/50">
                      <h2 className="text-sm font-black text-brand-text uppercase tracking-widest">Account Preferences</h2>
                    </div>
                    <div className="p-8">
                      <div className="space-y-6 max-w-lg">
                        <div>
                           <label className="block text-xs font-black text-brand-text-muted uppercase tracking-widest mb-2.5">Display Name</label>
                           <input type="text" disabled defaultValue={userProfile?.name} className="w-full px-4 py-3.5 bg-brand-bg border border-[#E8E6E1] rounded-xl text-sm text-brand-text-muted font-bold cursor-not-allowed shadow-inner" />
                           <p className="text-xs font-medium text-brand-text-muted mt-2.5">Names cannot be changed currently without Admin assistance.</p>
                        </div>
                        <div>
                           <label className="block text-xs font-black text-brand-text-muted uppercase tracking-widest mb-2.5">Email Address</label>
                           <input type="text" disabled defaultValue={userProfile?.email} className="w-full px-4 py-3.5 bg-brand-bg border border-[#E8E6E1] rounded-xl text-sm text-brand-text-muted font-bold cursor-not-allowed shadow-inner" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
