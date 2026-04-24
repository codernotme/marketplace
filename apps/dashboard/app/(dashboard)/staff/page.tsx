import { StaffList } from "@/modules/staff/components/StaffList"
import { PageHeader } from "@/components/common/PageHeader"

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Staff Management" 
        description="Manage employee profiles, roles, and performance tracking."
      />
      <StaffList />
    </div>
  )
}
