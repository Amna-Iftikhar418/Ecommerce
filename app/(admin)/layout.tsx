import Link from "next/link";
import { ChefHat, ArrowLeft } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import { getAdminUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAdminUser();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminMobileNav />
      <aside className="dark sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-background text-foreground lg:flex">
        <Link
          href="/admin"
          className="relative flex items-center gap-3 overflow-hidden border-b border-border px-6 py-6"
        >
          <span className="pointer-events-none absolute -left-10 -top-12 h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary),transparent_85%)]">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="relative flex flex-col leading-tight">
            <span className="font-heading text-lg font-bold">Bella Cucina</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Admin Panel
            </span>
          </span>
        </Link>
        <AdminNav />
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>
      </aside>
      <div className="flex-1 min-h-screen overflow-auto bg-background">
        {children}
      </div>
    </div>
  );
}
