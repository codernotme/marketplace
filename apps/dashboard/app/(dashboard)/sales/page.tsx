import { SalesList } from "@/modules/sales/components/SalesList"
import { PageHeader } from "@/components/common/PageHeader"

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Sales & Returns" 
        description="Monitor transactions, print invoices, and manage returns."
      />
      <SalesList />
    </div>
  )
}
