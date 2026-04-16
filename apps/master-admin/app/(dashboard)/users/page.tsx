import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, FilterIcon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { formatDate } from "@workspace/ui/lib/formatters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Users — themrktplace Master Admin",
  description: "Manage global administrators and support staff.",
};

const masterUsers = [
  { id: "u001", name: "Aryan Shah", email: "aryan@themrktplace.io", role: "Super Admin", status: "active", lastLogin: new Date() },
  { id: "u002", name: "Sarah Chen", email: "sarah@themrktplace.io", role: "Platform Manager", status: "active", lastLogin: new Date(Date.now() - 3600000) },
  { id: "u003", name: "Michael Rodriguez", email: "mike@themrktplace.io", role: "Support Lead", status: "active", lastLogin: new Date(Date.now() - 86400000) },
  { id: "u004", name: "Jessica Lee", email: "jess@themrktplace.io", role: "Billing Admin", status: "inactive", lastLogin: new Date(Date.now() - 604800000) },
];

export default function MasterUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Platform Users"
        description="Manage internal administrators and platform support staff."
      >
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Add team member
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{masterUsers.length} team members</CardTitle>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 py-2 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Last Login</span>
              <span>Status</span>
              <span className="w-10"></span>
            </div>
            {masterUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 py-3 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                <span className="text-sm">{user.role}</span>
                <span className="text-xs text-muted-foreground">{formatDate(user.lastLogin)}</span>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                  {user.status}
                </Badge>
                <Button variant="ghost" size="icon" className="size-8">
                  <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
