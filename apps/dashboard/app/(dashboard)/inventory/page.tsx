import { ProductList } from "@/modules/inventory/components/ProductList"
import { PageHeader } from "@/components/common/PageHeader"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Inventory Management" 
        description="Track products, variants, and stock levels across all stores."
      />
      <ProductList />
    </div>
  )
}
