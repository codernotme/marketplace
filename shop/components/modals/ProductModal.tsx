"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Tooltip, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useProductsStore, useCategoriesStore, useBrandsStore, useUIStore, type ModalMode } from "@/lib/store";

type ProductVariant = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number | null;
  category_id: string;
  brand: string;
  images: string[];
  ratings_avg: number;
  ratings_count: number;
  is_new: boolean;
  is_trending: boolean;
  is_featured: boolean;
  tags: string[];
  variants: ProductVariant[];
  status: "active" | "draft" | "archived";
  sku: string;
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: any;
}

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  slug: "", title: "", description: "", price: 0, comparePrice: null, category_id: "1", brand: "",
  images: [], ratings_avg: 0, ratings_count: 0, is_new: false, is_trending: false, is_featured: false,
  tags: [], variants: [{ id: "v_new_1", name: "Default", price: 0, stock: 0 }], status: "draft", sku: "",
};

export function ProductModal({ isOpen, onClose, mode, data }: ProductModalProps) {
  const { addProduct, updateProduct } = useProductsStore();
  const { categories } = useCategoriesStore();
  const { brands } = useBrandsStore();
  
  const [form, setForm] = useState<Omit<Product, "id">>({ ...EMPTY_PRODUCT });
  const [activeTab, setActiveTab] = useState("basic");
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({ ...data });
    } else {
      setForm({ ...EMPTY_PRODUCT });
    }
    setActiveTab("basic");
  }, [mode, data, isOpen]);

  const setField = (key: keyof typeof form, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (statusOverride?: "active" | "draft") => {
    if (!form.title || !form.price) return;
    
    setIsSaving(true);
    const status = statusOverride || form.status;
    const finalData = {
      ...form,
      status,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      sku: form.sku || `SKU-${Date.now()}`,
    };

    if (mode === "edit" && data?.id) {
      updateProduct(data.id, finalData);
    } else {
      addProduct({ ...finalData, id: `p_${Date.now()}` } as Product);
    }
    
    setIsSaving(false);
    onClose();
  };

  const TABS = [
    { id: "basic", label: "Basic Info", icon: "solar:info-circle-bold-duotone" },
    { id: "media", label: "Media", icon: "solar:gallery-bold-duotone" },
    { id: "pricing", label: "Pricing", icon: "solar:tag-bold-duotone" },
    { id: "inventory", label: "Inventory", icon: "solar:box-bold-duotone" },
    { id: "flags", label: "Flags & Tags", icon: "solar:flag-bold-duotone" },
  ];

  const inputCls = "w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200";
  const labelCls = "block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest opacity-80";

  return (
    <Modal>
      <Modal.Backdrop 
        isOpen={isOpen} 
        onOpenChange={onClose}
        variant="blur"
        className="bg-black/60"
      >
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-w-5xl w-full h-[85vh] flex flex-col">
            <Modal.Header className="px-8 py-6 border-b border-border bg-default/5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <Modal.Icon className="bg-accent/20 text-accent">
                  <Icon icon={mode === "edit" ? "solar:pen-new-square-bold-duotone" : "solar:add-square-bold-duotone"} className="text-2xl" />
                </Modal.Icon>
                <div>
                  <Modal.Heading className="text-xl font-black tracking-tight">{mode === "edit" ? "Edit Product" : "Create Product"}</Modal.Heading>
                  <p className="text-xs text-muted font-medium">Complete all details to list your product</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onPress={onClose} className="rounded-xl font-bold px-6">Discard</Button>
                <Button 
                  variant="primary" 
                  onPress={() => handleSave()} 
                  isPending={isSaving}
                  className="rounded-xl font-bold px-8 shadow-lg shadow-accent/20"
                  isDisabled={!form.title || !form.price}
                >
                  {isSaving ? "Saving..." : (mode === "edit" ? "Update Listing" : "Publish Product")}
                </Button>
              </div>
            </Modal.Header>

          {/* Root Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 border-r border-border bg-default/5 p-4 space-y-2 flex-shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                    activeTab === tab.id 
                      ? "bg-accent text-white shadow-lg shadow-accent/25 translate-x-1" 
                      : "text-muted hover:text-foreground hover:bg-default/60"
                  }`}
                >
                  <Icon icon={tab.icon} className={`text-xl ${activeTab === tab.id ? "text-white" : "text-muted group-hover:text-accent"}`} />
                  {tab.label}
                  {activeTab === tab.id && <Icon icon="solar:alt-arrow-right-bold-duotone" className="ml-auto text-white/60" />}
                </button>
              ))}
              
              <div className="mt-auto pt-8 px-4">
                <div className="p-4 rounded-2xl bg-default/40 border border-border/50">
                  <p className="text-[10px] font-bold text-muted uppercase mb-2 tracking-widest">Listing Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${form.status === "active" ? "bg-success animate-pulse" : "bg-warning"}`} />
                    <span className="text-xs font-bold capitalize">{form.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <Modal.Body className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              {activeTab === "basic" && (
                <div className="space-y-6 fade-in">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent">General Details</h3>
                    <div>
                      <label className={labelCls}>Product Title *</label>
                      <input 
                        type="text" 
                        value={form.title} 
                        onChange={(e) => setField("title", e.target.value)} 
                        placeholder="e.g. Ultra Slim Wireless Mechanical Keyboard" 
                        className={inputCls} 
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea 
                        value={form.description} 
                        onChange={(e) => setField("description", e.target.value)} 
                        rows={5} 
                        placeholder="Detail your product features, specifications..." 
                        className={`${inputCls} resize-none min-h-[120px]`} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Product Category</label>
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button className={cn(inputCls, "flex items-center justify-between cursor-pointer")}>
                            <span>{categories.find(c => c.id === form.category_id)?.name || "Select Category"}</span>
                            <Icon icon="solar:alt-arrow-down-bold-duotone" className="text-muted" />
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[200px]">
                          <Dropdown.Menu onSelectionChange={(keys: any) => setField("category_id", Array.from(keys)[0])} selectionMode="single" selectedKeys={new Set([form.category_id])}>
                            {categories.map((c) => (
                              <Dropdown.Item key={c.id} id={c.id} textValue={c.name}>
                                <div className="flex items-center gap-2">
                                  <Icon icon={c.icon} className="text-lg text-muted" />
                                  <Label className="font-bold">{c.name}</Label>
                                </div>
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                    <div>
                      <label className={labelCls}>Brand / Manufacturer</label>
                      <input 
                        list="modal-brands-list" 
                        type="text" 
                        value={form.brand} 
                        onChange={(e) => setField("brand", e.target.value)} 
                        placeholder="e.g. Logitech" 
                        className={inputCls} 
                      />
                      <datalist id="modal-brands-list">
                        {brands.map((b) => <option key={b.id} value={b.name} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className={labelCls}>Custom SKU Code</label>
                      <input 
                        type="text" 
                        value={form.sku} 
                        onChange={(e) => setField("sku", e.target.value)} 
                        placeholder="AUTO-GENERATED" 
                        className={inputCls} 
                      />
                    </div>
                    <div>
                      <label className={labelCls}>URL Alias (Slug)</label>
                      <input 
                        type="text" 
                        value={form.slug} 
                        onChange={(e) => setField("slug", e.target.value)} 
                        placeholder="auto-from-title" 
                        className={inputCls} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6 fade-in">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent">Product Media</h3>
                    <div className="flex gap-4">
                      <input 
                        type="url" 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)} 
                        onKeyDown={(e) => e.key === "Enter" && (form.images.push(imageUrlInput), setImageUrlInput(""))} 
                        placeholder="Paste image URL here..." 
                        className={`${inputCls} flex-1`} 
                      />
                      <Button 
                        variant="secondary" 
                        onPress={() => {
                          if (imageUrlInput.trim()) {
                            setField("images", [...form.images, imageUrlInput.trim()]);
                            setImageUrlInput("");
                          }
                        }}
                        className="rounded-2xl h-[48px] px-6"
                      >
                        Add Image
                      </Button>
                    </div>
                  </div>

                  {form.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border border-border hover:border-accent transition-colors shadow-sm">
                          <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <Button 
                              variant="danger" 
                              isIconOnly 
                              size="sm" 
                              className="rounded-xl"
                              onPress={() => setField("images", form.images.filter((_, j) => j !== i))}
                            >
                               <Icon icon="solar:trash-bin-trash-bold" />
                             </Button>
                          </div>
                          {i === 0 && (
                            <div className="absolute top-3 left-3 bg-accent text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">Main Cover</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted gap-3 bg-default/5">
                      <Icon icon="solar:gallery-wide-bold-duotone" className="text-6xl opacity-10" />
                      <p className="text-sm font-medium">No images added yet. Add URLs to preview.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "pricing" && (
                <div className="space-y-8 fade-in">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent">Pricing & Taxation</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>Selling Price (₹) *</label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">₹</span>
                           <input 
                            type="number" 
                            value={form.price || ""} 
                            onChange={(e) => setField("price", Number(e.target.value))} 
                            placeholder="0.00" 
                            className={`${inputCls} pl-8 font-black text-lg`} 
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Original Price (Strike-through)</label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">₹</span>
                           <input 
                            type="number" 
                            value={form.comparePrice ?? ""} 
                            onChange={(e) => setField("comparePrice", e.target.value ? Number(e.target.value) : null)} 
                            placeholder="Optional" 
                            className={`${inputCls} pl-8 opacity-60`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-gradient-to-br from-accent/5 to-violet-500/5 border border-accent/10">
                    <p className="text-[10px] font-black text-muted uppercase mb-4 tracking-[0.2em]">Customer Price Preview</p>
                    <div className="flex items-end gap-3" suppressHydrationWarning>
                      <span className="text-5xl font-black tracking-tighter">₹{Number(form.price).toLocaleString("en-IN")}</span>
                      {form.comparePrice && form.comparePrice > form.price && (
                        <>
                          <span className="text-2xl text-muted line-through font-bold mb-1 opacity-50">₹{Number(form.comparePrice).toLocaleString("en-IN")}</span>
                          <span className="mb-2 bg-success text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-success/20">
                            SAVE {Math.round(((form.comparePrice - form.price) / form.comparePrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-4 font-medium italic">* Includes all applicable taxes and processing fees.</p>
                  </div>
                </div>
              )}

              {activeTab === "inventory" && (
                <div className="space-y-6 fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent">Variants & Availability</h3>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-xl px-4 font-bold border border-border"
                      onPress={() => setField("variants", [...form.variants, { id: `v_${Date.now()}`, name: "", price: form.price, stock: 0 }])}
                    >
                      <Icon icon="solar:add-circle-bold" className="mr-1" /> Add Variant
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {form.variants.map((v, i) => (
                      <div key={v.id} className="grid grid-cols-12 gap-4 p-6 bg-default/40 rounded-[1.5rem] border border-border/50 items-end">
                        <div className="col-span-5">
                          <label className={labelCls}>Variant Name (e.g. Size / Color)</label>
                          <input 
                            type="text" 
                            value={v.name} 
                            onChange={(e) => {
                              const newList = [...form.variants];
                              newList[i] = { ...newList[i], name: e.target.value };
                              setField("variants", newList);
                            }} 
                            placeholder="e.g. Midnight Blue / XL" 
                            className={inputCls} 
                          />
                        </div>
                        <div className="col-span-3">
                          <label className={labelCls}>Direct Price (₹)</label>
                          <input 
                            type="number" 
                            value={v.price} 
                            onChange={(e) => {
                              const newList = [...form.variants];
                              newList[i] = { ...newList[i], price: Number(e.target.value) };
                              setField("variants", newList);
                            }} 
                            className={inputCls} 
                          />
                        </div>
                        <div className="col-span-3">
                          <label className={labelCls}>Stock Count</label>
                          <input 
                            type="number" 
                            value={v.stock} 
                            onChange={(e) => {
                              const newList = [...form.variants];
                              newList[i] = { ...newList[i], stock: Number(e.target.value) };
                              setField("variants", newList);
                            }} 
                            className={`${inputCls} ${v.stock < 5 ? "border-warning/50 text-warning" : ""}`}
                          />
                        </div>
                        <div className="col-span-1 pb-1">
                          {form.variants.length > 1 && (
                            <Button 
                              variant="danger" 
                              isIconOnly 
                              className="rounded-xl"
                              onPress={() => setField("variants", form.variants.filter((_, j) => j !== i))}
                            >
                              <Icon icon="solar:trash-bin-trash-bold" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "flags" && (
                <div className="space-y-8 fade-in">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-accent">Internal Tags & Visibility</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { key: "is_new", label: "New Arrival", icon: "solar:star-fall-bold-duotone", color: "text-blue-400" },
                        { key: "is_featured", label: "Featured Item", icon: "solar:crown-bold-duotone", color: "text-violet-400" },
                        { key: "is_trending", label: "Trending", icon: "solar:fire-bold-duotone", color: "text-orange-400" },
                      ].map((f) => {
                        const isSet = form[f.key as keyof typeof form];
                        return (
                          <button
                            key={f.key}
                            onClick={() => setField(f.key as keyof typeof form, !isSet)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                              isSet ? "border-accent bg-accent/10 shadow-lg shadow-accent/10" : "border-border hover:border-accent/40"
                            }`}
                          >
                            <Icon icon={f.icon} className={`text-4xl ${isSet ? f.color : "text-muted"}`} />
                            <span className="text-xs font-black uppercase tracking-widest">{f.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className={labelCls}>Product Status</label>
                    <Dropdown>
                      <Dropdown.Trigger>
                        <button className="px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-border hover:border-accent/40 bg-background flex items-center gap-2 cursor-pointer transition-all outline-none">
                          <div className={`w-2 h-2 rounded-full ${form.status === "active" ? "bg-success" : form.status === "draft" ? "bg-warning" : "bg-muted"}`} />
                          {form.status}
                          <Icon icon="solar:alt-arrow-down-bold-duotone" className="ml-1 text-muted" />
                        </button>
                      </Dropdown.Trigger>
                      <Dropdown.Popover className="min-w-[160px]">
                        <Dropdown.Menu onSelectionChange={(keys: any) => setField("status", Array.from(keys)[0])} selectionMode="single" selectedKeys={new Set([form.status])}>
                          {(["active", "draft", "archived"] as const).map((s) => (
                            <Dropdown.Item key={s} id={s} textValue={s}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${s === "active" ? "bg-success" : s === "draft" ? "bg-warning" : "bg-muted"}`} />
                                <Label className="font-bold uppercase tracking-wider">{s}</Label>
                              </div>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>

                  <div className="space-y-4">
                    <label className={labelCls}>Search Keywords & Tags</label>
                    <div className="flex gap-3">
                       <input 
                        type="text" 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)} 
                        onKeyDown={(e) => e.key === "Enter" && (tagInput.trim() && !form.tags.includes(tagInput.trim().toLowerCase()) && (setField("tags", [...form.tags, tagInput.trim().toLowerCase()]), setTagInput("")))} 
                        placeholder="Type a tag and press Enter..." 
                        className={inputCls} 
                      />
                       <Button 
                        variant="secondary" 
                        onPress={() => {
                          if (tagInput.trim() && !form.tags.includes(tagInput.trim().toLowerCase())) {
                            setField("tags", [...form.tags, tagInput.trim().toLowerCase()]);
                            setTagInput("");
                          }
                        }}
                        className="rounded-2xl h-[48px] font-bold"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                       {form.tags.map((t) => (
                          <span key={t} className="bg-default border border-border px-4 py-1.5 rounded-xl text-xs font-bold text-foreground flex items-center gap-2 shadow-sm">
                            #{t}
                            <button onClick={() => setField("tags", form.tags.filter(x => x !== t))} className="text-muted hover:text-danger">×</button>
                          </span>
                       ))}
                       {form.tags.length === 0 && <p className="text-[11px] text-muted font-medium italic">No tags added yet. Helpful for SEO and search.</p>}
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
          </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
