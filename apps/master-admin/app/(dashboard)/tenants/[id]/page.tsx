import { getTenantDetails } from "@/app/actions/master";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Building01Icon, 
  CreditCardIcon, 
  UserGroupIcon, 
  Activity01Icon, 
  Globe02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon
} from "@hugeicons/core-free-icons";
import { cn } from "@workspace/ui/lib/utils";
import { notFound } from "next/navigation";
import { formatDateTime } from "@workspace/ui/lib/formatters";

export default async function TenantDetailPage({ params }: { params: { id: string } }) {
  const tenant = await getTenantDetails(params.id);

  if (!tenant) {
    notFound();
  }

  const stats = [
    { label: "Members", value: tenant.members.length, icon: UserGroupIcon, color: "text-blue-500" },
    { label: "Plan", value: tenant.subscription?.plan?.name || "Free", icon: CreditCardIcon, color: "text-purple-500" },
    { label: "Status", value: tenant.status || "active", icon: Activity01Icon, color: "text-green-500" },
    { label: "Domain", value: tenant.slug + ".localhost", icon: Globe02Icon, color: "text-orange-500" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={tenant.name}
        description={`Organization ID: ${tenant.id}`}
      >
        <Badge className={cn(
          "px-4 h-7 text-[10px] uppercase font-black tracking-[0.1em]",
          tenant.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        )}>
          {tenant.status || "active"} instance
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/40 backdrop-blur-md border-border/50 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <div className={cn("size-10 rounded-2xl bg-background flex items-center justify-center border border-border/50 shadow-sm", s.color)}>
                  <HugeiconsIcon icon={s.icon} size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-black">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feature Flags */}
        <Card className="lg:col-span-2 rounded-[40px] border-border/50 bg-card/20 backdrop-blur-xl shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 p-8">
             <CardTitle className="text-xl font-black tracking-tight">Feature Overrides</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/40">
                {tenant.featureFlags.length > 0 ? tenant.featureFlags.map(flag => (
                   <div key={flag.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-bold tracking-tight">{flag.key}</span>
                         <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.05em]">Platform-level override</span>
                      </div>
                      <div className={cn(
                         "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                         flag.value === "true" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>
                         <HugeiconsIcon icon={flag.value === "true" ? CheckmarkCircle02Icon : Cancel01Icon} size={12} />
                         {flag.value === "true" ? "Enabled" : "Disabled"}
                      </div>
                   </div>
                )) : (
                   <div className="p-12 text-center text-muted-foreground">
                      <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">No overrides active</p>
                      <p className="text-[10px] font-medium max-w-[200px] mx-auto leading-relaxed">This organization is using the default configuration defined by the {tenant.subscription?.plan?.name || "Free"} plan.</p>
                   </div>
                )}
             </div>
          </CardContent>
        </Card>

        {/* Ownership */}
        <div className="flex flex-col gap-6">
           <Card className="rounded-[40px] border-border/50 bg-card/20 backdrop-blur-xl shadow-sm p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Primary Ownership</h3>
              <div className="flex flex-col gap-4">
                 {tenant.members.filter(m => m.role === "owner").map(m => (
                    <div key={m.id} className="flex items-center gap-4">
                       <div className="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-lg">
                          {m.user.name.charAt(0)}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold text-sm tracking-tight">{m.user.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{m.user.email}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="rounded-[40px] border-border/50 bg-card/20 backdrop-blur-xl shadow-sm p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Metadata Analysis</h3>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                 <pre className="text-[9px] font-mono leading-relaxed text-muted-foreground overflow-auto">
                    {JSON.stringify(JSON.parse(tenant.metadata || "{}"), null, 2)}
                 </pre>
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 font-medium italic">
                 Last updated: {formatDateTime(tenant.updatedAt)}
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
}
