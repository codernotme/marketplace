"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useProductsStore, useCategoriesStore, useBrandsStore } from "@/lib/store";
import type { Product } from "@/lib/mock-data";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, updateProduct } = useProductsStore();
  const { categories } = useCategoriesStore();
  const { brands } = useBrandsStore();

  const productToEdit = products.find((p) => p.id === id);

  const [form, setForm] = useState<Product | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    if (productToEdit) {
      setForm({ ...productToEdit });
    } else {
      router.push("/dashboard/inventory/products");
    }
  }, [productToEdit, router]);

  if (!form) return <div className="p-10 text-center text-muted font-bold">Loading...</div>;

  const set = (key: keyof Product, value: any) => setForm((f) => f ? ({ ...f, [key]: value }) : null);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => set("tags", form.tags.filter((x) => x !== t));

  const addImage = () => {
    if (imageUrlInput.trim()) {
      set("images", [...form.images, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const addVariant = () =>
    set("variants", [...form.variants, { id: `v_${Date.now()}`, name: "", price: form.price, stock: 0 }]);

  const updateVariant = (idx: number, key: string, value: string | number) => {
    const v = [...form.variants];
    v[idx] = { ...v[idx], [key]: value };
    set("variants", v);
  };

  const handleSave = () => {
    if (form) {
      updateProduct(form.id, form);
      setSaved(true);
      setTimeout(() => { router.push("/dashboard/inventory/products"); }, 1200);
    }
  };

  const SECTIONS = [
    { key: "basic", label: "Basic Info", icon: "solar:info-circle-bold-duotone" },
    { key: "media", label: "Images", icon: "solar:gallery-bold-duotone" },
    { key: "pricing", label: "Pricing", icon: "solar:tag-bold-duotone" },
    { key: "inventory", label: "Variants", icon: "solar:box-bold-duotone" },
    { key: "flags", label: "Flags & Tags", icon: "solar:flag-bold-duotone" },
  ];

  const inputCls = "w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors";
  const labelCls = "block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Edit Product"
        subtitle={`Updating: ${productToEdit?.title}`}
        icon="solar:pen-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onPress={() => router.push("/dashboard/inventory/products")}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onPress={handleSave}
              isDisabled={!form.title || !form.price}
            >
              <Icon icon={saved ? "solar:check-circle-bold-duotone" : "solar:floppy-disk-bold-duotone"} className="text-base" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex lg:flex-col gap-1 p-1 bg-surface border border-border rounded-2xl lg:w-44 h-fit flex-shrink-0 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink ${
                activeSection === s.key ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-default/60"
              }`}
            >
              <Icon icon={s.icon} className="text-base flex-shrink-0" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeSection === "basic" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base mb-2">Basic Information</h3>
              <div>
                <label className={labelCls}>Product Title *</label>
                <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug (URL)</label>
                  <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Brand</label>
                  <input list="brands-list" type="text" value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls} />
                  <datalist id="brands-list">
                    {brands.map((b) => <option key={b.id} value={b.name} />)}
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {activeSection === "media" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base mb-2">Product Images</h3>
              <div className="flex gap-2">
                <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addImage()} placeholder="https://..." className={`${inputCls} flex-1`} />
                <Button variant="secondary" size="sm" onPress={addImage}>Add</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-default border border-border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 bg-danger text-white rounded-full text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "pricing" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base mb-2">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Selling Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Compare at (₹)</label>
                  <input type="number" value={form.comparePrice ?? ""} onChange={(e) => set("comparePrice", e.target.value ? Number(e.target.value) : null)} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {activeSection === "inventory" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base">Variants</h3>
                <Button variant="secondary" size="sm" onPress={addVariant}>Add Variant</Button>
              </div>
              <div className="space-y-3">
                {form.variants.map((v, i) => (
                  <div key={v.id} className="grid grid-cols-3 gap-3 p-4 bg-default/40 rounded-xl">
                    <input type="text" value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} placeholder="Name" className={inputCls} />
                    <input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", Number(e.target.value))} placeholder="Price" className={inputCls} />
                    <input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} placeholder="Stock" className={inputCls} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "flags" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-5">
              <h3 className="font-bold text-base">Flags & Tags</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "is_new", label: "New", color: "text-blue-400" },
                  { key: "is_featured", label: "Featured", color: "text-violet-400" },
                  { key: "is_trending", label: "Trending", color: "text-orange-400" },
                ].map((f) => (
                  <button key={f.key} onClick={() => set(f.key as any, !form[f.key as keyof Product])} className={`p-4 rounded-xl border-2 transition-all ${form[f.key as keyof Product] ? "border-accent bg-accent/8" : "border-border"}`}>
                    <p className={`text-sm font-bold ${form[f.key as keyof Product] ? f.color : "text-muted"}`}>{f.label}</p>
                  </button>
                ))}
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <div className="flex gap-2">
                  {(["active", "draft", "archived"] as const).map((s) => (
                    <button key={s} onClick={() => set("status", s)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${form.status === s ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Tags</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} className={`${inputCls} flex-1`} />
                  <Button variant="secondary" size="sm" onPress={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((t) => (
                    <span key={t} className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                      {t}
                      <button onClick={() => removeTag(t)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
