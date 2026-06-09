export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Order Tracking</h1>
    </main>
  );
}
