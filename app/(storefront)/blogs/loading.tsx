import { BlogGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function BlogsLoading() {
  return (
    <div className="bg-white min-h-screen pb-24">

      {/* Hero section */}
      <div className="bg-brand-bg py-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Skeleton className="h-6 w-28 rounded-full mx-auto" />
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full max-w-lg mx-auto" />
          <Skeleton className="h-5 w-5/6 max-w-lg mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogGridSkeleton count={6} />
      </div>

    </div>
  );
}
