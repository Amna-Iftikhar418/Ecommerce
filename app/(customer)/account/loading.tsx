import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-4 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row">
        <Skeleton className="h-[72px] w-[72px] shrink-0 rounded-full" />
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <Skeleton className="h-5 w-40 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-52 mx-auto sm:mx-0" />
          <Skeleton className="h-3 w-32 mx-auto sm:mx-0" />
        </div>
        <Skeleton className="h-7 w-36 rounded-lg" />
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
