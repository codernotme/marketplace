"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCategoriesStore, type ModalMode } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: any;
}

export function CategoryModal({ isOpen, onClose, mode, data }: CategoryModalProps) {
  const { addCategory, updateCategory } = useCategoriesStore();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "solar:folder-bold-duotone",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        name: data.name || "",
        slug: data.slug || "",
        icon: data.icon || "solar:folder-bold-duotone",
        image: data.image || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        icon: "solar:folder-bold-duotone",
        image: "",
        isActive: true,
      });
    }
  }, [mode, data, isOpen]);

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (mode === "edit" && data?.id) {
      updateCategory(data.id, {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        icon: form.icon,
        image: form.image,
      });
    } else {
      addCategory({
        id: `cat_${Date.now()}`,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        name: form.name,
        icon: form.icon,
        image: form.image,
        parentId: null,
        isActive: form.isActive,
        productCount: 0,
      });
    }
    onClose();
  };

  return (
    <Modal>
      <Modal.Backdrop 
        isOpen={isOpen} 
        onOpenChange={onClose}
        variant="blur"
        className="bg-black/60"
      >
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden max-w-lg w-full">
            <Modal.Header className="px-6 py-5 border-b border-border bg-default/10">
              <div className="flex items-center gap-3">
                <Modal.Icon className="bg-accent/20 text-accent">
                  <Icon icon={mode === "edit" ? "solar:pen-bold-duotone" : "solar:add-square-bold-duotone"} className="text-xl" />
                </Modal.Icon>
                <div>
                  <Modal.Heading className="text-lg font-bold">{mode === "edit" ? "Edit Category" : "New Category"}</Modal.Heading>
                  <p className="text-xs text-muted">Organize your products with categories</p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-widest">Category Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Smartphones & Tablets"
                    className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-widest">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="smartphones-tablets"
                    className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-widest">Iconify Icon</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="solar:folder-bold-duotone"
                    className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-[0.2em] opacity-80">Category Status</label>
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-border hover:border-accent/40 bg-default/20 flex items-center gap-2 cursor-pointer transition-all outline-none">
                        <div className={`w-2 h-2 rounded-full ${form.isActive ? "bg-success" : "bg-muted"}`} />
                        {form.isActive ? "Active" : "Hidden"}
                        <Icon icon="solar:alt-arrow-down-bold-duotone" className="ml-1 text-muted" />
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Popover className="min-w-[160px]">
                      <Dropdown.Menu onSelectionChange={(keys: any) => setForm({ ...form, isActive: Array.from(keys)[0] === "active" })} selectionMode="single" selectedKeys={new Set([form.isActive ? "active" : "hidden"])}>
                        <Dropdown.Item id="active" textValue="Active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <Label className="font-bold uppercase tracking-wider text-xs">Active</Label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item id="hidden" textValue="Hidden">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-muted" />
                            <Label className="font-bold uppercase tracking-wider text-xs">Hidden</Label>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="px-6 py-5 border-t border-border flex items-center justify-end gap-3 bg-default/5">
              <Button variant="secondary" onPress={onClose} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button variant="primary" onPress={handleSubmit} className="rounded-xl px-8 shadow-lg shadow-accent/20">
                {mode === "edit" ? "Update Category" : "Create Category"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
