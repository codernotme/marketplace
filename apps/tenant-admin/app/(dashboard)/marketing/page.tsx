import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Discount01Icon, Mail01Icon, StarIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing — themrktplace",
  description: "Discounts, campaigns, and loyalty program management.",
};

export default function MarketingPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Marketing"
        description="Drive sales with discounts, campaigns, and loyalty programs."
      >
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Create campaign
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Discounts", icon: <HugeiconsIcon icon={Discount01Icon} size={24} />, count: 12, desc: "Active coupon codes and promotions", href: "/dashboard/marketing/discounts" },
          { title: "Email Campaigns", icon: <HugeiconsIcon icon={Mail01Icon} size={24} />, count: 5, desc: "Scheduled and sent campaigns", href: "/dashboard/marketing/campaigns" },
          { title: "Loyalty Program", icon: <HugeiconsIcon icon={StarIcon} size={24} />, count: "284 members", desc: "Points, tiers, and rewards", href: "/dashboard/marketing/loyalty" },
        ].map((item) => (
          <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary w-fit mb-2 group-hover:bg-primary/20 transition-colors">
                {item.icon}
              </div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active discounts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Active Discounts</CardTitle>
            <CardDescription>Currently running promotions</CardDescription>
          </div>
          <Button size="sm">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
            New discount
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[
              { code: "WELCOME20", type: "20% off", usage: "48/100", status: "active", expires: "Apr 30, 2026" },
              { code: "FREESHIP", type: "Free shipping", usage: "∞", status: "active", expires: "Never" },
              { code: "SUMMER15", type: "15% off", usage: "12/50", status: "scheduled", expires: "May 15, 2026" },
            ].map((d) => (
              <div key={d.code} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono font-semibold bg-muted px-2 py-0.5 rounded">{d.code}</code>
                  <span className="text-sm text-muted-foreground">{d.type}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Used: {d.usage}</span>
                  <span className="text-muted-foreground">Expires: {d.expires}</span>
                  <Badge variant={d.status === "active" ? "default" : "secondary"}>{d.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
