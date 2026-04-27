import { FilterSidebarSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-brand-bg min-h-screen pb-24">

      {/* Hero Slider Skeleton */}
      <div className="w-full h-[60vh] min-h-[400px] bg-gradient-to-r from-[#E8E5E0] via-[#F0EDE8] to-[#E8E5E0] animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Category pills skeleton */}
        <div className="flex gap-2 overflow-hidden mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 shrink-0 rounded-full bg-[#E8E5E0] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar skeleton */}
          <FilterSidebarSkeleton />

          {/* Grid skeleton */}
          <div className="flex-1">
            {/* Result count bar */}
            <div className="h-4 w-40 rounded-full bg-[#E8E5E0] animate-pulse mb-6" />
            <ProductGridSkeleton count={9} />
          </div>
        </div>

      </div>
    </div>
  );
}
