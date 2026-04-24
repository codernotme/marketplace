import { Metadata } from "next"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PieChartIcon, Calendar01Icon, Download01Icon, ArrowRight01Icon, ChartLineData01Icon, PackageIcon, UserMultipleIcon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Reports | The Mrktplace",
  description: "Analyze your business performance with detailed reports.",
}

const REPORT_CATEGORIES = [
  { 
    title: "Sales Analytics", 
    description: "End-of-day sales, revenue trends, and payment method breakdown.",
    icon: ChartLineData01Icon,
    reports: ["Daily Sales Summary", "Monthly Revenue Report", "Payment Method Analysis"]
  },
  { 
    title: "Inventory Reports", 
    description: "Stock levels, low stock alerts, and inventory movement history.",
    icon: PackageIcon,
    reports: ["Current Stock Valuation", "Low Stock Alert Report", "Inventory Adjustments"]
  },
  { 
    title: "Customer Insights", 
    description: "Top customers, loyalty point redemption, and purchase frequency.",
    icon: UserMultipleIcon,
    reports: ["Top 50 Customers", "Loyalty Point Balance", "New vs Returning Customers"]
  },
  { 
    title: "Tax & Compliance", 
    description: "GSTR1 summaries and tax collection reports for accounting.",
    icon: Calendar01Icon,
    reports: ["GST Summary (GSTR1)", "Tax Collected Report", "Audit Logs"]
  },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Business Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">Detailed insights and downloadable reports for your business.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 mr-2" /> This Month
          </Button>
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" /> Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "$45,231.89", change: "+12.5%", positive: true },
          { label: "Total Sales", value: "1,245", change: "+5.2%", positive: true },
          { label: "Avg. Order Value", value: "$36.33", change: "-1.4%", positive: false },
          { label: "New Customers", value: "128", change: "+8.1%", positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-semibold tracking-tight">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.positive ? "text-emerald-500" : "text-red-500"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {REPORT_CATEGORIES.map((category, i) => {
          const Icon = category.icon
          return (
            <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-border/50 bg-muted/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <HugeiconsIcon icon={category.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </div>
              </div>
              <div className="p-0 flex-1">
                <div className="flex flex-col">
                  {category.reports.map((report, j) => (
                    <button 
                      key={j} 
                      className="flex items-center justify-between p-4 text-sm text-left hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 group"
                    >
                      <span className="font-sans">{report}</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
