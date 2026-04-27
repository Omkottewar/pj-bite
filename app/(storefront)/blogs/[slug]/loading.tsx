import { Skeleton } from "@/components/ui/Skeleton";

export default function BlogDetailLoading() {
  return (
    <div className="bg-white min-h-screen pb-24">

      {/* Hero image */}
      <Skeleton className="w-full h-[50vh] min-h-[360px] rounded-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Category + date */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />

        {/* Author row */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-36 rounded-full" />
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E8E6E1]" />

        {/* Body paragraphs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-4/5 rounded-full" />
          </div>
        ))}

        {/* Inline image */}
        <Skeleton className="h-72 w-full rounded-2xl" />

        {/* More paragraphs */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
          </div>
        ))}
      </div>

    </div>
  );
}
