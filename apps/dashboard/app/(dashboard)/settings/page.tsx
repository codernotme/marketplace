import { Metadata } from "next"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings01Icon, Store01Icon, UserCircleIcon, CreditCardIcon, SecurityIcon, Notification01Icon, Tag01Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Settings | The Mrktplace",
  description: "Configure your store and account settings.",
}

const SETTING_SECTIONS = [
  { id: "store", label: "Store Profile", icon: Store01Icon, description: "Manage your business name, logo, and contact info." },
  { id: "tax", label: "Tax Settings", icon: Tag01Icon, description: "Configure GST rates, HSN codes, and tax labels." },
  { id: "payments", label: "Payment Methods", icon: CreditCardIcon, description: "Manage cash, card, and digital wallet integrations." },
  { id: "account", label: "Account Security", icon: SecurityIcon, description: "Update your password and manage session security." },
  { id: "notifications", label: "Notifications", icon: Notification01Icon, description: "Configure receipt emails and low stock alerts." },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1 font-sans">Configure the behavior and appearance of your POS system.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {SETTING_SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <button 
                key={section.id} 
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-card transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <HugeiconsIcon icon={section.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{section.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border/50 rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-medium border-b border-border/50 pb-4 mb-6">Store Profile</h3>
            
            <div className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Store Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border/60">
                    <HugeiconsIcon icon={Store01Icon} className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <Button variant="outline" size="sm">Change Logo</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <input className="w-full bg-background border border-border/50 rounded-md h-10 px-3 text-sm" placeholder="The Mrktplace Flagship" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <input className="w-full bg-background border border-border/50 rounded-md h-10 px-3 text-sm" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                <textarea className="w-full bg-background border border-border/50 rounded-md p-3 text-sm min-h-[100px]" placeholder="123 Luxury Lane, Fashion District, Mumbai" />
              </div>

              <div className="pt-4">
                <Button className="px-8">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
