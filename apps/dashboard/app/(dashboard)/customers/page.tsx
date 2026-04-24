import { CustomerList } from "@/modules/customers/components/CustomerList"
import { PageHeader } from "@/components/common/PageHeader"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customer Directory" 
        description="Manage your customer relationships, loyalty points, and purchase history."
      />
      <CustomerList />
    </div>
  )
}
