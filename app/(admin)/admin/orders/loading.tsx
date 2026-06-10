import { Skeleton } from "@/components/ui/skeleton";
import PageHeaderSkeleton from "@/components/admin/PageHeaderSkeleton";
import TableSkeleton from "@/components/admin/TableSkeleton";

export default function AdminOrdersLoading() {
  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <PageHeaderSkeleton />
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <TableSkeleton columns={6} rows={7} />
    </main>
  );
}
