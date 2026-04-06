"use client";

import { useState } from "react";
import { Button, Input, Card, Separator, Tooltip, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { emailTemplates } from "@/lib/mock-data";

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState("");

  const filtered = emailTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Templates"
        subtitle="Manage and customize automated customer communications"
        icon="solar:letter-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="font-bold px-6 shadow-lg shadow-accent/20">
            <Icon icon="solar:document-plus-bold-duotone" className="text-xl mr-2" />
            Create Template
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((template) => (
          <Card key={template.id} className="bg-surface border border-border shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-accent/40 transition-all flex flex-col items-center p-8 text-center relative">
            <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${template.isActive ? 'bg-accent/40' : 'bg-default'}`} />
            
            <div className="w-16 h-16 rounded-2xl bg-default/40 flex items-center justify-center text-accent shadow-sm border border-border mb-6 group-hover:scale-110 transition-transform">
              <Icon icon="solar:document-text-bold-duotone" className="text-3xl" />
            </div>

            <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>{template.name}</h3>
            <p className="text-[11px] text-muted font-bold mt-2 leading-relaxed px-6">{template.subject}</p>

            <Separator className="my-8 opacity-30" />

            <div className="w-full flex items-center justify-between mb-8">
              <div className="text-left">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest leading-none mb-1">Status</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-default'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{template.isActive ? 'Active' : 'Disabled'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest leading-none mb-1">Type</p>
                <p className="text-[11px] font-black text-foreground mt-2 uppercase">Transactional</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button size="sm" variant="secondary" className="font-bold h-10 rounded-xl border border-border hover:bg-default transition-all">Preview</Button>
              <Button size="sm" variant="secondary" className="font-bold h-10 rounded-xl border border-border hover:bg-accent hover:text-white hover:border-accent transition-all">Edit Code</Button>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Dropdown>
                <Dropdown.Trigger>
                  <div 
                    className="p-1.5 rounded-xl bg-surface/80 backdrop-blur-md hover:bg-surface text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer border border-border/50"
                    role="button"
                    tabIndex={0}
                  >
                    <Icon icon="solar:menu-dots-bold-duotone" className="text-lg" />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[160px]">
                  <Dropdown.Menu>
                    <Dropdown.Item id="duplicate" textValue="Duplicate Template">
                      <Icon icon="solar:copy-bold-duotone" className="text-lg text-muted" />
                      <Label className="font-bold">Duplicate</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="test" textValue="Send Test Email">
                      <Icon icon="solar:mailbox-bold-duotone" className="text-lg text-muted" />
                      <Label className="font-bold">Send Test</Label>
                    </Dropdown.Item>
                    <Separator className="my-1 border-border/50" />
                    <Dropdown.Item id="delete" textValue="Delete Template" variant="danger">
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                      <Label className="font-bold text-danger">Delete</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
