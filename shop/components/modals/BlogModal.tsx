"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Input, Checkbox, Label, Description, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBlogStore, useUIStore } from "@/lib/store";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  avatar: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured: boolean;
  content: string[];
  tags: string[];
};

const CATEGORIES = ["Fashion", "Electronics", "Lifestyle", "Home & Living"];

export function BlogModal({
  isOpen,
  onClose,
  mode,
  data
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  data?: any;
}) {
  const { addPost, updatePost } = useBlogStore();

  const isEdit = mode === "edit";

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    category: "Fashion",
    featured: false,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
    author: "Aryan Bajpai",
    avatar: "https://i.pravatar.cc/100?img=68",
    tags: [],
    content: [],
  });

  useEffect(() => {
    if (isEdit && data) {
      setFormData(data);
    } else {
      setFormData({
        title: "",
        excerpt: "",
        category: "Fashion",
        featured: false,
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
        author: "Aryan Bajpai",
        avatar: "https://i.pravatar.cc/100?img=68",
        tags: [],
        content: [],
      });
    }
  }, [isEdit, data, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && data?.id) {
      updatePost(data.id, formData);
    } else {
      const newPost: BlogPost = {
        ...formData as BlogPost,
        id: `blog-${Math.random().toString(36).substr(2, 9)}`,
        slug: formData.title?.toLowerCase().replace(/ /g, "-") || "",
        publishedAt: new Date().toISOString().split("T")[0],
        readTime: "5 min read",
      };
      addPost(newPost);
    }
    onClose();
  };

  return (
    <Modal>
      <Modal.Backdrop 
        isOpen={isOpen} 
        onOpenChange={onClose}
        variant="blur"
        className="bg-black/60"
      >
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-w-[720px] w-full flex flex-col max-h-[90vh]">
            <Modal.Header className="px-8 py-6 border-b border-border bg-default/5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <Modal.Icon className="bg-accent/20 text-accent">
                  <Icon icon={isEdit ? "solar:pen-2-bold-duotone" : "solar:add-circle-bold-duotone"} className="text-2xl" />
                </Modal.Icon>
                <div>
                  <Modal.Heading className="text-xl font-black tracking-tight">{isEdit ? "Edit Article" : "New Article"}</Modal.Heading>
                  <p className="text-xs text-muted font-medium mt-0.5">Define your storytelling and reach your audience.</p>
                </div>
              </div>
              <Button variant="secondary" onPress={onClose} isIconOnly className="rounded-xl">
                 <Icon icon="solar:close-circle-bold" className="text-xl" />
              </Button>
            </Modal.Header>

            <Modal.Body className="p-8 overflow-y-auto scrollbar-hide space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Article Title *</Label>
                      <input
                        placeholder="Enter catchy title..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full bg-default/40 border border-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Category</Label>
                       <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-300 ${formData.category === cat
                                ? "bg-accent/10 border-accent/40 text-accent shadow-sm"
                                : "bg-default/40 border-border text-muted hover:border-accent/20"
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-accent/5 border border-accent/10 shadow-sm">
                      <input
                        type="checkbox"
                        id="blog-featured-toggle"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5 rounded-lg border-border text-accent focus:ring-accent accent-accent transition-all cursor-pointer"
                      />
                      <div>
                        <Label htmlFor="blog-featured-toggle" className="text-sm font-bold text-accent cursor-pointer block">Featured Article</Label>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">This article will be pinned at the top of the blog feed.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Cover Image</Label>
                      <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-border bg-default/20 group cursor-pointer shadow-inner">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="font-bold gap-2 rounded-xl">
                            <Icon icon="solar:camera-bold-duotone" className="text-lg" />
                            Update Asset
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Short Excerpt *</Label>
                      <textarea
                        placeholder="Brief summary for social feeds..."
                        rows={4}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        required
                        className="w-full bg-default/40 border border-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent transition-all duration-300 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
               </div>

               <Separator className="border-border/50" />

               <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Tags (Comma Separated)</Label>
                    <input
                      placeholder="style, guide, tech, fashion..."
                      value={formData.tags?.join(", ")}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                      className="w-full bg-default/40 border border-border rounded-2xl px-5 py-3.5 text-sm font-mono focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 opacity-80">Main Article Content</Label>
                    <textarea
                      placeholder="Start writing your masterpiece here..."
                      rows={8}
                      value={formData.content?.join("\n\n")}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value.split("\n\n") })}
                      className="w-full bg-default/40 border border-border rounded-3xl px-6 py-5 text-sm focus:outline-none focus:border-accent transition-all duration-300 outline-none resize-none font-body leading-relaxed min-h-[220px]"
                    />
                    <p className="text-[10px] text-muted italic ml-1">* Use double line breaks to start a new paragraph.</p>
                  </div>
               </div>
            </Modal.Body>

            <Modal.Footer className="px-8 py-6 border-t border-border flex items-center justify-between bg-default/5 flex-shrink-0">
              <Button variant="secondary" className="font-bold border border-border rounded-xl px-6" onPress={onClose}>
                Cancel
              </Button>
              <div className="flex gap-4">
                {!isEdit && (
                  <Button variant="secondary" className="font-bold border border-border rounded-xl px-6" type="button">
                    Save Draft
                  </Button>
                )}
                <Button variant="primary" className="font-bold px-10 rounded-xl shadow-lg shadow-accent/20" type="submit">
                  {isEdit ? "Update Article" : "Publish Article"}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
