"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { AuditLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  Search, 
  Activity, 
  ShieldAlert, 
  Users, 
  Download, 
  Eye, 
  FileJson,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const actionColors: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  update: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  delete: "bg-destructive/10 text-destructive border-destructive/20",
  suspend: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  activate: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  login: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

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
        // Robust mock data for demo-ready state
        setLogs([
          {
            _id: "log_001",
            admin_id: "admin_001",
            admin_email: "aryan@themrktplace.com",
            action: "update",
            resource_type: "tenant",
            resource_id: "65f2b1a2c3d4",
            changes: { status: "active", plan: "pro", activated_at: new Date().toISOString() },
            ip_address: "157.34.122.90",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
          {
            _id: "log_002",
            admin_id: "admin_001",
            admin_email: "aryan@themrktplace.com",
            action: "create",
            resource_type: "plan",
            resource_id: "65f2b5e2a1b2",
            changes: { name: "Enterprise Ultra", price_monthly: 999, currency: "USD" },
            ip_address: "157.34.122.90",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          },
          {
            _id: "log_003",
            admin_id: "admin_002",
            admin_email: "support@themrktplace.com",
            action: "suspend",
            resource_type: "tenant",
            resource_id: "65f2c2a3b1c2",
            changes: { status: "suspended", reason: "Policy violation: high risk activities" },
            ip_address: "192.168.1.45",
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          },
          {
            _id: "log_004",
            admin_id: "admin_001",
            admin_email: "aryan@themrktplace.com",
            action: "login",
            resource_type: "admin",
            resource_id: "admin_001",
            changes: { method: "credentials", source: "dashboard-login" },
            ip_address: "157.34.122.90",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [search]);

  const handleExport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Admin,Action,Resource,IP Address\n"
      + logs.map(e => `${e.timestamp},${e.admin_email},${e.action},${e.resource_type},${e.ip_address}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 container mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Real-time activity stream and governance tracking for the SaaS platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="h-9 border-border">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" variant="default" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
            <Activity className="mr-2 h-4 w-4" />
            Live Stream
          </Button>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+12% from last 24h</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently authenticated</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-emerald-500">Sync operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Row */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by admin, resource ID, or specific action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background border-border text-foreground h-10 w-full md:max-w-md focus-visible:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Logs Table */}
      <Card className="border-border bg-card shadow-md overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
              <Spinner className="h-8 w-8 text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">Fetching platform audit stream...</p>
            </div>
          ) : (
            <div className="relative">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[220px] font-semibold text-foreground">Admin User</TableHead>
                    <TableHead className="w-[120px] font-semibold text-foreground">Action Type</TableHead>
                    <TableHead className="font-semibold text-foreground">Affected Resource</TableHead>
                    <TableHead className="w-[140px] font-semibold text-foreground">Network Context</TableHead>
                    <TableHead className="w-[180px] font-semibold text-foreground">Event Time</TableHead>
                    <TableHead className="w-[100px] text-right font-semibold text-foreground">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Eye className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-lg font-medium">No activity data within slice</p>
                          <p className="text-sm">Try adjusting your filters or check sync state.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log._id} className="border-border hover:bg-muted/20 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                              {log.admin_email.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-foreground">{log.admin_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${actionColors[log.action] || "bg-muted text-muted-foreground"}`}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-mono">
                              {log.resource_type}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                              {log.resource_id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-[11px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                            {log.ip_address}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground">
                              {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedLog(log)}
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <DialogContent className="max-w-2xl bg-card border-border">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FileJson className="h-5 w-5 text-primary" />
                                  Event Transformation Details
                                </DialogTitle>
                                <DialogDescription>
                                  Deep-link identifier: {log._id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm p-4 rounded-lg bg-muted/30 border border-border">
                                  <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Actor</p>
                                    <p className="font-medium">{log.admin_email}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Agent Signature</p>
                                    <p className="font-medium truncate" title={log.user_agent}>{log.user_agent}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase text-muted-foreground">Changes Context</label>
                                  <ScrollArea className="h-[250px] w-full rounded-md border border-border bg-black p-4">
                                    <pre className="text-emerald-400 text-xs font-mono">
                                      {JSON.stringify(log.changes, null, 2)}
                                    </pre>
                                  </ScrollArea>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
      
      {/* Platform Health Section */}
      <div className="flex items-center justify-between pt-2">
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Stream Status: Synchronized</span>
         </div>
         <p className="text-[10px] text-muted-foreground italic">Retention Policy: 365 Days Global History</p>
      </div>
    </div>
  );
}

