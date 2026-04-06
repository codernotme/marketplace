"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBrandsStore, type ModalMode } from "@/lib/store";
import { cn } from "@/lib/utils";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: any;
}

export function BrandModal({ isOpen, onClose, mode, data }: BrandModalProps) {
  const { addBrand, updateBrand } = useBrandsStore();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
    isActive: true,
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        name: data.name || "",
        slug: data.slug || "",
        logo: data.logo || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        logo: "",
        isActive: true,
      });
    }
  }, [mode, data, isOpen]);

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");

    if (mode === "edit" && data?.id) {
      updateBrand(data.id, {
        name: form.name,
        slug,
        logo: form.logo,
      });
    } else {
      addBrand({
        id: `br_${Date.now()}`,
        name: form.name,
        slug,
        logo: form.logo,
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
          <Modal.Dialog className="bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
            <Modal.Header className="px-6 py-5 border-b border-border bg-default/10">
              <div className="flex items-center gap-3">
                <Modal.Icon className="bg-accent/20 text-accent">
                  <Icon icon={mode === "edit" ? "solar:pen-bold-duotone" : "solar:add-square-bold-duotone"} className="text-xl" />
                </Modal.Icon>
                <div>
                  <Modal.Heading className="text-lg font-bold">{mode === "edit" ? "Edit Brand" : "New Brand"}</Modal.Heading>
                  <p className="text-xs text-muted">Manage your product manufacturers</p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-widest">Brand Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Nike, Apple, Samsung"
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
                    placeholder="e.g. nike-sports"
                    className="w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-widest">Logo URL (Optional)</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={form.logo}
                      onChange={(e) => setForm({ ...form, logo: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200"
                    />
                    {(form.logo || form.name) && (
                      <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-default flex items-center justify-center flex-shrink-0">
                        {form.logo ? (
                          <img src={form.logo} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-bold text-lg text-accent">{form.name[0]?.toUpperCase()}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-[0.2em] opacity-80">Brand Status</label>
                  <Dropdown>
                    <Dropdown.Trigger className="w-fit">
                      <div className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-border hover:border-accent/40 bg-default/20 flex items-center gap-2 cursor-pointer transition-all">
                        <div className={`w-2 h-2 rounded-full ${form.isActive ? "bg-success" : "bg-muted"}`} />
                        {form.isActive ? "Active" : "Inactive"}
                        <Icon icon="solar:alt-arrow-down-bold-duotone" className="ml-1 text-muted" />
                      </div>
                    </Dropdown.Trigger>
                    <Dropdown.Popover className="min-w-[160px]">
                      <Dropdown.Menu onSelectionChange={(keys) => setForm({ ...form, isActive: Array.from(keys)[0] === "active" })} selectionMode="single" selectedKeys={new Set([form.isActive ? "active" : "hidden"])}>
                        <Dropdown.Item id="active" textValue="Active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <Label className="font-bold uppercase tracking-wider text-xs">Active</Label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item id="hidden" textValue="Hidden">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-muted" />
                            <Label className="font-bold uppercase tracking-wider text-xs">Inactive</Label>
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
                {mode === "edit" ? "Update Brand" : "Create Brand"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
