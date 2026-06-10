import { Skeleton } from "@/components/ui/skeleton";
import PageHeaderSkeleton from "@/components/admin/PageHeaderSkeleton";

export default function AdminSettingsLoading() {
  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <PageHeaderSkeleton />
      <div className="max-w-2xl space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
