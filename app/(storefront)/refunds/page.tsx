import { Metadata } from "next";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Refunds, Returns & Cancellation Policy | PJ Bite",
  description: "Learn about PJ Bite's refund, return and cancellation policy for food products.",
};

export default function RefundsPage() {
  const lastUpdated = "March 2025";

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RefreshCcw className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-text font-serif tracking-tight mb-4">Refunds, Returns & Cancellation Policy</h1>
          <p className="text-sm text-brand-text-muted font-medium">Last Updated: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="bg-brand-bg rounded-3xl p-8 border border-[#E8E6E1] mb-10">
          <p className="text-brand-text-muted leading-relaxed font-medium">
            At PJ Bite, we are committed to delivering high-quality, natural food products. This policy outlines the terms governing refunds, returns, and cancellations to ensure transparency and a seamless customer experience.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-brand-text-muted font-medium leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">1. Definitions</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-brand-text">Company</strong> refers to PJ Bite</li>
              <li><strong className="text-brand-text">Customer</strong> refers to any individual placing an order</li>
              <li><strong className="text-brand-text">Products</strong> refer to all food items sold on our platform</li>
              <li><strong className="text-brand-text">Order</strong> refers to a confirmed purchase</li>
              <li><strong className="text-brand-text">Delivery</strong> refers to successful receipt of the product</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">2. Eligibility for Returns & Refunds</h2>
            <p className="mb-4">Return/refund requests will be considered only under the following conditions:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 mb-4">
              <li>Product received is <strong className="text-brand-text">damaged, defective, or tampered</strong></li>
              <li>Product is <strong className="text-brand-text">expired or spoiled</strong> at delivery</li>
              <li><strong className="text-brand-text">Incorrect product</strong> delivered</li>
              <li><strong className="text-brand-text">Missing items</strong> in the order</li>
            </ul>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-blue-700 font-bold">📌 Requests must be raised within 12 hours of delivery</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">3. Non-Returnable Conditions</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <p className="text-red-700 font-bold mb-3">⚠️ Due to the consumable nature of our products, returns are not accepted in the following cases:</p>
              <ul className="list-disc list-inside space-y-2 text-red-600 pl-2">
                <li>Change of mind or personal preference</li>
                <li>Opened, consumed, or partially used products</li>
                <li>Products purchased under discounts or promotional offers (unless defective)</li>
                <li>Requests raised after 12 hours</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">4. Important Quality Disclaimer</h2>
            <p className="mb-2">Our products are made from natural ingredients.</p>
            <p>Slight variations in color, texture, taste, or appearance are normal and do not qualify as defects.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">5. Return Request Process</h2>
            <p className="mb-4">Customers must:</p>
            <ol className="list-decimal list-inside space-y-3 pl-2 mb-4">
              <li>Contact <a href="mailto:infopjbite@gmail.com" className="text-brand-primary font-bold hover:underline">infopjbite@gmail.com</a> or <strong className="text-brand-text">+91 7744929395</strong></li>
              <li>Provide Order ID, issue details, and clear images/videos</li>
              <li>Submit request within 12 hours</li>
            </ol>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-blue-700 font-bold">⚠️ We recommend recording an unboxing video for faster resolution.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">6. Approval & Verification</h2>
            <p>All requests are subject to verification.</p>
            <p>PJ Bite reserves the right to approve or reject claims based on investigation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">7. Refund Options</h2>
            <p className="mb-4">Upon approval:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 mb-4">
              <li><strong className="text-brand-text">Original Payment Method:</strong> Processed within 5–7 business days</li>
              <li><strong className="text-brand-text">Store Credit:</strong> Instant credit to PJ Bite wallet</li>
              <li><strong className="text-brand-text">Replacement:</strong> Fresh product dispatched at no extra cost</li>
            </ul>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="text-gray-700 font-bold">👉 For Cash on Delivery orders, refunds may be processed via bank transfer or store credit</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">8. Order Cancellation</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Orders can be cancelled within <strong className="text-brand-text">1 hours</strong> of placement</li>
              <li>Cancellation is not allowed after dispatch</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">9. Shipping & Delivery Disclaimer</h2>
            <p className="mb-4">PJ Bite is not liable for delays caused by:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Courier partner issues</li>
              <li>Weather conditions</li>
              <li>External logistical disruptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">10. Misuse & Fraud Protection</h2>
            <p className="mb-4">PJ Bite reserves the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Reject claims in case of fraudulent or repeated misuse</li>
              <li>Suspend accounts engaging in suspicious activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">11. Limitation of Liability</h2>
            <p>PJ Bite’s liability is limited to the value of the purchased product only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">12. Force Majeure</h2>
            <p>PJ Bite shall not be held responsible for failure to perform obligations due to events beyond control, including natural disasters, strikes, or government restrictions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">13. Policy Updates</h2>
            <p>PJ Bite reserves the right to update or modify this policy at any time without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">14. Jurisdiction</h2>
            <p>All disputes shall be subject to the jurisdiction of courts in <strong className="text-brand-text">Wardha, Maharashtra, India</strong>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">15. Contact Us</h2>
            <div className="bg-brand-bg rounded-2xl p-6 border border-[#E8E6E1]">
              <p><strong className="text-brand-text">PJ Bite Customer Support</strong></p>
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
            <Link href="/shipping" className="font-bold text-brand-primary hover:underline">Shipping Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
