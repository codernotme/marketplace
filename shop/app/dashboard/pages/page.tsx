"use client";

import { useState } from "react";
import { Button, Card, Label, Separator, Dropdown } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useUIStore, usePagesStore } from "@/lib/store";

export default function StaticPages() {
  const { openModal } = useUIStore();
  const { pages, togglePageStatus, deletePage } = usePagesStore();
  const [search, setSearch] = useState("");

  const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Static Pages"
        subtitle="Manage information pages and legal documents"
        icon="solar:notebook-bold-duotone"
        actions={
          <Button 
            variant="primary" 
            className="font-bold px-6 shadow-lg shadow-accent/20" 
            size="sm"
            onPress={() => openModal("page", "add")}
          >
            <Icon icon="solar:add-circle-bold-duotone" className="text-xl mr-2" />
            Create New Page
          </Button>
        }
      />

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((page) => (
          <Card key={page.id} className="p-6 bg-surface border border-border shadow-xl rounded-[2rem] hover:border-accent/40 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -translate-y-16 translate-x-16 group-hover:bg-accent/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-default/40 flex items-center justify-center text-accent shadow-sm border border-border group-hover:scale-110 transition-transform">
                <Icon icon="solar:file-text-bold-duotone" className="text-2xl" />
              </div>
              <Dropdown>
                <Dropdown.Trigger>
                  <div 
                    className="p-2 rounded-xl hover:bg-default/60 text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    <Icon icon="solar:menu-dots-bold-duotone" className="text-xl" />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[160px]">
                  <Dropdown.Menu>
                    <Dropdown.Item id="edit" textValue="Edit Page" onPress={() => openModal("page", "edit", page)}>
                      <Icon icon="solar:pen-bold-duotone" className="text-lg text-muted" />
                      <Label className="font-bold">Edit Content</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="toggle" textValue="Toggle Status" onPress={() => togglePageStatus(page.id)}>
                      <Icon icon={page.status === 'active' ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-lg text-muted" />
                      <Label className="font-bold">{page.status === 'active' ? "Hide Page" : "Show Page"}</Label>
                    </Dropdown.Item>
                    <Separator className="my-1 border-border/50" />
                    <Dropdown.Item id="delete" textValue="Delete Page" variant="danger" onPress={() => deletePage(page.id)}>
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                      <Label className="font-bold text-danger">Delete Page</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>

            <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{page.title}</h3>
            <p className="text-[11px] text-muted font-mono mt-1 opacity-70 uppercase tracking-tighter">/{page.slug}</p>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted font-black uppercase tracking-widest leading-none mb-1.5">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  page.status === 'active' ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'active' ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-warning"}`} />
                  {page.status}
                </span>
              </div>
              <div className="flex flex-col ml-auto text-right">
                <span className="text-[10px] text-muted font-black uppercase tracking-widest leading-none mb-1.5">Last Edit</span>
                <span className="text-[11px] font-black text-foreground uppercase tracking-tight">{new Date(page.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
          </Card>
        ))}
      </div>
    </div>
  );
}
