import { ReportGrid } from "@/modules/reports/components/ReportGrid"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Analytics & Reports" 
          description="Real-time insights into your business performance and growth."
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>
      <ReportGrid />
    </div>
  )
}
