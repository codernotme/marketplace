import { getOrder } from "@/actions/orders";
import { notFound } from "next/navigation";
import { Card, Chip, Button, Separator } from "@heroui/react";
import { ArrowLeft, Printer, Box, CreditCard, Truck, MessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "success";
      case "PENDING": return "warning";
      case "FAILED": return "danger";
      case "REFUNDED": return "default";
      default: return "default";
    }
  };

  const getFulfillmentColor = (status: string) => {
    switch (status) {
      case "FULFILLED": return "success";
      case "UNFULFILLED": return "warning";
      case "SHIPPED": return "accent";
      case "DELIVERED": return "success";
      default: return "default";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            render={(props) => <Link {...(props as any)} href="/dashboard/orders" />}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Order {order.orderNumber}</h1>
            <p className="text-sm text-muted uppercase tracking-wider">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="border-divider">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="primary">
            <Truck className="w-4 h-4 mr-2" />
            Fulfill Items
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <Card.Content className="p-0">
              <div className="flex items-center justify-between p-6 bg-surface/50 border-b border-divider">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-muted" />
                  <span className="font-semibold text-foreground">{order.items.length} Items</span>
                </div>
                <Chip color={getFulfillmentColor(order.fulfillmentStatus)} variant="soft">
                  {order.fulfillmentStatus}
                </Chip>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-muted/30 border border-divider p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-muted text-xs">IMG</div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted font-mono">{item.variantLabel || item.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <p className="text-sm text-muted">x{item.quantity}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(item.totalPrice))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Card className="shadow-sm">
            <Card.Content className="p-0">
              <div className="flex items-center justify-between p-6 bg-surface/50 border-b border-divider">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted" />
                  <span className="font-semibold text-foreground">Payment Summary</span>
                </div>
                <Chip color={getStatusColor(order.paymentStatus)} variant="soft">
                  {order.paymentStatus}
                </Chip>
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-foreground">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(order.subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Discount</span>
                    <span className="text-danger">-{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(order.discountTotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-foreground">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(order.shippingTotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Tax</span>
                    <span className="text-foreground">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(order.taxTotal))}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-accent">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(order.total))}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-6">
              <h3 className="font-semibold text-foreground">Order Timeline</h3>
              <Separator />
              <div className="space-y-6">
                {order.timeline.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0 z-10 relative" />
                      <div className="absolute left-1/2 top-3 bottom-[-24px] w-px bg-divider -translate-x-1/2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.message}</p>
                      <span className="text-xs text-muted uppercase">{new Date(event.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Order Placed</p>
                    <span className="text-xs text-muted uppercase">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Customer</h3>
              <Separator />
              {order.customer ? (
                <div className="flex flex-col gap-2">
                  <Link href={`/dashboard/customers/${order.customer.id}`} className="font-semibold text-accent hover:underline">
                    {order.customer.name}
                  </Link>
                  <p className="text-sm text-foreground">{order.customer.email}</p>
                  <p className="text-sm text-muted">{order.customer.phone || "No phone added"}</p>
                  <div className="mt-2 pt-2 border-t border-divider">
                    <span className="text-xs font-medium text-muted uppercase">{order.customer.ordersCount} Total Orders</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-foreground">Guest Customer</p>
                  <p className="text-sm text-muted">{order.guestEmail}</p>
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-4">
               <h3 className="font-semibold text-foreground">Shipping Address</h3>
               <Separator />
               {order.shippingAddress ? (
                 <div className="text-sm text-foreground flex flex-col gap-1 leading-relaxed">
                   <p className="font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                   {order.shippingAddress.company && <p className="text-muted">{order.shippingAddress.company}</p>}
                   <p>{order.shippingAddress.addressLine1}</p>
                   {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                   <p className="font-medium text-accent">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                   <p className="text-xs text-muted uppercase tracking-widest">{order.shippingAddress.country}</p>
                 </div>
               ) : (
                 <p className="text-sm text-muted italic">No shipping address provided.</p>
               )}
            </Card.Content>
          </Card>

          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Contact</h3>
              <Separator />
              <Button variant="ghost" className="w-full border-divider">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Customer
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
