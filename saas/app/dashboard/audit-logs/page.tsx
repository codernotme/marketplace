"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { AuditLog } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const actionColors: Record<string, string> = {
  create: "bg-green-500/20 text-green-400",
  update: "bg-blue-500/20 text-blue-400",
  delete: "bg-red-500/20 text-red-400",
  suspend: "bg-orange-500/20 text-orange-400",
  activate: "bg-green-500/20 text-green-400",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const params = new URLSearchParams({
          limit: "50",
          ...(search && { search }),
        });
        const response = await apiClient.get<{ data: AuditLog[] }>(`/api/saas/audit-logs?${params.toString()}`);
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        // Mock data
        setLogs([
          {
            _id: "log_001",
            admin_id: "admin_001",
            admin_email: "admin@themrktplace.com",
            action: "update",
            resource_type: "tenant",
            resource_id: "tenant_001",
            changes: { status: "active" },
            ip_address: "192.168.1.1",
            user_agent: "Mozilla/5.0",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">Track all admin actions and platform changes</p>
      </div>

      {/* Search */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by admin email, action, or resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted border-border text-foreground placeholder-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-muted-foreground">Admin</TableHead>
                    <TableHead className="text-muted-foreground">Action</TableHead>
                    <TableHead className="text-muted-foreground">Resource</TableHead>
                    <TableHead className="text-muted-foreground">Changes</TableHead>
                    <TableHead className="text-muted-foreground">IP Address</TableHead>
                    <TableHead className="text-muted-foreground">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log._id} className="border-border hover:bg-muted/50 transition">
                        <TableCell>
                          <div>
                            <p className="text-foreground text-sm">{log.admin_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`capitalize ${actionColors[log.action] || "bg-accent text-muted-foreground"}`}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground text-sm">
                          {log.resource_type} ({log.resource_id})
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {Object.entries(log.changes).slice(0, 2).map(([key, val]) => (
                            <div key={key}>
                              {key}: {String(val).substring(0, 20)}...
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{log.ip_address}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

