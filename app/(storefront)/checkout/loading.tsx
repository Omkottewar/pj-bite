import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="bg-brand-bg min-h-screen pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form column */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px] rounded-[2rem]" />
            <Skeleton className="h-[200px] rounded-[2rem]" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <Skeleton className="h-[350px] rounded-[2rem]" />
          </div>
        </div>

      </div>
    </div>
  );
}
