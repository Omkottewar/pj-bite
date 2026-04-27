"use client";

import { useState, useTransition } from "react";
import { Star, Loader2, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { createReview } from "@/app/actions/reviews";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";
import { showToast, showError } from "@/lib/swal";

export default function WriteReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error", message: string }>({ type: "idle", message: "" });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setStatus({ type: "error", message: "Please select a star rating." });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment") as string;
    const image = formData.get("image") as string || "";

    startTransition(async () => {
      const res = await createReview(productId, rating, comment, image);
      if (res.success) {
        setStatus({ type: "success", message: "Review submitted successfully! Thank you." });
        showToast("Review submitted! 💕");
        setRating(5);
        e.currentTarget.reset();
      } else {
        setStatus({ type: "error", message: res.error || "Failed to submit review." });
        showError("Review Error", res.error || "Failed to submit review.");
      }
    });
  };

  return (
    <div className="bg-[#fbfbfb] p-8 rounded-[2rem] border border-[#E8E6E1]/60 premium-shadow">
      <h3 className="text-[11px] font-black text-brand-text uppercase tracking-[0.2em] mb-6">
        Post A Review
      </h3>

      {status.type === "success" && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3 text-[13px] font-bold">
          <CheckCircle2 className="w-5 h-5" />
          {status.message}
        </div>
      )}

      {status.type === "error" && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-3 text-[13px] font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-text-muted mb-4">
            Satisfied Level
          </label>
          <div className="flex gap-2 cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`w-8 h-8 transition-all duration-300 ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400 scale-110"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-text-muted mb-4">
            Experience Details
          </label>
          <textarea
            name="comment"
            rows={4}
            placeholder="Share your artisanal dried fruit journey..."
            className="w-full px-5 py-4 bg-white border border-[#E8E6E1] rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all outline-none text-[14px] font-medium resize-none shadow-sm"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-brand-text-muted mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Product Snapshots
          </label>
          <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1]/80 shadow-sm">
            <CloudinaryUpload name="image" maxFiles={1} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-14 bg-brand-text text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Feedback"}
        </button>
      </form>
    </div>
  );
}
