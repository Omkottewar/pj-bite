import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="bg-brand-bg min-h-screen pt-8 pb-24">
      <DashboardSkeleton />
    </div>
  );
}
