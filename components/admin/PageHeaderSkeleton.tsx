import { Skeleton } from "@/components/ui/skeleton";

export default function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="mb-3 h-4 w-32" />
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-3 h-4 w-72" />
    </div>
  );
}
