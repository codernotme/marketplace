"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Input, InputGroup, Dropdown, Label, Separator, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBlogStore, useUIStore } from "@/lib/store";

const CATEGORIES = ["All", "Fashion", "Electronics", "Lifestyle", "Home & Living"];

export default function BlogPage() {
  const { posts, deletePost, toggleFeatured } = useBlogStore();
  const { openModal } = useUIStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const categoryFilter = searchParams.get("category") || "All";

  const updateCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") params.delete("category");
    else params.set("category", cat);
    router.push(`/dashboard/blog?${params.toString()}`);
  };

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Management"
        subtitle={`${posts.length} articles published`}
        icon="solar:pen-new-square-bold-duotone"
        actions={
          <Button 
            variant="primary" 
            className="font-bold gap-2 px-6 shadow-lg shadow-accent/20"
            onPress={() => openModal("blog", "add")}
          >
            <Icon icon="solar:add-circle-bold-duotone" className="text-xl" />
            Create Post
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex gap-1 p-1 bg-default/40 rounded-xl w-fit overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <div className="flex items-center gap-2 bg-default/40 border border-border rounded-2xl px-4 py-2.5 text-sm hover:border-accent/40 transition-all">
            <Icon icon="solar:magnifer-bold-duotone" className="text-lg text-muted" />
            <input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-5 py-4 text-xs font-black text-muted uppercase tracking-[0.1em]">Article</th>
                <th className="text-left px-5 py-4 text-xs font-black text-muted uppercase tracking-[0.1em] hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-4 text-xs font-black text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Author</th>
                <th className="text-left px-5 py-4 text-xs font-black text-muted uppercase tracking-[0.1em]">Status</th>
                <th className="px-5 py-4 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((post) => (
                <tr key={post.id} className="table-row-hover group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border bg-default/20">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[240px] group-hover:text-accent transition-colors">{post.title}</p>
                          <p className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider" suppressHydrationWarning>
                            Published {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-default/60 text-[10px] font-black uppercase tracking-wider text-muted">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full border border-border" />
                        <span className="font-bold text-foreground/80">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                          <span className="text-xs font-bold">Published</span>
                        </div>
                        {post.featured && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded-md border border-accent/10">
                            <Icon icon="solar:star-bold-duotone" />
                            Featured
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <div 
                            className="p-2 rounded-xl hover:bg-default text-muted hover:text-foreground transition-all duration-300 outline-none cursor-pointer group"
                            role="button"
                            tabIndex={0}
                          >
                            <Icon icon="solar:menu-dots-bold-duotone" className="text-xl group-hover:scale-110 transition-transform" />
                          </div>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="min-w-[180px]">
                          <Dropdown.Menu onAction={(key) => {
                            if (key === "edit") openModal("blog", "edit", post);
                            if (key === "delete") deletePost(post.id);
                            if (key === "feature") toggleFeatured(post.id);
                          }}>
                            <Dropdown.Item id="preview" textValue="Preview Article">
                              <Icon icon="solar:eye-bold-duotone" className="text-lg text-muted" />
                              <Label className="font-bold">Preview</Label>
                            </Dropdown.Item>
                          <Dropdown.Item id="edit" textValue="Edit Article">
                            <Icon icon="solar:pen-2-bold-duotone" className="text-lg text-muted" />
                            <Label className="font-bold">Edit Article</Label>
                          </Dropdown.Item>
                          <Dropdown.Item id="feature" textValue={post.featured ? "Unfeature Article" : "Feature Article"}>
                            <Icon icon={post.featured ? "solar:star-outline-bold-duotone" : "solar:star-bold-duotone"} className={`text-lg ${post.featured ? "text-muted" : "text-accent"}`} />
                            <Label className="font-bold">{post.featured ? "Remove Featured" : "Make Featured"}</Label>
                          </Dropdown.Item>
                          <Separator className="my-1 border-border/50" />
                          <Dropdown.Item id="delete" textValue="Delete Article" variant="danger">
                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg text-danger" />
                            <Label className="font-bold text-danger">Delete</Label>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-default/20 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-border/40 text-muted/40">
                <Icon icon="solar:pen-new-square-bold-duotone" className="text-3xl" />
              </div>
              <p className="text-sm font-bold text-muted">No articles found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
