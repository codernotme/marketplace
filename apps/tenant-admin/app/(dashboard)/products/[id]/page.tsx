"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Tick01Icon, ImageAdd01Icon, Analytics01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { updateProduct, getProduct, getCategories } from "@/app/actions/products";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  description: z.string().optional(),
  sku: z.string().min(3, "SKU is required."),
  price: z.string(),
  compareAtPrice: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]),
  stock: z.string(),
});

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: "0",
      compareAtPrice: "",
      categoryId: "",
      status: "draft",
      stock: "0",
    },
  });

  useEffect(() => {
    async function init() {
      try {
        const [productData, categoriesData] = await Promise.all([
          getProduct(id),
          getCategories(),
        ]);
        
        setCategories(categoriesData);

        if (productData) {
          form.reset({
            name: productData.name,
            description: productData.description || "",
            sku: productData.sku || "",
            price: productData.variants?.[0]?.price?.toString() || "0",
            compareAtPrice: productData.variants?.[0]?.compareAtPrice?.toString() || "",
            categoryId: productData.categoryId || "",
            status: productData.status as any,
            stock: productData.variants?.[0]?.stock?.toString() || "0",
          });
        }
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/dashboard/products");
      } finally {
        setFetching(false);
      }
    }
    init();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        status: values.status,
        categoryId: values.categoryId || null,
        // For simple edit, we'll update the first variant or the main fields
        // In reality, SKU/Price/Stock might be on the main Product or ProductVariant
        // We'll update the main fields for now
      };
      
      await updateProduct(id, payload);
      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/products">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </Link>
          </Button>
          <PageHeader
            title={`Edit ${form.getValues("name")}`}
            description="Update your product details and availability."
          />
        </div>
        <Button variant="outline" size="sm" className="rounded-full">
           <HugeiconsIcon icon={Analytics01Icon} data-icon="inline-start" />
           View Performance
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Premium Cotton T-Shirt" {...field} className="bg-background/50 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell your customers about this product..." 
                          className="min-h-[200px] bg-background/50 border-input/50 rounded-xl resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm opacity-60">
               <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                  Inventory & Variants
                  <span className="text-[10px] font-normal px-2 py-0.5 bg-muted rounded">Coming Soon</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-xs text-muted-foreground italic">
                   Product variants (size, color, etc.) management will be available in Phase 2.
                 </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-muted/20 opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <HugeiconsIcon icon={ImageAdd01Icon} className="text-muted-foreground" size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Upload new gallery images.
                    <br />
                    <span className="text-xs">Supports PNG, JPG, WebP. (Phase 2)</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Visibility & Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 rounded-xl">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 rounded-xl">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="sticky top-24 space-y-4">
              <Button type="submit" className="w-full shadow-lg shadow-primary/20 rounded-xl py-6" disabled={loading}>
                {loading ? "Updating..." : (
                  <>
                    <HugeiconsIcon icon={Tick01Icon} data-icon="inline-start" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full rounded-xl py-6" asChild>
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
