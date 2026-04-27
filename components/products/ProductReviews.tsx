import { getProductReviews, checkReviewEligibility } from "@/app/actions/reviews";
import { Star, ShieldCheck, User as UserIcon, MessageSquare } from "lucide-react";
import WriteReviewForm from "./WriteReviewForm";

export default async function ProductReviews({ productId }: { productId: string }) {
  const { reviews, stats } = await getProductReviews(productId);
  const eligibility = await checkReviewEligibility(productId);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Aggregates & Eligibility */}
        <div className="lg:col-span-4 flex flex-col lg:sticky lg:top-32">
          <div className="bg-white p-8 rounded-[2rem] border border-[#E8E6E1]/80 premium-shadow">
            <h3 className="text-[11px] font-black text-brand-text uppercase tracking-[0.2em] mb-8">Ratings Overview</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-5xl font-black text-brand-text tracking-tighter leading-none">{stats.average.toFixed(1)}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-text-muted mt-3 ml-1">Out of 5 Stars</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.round(stats.average) ? "fill-current" : "text-gray-100"}`} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-500 ml-0.5">
                  {stats.total} {stats.total === 1 ? 'verified review' : 'verified reviews'}
                </span>
              </div>
            </div>

            {/* Distribution Graph (Visual Polish) */}
            <div className="space-y-3 pt-6 border-t border-[#E8E6E1]/50">
               {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r:any) => Math.round(r.rating) === rating).length;
                  const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-brand-text-muted w-3">{rating}</span>
                      <div className="flex-1 h-1.5 bg-brand-bg rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )
               })}
            </div>

            {/* Eligibility Resolution */}
            <div className="mt-10">
              {eligibility.eligible ? (
                <WriteReviewForm productId={productId} />
              ) : (
                <div className="bg-brand-bg/50 p-6 rounded-2xl border border-[#E8E6E1]/50 text-center flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-gray-300 mb-3" />
                  <p className="text-[13px] font-black text-brand-text-muted mb-1 uppercase tracking-wider">Verified Buyers Only</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{eligibility.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Review List */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {reviews.length === 0 ? (
            <div className="py-20 bg-brand-bg/40 rounded-[2.5rem] border border-dashed border-[#E8E6E1] flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-1">Pristine Feedback</h3>
              <p className="text-sm text-gray-400 font-medium">Be the first to share your artisanal experience!</p>
            </div>
          ) : (
            reviews.map((review: any) => (
              <div key={review._id} className="p-8 sm:p-10 bg-white border border-[#E8E6E1]/80 rounded-[2rem] premium-shadow transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-brand-bg flex items-center justify-center flex-shrink-0 border border-[#E8E6E1]/50 relative">
                      <UserIcon className="w-6 h-6 text-brand-text-muted" />
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-brand-primary" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-brand-text tracking-tight">{review.user.name}</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/5 text-brand-primary rounded-full text-[9px] uppercase tracking-[0.15em] font-black border border-brand-primary/10">
                          Verified Purchase
                        </span>
                      </div>
                      <span className="text-[11px] uppercase tracking-widest font-black text-brand-text-muted mt-1.5">
                        {new Date(review.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-100"}`} />
                    ))}
                  </div>
                </div>
                
                {review.comment && (
                  <div className="relative">
                     <span className="absolute -left-4 top-0 text-brand-primary/10 text-6xl font-serif select-none">“</span>
                     <p className="text-brand-text-muted text-[14px] leading-[1.7] font-medium mt-2 italic">
                        {review.comment}
                     </p>
                  </div>
                )}
                
                {review.image && (
                  <div className="mt-8 rounded-[1.5rem] overflow-hidden border border-[#E8E6E1]/60 premium-shadow max-w-lg group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={review.image} 
                      alt="Customer review attachment" 
                      className="w-full h-auto max-h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
