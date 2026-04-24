import { Metadata } from "next"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon, FilterIcon, Download01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Sales & Returns | The Mrktplace",
  description: "View and manage your sales history and returns.",
}

const MOCK_SALES = [
  { id: "SAL-1001", date: "2024-03-24 14:30", customer: "Walk-in Customer", total: 324.99, status: "Completed", items: 3 },
  { id: "SAL-1002", date: "2024-03-24 15:15", customer: "John Doe", total: 85.00, status: "Completed", items: 1 },
  { id: "SAL-1003", date: "2024-03-24 16:45", customer: "Jane Smith", total: 129.99, status: "Returned", items: 2 },
  { id: "SAL-1004", date: "2024-03-24 17:20", customer: "Walk-in Customer", total: 45.00, status: "Completed", items: 1 },
  { id: "SAL-1005", date: "2024-03-24 18:10", customer: "John Doe", total: 299.99, status: "Completed", items: 1 },
]

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sales & Returns</h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">Track your revenue and manage customer returns.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={FilterIcon} className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl flex-1 overflow-hidden shadow-sm flex flex-col">
        <div className="p-0 flex-1">
          <table className="w-full text-left font-sans text-sm">
            <thead className="border-b border-border/50 bg-muted/10">
              <tr>
                <th className="font-medium p-4 text-muted-foreground">Order ID</th>
                <th className="font-medium p-4 text-muted-foreground">Date & Time</th>
                <th className="font-medium p-4 text-muted-foreground">Customer</th>
                <th className="font-medium p-4 text-muted-foreground">Items</th>
                <th className="font-medium p-4 text-muted-foreground">Total</th>
                <th className="font-medium p-4 text-muted-foreground">Status</th>
                <th className="font-medium p-4 text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SALES.map((sale) => (
                <tr key={sale.id} className="border-b border-border/30 hover:bg-muted/5 transition-colors">
                  <td className="p-4 font-medium">{sale.id}</td>
                  <td className="p-4 text-muted-foreground">{sale.date}</td>
                  <td className="p-4">{sale.customer}</td>
                  <td className="p-4">{sale.items} items</td>
                  <td className="p-4 font-mono font-medium">${sale.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-[10px] rounded-full font-medium uppercase tracking-wider ${
                      sale.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      Details <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-2" />
                    </Button>
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
