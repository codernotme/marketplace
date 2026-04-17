"use client";

import { useState } from "react";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, PlusSignIcon, Edit01Icon, CodeIcon } from "@hugeicons/core-free-icons";
import { Textarea } from "@workspace/ui/components/textarea";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([
    { id: "1", name: "Welcome Email", subject: "Welcome to themrktplace!", category: "Transactional" },
    { id: "2", name: "Invoice Summary", subject: "Your invoice for {{month}}", category: "Billing" },
    { id: "3", name: "Order Confirmation", subject: "Order #{{orderNumber}} confirmed", category: "Transactional" },
  ]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <PageHeader
        title="Email Template Library"
        description="Manage global email defaults for all platform notifications."
      >
        <Button className="rounded-full px-6 gap-2 font-bold shadow-lg shadow-primary/20">
          <HugeiconsIcon icon={PlusSignIcon} size={18} />
          Create Template
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
           {templates.map((tpl) => (
             <Card key={tpl.id} className="border-none shadow-sm bg-card/60 rounded-3xl group cursor-pointer hover:bg-muted/30 transition-all border border-transparent hover:border-primary/20">
               <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <HugeiconsIcon icon={Mail01Icon} size={20} />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{tpl.name}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{tpl.category}</span>
                     </div>
                  </div>
                  <HugeiconsIcon icon={Edit01Icon} size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
               </CardContent>
             </Card>
           ))}
        </div>

        <Card className="lg:col-span-2 border-none shadow-2xl bg-card/60 backdrop-blur-xl rounded-[40px] overflow-hidden min-h-[600px]">
           <CardHeader className="p-8 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">Editor: Welcome Email</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Editing global default version</p>
              </div>
              <Badge variant="outline" className="rounded-full bg-success/5 text-success border-success/20 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                Active Template
              </Badge>
           </CardHeader>
           <CardContent className="p-8 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Template Name</Label>
                  <Input placeholder="Template Name" defaultValue="Welcome Email" className="rounded-2xl bg-muted/30 border-none h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Email Subject</Label>
                  <Input placeholder="Subject Line" defaultValue="Welcome to themrktplace!" className="rounded-2xl bg-muted/30 border-none h-12" />
                </div>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                 <div className="flex items-center justify-between ml-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Email Body (Markdown/HTML)</Label>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                       <HugeiconsIcon icon={CodeIcon} size={12} />
                       Supports Variables
                    </div>
                 </div>
                 <Textarea 
                   className="flex-1 rounded-[32px] bg-muted/20 border-border/40 min-h-[300px] p-6 font-mono text-sm leading-relaxed"
                   defaultValue={`# Hello {{name}}!

Welcome to **themrktplace**. We're excited to help you launch your store.

Getting started is easy:
1. Complete your profile
2. Setup your first product
3. Choose a custom domain

Best regards,
The Platform Team`}
                 />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                 <Button variant="outline" className="rounded-full px-6 font-bold bg-background shadow-none">
                    Preview
                 </Button>
                 <Button className="rounded-full px-8 font-black shadow-lg shadow-primary/20">
                    Save Template
                 </Button>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
