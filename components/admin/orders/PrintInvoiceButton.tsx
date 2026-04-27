"use client";

import { Printer } from "lucide-react";

export default function PrintInvoiceButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 text-sm font-semibold text-gray-900 border border-gray-900 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors print:hidden"
      title="Print Invoice"
    >
      <Printer className="w-4 h-4" /> Print Invoice
    </button>
  );
}
