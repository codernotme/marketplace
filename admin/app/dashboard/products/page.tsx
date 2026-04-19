"use client";

import { useState, useEffect } from "react";
import { 
  Table, Button, Input, Chip, Dropdown, Label
} from "@heroui/react";
import { Plus, Search, MoreVertical, FileDown, Eye } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/actions/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts(search);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-muted">Manage your product catalog and inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="border-divider">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="primary" 
            render={(props) => <Link {...(props as any)} href="/dashboard/products/new" />}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-divider">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table aria-label="Products table">
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Column isRowHeader>PRODUCT</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column>INVENTORY</Table.Column>
              <Table.Column>CATEGORY</Table.Column>
              <Table.Column className="text-right">ACTIONS</Table.Column>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-10 text-muted">Loading products...</Table.Cell>
                </Table.Row>
              ) : products.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-10 text-muted">No products found.</Table.Cell>
                </Table.Row>
              ) : products.map((item) => {
                const totalInventory = item.variants.reduce((acc: number, v: any) => acc + v.quantity, 0);
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          IMG
                        </div>
                        <div className="flex flex-col text-left">
                          <Link href={`/dashboard/products/${item.id}`} className="font-medium text-accent hover:underline">
                            {item.name}
                          </Link>
                          <span className="text-xs text-muted">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(item.basePrice))}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip 
                        color={item.status === "ACTIVE" ? "success" : item.status === "DRAFT" ? "warning" : "default"}
                        variant="soft"
                      >
                        {item.status}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      {totalInventory > 0 ? (
                        <span className="text-success">{totalInventory} in stock</span>
                      ) : (
                        <span className="text-danger">Out of stock</span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-muted">{item.category?.name || "-"}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          render={(props) => <Link {...(props as any)} href={`/dashboard/products/${item.id}`} />}
                        >
                          <Eye className="w-4 h-4 text-muted" />
                        </Button>
                        <Dropdown>
                          <Button variant="ghost" size="sm" aria-label="More actions">
                            <MoreVertical className="w-4 h-4 text-muted" />
                          </Button>
                          <Dropdown.Popover>
                            <Dropdown.Menu>
                              <Dropdown.Item id="edit" textValue="Edit product">
                                <Label>Edit product</Label>
                              </Dropdown.Item>
                              <Dropdown.Item id="duplicate" textValue="Duplicate">
                                <Label>Duplicate</Label>
                              </Dropdown.Item>
                              <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                                <Label>Delete</Label>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
