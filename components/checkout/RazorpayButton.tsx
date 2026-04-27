"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import Script from "next/script";

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function RazorpayButton({ productId, price, variantName, image }: { productId: string, price: number, variantName?: string, image?: string }) {
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async () => {
    // In a full app, these would come from a form via a Modal before paying
    const testCustomer: CustomerDetails = {
      name: "Test User",
      email: "test@example.com",
      phone: "9999999999",
      address: "123 Main St, Mumbai"
    };

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
          customerDetails: testCustomer,
          price,
          variantName,
          image
        }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SBmaoMPlHuejMQ", 
        amount: data.amount,
        currency: data.currency,
        name: "Fruit Bite",
        description: "Purchase " + data.product.name,
        order_id: data.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productInfo: data.product,
              customerDetails: testCustomer,
              quantity: 1
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Order ID: " + verifyData.orderId);
            window.location.href = "/";
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: testCustomer.name,
          email: testCustomer.email,
          contact: testCustomer.phone,
        },
        theme: {
          color: "#27ae60",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong initializing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button 
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-4 bg-gray-900 border border-gray-900 text-white text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? "Processing..." : "Buy it now"}
      </button>
    </>
  );
}
