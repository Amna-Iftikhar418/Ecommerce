import { Skeleton } from "@/components/ui/skeleton";
import PageHeaderSkeleton from "@/components/admin/PageHeaderSkeleton";
import TableSkeleton from "@/components/admin/TableSkeleton";

export default function AdminMenuLoading() {
  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <PageHeaderSkeleton />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-10 w-48 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <TableSkeleton columns={5} rows={6} />
    </main>
  );
}
