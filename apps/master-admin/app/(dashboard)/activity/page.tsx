import { PageHeader } from "@workspace/ui/components/page-header";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { formatDateTime } from "@workspace/ui/lib/formatters";
import { db } from "@workspace/db";
import { HugeiconsIcon } from "@hugeicons/react";
import { Activity01Icon, UserIcon, Building01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs — themrktplace Master Admin",
  description: "Global platform activity and security logs.",
};

export default async function ActivityPage() {
  const logs = await db.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      actor: true,
      organization: true,
    },
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Audit Logs"
        description="Monitor system-level events and configuration changes across the platform."
      >
        <div className="flex items-center gap-2 p-1 px-3 bg-muted/50 rounded-full border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted">
           <HugeiconsIcon icon={Activity01Icon} size={14} className="text-primary" />
           Real-time Stream
        </div>
      </PageHeader>

      <div className="bg-card/20 backdrop-blur-md rounded-[40px] border border-border/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-12">Timestamp</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-12">Actor</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-12">Action</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-12">Target Organization</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-12">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/30 border-border/20 transition-colors">
                <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {formatDateTime(log.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <HugeiconsIcon icon={UserIcon} size={12} />
                    </div>
                    <span className="text-xs font-bold leading-none">{log.actor.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-primary/10 text-primary border-transparent shadow-none text-[9px] font-black uppercase tracking-tight h-5">
                    {log.action.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                   {log.organization ? (
                     <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Building01Icon} size={12} className="text-muted-foreground" />
                        <span className="text-xs font-medium">{log.organization.name}</span>
                     </div>
                   ) : <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">System</span>}
                </TableCell>
                <TableCell className="max-w-[300px]">
                   <p className="text-[10px] font-medium text-muted-foreground truncate">
                     {log.metadata ? log.metadata : "—"}
                   </p>
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                   No activity logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
