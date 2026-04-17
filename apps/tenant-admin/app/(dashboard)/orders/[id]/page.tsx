"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  PackageIcon, 
  Tick01Icon, 
  UserIcon, 
  Location01Icon, 
  Cancel01Icon,
  Shipping02Icon,
  Truck01Icon
} from "@hugeicons/core-free-icons";
import { formatINR, formatDateTime, getOrderStatusColor, formatOrderStatus } from "@workspace/ui/lib/formatters";
import { getOrder, updateOrderStatus } from "@/app/actions/orders";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrder(id);
        if (!data) {
          toast.error("Order not found");
          router.push("/dashboard/orders");
          return;
        }
        setOrder(data);
      } catch (error) {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, router]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      const updatedOrder = await getOrder(id);
      setOrder(updatedOrder);
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/dashboard/orders">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </Link>
        </Button>
        <PageHeader
          title={order.orderNumber || `#${order.id.slice(-8)}`}
          description={formatDateTime(order.createdAt)}
        >
          <Badge className={cn("px-4 py-1.5 text-xs font-semibold shadow-none border-transparent capitalize", getOrderStatusColor(order.status))}>
            {formatOrderStatus(order.status)}
          </Badge>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Billing */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HugeiconsIcon icon={PackageIcon} size={18} className="text-primary" />
                Items
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[10px]">{order.items?.length || 0} items</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right pr-6">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div className="font-medium text-sm">{item.title}</div>
                        {item.variantTitle && <div className="text-[10px] text-muted-foreground">{item.variantTitle}</div>}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                      <TableCell className="tabular-nums text-sm">{formatINR(item.unitPrice)}</TableCell>
                      <TableCell className="text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold pr-6">{formatINR(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="p-6 bg-muted/10">
                <div className="flex flex-col gap-2 max-w-[300px] ml-auto">
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="tabular-nums">{formatINR(order.subtotal)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="tabular-nums text-success">Free</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="tabular-nums text-destructive">-{formatINR(order.discountAmount || 0)}</span>
                   </div>
                   <Separator className="my-2" />
                   <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatINR(order.total)}</span>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
                <CardTitle className="text-sm font-semibold">Status Transitions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
               {order.status === 'pending' && (
                 <Button onClick={() => handleStatusChange('processing')} disabled={updating} className="rounded-xl flex-1 bg-primary shadow-lg shadow-primary/20">
                    <HugeiconsIcon icon={Tick01Icon} data-icon="inline-start" />
                    Accept Order
                 </Button>
               )}
               {order.status === 'processing' && (
                 <Button onClick={() => handleStatusChange('shipped')} disabled={updating} className="rounded-xl flex-1 bg-info hover:bg-info/90">
                    <HugeiconsIcon icon={Shipping02Icon} data-icon="inline-start" />
                    Mark as Shipped
                 </Button>
               )}
               {order.status === 'shipped' && (
                 <Button onClick={() => handleStatusChange('delivered')} disabled={updating} className="rounded-xl flex-1 bg-success hover:bg-success/90">
                    <HugeiconsIcon icon={Truck01Icon} data-icon="inline-start" />
                    Mark as Delivered
                 </Button>
               )}
               {['pending', 'processing'].includes(order.status) && (
                 <Button variant="outline" onClick={() => handleStatusChange('cancelled')} disabled={updating} className="rounded-xl flex-1 text-destructive border-destructive/20 hover:bg-destructive/5">
                    <HugeiconsIcon icon={Cancel01Icon} data-icon="inline-start" />
                    Cancel Order
                 </Button>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-8">
           <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                    <HugeiconsIcon icon={UserIcon} size={16} />
                    Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <div className="font-medium text-sm">{order.customer?.name || "Guest Checkout"}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                    {order.phone && <div className="text-xs text-muted-foreground mt-0.5">{order.phone}</div>}
                 </div>
                 <Button variant="outline" size="sm" className="w-full text-[11px] rounded-lg h-8">
                    View Customer Profile
                 </Button>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                    <HugeiconsIcon icon={Location01Icon} size={16} />
                    Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="text-xs leading-relaxed text-muted-foreground/80">
                    {order.shippingAddress ? (
                      // Assume parsing for now if it's JSON string
                      typeof order.shippingAddress === 'string' ? order.shippingAddress : JSON.stringify(order.shippingAddress)
                    ) : "No shipping address provided."}
                 </div>
                 <Button variant="ghost" size="sm" className="w-full text-[11px] text-primary hover:bg-primary/5">
                    Edit Address
                 </Button>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-[10px] shadow-none h-5">
                       {order.paymentStatus}
                    </Badge>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Method</span>
                    <span className="text-xs font-medium">Digital/POS</span>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
