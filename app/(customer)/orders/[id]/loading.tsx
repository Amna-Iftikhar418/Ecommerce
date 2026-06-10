import { Skeleton } from "@/components/ui/skeleton";

export default function OrderTrackingLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="rounded-xl border p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              {i < 3 && <Skeleton className="h-1 flex-1" />}
            </div>
          ))}
        </div>
        {/* Order items */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
