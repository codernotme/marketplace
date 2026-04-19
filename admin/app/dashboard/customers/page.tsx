"use client";

import { useState, useEffect } from "react";
import { 
  Table, Button, Input, Chip, Dropdown, Label, Spinner, Separator
} from "@heroui/react";
import { Search, Filter, MoreVertical, Ban, Mail } from "lucide-react";
import { getCustomers } from "@/actions/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    const data = await getCustomers(search);
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted">Manage your store's customers and view their history.</p>
        </div>
        <Button variant="secondary" className="bg-surface/50">
          <Filter className="w-4 h-4 mr-2" />
          Segments
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-divider">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table aria-label="Customers table">
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Column isRowHeader>NAME</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column>ORDERS</Table.Column>
              <Table.Column>TOTAL SPENT</Table.Column>
              <Table.Column>JOINED</Table.Column>
              <Table.Column className="text-right">ACTIONS</Table.Column>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-10 text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Loading customers...</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : customers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-10 text-muted">No customers found.</Table.Cell>
                </Table.Row>
              ) : customers.map((customer) => (
                <Table.Row key={customer.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground hover:text-accent transition cursor-pointer">{customer.name}</span>
                      <span className="text-xs text-muted">{customer.email}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip 
                      color={customer.status === "ACTIVE" ? "success" : customer.status === "BANNED" ? "danger" : "default"} 
                      variant="soft"
                    >
                      {customer.status}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>{customer.ordersCount}</Table.Cell>
                  <Table.Cell>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: "INR" }).format(customer.totalSpent)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-muted">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4 text-muted" />
                      </Button>
                      <Dropdown>
                        <Dropdown.Trigger>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4 text-muted" />
                          </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover>
                          <Dropdown.Menu aria-label="Customer actions">
                            <Dropdown.Item>View Profile</Dropdown.Item>
                            <Dropdown.Item>Send Password Reset</Dropdown.Item>
                            <Separator />
                            <Dropdown.Item variant="danger">
                              <Ban className="w-4 h-4 mr-2" />
                              Ban Customer
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
