import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Package, MapPin, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

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
    <main className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* Profile card */}
      <div className="bg-white border rounded-2xl p-6 mb-4 flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-lg leading-tight">{name}</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
          <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border rounded-2xl p-6 mb-4">
        <h2 className="font-semibold mb-4">Order History</h2>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
            <Package className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{orderCount}</p>
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
        <div className="bg-white border rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-orange-500" />
            <h2 className="font-semibold">Saved Addresses</h2>
          </div>
          <div className="space-y-3">
            {dbUser.addresses.map((addr, i) => (
              <div key={addr.id}>
                {i > 0 && <Separator className="mb-3" />}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {addr.label && (
                      <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-0.5">
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
      <div className="bg-white border rounded-2xl overflow-hidden">
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
            <span className="text-muted-foreground text-lg leading-none">🍽</span>
            <span className="text-sm font-medium">Browse Menu</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </main>
  );
}
