import { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | PJ Bite",
  description: "Read PJ Bite's terms and conditions governing the use of our website and services.",
};

export default function TermsPage() {
  const lastUpdated = "March 23, 2025";

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-text font-serif tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm text-brand-text-muted font-medium">Last Updated: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="bg-brand-bg rounded-3xl p-8 border border-[#E8E6E1] mb-10">
          <p className="text-brand-text-muted leading-relaxed font-medium">
            Welcome to PJ Bite. By accessing or using our website, you agree to be bound by these Terms of Service and 
            all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
            using or accessing this site.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-brand-text-muted font-medium leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">1. Use of the Website</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>You must be at least 18 years of age to use this website.</li>
              <li>You agree not to use the site for any unlawful purpose or in any way that could harm PJ Bite or its users.</li>
              <li>You are responsible for maintaining the confidentiality of your account and password.</li>
              <li>You agree to notify us immediately of any unauthorized access to your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">2. Products & Orders</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>We reserve the right to modify or discontinue products without notice.</li>
              <li>We reserve the right to refuse or cancel any order for any reason, including suspected fraud.</li>
              <li>Product descriptions are as accurate as possible; minor variations may occur.</li>
              <li>Prices are subject to change without notice. The price at the time of order placement is the price you pay.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">3. Payments</h2>
            <p className="mb-4">
              Payments are processed securely via Razorpay. By completing a purchase, you represent that you are authorized 
              to use the payment method provided. All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">4. Intellectual Property</h2>
            <p>
              All content on the PJ Bite website — including text, graphics, logos, images, and software — is the property 
              of PJ Bite and is protected by applicable intellectual property laws. You may not reproduce, distribute, or 
              create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">5. Disclaimer of Warranties</h2>
            <p>
              The website and its contents are provided "as is" without any warranty of any kind, express or implied. 
              PJ Bite does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, PJ Bite shall not be liable for any indirect, incidental, special, 
              or consequential damages arising from your use of the website or any products purchased through it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">7. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes 
              arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">8. Changes to Terms</h2>
            <p>
              PJ Bite reserves the right to update these terms at any time. Continued use of the website after changes 
              constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-brand-text font-serif mb-4">9. Contact Us</h2>
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
            <Link href="/shipping" className="font-bold text-brand-primary hover:underline">Shipping Policy</Link>
            <span className="text-[#E8E6E1]">•</span>
            <Link href="/refunds" className="font-bold text-brand-primary hover:underline">Refunds & Returns</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
