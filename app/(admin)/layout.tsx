import Link from "next/link";
import { ChefHat } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 flex flex-col shrink-0 sticky top-0 h-screen">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-5 border-b border-gray-800"
        >
          <ChefHat className="h-5 w-5 text-orange-400" />
          <span className="font-bold text-white">Admin Panel</span>
        </Link>
        <AdminNav />
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
      <div className="flex-1 min-h-screen bg-gray-50 overflow-auto">
        {children}
      </div>
    </div>
  );
}
