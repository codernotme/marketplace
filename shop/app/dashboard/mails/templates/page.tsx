"use client";

import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { emailTemplates } from "@/lib/mock-data";

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Email Templates"
        subtitle="Customize transactional email templates"
        icon="solar:document-text-bold-duotone"
      />

      <div className="space-y-3">
        {emailTemplates.map((template) => (
          <div key={template.id} className="bg-surface rounded-2xl border border-border/50 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:letter-bold-duotone" className="text-accent text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{template.name}</p>
              <p className="text-xs text-muted truncate mt-0.5 font-mono">{template.subject}</p>
            </div>
            <Chip size="sm" variant={template.isActive ? "success" : "default"}>
              {template.isActive ? "Active" : "Inactive"}
            </Chip>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Icon icon="solar:eye-bold-duotone" className="text-base" />
                Preview
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Icon icon="solar:pen-bold-duotone" className="text-base" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
