"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat, Menu, ArrowLeft } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AdminNav from "./AdminNav";

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="dark sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background px-4 py-3 text-foreground lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/admin" className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ChefHat className="h-4 w-4" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-heading text-sm font-bold">Bella Cucina</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Admin Panel
          </span>
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="dark flex w-72 flex-col border-border bg-background p-0 text-foreground"
        >
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="flex items-center gap-2.5 font-heading text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ChefHat className="h-4 w-4" />
              </span>
              Bella Cucina Admin
            </SheetTitle>
          </SheetHeader>
          <AdminNav onNavigate={() => setOpen(false)} />
          <div className="border-t border-border p-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
