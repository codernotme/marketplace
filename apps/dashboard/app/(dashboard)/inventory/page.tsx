import { Metadata } from "next"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Download01Icon, FilterIcon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Inventory | The Mrktplace",
  description: "Manage your products and stock levels.",
}

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1 font-sans">Manage your products, variants, and stock levels.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={FilterIcon} className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="font-sans">
            <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl flex-1 overflow-hidden shadow-sm flex flex-col">
        {/* Placeholder for Data Table */}
        <div className="border-b border-border/50 p-4 bg-muted/20">
           <div className="flex gap-4">
             <div className="w-64 h-10 bg-muted/50 rounded-md animate-pulse"></div>
           </div>
        </div>
        
        <div className="p-0 flex-1">
          <table className="w-full text-left font-sans text-sm">
            <thead className="border-b border-border/50 bg-muted/10">
              <tr>
                <th className="font-medium p-4 text-muted-foreground">Product</th>
                <th className="font-medium p-4 text-muted-foreground">SKU</th>
                <th className="font-medium p-4 text-muted-foreground">Category</th>
                <th className="font-medium p-4 text-muted-foreground">Price</th>
                <th className="font-medium p-4 text-muted-foreground">Stock</th>
                <th className="font-medium p-4 text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/5 transition-colors">
                  <td className="p-4 font-medium">Premium Leather Jacket</td>
                  <td className="p-4 font-mono text-muted-foreground">SKU-100{i}</td>
                  <td className="p-4"><span className="inline-flex px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium uppercase tracking-wider">Apparel</span></td>
                  <td className="p-4 font-mono">$299.99</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      45 units
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
