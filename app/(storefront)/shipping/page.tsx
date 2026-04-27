import { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | PJ Bite",
  description: "Learn about PJ Bite's shipping methods, delivery times, and order tracking.",
};

export default function ShippingPolicyPage() {
  const lastUpdated = "March 23, 2025";

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-text font-serif tracking-tight mb-4">Shipping Policy</h1>
          <p className="text-sm text-brand-text-muted font-medium">Last Updated: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="bg-brand-bg rounded-3xl p-8 border border-[#E8E6E1] mb-10">
          <p className="text-brand-text-muted leading-relaxed font-medium">
            We are committed to delivering your PJ Bite products safely and on time. Please read our Shipping Policy 
            carefully to understand our processing times, delivery options, and other details related to order fulfillment.
          </p>
        </div>

        {/* Shipping Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            { label: "Processing Time", value: "1–2 Business Days", icon: "⏱️" },
            { label: "Delivery Time", value: "4–7 Business Days", icon: "🚚" },
            { label: "Free Shipping", value: "Orders above ₹499", icon: "🎁" },
          ].map((item) => (
            <div key={item.label} className="bg-brand-bg rounded-3xl p-6 text-center border border-[#E8E6E1] premium-shadow">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-base font-black text-brand-text mb-1">{item.value}</div>
              <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10 text-brand-text-muted font-medium leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">1. Order Processing</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Orders are processed within <strong className="text-brand-text">1–2 business days</strong> (Monday–Saturday, excluding public holidays).</li>
              <li>You will receive an order confirmation email immediately after placing your order.</li>
              <li>Orders placed after 2:00 PM IST will be processed the next business day.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">2. Shipping & Delivery</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>We ship across India via trusted courier partners (Shiprocket, DTDC, BlueDart, etc.).</li>
              <li>Standard delivery takes <strong className="text-brand-text">4–7 business days</strong> from the date of dispatch.</li>
              <li>Remote or rural locations may experience slight delays of 1–3 additional days.</li>
              <li>Once your order is dispatched, you will receive a tracking ID via email and SMS.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">3. Shipping Charges</h2>
            <div className="bg-brand-bg rounded-2xl p-6 border border-[#E8E6E1] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E6E1]">
                    <th className="text-left font-black text-brand-text uppercase tracking-widest text-xs pb-3">Order Value</th>
                    <th className="text-right font-black text-brand-text uppercase tracking-widest text-xs pb-3">Shipping Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E1]">
                  <tr>
                    <td className="py-3">Below ₹499</td>
                    <td className="py-3 text-right font-bold text-brand-text">₹49</td>
                  </tr>
                  <tr>
                    <td className="py-3">₹499 and above</td>
                    <td className="py-3 text-right font-black text-brand-primary">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">4. Order Tracking</h2>
            <p>
              Once your order has been dispatched, you'll receive a tracking number via email. You can use this number 
              on the respective courier partner's website to track your delivery in real time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">5. Undeliverable Packages</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>If a package is returned to us due to an incorrect/incomplete address, the customer is responsible for re-shipping charges.</li>
              <li>If a delivery attempt is made 3 times without success and no response is received from the customer, the shipment will be returned to us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">6. Damaged or Lost Packages</h2>
            <p>
              If your order arrives damaged or is lost in transit, please contact us within <strong className="text-brand-text">48 hours</strong> of the 
              expected delivery date with your order number and photographs (if damaged). We will arrange a replacement or full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">7. Contact Us</h2>
            <div className="mt-4 bg-brand-bg rounded-2xl p-6 border border-[#E8E6E1]">
              <p><strong className="text-brand-text">PJ Bite</strong></p>
              <p>Email: <a href="mailto:infopjbite@gmail.com" className="text-brand-primary hover:underline font-bold">infopjbite@gmail.com</a></p>
              <p>Phone: +91 7744929395</p>
              <p>Support Hours: Mon–Sat, 9:00 AM – 6:00 PM IST</p>
            </div>
          </section>

        </div>

        {/* Policy Links */}
        <div className="mt-16 pt-10 border-t border-[#E8E6E1]">
          <p className="text-sm text-brand-text-muted font-medium text-center mb-6">Related Policies</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy" className="font-bold text-brand-primary hover:underline">Privacy Policy</Link>
            <span className="text-[#E8E6E1]">•</span>
            <Link href="/terms" className="font-bold text-brand-primary hover:underline">Terms of Service</Link>
            <span className="text-[#E8E6E1]">•</span>
            <Link href="/refunds" className="font-bold text-brand-primary hover:underline">Refunds & Returns</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
