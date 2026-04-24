import { Metadata } from "next"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store01Icon, Add01Icon, FilterIcon, UserAdd01Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Staff Management | The Mrktplace",
  description: "Manage your store staff, roles, and shifts.",
}

const MOCK_STAFF = [
  { id: "STF-101", name: "Aryan", role: "Store Manager", status: "Active", shift: "Morning", phone: "+91 98765 43210" },
  { id: "STF-102", name: "Ananya", role: "Cashier", status: "Active", shift: "Evening", phone: "+91 98765 43211" },
  { id: "STF-103", name: "Rahul", role: "Sales Associate", status: "Active", shift: "Morning", phone: "+91 98765 43212" },
  { id: "STF-104", name: "Priya", role: "Cashier", status: "On Leave", shift: "N/A", phone: "+91 98765 43213" },
  { id: "STF-105", name: "Vikram", role: "Inventory Lead", status: "Active", shift: "Full-day", phone: "+91 98765 43214" },
]

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">Manage employee access levels and schedules.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-sans">
            <HugeiconsIcon icon={FilterIcon} className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="font-sans">
            <HugeiconsIcon icon={UserAdd01Icon} className="w-4 h-4 mr-2" /> Add Staff Member
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl flex-1 overflow-hidden shadow-sm flex flex-col">
        <div className="p-0 flex-1">
          <table className="w-full text-left font-sans text-sm">
            <thead className="border-b border-border/50 bg-muted/10">
              <tr>
                <th className="font-medium p-4 text-muted-foreground">Name</th>
                <th className="font-medium p-4 text-muted-foreground">Role</th>
                <th className="font-medium p-4 text-muted-foreground">Current Shift</th>
                <th className="font-medium p-4 text-muted-foreground">Contact</th>
                <th className="font-medium p-4 text-muted-foreground">Status</th>
                <th className="font-medium p-4 text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STAFF.map((staff) => (
                <tr key={staff.id} className="border-b border-border/30 hover:bg-muted/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                        {staff.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{staff.name}</span>
                        <span className="text-[11px] text-muted-foreground">{staff.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{staff.role}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-muted text-xs">
                      {staff.shift}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{staff.phone}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-[10px] rounded-full font-medium uppercase tracking-wider ${
                      staff.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Shifts</Button>
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
