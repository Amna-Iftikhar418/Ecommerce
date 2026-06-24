"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  ImagePlus,
  Upload,
  X,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  slug: string;
  categoryId: string;
  category: Category;
  isAvailable: boolean;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  slug: string;
  isAvailable: boolean;
  image: string;
};

const BLANK: FormState = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  slug: "",
  isAvailable: true,
  image: "",
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MenuClient({
  initialItems,
  categories,
}: {
  initialItems: MenuItem[];
  categories: Category[];
}) {
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormState>(BLANK);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(BLANK);
    setOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      categoryId: item.categoryId,
      slug: item.slug,
      isAvailable: item.isAvailable,
      image: item.image ?? "",
    });
    setOpen(true);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : toSlug(name),
    }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error();
      const { url } = (await res.json()) as { url: string };
      setForm((f) => ({ ...f, image: url }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.categoryId || !form.slug) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        slug: form.slug,
        isAvailable: form.isAvailable,
        image: form.image || null,
      };

      if (editing) {
        const res = await fetch(`/api/admin/menu/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update item");
        const updated = (await res.json()) as MenuItem;
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? updated : i))
        );
        toast.success("Item updated");
      } else {
        const res = await fetch("/api/admin/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          throw new Error(err.error ?? "Failed to create item");
        }
        const created = (await res.json()) as MenuItem;
        setItems((prev) => [created, ...prev]);
        toast.success("Item created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed");
      }
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Item deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete item");
    }
  }

  async function handleToggleAvailability(item: MenuItem) {
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
        )
      );
    } catch {
      toast.error("Failed to update availability");
    }
  }

  const columns = [
    {
      header: "Item",
      cell: (item: MenuItem) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {item.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (item: MenuItem) => (
        <Badge variant="outline" className="text-xs">
          {item.category.name}
        </Badge>
      ),
    },
    {
      header: "Price",
      cell: (item: MenuItem) => (
        <span className="font-semibold">${item.price.toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      cell: (item: MenuItem) => (
        <button
          onClick={() => handleToggleAvailability(item)}
          className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
            item.isAvailable
              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              : "bg-muted text-muted-foreground border-border hover:bg-secondary"
          }`}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </button>
      ),
    },
    {
      header: "",
      cell: (item: MenuItem) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(item)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(item)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      className: "w-20",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} items</p>
        <Button
          onClick={openAdd}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No menu items yet. Add your first item."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <UtensilsCrossed className="h-5 w-5 text-accent" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg">
                  {editing ? "Edit Menu Item" : "Add Menu Item"}
                </DialogTitle>
                <DialogDescription>
                  {editing
                    ? `Update details for "${editing.name}"`
                    : "Add a new dish to your menu"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-1">
            <div>
              <Label>Photo</Label>
              <div className="mt-1.5">
                {form.image ? (
                  <div className="group relative h-40 w-full overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      sizes="(max-width: 640px) 100vw, 512px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-white">
                        <Upload className="h-3.5 w-3.5" />
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image: "" }))}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm hover:bg-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    className={cn(
                      "flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-accent hover:bg-accent/5",
                      uploading && "pointer-events-none opacity-60"
                    )}
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload a photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleImageUpload(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <Label>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Grilled Salmon"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Fresh Atlantic salmon with herbs..."
                rows={3}
                className="mt-1.5"
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  Price ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="12.99"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, categoryId: v ?? "" }))
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))
                  }
                  placeholder="grilled-salmon"
                  className="mt-1.5 font-mono text-sm"
                />
              </div>
              <div>
                <Label>Availability</Label>
                <Select
                  value={form.isAvailable ? "true" : "false"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, isAvailable: (v ?? "true") === "true" }))
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={saving || uploading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently remove the item from your menu. This cannot be undone."
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
        }}
      />
    </>
  );
}
