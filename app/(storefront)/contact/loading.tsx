import { Skeleton } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-6 w-28 rounded-full mx-auto" />
          <Skeleton className="h-14 w-64 rounded-2xl mx-auto" />
          <Skeleton className="h-5 w-full max-w-md mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left info panel */}
          <div className="lg:col-span-2">
            <Skeleton className="h-[420px] rounded-[2.5rem]" />
          </div>
          {/* Right form */}
          <div className="lg:col-span-3">
            <Skeleton className="h-[420px] rounded-[2.5rem]" />
          </div>
        </div>

      </div>
    </div>
  );
}
