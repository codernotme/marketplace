import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { TenantSidebar } from "@/components/tenant-sidebar";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Notification01Icon, Settings01Icon } from "@hugeicons/core-free-icons";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border px-6 sticky top-0 z-10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex-1 flex items-center max-w-md relative group">
            <HugeiconsIcon 
              icon={Search01Icon} 
              size={18} 
              className="absolute left-3 text-muted-foreground group-focus-within:text-foreground transition-colors" 
            />
            <Input 
              placeholder="Search anything... (⌘K)" 
              className="pl-10 h-10 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-full"
            />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <HugeiconsIcon icon={Notification01Icon} size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <HugeiconsIcon icon={Settings01Icon} size={20} />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col gap-6 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
