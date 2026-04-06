"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBannersStore, useUIStore, type ModalMode } from "@/lib/store";
import { cn } from "@/lib/utils";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: any;
}

const PLACEMENTS = ["Hero Slider", "Mid-Banner", "Popup", "Category Banner", "Product Banner"];

export function BannerModal({ isOpen, onClose, mode, data }: BannerModalProps) {
  const { addBanner, updateBanner } = useBannersStore();
  const [form, setForm] = useState({
    title: "",
    placement: "Hero Slider",
    link: "",
    image: "",
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        title: data.title || "",
        placement: data.placement || "Hero Slider",
        link: data.link || "",
        image: data.image || "",
      });
    } else {
      setForm({
        title: "",
        placement: "Hero Slider",
        link: "",
        image: "",
      });
    }
  }, [mode, data, isOpen]);

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    const payload = {
      title: form.title,
      placement: form.placement,
      link: form.link,
      image: form.image,
    };

    if (mode === "edit" && data?.id) {
      updateBanner(data.id, payload);
    } else {
      addBanner({
        ...payload,
        id: `ban_${Date.now()}`,
        isActive: true,
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        clicks: 0,
        impressions: 0,
      });
    }
    onClose();
  };

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
          <Modal.Dialog className="bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden max-w-xl w-full">
            <Modal.Header className="px-8 py-6 border-b border-border bg-default/5 flex items-center gap-4">
              <Modal.Icon className="bg-accent/20 text-accent">
                <Icon icon="solar:gallery-wide-bold-duotone" className="text-2xl" />
              </Modal.Icon>
              <div>
                <Modal.Heading className="text-xl font-black tracking-tight">{mode === "edit" ? "Edit Campaign" : "New Banner"}</Modal.Heading>
                <p className="text-xs text-muted font-medium">Design your marketing campaign assets</p>
              </div>
            </Modal.Header>

            <Modal.Body className="p-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Banner Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Black Friday Super Sale"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Placement Area</label>
                    <Dropdown>
                      <Dropdown.Trigger className="w-full">
                        <div className={cn(inputCls, "flex items-center justify-between cursor-pointer font-bold")}>
                          <span>{form.placement}</span>
                          <Icon icon="solar:alt-arrow-down-bold-duotone" className="text-muted" />
                        </div>
                      </Dropdown.Trigger>
                      <Dropdown.Popover className="min-w-[180px]">
                        <Dropdown.Menu onSelectionChange={(keys) => setForm({ ...form, placement: Array.from(keys)[0] as string })} selectionMode="single" selectedKeys={new Set([form.placement])}>
                          {PLACEMENTS.map((p) => (
                            <Dropdown.Item key={p} id={p} textValue={p}>
                              <Label className="font-bold text-xs uppercase tracking-wider">{p}</Label>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>
                  <div>
                    <label className={labelCls}>Target URL / Link</label>
                    <input
                      type="text"
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      placeholder="/shop/new-arrivals"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Banner Image URL</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://..."
                      className={`${inputCls} flex-1`}
                    />
                  </div>
                  {form.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-border aspect-[21/9] bg-default/10">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="px-8 py-6 border-t border-border flex items-center justify-end gap-3 bg-default/5">
              <Button variant="secondary" onPress={onClose} className="rounded-xl font-bold px-6">Cancel</Button>
              <Button variant="primary" onPress={handleSubmit} className="rounded-xl font-bold px-8 shadow-lg shadow-accent/20">
                {mode === "edit" ? "Update Banner" : "Create Banner"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
