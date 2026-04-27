import { DetailPageSkeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="bg-white min-h-screen">
      <DetailPageSkeleton />
    </div>
  );
}
