"use client";

import { PageHeader } from "@workspace/ui/components/page-header";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Settings01Icon, Delete02Icon, PencilEdit01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { getCategories, createCategory } from "@/app/actions/products";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@workspace/ui/components/sheet";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent } from "@workspace/ui/components/card";
import { toast } from "sonner";
import { slugify } from "@workspace/ui/lib/formatters";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    setLoading(true);
    try {
      await createCategory({
        name: newName,
        description: newDescription,
        slug: slugify(newName),
      });
      toast.success("Category created successfully");
      setNewName("");
      setNewDescription("");
      setIsAdding(false);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Categories"
        description="Organize your products into logical collections and hierarchies."
      >
        <Sheet open={isAdding} onOpenChange={setIsAdding}>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-full shadow-lg shadow-primary/10 px-5">
              <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
              New Category
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-background/80 backdrop-blur-xl border-l border-border/50">
            <SheetHeader>
              <SheetTitle>Create Category</SheetTitle>
              <SheetDescription>
                Add a new category to your store. You can nest categories later.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-6 mt-8">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Menswear"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-background/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="bg-background/50 rounded-xl min-h-[100px] resize-none"
                />
              </div>
              <SheetFooter>
                <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id} className="group border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <HugeiconsIcon icon={Folder01Icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {category.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                   <span>0 Products</span>
                   <div className="flex items-center gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-success" />
                     {category.isActive ? "Active" : "Inactive"}
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
            <HugeiconsIcon icon={Folder01Icon} size={40} className="text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground mt-4">No categories found.</p>
            <p className="text-xs text-muted-foreground/60 mt-1 text-center max-w-[200px]">
              Categories help you organize products and improve navigation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
