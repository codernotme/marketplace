import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Invoice01Icon, 
  Package01Icon, 
  UserGroupIcon, 
  PresentationBarChart01Icon 
} from '@hugeicons/core-free-icons'
import { OnboardingProgressWidget } from '@modules/onboarding/components/OnboardingProgressWidget'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your business performance"
      />

      <div className="max-w-4xl">
        <OnboardingProgressWidget />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value="₹45,231.89"
          description="from last month"
          icon={<HugeiconsIcon icon={Invoice01Icon} className="h-4 w-4" />}
          trend={{ value: 12, label: 'up', isPositive: true }}
        />
        <StatCard
          title="Active Products"
          value="1,240"
          description="across 12 categories"
          icon={<HugeiconsIcon icon={Package01Icon} className="h-4 w-4" />}
        />
        <StatCard
          title="New Customers"
          value="+573"
          description="this week"
          icon={<HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4" />}
          trend={{ value: 8, label: 'up', isPositive: true }}
        />
        <StatCard
          title="Avg. Order Value"
          value="₹1,250"
          description="per customer"
          icon={<HugeiconsIcon icon={PresentationBarChart01Icon} className="h-4 w-4" />}
          trend={{ value: 2, label: 'down', isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Placeholder for charts */}
        <div className="md:col-span-4 rounded-xl border bg-card p-6 shadow-sm min-h-[300px] flex items-center justify-center text-muted-foreground">
          Sales Chart Placeholder
        </div>
        <div className="md:col-span-3 rounded-xl border bg-card p-6 shadow-sm min-h-[300px] flex items-center justify-center text-muted-foreground">
          Recent Activity Placeholder
        </div>
      </div>
    </div>
  )
}
