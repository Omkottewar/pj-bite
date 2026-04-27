import { Skeleton } from "@/components/ui/Skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left brand panel */}
      <Skeleton className="hidden lg:block rounded-none min-h-screen" />

      {/* Right form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3 mb-8">
            <Skeleton className="h-12 w-12 rounded-2xl mx-auto" />
            <Skeleton className="h-8 w-48 rounded-2xl mx-auto" />
            <Skeleton className="h-4 w-64 rounded-full mx-auto" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}
