interface SkeletonProps {
  className?: string;
}

/** Base pulsing skeleton block */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse rounded-2xl bg-gradient-to-r from-[#F0EDE8] via-[#E8E5E0] to-[#F0EDE8] bg-[length:200%_100%]",
        "[animation:shimmer_1.6s_ease-in-out_infinite]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/** Single product card skeleton */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-[#E8E6E1] overflow-hidden flex flex-col">
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      {/* Body */}
      <div className="p-6 flex-1 space-y-3">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full mt-4 rounded-xl" />
      </div>
    </div>
  );
}

/** Product grid skeleton (full page) */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Blog card skeleton */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-[#E8E6E1] overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-3 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Blog grid skeleton */
export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Hero banner skeleton */
export function HeroBannerSkeleton() {
  return <Skeleton className="w-full h-[60vh] min-h-[400px] rounded-none" />;
}

/** Detail page skeleton (product or blog) */
export function DetailPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image column */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-[2rem]" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        {/* Content column */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-14 rounded-2xl" />
            <Skeleton className="h-14 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sidebar filter skeleton */
export function FilterSidebarSkeleton() {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="bg-white rounded-[2rem] border border-[#E8E6E1] p-6 space-y-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-xl" />
        ))}
        <div className="pt-2 space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-xl" />
          ))}
        </div>
      </div>
    </aside>
  );
}

/** Page content skeleton (text-heavy pages like About/Privacy etc) */
export function TextPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
      <div className="text-center space-y-4 mb-16">
        <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
        <Skeleton className="h-12 w-64 rounded-2xl mx-auto" />
        <Skeleton className="h-4 w-32 rounded-full mx-auto" />
      </div>
      <Skeleton className="h-28 w-full rounded-3xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-7 w-56 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Dashboard skeleton */
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-[2rem]" />
        ))}
      </div>
      {/* Orders table */}
      <div className="bg-white rounded-[2rem] border border-[#E8E6E1] p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
