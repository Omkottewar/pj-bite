"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import { showToast, showError } from "@/lib/swal";

interface ProductShareButtonProps {
  productName: string;
}

export default function ProductShareButton({ productName }: ProductShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${productName} | Nature's Nutrition`,
      text: `Check out this amazing product from PJ Bite: ${productName}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        showToast("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        showError("Share Error", "Could not share product.");
        console.error("Share error:", err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E8E6E1] bg-white text-brand-text hover:text-brand-primary hover:border-brand-primary transition-colors shrink-0 premium-shadow group relative" 
      aria-label="Share Product"
    >
      {copied ? (
        <Check className="w-5 h-5 text-emerald-600" />
      ) : (
        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      )}
      
      {/* Tooltip for desktop accessibility */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-text text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {copied ? "Copied!" : "Share Link"}
      </span>
    </button>
  );
}
