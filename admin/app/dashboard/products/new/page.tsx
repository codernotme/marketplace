"use client";

import { useState, useEffect } from "react";
import { 
  Input, Button, Select, ListBox, TextArea, Card, Checkbox, Label, Separator, Spinner
} from "@heroui/react";
import { ArrowLeft, Save, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories } from "@/actions/categories";
import { createProduct } from "@/actions/products";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "0",
    sku: "",
    quantity: "0",
    categoryId: "",
    status: "DRAFT"
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await createProduct({
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      quantity: parseInt(formData.quantity)
    });

    setIsSaving(false);
    
    if (result.success) {
      router.push("/dashboard/products");
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            render={(props) => <Link {...(props as any)} href="/dashboard/products" />}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Product</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-danger border-divider" 
            render={(props) => <Link {...(props as any)} href="/dashboard/products" />}
          >
            Discard
          </Button>
          <Button variant="primary" type="submit" isPending={isSaving}>
            {({isPending}) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Basic Info</h2>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input 
                    required 
                    placeholder="e.g. Premium Cotton T-Shirt"
                    value={formData.name}
                    onChange={e => {
                      const name = e.target.value;
                      setFormData({...formData, name, slug: name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')});
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Slug</Label>
                  <Input 
                    required 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <TextArea 
                    placeholder="Describe your product..."
                    className="min-h-[150px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Pricing & Inventory</h2>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price (₹)</Label>
                  <Input 
                    required 
                    type="number"
                    value={formData.basePrice}
                    onChange={e => setFormData({...formData, basePrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compare at price (₹)</Label>
                  <Input 
                    type="number"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SKU (Stock Keeping Unit)</Label>
                  <Input 
                    required 
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Initial Quantity</Label>
                  <Input 
                    required 
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Organization</h2>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    onSelectionChange={(keys: any) => {
                      const key = Array.from(keys)[0] as string;
                      if (key) setFormData({...formData, status: key});
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="DRAFT">Draft</ListBox.Item>
                        <ListBox.Item id="ACTIVE">Active</ListBox.Item>
                        <ListBox.Item id="ARCHIVED">Archived</ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    onSelectionChange={(keys: any) => {
                      const key = Array.from(keys)[0] as string;
                      if (key) setFormData({...formData, categoryId: key});
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {categories.map(c => (
                          <ListBox.Item id={c.id} key={c.id}>{c.name}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="shadow-sm">
            <Card.Content className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Media</h2>
              <Separator />
              <div className="border-2 border-dashed border-divider rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 hover:border-accent/50 transition cursor-pointer">
                <div className="p-3 bg-muted rounded-full">
                  <Plus className="w-6 h-6 text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Upload images</p>
                  <p className="text-xs text-muted">Drag and drop or click to select</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </form>
  );
}
