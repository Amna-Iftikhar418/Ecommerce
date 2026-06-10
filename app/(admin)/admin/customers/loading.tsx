import PageHeaderSkeleton from "@/components/admin/PageHeaderSkeleton";
import TableSkeleton from "@/components/admin/TableSkeleton";

export default function AdminCustomersLoading() {
  return (
    <main className="p-6 sm:p-8 lg:p-10">
      <PageHeaderSkeleton />
      <TableSkeleton columns={4} rows={8} />
    </main>
  );
}
