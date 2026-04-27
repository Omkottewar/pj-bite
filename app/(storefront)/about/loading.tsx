import { Skeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="bg-white min-h-screen pb-24">

      {/* Hero */}
      <div className="bg-brand-bg py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <Skeleton className="h-6 w-24 rounded-full mx-auto" />
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-5 w-5/6 max-w-2xl mx-auto" />
          <Skeleton className="h-16 w-96 rounded-2xl mx-auto mt-6" />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-2 sm:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-3xl" />
        ))}
      </div>

      {/* Values */}
      <div className="bg-brand-bg py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-[2rem]" />
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-3 mb-12">
          <Skeleton className="h-4 w-40 rounded-full mx-auto" />
          <Skeleton className="h-10 w-48 rounded-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[2rem]" />
          ))}
        </div>
      </div>

    </div>
  );
}
