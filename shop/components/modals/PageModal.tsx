"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Separator, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useUIStore, usePagesStore } from "@/lib/store";

type StaticPage = {
  id: string;
  title: string;
  slug: string;
  status: "active" | "draft";
  content: string;
  seoDescription: string;
  updatedAt: string;
};

export function PageModal({
  isOpen,
  onClose,
  mode,
  data
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: any;
}) {
  const { addPage, updatePage } = usePagesStore();
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState<Partial<StaticPage>>({
    title: "",
    slug: "",
    status: "draft",
    content: "",
    seoDescription: "",
  });

  useEffect(() => {
    if (isEdit && data) {
      setFormData(data);
    } else {
      setFormData({
        title: "",
        slug: "",
        status: "draft",
        content: "",
        seoDescription: "",
      });
    }
  }, [isEdit, data, isOpen]);

  const handleSave = () => {
    if (isEdit && data?.id) {
      updatePage(data.id, { ...formData, updatedAt: new Date().toISOString() });
    } else {
      const newPage: StaticPage = {
        id: `pg_${Date.now()}`,
        title: formData.title || "Untitled Page",
        slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, "-") || "untitled",
        status: (formData.status as "active" | "draft") || "draft",
        content: formData.content || "",
        seoDescription: formData.seoDescription || "",
        updatedAt: new Date().toISOString(),
      };
      addPage(newPage);
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
          <Modal.Dialog className="bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-w-[720px] w-full flex flex-col max-h-[90vh]">
            <Modal.Header className="px-8 py-6 border-b border-border bg-default/5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <Modal.Icon className="bg-accent/20 text-accent">
                  <Icon icon={isEdit ? "solar:pen-2-bold-duotone" : "solar:add-circle-bold-duotone"} className="text-2xl" />
                </Modal.Icon>
                <div>
                  <Modal.Heading className="text-xl font-black tracking-tight">{isEdit ? "Edit Static Page" : "New Static Page"}</Modal.Heading>
                  <p className="text-xs text-muted font-medium mt-0.5">Informational content for your storefront.</p>
                </div>
              </div>
              <Button variant="secondary" onPress={onClose} isIconOnly className="rounded-xl">
                 <Icon icon="solar:close-circle-bold" className="text-xl" />
              </Button>
            </Modal.Header>

            <Modal.Body className="p-8 overflow-y-auto scrollbar-hide space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Page Title *</Label>
                    <input
                      placeholder="e.g. About Us"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full bg-default/40 border border-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">URL Slug</Label>
                    <div className="flex items-center gap-2 bg-default/40 border border-border rounded-2xl px-5 py-3.5">
                      <span className="text-muted opacity-40 text-sm">/</span>
                      <input
                        placeholder="about-us"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="bg-transparent border-none p-0 w-full text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Visibility Status</Label>
                    <div className="flex gap-2">
                      {["active", "draft"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: status as any })}
                          className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-extra-bold border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                            formData.status === status
                              ? "bg-accent/10 border-accent/40 text-accent shadow-sm"
                              : "bg-default/40 border-border text-muted hover:border-accent/20"
                          }`}
                        >
                          <Icon icon={status === 'active' ? "solar:check-circle-bold-duotone" : "solar:clock-circle-bold-duotone"} className="text-base" />
                          {status.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">SEO Description</Label>
                    <input
                      placeholder="Short summary for search results..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full bg-default/40 border border-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <Separator className="border-border/50" />

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Page Content (HTML/Rich Text)</Label>
                <textarea
                  placeholder="The details go here..."
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-default/40 border border-border rounded-3xl px-6 py-5 text-sm focus:outline-none focus:border-accent transition-all duration-300 outline-none resize-none font-body leading-relaxed min-h-[250px]"
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="px-8 py-6 border-t border-border flex items-center justify-between bg-default/5 flex-shrink-0">
              <Button variant="secondary" className="font-bold border border-border rounded-xl px-6" onPress={onClose}>
                Discard
              </Button>
              <Button 
                variant="primary" 
                className="font-bold px-10 rounded-xl shadow-lg shadow-accent/20" 
                onPress={handleSave}
              >
                {isEdit ? "Update Page" : "Publish Page"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
