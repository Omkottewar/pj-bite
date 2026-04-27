"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-[2rem] premium-shadow border border-[#E8E6E1]">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-black text-brand-text font-serif tracking-tight mb-4">
          Something went wrong!
        </h2>
        
        <p className="text-brand-text-muted font-medium mb-10 leading-relaxed">
          We apologize for the inconvenience. An unexpected error has occurred on our end.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary hover:bg-[#164a20] text-white font-bold py-3.5 px-8 rounded-full transition-colors uppercase tracking-widest text-sm"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-bg hover:bg-[#E8E6E1] text-brand-text font-bold py-3.5 px-8 rounded-full transition-colors uppercase tracking-widest text-sm"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
