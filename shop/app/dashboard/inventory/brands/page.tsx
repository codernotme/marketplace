"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBrandsStore } from "@/lib/store";

export default function BrandsPage() {
  const { brands, addBrand, updateBrand, deleteBrand, toggleBrand } = useBrandsStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });

  const resetForm = () => { setForm({ name: "", slug: "" }); setEditId(null); setShowForm(false); };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    if (editId) {
      updateBrand(editId, { name: form.name, slug });
    } else {
      addBrand({ id: `br_${Date.now()}`, name: form.name, slug, logo: "", isActive: true, productCount: 0 });
    }
    resetForm();
  };

  const startEdit = (b: typeof brands[0]) => {
    setForm({ name: b.name, slug: b.slug });
    setEditId(b.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Brands"
        subtitle={`${brands.length} brands`}
        icon="solar:shield-star-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2" onPress={() => { resetForm(); setShowForm(true); }}>
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Brand
          </Button>
        }
      />

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold mb-2">{editId ? "Edit Brand" : "New Brand"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Brand Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nike" className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onPress={handleSubmit}>{editId ? "Save" : "Create Brand"}</Button>
            <Button variant="secondary" size="sm" onPress={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Brand</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Products</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands.map((b) => (
                <tr key={b.id} className="table-row-hover">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/10 to-violet-500/10 flex items-center justify-center font-bold text-sm text-accent">
                        {b.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted font-mono text-xs hidden md:table-cell">{b.slug}</td>
                  <td className="px-5 py-3.5 text-right font-medium hidden lg:table-cell">{b.productCount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                      {b.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(b)} className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                        <Icon icon="solar:pen-bold-duotone" className="text-base" />
                      </button>
                      <button onClick={() => toggleBrand(b.id)} className="p-1.5 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors">
                        <Icon icon={b.isActive ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-base" />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete ${b.name}?`)) deleteBrand(b.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
