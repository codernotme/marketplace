import { Metadata } from "next"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserMultipleIcon, Add01Icon, FilterIcon, Download01Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Customers | The Mrktplace",
  description: "Manage your customers and loyalty programs.",
}

const MOCK_CUSTOMERS = [
  { id: "CUST-1001", name: "John Doe", email: "john@example.com", phone: "+1 234 567 8901", points: 450, totalSpent: 1250.00, lastVisit: "2 days ago" },
  { id: "CUST-1002", name: "Jane Smith", email: "jane@smith.me", phone: "+1 234 567 8902", points: 120, totalSpent: 450.50, lastVisit: "1 week ago" },
  { id: "CUST-1003", name: "Robert Brown", email: "robert.b@provider.com", phone: "+1 234 567 8903", points: 890, totalSpent: 3420.00, lastVisit: "Today" },
  { id: "CUST-1004", name: "Sarah Wilson", email: "sarah.w@email.com", phone: "+1 234 567 8904", points: 50, totalSpent: 85.00, lastVisit: "3 weeks ago" },
  { id: "CUST-1005", name: "Michael Chen", email: "m.chen@business.com", phone: "+1 234 567 8905", points: 310, totalSpent: 890.75, lastVisit: "4 days ago" },
]

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">View customer profiles and manage loyalty rewards.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={FilterIcon} className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="font-sans">
            <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl flex-1 overflow-hidden shadow-sm flex flex-col">
        <div className="p-0 flex-1">
          <table className="w-full text-left font-sans text-sm">
            <thead className="border-b border-border/50 bg-muted/10">
              <tr>
                <th className="font-medium p-4 text-muted-foreground">Name</th>
                <th className="font-medium p-4 text-muted-foreground">Contact</th>
                <th className="font-medium p-4 text-muted-foreground">Loyalty Points</th>
                <th className="font-medium p-4 text-muted-foreground">Total Spent</th>
                <th className="font-medium p-4 text-muted-foreground">Last Visit</th>
                <th className="font-medium p-4 text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="border-b border-border/30 hover:bg-muted/5 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-[11px] text-muted-foreground">{customer.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span>{customer.email}</span>
                      <span className="text-[11px] text-muted-foreground">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="font-mono">{customer.points} pts</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-medium">${customer.totalSpent.toFixed(2)}</td>
                  <td className="p-4 text-muted-foreground">{customer.lastVisit}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">View History</Button>
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
