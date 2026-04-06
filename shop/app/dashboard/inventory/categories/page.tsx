"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCategoriesStore } from "@/lib/store";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategory } = useCategoriesStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "solar:folder-bold-duotone", image: "" });

  const resetForm = () => { setForm({ name: "", slug: "", icon: "solar:folder-bold-duotone", image: "" }); setEditId(null); setShowForm(false); };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateCategory(editId, { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"), icon: form.icon });
    } else {
      addCategory({
        id: `cat_${Date.now()}`,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        name: form.name,
        icon: form.icon,
        image: form.image,
        parentId: null,
        isActive: true,
        productCount: 0,
      });
    }
    resetForm();
  };

  const startEdit = (cat: typeof categories[0]) => {
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, image: cat.image });
    setEditId(cat.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
        icon="solar:folder-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2" onPress={() => { resetForm(); setShowForm(true); }}>
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Add Category
          </Button>
        }
      />

      {/* Form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-base mb-4">{editId ? "Edit Category" : "New Category"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Electronics"
                className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated if empty"
                className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Icon (Iconify)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="solar:folder-bold-duotone"
                className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-default/60 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onPress={handleSubmit}>{editId ? "Save Changes" : "Create Category"}</Button>
            <Button variant="secondary" size="sm" onPress={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-surface border border-border rounded-2xl overflow-hidden stat-card">
            {cat.image ? (
              <div className="h-28 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-28 bg-gradient-to-br from-accent/10 to-violet-500/10 flex items-center justify-center">
                <Icon icon={cat.icon} className="text-5xl text-accent/40" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon icon={cat.icon} className="text-accent text-base" />
                    <h3 className="font-bold text-sm">{cat.name}</h3>
                  </div>
                  <p className="text-xs text-muted font-mono">{cat.slug}</p>
                  <p className="text-xs text-muted mt-1">{cat.productCount} products</p>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${cat.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                  {cat.isActive ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => startEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg hover:bg-default/60 text-muted hover:text-foreground transition-colors"
                >
                  <Icon icon="solar:pen-bold-duotone" className="text-sm" />
                  Edit
                </button>
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${cat.isActive ? "hover:bg-warning/10 text-muted hover:text-warning" : "hover:bg-success/10 text-muted hover:text-success"}`}
                >
                  <Icon icon={cat.isActive ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-sm" />
                  {cat.isActive ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => { if (window.confirm(`Delete "${cat.name}"?`)) deleteCategory(cat.id); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors"
                >
                  <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-sm" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
