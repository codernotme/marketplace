"use client";

import { useState, useEffect } from "react";
import { 
  Table, Button, Input, Chip, Modal, Select, ListBox, TextArea, Checkbox, Label, Separator
} from "@heroui/react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/actions/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", parentId: "", isActive: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, { ...formData, parentId: formData.parentId || null });
    } else {
      await createCategory({ ...formData, parentId: formData.parentId || null });
    }
    fetchCategories();
    setIsModalOpen(false);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || "",
      isActive: category.isActive
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  const openNewCategory = () => {
    setFormData({ name: "", slug: "", description: "", parentId: "", isActive: true });
    setEditingId(null);
    setIsModalOpen(true);
  }

  return (
    <div className="flex flex-col w-full px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted">Organize your product catalog into categories.</p>
        </div>
        <Button variant="primary" onPress={openNewCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-divider">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input 
            placeholder="Search categories..." 
            className="pl-10"
          />
        </div>
      </div>

      <Table aria-label="Categories table">
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Column isRowHeader>NAME</Table.Column>
              <Table.Column>SLUG</Table.Column>
              <Table.Column>PRODUCTS</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column className="text-right">ACTIONS</Table.Column>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-10 text-muted">Loading categories...</Table.Cell>
                </Table.Row>
              ) : categories.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-10 text-muted">No categories found.</Table.Cell>
                </Table.Row>
              ) : categories.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.name}</span>
                      {item.parent && <span className="text-xs text-muted">Child of: {item.parent.name}</span>}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted">{item.slug}</Table.Cell>
                  <Table.Cell>{item._count.products}</Table.Cell>
                  <Table.Cell>
                    <Chip 
                      color={item.isActive ? "success" : "default"}
                      variant="soft"
                    >
                      {item.isActive ? "Active" : "Archived"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onPress={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4 text-muted" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-danger" onPress={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Heading>{editingId ? "Edit Category" : "New Category"}</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({...formData, name, slug: name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')});
                    }}
                    placeholder="Category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input 
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="category-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <Select 
                    placeholder="Select a parent (optional)"
                    onSelectionChange={(keys: any) => {
                      const key = Array.from(keys)[0] as string;
                      if (key) setFormData({...formData, parentId: key});
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {categories.filter(c => c.id !== editingId).map((c) => (
                          <ListBox.Item id={c.id} key={c.id}>{c.name}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <TextArea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional description"
                    className="min-h-[100px]"
                  />
                </div>
                <Checkbox 
                  id="active-status"
                  isSelected={formData.isActive}
                  onChange={(isSelected) => setFormData({...formData, isActive: isSelected})}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label htmlFor="active-status">Active</Label>
                  </Checkbox.Content>
                </Checkbox>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? "Update Category" : "Create Category"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
}
