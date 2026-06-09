export default function DishDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  void params;
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Dish Detail</h1>
    </main>
  );
}
