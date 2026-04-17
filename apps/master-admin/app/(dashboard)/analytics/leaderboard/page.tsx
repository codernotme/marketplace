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
import { Progress } from "@workspace/ui/components/progress";
import { formatCurrency } from "@workspace/ui/lib/formatters";
import { db } from "@workspace/db";
import { HugeiconsIcon } from "@hugeicons/react";
import { Trophy01Icon, ZapIcon, TrendingUp01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Leaderboard — themrktplace Master Admin",
  description: "Performance ranking of all merchants on the platform.",
};

export default async function LeaderboardPage() {
  const tenants = await db.organization.findMany({
    include: {
      orders: {
        where: { status: { not: "cancelled" } },
        select: { total: true }
      },
      subscription: {
        include: { plan: true }
      }
    }
  });

  // Calculate metrics
  const leaderboard = tenants.map(tenant => {
    const revenue = tenant.orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const orderCount = tenant.orders.length;
    return {
      ...tenant,
      revenue,
      orderCount,
      perfScore: Math.min(100, (revenue / 1000) + (orderCount / 10)) // Simple mock heuristic
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Tenant Leaderboard"
        description="Detailed performance metrics and ranking of top-performing merchants."
      >
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-8 rounded-full border-primary/20 bg-primary/5 px-4 font-bold text-primary">
              <HugeiconsIcon icon={ZapIcon} size={14} className="mr-2" />
              Live Performance
           </Badge>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <div className="bg-card/20 backdrop-blur-md rounded-[40px] border border-border/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="w-12 text-center h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rank</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Merchant</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tier</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Revenue (GMV)</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Orders</TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[200px]">Performance Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((tenant, index) => (
                <TableRow key={tenant.id} className="hover:bg-muted/30 border-border/20 transition-colors group">
                  <TableCell className="text-center font-black text-muted-foreground/50 group-hover:text-primary transition-colors">
                     {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                         {index === 0 ? <HugeiconsIcon icon={Trophy01Icon} size={16} /> : tenant.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{tenant.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{tenant.slug}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <Badge className="bg-muted/50 text-muted-foreground border-transparent shadow-none text-[9px] font-bold h-5">
                       {tenant.subscription?.plan?.name || "Free"}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right font-black text-sm">
                    {formatCurrency(tenant.revenue)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-muted-foreground">
                    {tenant.orderCount}
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center px-0.5">
                           <span className="text-[9px] font-black uppercase text-muted-foreground">Efficiency</span>
                           <span className="text-[9px] font-black text-primary">{Math.round(tenant.perfScore)}%</span>
                        </div>
                        <Progress value={tenant.perfScore} className="h-1.5 bg-muted/30" indicatorClassName="bg-gradient-to-r from-primary/50 to-primary" />
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
