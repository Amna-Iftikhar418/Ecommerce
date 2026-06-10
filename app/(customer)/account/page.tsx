import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Package, MapPin, ChevronRight, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";

export default async function AccountPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const [dbUser, orderCount] = await Promise.all([
    db.user.findUnique({
      where: { id: clerkUser.id },
      include: { addresses: { orderBy: [{ isDefault: "desc" }, { id: "asc" }] } },
    }),
    db.order.count({ where: { userId: clerkUser.id } }),
  ]);

  const name = clerkUser.fullName ?? clerkUser.firstName ?? "Customer";
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const memberSince = new Date(clerkUser.createdAt).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });

  return (
    <div>
      <PageHeader eyebrow="Welcome back" title="My Account" />

      <main className="container mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Profile card */}
        <div className="mb-4 flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/15 font-heading text-xl font-bold text-accent">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-lg leading-tight">{name}</p>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
            <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-heading font-semibold mb-4">Order History</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Package className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-heading text-2xl font-bold">{orderCount}</p>
              <p className="text-sm text-muted-foreground">
                {orderCount === 1 ? "order placed" : "orders placed"}
              </p>
            </div>
          </div>
          {orderCount > 0 && (
            <Link
              href="/orders"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
            >
              View All Orders <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>

        {/* Saved Addresses */}
        {dbUser && dbUser.addresses.length > 0 && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-accent" />
              <h2 className="font-heading font-semibold">Saved Addresses</h2>
            </div>
            <div className="space-y-3">
              {dbUser.addresses.map((addr, i) => (
                <div key={addr.id}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {addr.label && (
                        <p className="text-xs font-medium text-accent uppercase tracking-wide mb-0.5">
                          {addr.label}
                        </p>
                      )}
                      <p className="text-sm">
                        {addr.line1}{addr.line2 && `, ${addr.line2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                    </div>
                    {addr.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5 shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Link
            href="/orders"
            className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Your Orders</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Separator />
          <Link
            href="/menu"
            className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Browse Menu</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </main>
    </div>
  );
}
