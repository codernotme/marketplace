"use client";

import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  MoreVerticalIcon, 
  Notification01Icon, 
  ShieldOffIcon, 
  SquareLock02Icon,
  LicenseIcon
} from "@hugeicons/core-free-icons";
import { bulkUpdateTenants } from "@/app/actions/master";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedIds: string[];
  onComplete: () => void;
}

export function BulkActions({ selectedIds, onComplete }: BulkActionsProps) {
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "suspend" | "activate" | "notify") {
    if (selectedIds.length === 0) return;
    setLoading(true);
    
    try {
      if (action === "notify") {
         toast.info(`Sending notifications to ${selectedIds.length} tenants...`);
         // Mock notification logic
      } else {
         await bulkUpdateTenants(selectedIds, { status: action === "suspend" ? "suspended" : "active" });
         toast.success(`Successfully updated ${selectedIds.length} tenants`);
         onComplete();
      }
    } catch (error) {
      toast.error("Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-xl" disabled={loading || selectedIds.length === 0}>
           <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
           Bulk Actions ({selectedIds.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">
          Tenant Operations
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleAction("activate")} className="rounded-xl gap-2 font-bold cursor-pointer">
          <HugeiconsIcon icon={LicenseIcon} size={16} className="text-success" />
          Activate Selected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("suspend")} className="rounded-xl gap-2 font-bold cursor-pointer text-destructive">
          <HugeiconsIcon icon={SquareLock02Icon} size={16} />
          Suspend Selected
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 opacity-50" />
        <DropdownMenuItem onClick={() => handleAction("notify")} className="rounded-xl gap-2 font-bold cursor-pointer">
          <HugeiconsIcon icon={Notification01Icon} size={16} className="text-primary" />
          Send Broadcast
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
