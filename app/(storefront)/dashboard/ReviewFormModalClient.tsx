"use client";

import { useState } from "react";
import { createReview } from "@/app/actions/reviews";
import { Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/swal";

export default function ReviewFormModalClient({ 
  productId, 
  productName,
  compact = false
}: { 
  productId: string, 
  productName: string,
  compact?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createReview(productId, rating, comment);
      if (!res.success) throw new Error(res.error || "Failed to submit review.");
      
      showToast("Review successfully posted!", "success");
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to submit review.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`${compact ? 'text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50' : 'text-sm hover:underline'} font-bold text-brand-primary flex items-center gap-1.5 transition-colors`}
      >
        <MessageSquare className="w-4 h-4" /> 
        {compact ? "Review" : "Review Product"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl p-8 max-w-lg w-full premium-shadow z-10"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review {productName}</h2>
              <p className="text-gray-500 mb-6">Your honest feedback helps our community.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} type="button" 
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-100"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea 
                    required 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Tell us what you think about the taste, packaging, and quality..."
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-brand-primary hover:bg-[#164a20] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75 disabled:cursor-wait"
                  >
                    {loading ? "Posting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
