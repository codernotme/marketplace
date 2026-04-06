"use client";

import { useState } from "react";
import { Button, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { emailTemplates } from "@/lib/mock-data";

export default function MailTemplatesPage() {
  const [templates, setTemplates] = useState(emailTemplates);

  const toggleStatus = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Email Templates"
        subtitle="Manage transactional emails and automated notifications"
        icon="solar:letter-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2">
            <Icon icon="solar:add-square-bold-duotone" className="text-base" />
            Create Template
          </Button>
        }
      />

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-background/30 flex items-center justify-between">
          <h3 className="font-bold text-sm">Transactional Templates</h3>
          <p className="text-xs text-muted">{templates.length} templates configured</p>
        </div>
        <div className="divide-y divide-border">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-default/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <Icon icon="solar:document-text-bold-duotone" className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm tracking-tight">{t.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${t.isActive ? "bg-success/15 text-success" : "bg-default text-muted"}`}>
                    {t.isActive ? "Active" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-muted truncate max-w-md">{t.subject}</p>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-widest hidden md:block">Status</span>
                  <Switch
                    isSelected={t.isActive}
                    onChange={() => toggleStatus(t.id)}
                    size="sm"
                  />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors" title="Edit template">
                    <Icon icon="solar:pen-bold-duotone" className="text-lg" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-default text-muted hover:text-foreground transition-colors" title="Preview">
                    <Icon icon="solar:eye-bold-duotone" className="text-lg" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors" title="Delete">
                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Help Card */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
          <Icon icon="solar:info-circle-bold-duotone" className="text-xl" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-accent mb-1">Dynamic Variables</h4>
          <p className="text-xs text-muted/80 leading-relaxed">
            You can use dynamic variables like <code className="text-accent bg-accent/10 px-1 rounded">{"{{order_number}}"}</code>, <code className="text-accent bg-accent/10 px-1 rounded">{"{{customer_name}}"}</code>, and <code className="text-accent bg-accent/10 px-1 rounded">{"{{total_amount}}"}</code> in your templates. These will be automatically replaced when the email is sent.
          </p>
        </div>
      </div>
    </div>
  );
}
