"use client";

import { useState, useEffect } from "react";
import { 
  Table, Button, Input, Chip, Dropdown, Label, Tabs
} from "@heroui/react";
import { Search, Filter, Eye, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/actions/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders(statusFilter !== "ALL" ? statusFilter : undefined);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "success";
      case "PROCESSING": return "warning";
      case "PENDING": return "default";
      case "CANCELLED": return "danger";
      default: return "default";
    }
  };

  const getFulfillmentColor = (status: string) => {
    switch (status) {
      case "SHIPPED": return "accent";
      case "DELIVERED": return "success";
      case "PENDING": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted">Manage and fulfill your customer orders.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Tabs 
          className="w-full"
          onSelectionChange={(k) => setStatusFilter(k as string)}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Order Status">
              <Tabs.Tab id="ALL">
                All Orders <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="PENDING">
                Pending <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="PAID">
                Paid <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="FAILED">
                Failed <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-divider">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input 
              placeholder="Search orders (e.g. #ORD-1234)..." 
              className="pl-10 w-full"
            />
          </div>
          <Button variant="ghost" className="border-divider">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Table aria-label="Orders table">
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Column isRowHeader>ORDER</Table.Column>
              <Table.Column>DATE</Table.Column>
              <Table.Column>CUSTOMER</Table.Column>
              <Table.Column>PAYMENT</Table.Column>
              <Table.Column>FULFILLMENT</Table.Column>
              <Table.Column>TOTAL</Table.Column>
              <Table.Column className="text-right">ACTIONS</Table.Column>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-10 text-muted">Loading orders...</Table.Cell>
                </Table.Row>
              ) : orders.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-10 text-muted">No orders found.</Table.Cell>
                </Table.Row>
              ) : orders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <Link href={`/dashboard/orders/${order.id}`} className="font-semibold text-accent hover:underline">
                      {order.orderNumber}
                    </Link>
                    <div className="text-xs text-muted">{order._count?.items || 0} items</div>
                  </Table.Cell>
                  <Table.Cell className="text-muted uppercase text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-foreground">
                      {order.customer ? order.customer.name : order.guestEmail}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip color={getStatusColor(order.paymentStatus)} variant="soft">
                      {order.paymentStatus}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip color={getFulfillmentColor(order.fulfillmentStatus)} variant="soft">
                      {order.fulfillmentStatus}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="font-semibold">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(Number(order.total))}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        render={(props) => <Link {...(props as any)} href={`/dashboard/orders/${order.id}`} />}
                      >
                        <Eye className="w-4 h-4 text-muted" />
                      </Button>
                      <Dropdown>
                        <Button variant="ghost" size="sm" aria-label="Order actions">
                          <ChevronDown className="w-4 h-4 text-muted" />
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu>
                            <Dropdown.Item id="paid" textValue="Mark as Paid">
                              <Label>Mark as Paid</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="fulfill" textValue="Fulfill Items">
                              <Label>Fulfill Items</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="cancel" textValue="Cancel Order" variant="danger">
                              <Label>Cancel Order</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
