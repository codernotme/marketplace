"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useProductsStore, useCategoriesStore, useBrandsStore } from "@/lib/store";
import type { Product } from "@/lib/mock-data";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  slug: "", title: "", description: "", price: 0, comparePrice: null, category_id: "1", brand: "",
  images: [], ratings_avg: 0, ratings_count: 0, is_new: false, is_trending: false, is_featured: false,
  tags: [], variants: [{ id: "v_new_1", name: "Default", price: 0, stock: 0 }], status: "draft", sku: "",
};

export default function AddProductPage() {
  const { addProduct } = useProductsStore();
  const { categories } = useCategoriesStore();
  const { brands } = useBrandsStore();

  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const set = (key: keyof typeof form, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

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

  const handleSave = (status: "active" | "draft") => {
    const product: Product = {
      ...form,
      id: `p_${Date.now()}`,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      sku: form.sku || `SKU-${Date.now()}`,
      status,
    };
    addProduct(product);
    setSaved(true);
    setTimeout(() => { window.location.href = "/dashboard/inventory/products"; }, 1200);
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
        title="Add Product"
        subtitle="Create a new product listing"
        icon="solar:add-square-bold-duotone"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onPress={() => handleSave("draft")}>
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onPress={() => handleSave("active")}
              isDisabled={!form.title || !form.price}
            >
              <Icon icon={saved ? "solar:check-circle-bold-duotone" : "solar:add-square-bold-duotone"} className="text-base" />
              {saved ? "Saved!" : "Publish Product"}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Section nav */}
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

        {/* Form panel */}
        <div className="flex-1">
          {activeSection === "basic" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base mb-2">Basic Information</h3>
              <div>
                <label className={labelCls}>Product Title *</label>
                <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Premium Leather Wallet" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describe your product in detail…" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="AUTO-GENERATED" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug (URL)</label>
                  <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Brand</label>
                  <input list="brands-list" type="text" value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Select or type brand" className={inputCls} />
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
                <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addImage()} placeholder="https://images.unsplash.com/..." className={`${inputCls} flex-1`} />
                <Button variant="secondary" size="sm" onPress={addImage} className="flex-shrink-0">Add</Button>
              </div>
              {form.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-default">
                      <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-danger text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted text-sm">
                  <div className="text-center">
                    <Icon icon="solar:gallery-add-bold-duotone" className="text-3xl mb-1 opacity-40 mx-auto" />
                    Add image URLs above
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "pricing" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base mb-2">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Selling Price (₹) *</label>
                  <input type="number" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Compare at (₹)</label>
                  <input type="number" value={form.comparePrice ?? ""} onChange={(e) => set("comparePrice", e.target.value ? Number(e.target.value) : null)} placeholder="Strike-through price" className={inputCls} />
                </div>
              </div>
              <div className="p-4 bg-default/40 rounded-xl text-sm">
                <p className="text-muted text-xs mb-2">Preview</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-foreground">₹{Number(form.price).toLocaleString("en-IN")}</span>
                  {form.comparePrice && <span className="text-base text-muted line-through">₹{Number(form.comparePrice).toLocaleString("en-IN")}</span>}
                  {form.comparePrice && form.comparePrice > form.price && (
                    <span className="text-xs bg-success/15 text-success px-1.5 py-0.5 rounded-full font-semibold">
                      {Math.round(((form.comparePrice - form.price) / form.comparePrice) * 100)}% off
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "inventory" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base">Variants & Stock</h3>
                <Button variant="secondary" size="sm" className="gap-1.5" onPress={addVariant}>
                  <Icon icon="solar:add-square-bold-duotone" className="text-sm" />
                  Add Variant
                </Button>
              </div>
              <div className="space-y-3">
                {form.variants.map((v, i) => (
                  <div key={v.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-default/40 rounded-xl">
                    <div>
                      <label className={labelCls}>Variant Name</label>
                      <input type="text" value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} placeholder="e.g. Red / L" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Price (₹)</label>
                      <input type="number" value={v.price || ""} onChange={(e) => updateVariant(i, "price", Number(e.target.value))} placeholder="0" className={inputCls} />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className={labelCls}>Stock Qty</label>
                        <input type="number" value={v.stock || ""} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} placeholder="0" className={inputCls} />
                      </div>
                      {form.variants.length > 1 && (
                        <button
                          onClick={() => set("variants", form.variants.filter((_, j) => j !== i))}
                          className="p-2.5 rounded-xl hover:bg-danger/10 text-muted hover:text-danger transition-colors mb-0.5"
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-base" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "flags" && (
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-5">
              <h3 className="font-bold text-base mb-2">Product Flags & Tags</h3>

              {/* Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "is_new", label: "New Arrival", icon: "solar:star-shine-bold-duotone", color: "text-blue-400" },
                  { key: "is_featured", label: "Featured", icon: "solar:crown-bold-duotone", color: "text-violet-400" },
                  { key: "is_trending", label: "Trending 🔥", icon: "solar:fire-bold-duotone", color: "text-orange-400" },
                ].map((f) => {
                  const val = form[f.key as keyof typeof form] as boolean;
                  return (
                    <button
                      key={f.key}
                      onClick={() => set(f.key as keyof typeof form, !val)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${val ? `border-accent bg-accent/8` : "border-border hover:border-accent/40"}`}
                    >
                      <Icon icon={f.icon} className={`text-2xl ${val ? f.color : "text-muted"}`} />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{f.label}</p>
                        <p className="text-xs text-muted">{val ? "Enabled" : "Disabled"}</p>
                      </div>
                      {val && <Icon icon="solar:check-circle-bold-duotone" className="ml-auto text-accent text-base" />}
                    </button>
                  );
                })}
              </div>

              {/* Status */}
              <div>
                <label className={labelCls}>Product Status</label>
                <div className="flex gap-2">
                  {(["active", "draft", "archived"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => set("status", s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${form.status === s ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-accent/40"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className={labelCls}>Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add a tag and press Enter"
                    className={`${inputCls} flex-1`}
                  />
                  <Button variant="secondary" size="sm" onPress={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((t) => (
                    <span key={t} className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-medium">
                      {t}
                      <button onClick={() => removeTag(t)} className="text-accent/60 hover:text-accent ml-0.5">×</button>
                    </span>
                  ))}
                  {form.tags.length === 0 && <p className="text-xs text-muted">No tags yet</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
