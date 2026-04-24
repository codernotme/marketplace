"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Store01Icon, 
  Tag01Icon, 
  UserGroupIcon, 
  CheckmarkCircle01Icon, 
  ArrowRight01Icon, 
  ArrowLeft01Icon,
  Package01Icon,
  CreditCardIcon
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useOnboarding } from "../hooks/useOnboarding"
import { Loader2 } from "lucide-react"

const STEPS = [
  { id: "store", title: "Store Profile", icon: Store01Icon, description: "Tell us about your business location" },
  { id: "tax", title: "Tax Settings", icon: Tag01Icon, description: "Configure your default tax rates" },
  { id: "staff", title: "Staff Setup", icon: UserGroupIcon, description: "Add your first team members" },
  { id: "products", title: "First Products", icon: Package01Icon, description: "Quickly add your first few items" },
  { id: "payments", title: "Payments", icon: CreditCardIcon, description: "Configure how you accept money" },
  { id: "finish", title: "Ready to Go!", icon: CheckmarkCircle01Icon, description: "Your terminal is being prepared" },
]

export function OnboardingWizard() {
  const { status, updateProgress, isLoading } = useOnboarding()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState({
    storeName: "",
    address: "",
    gstin: "",
    taxRate: "18",
    staffName: "",
    staffPin: ""
  })
  const router = useRouter()

  React.useEffect(() => {
    if (status?.onboardingStep !== undefined) {
      setCurrentStep(status.onboardingStep)
    }
  }, [status])

  const handleNext = async () => {
    const nextStepIdx = currentStep + 1
    const isLastStep = currentStep === STEPS.length - 1

    try {
      await updateProgress.mutateAsync({
        step: isLastStep ? currentStep : nextStepIdx,
        completed: isLastStep
      })

      if (isLastStep) {
        toast.success("Setup complete!")
        router.push("/")
      } else {
        setCurrentStep(nextStepIdx)
      }
    } catch (error) {
      // Error handled by mutation
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl w-full mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-muted -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%`, maxWidth: 'calc(100% - 32px)' }}
        />
        
        {STEPS.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                idx <= currentStep ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
              }`}
            >
              <HugeiconsIcon icon={step.icon} className="w-5 h-5" />
            </div>
            <span className={`hidden md:block text-[10px] uppercase tracking-tighter mt-2 font-semibold ${idx <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 border-b border-border/40 bg-muted/30">
          <h2 className="text-2xl font-semibold tracking-tight">{STEPS[currentStep]?.title}</h2>
          <p className="text-muted-foreground text-sm mt-1">{STEPS[currentStep]?.description}</p>
        </div>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input 
                      id="storeName" 
                      placeholder="e.g. Downtown Boutique" 
                      className="h-12" 
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="123 Fashion Street, Mumbai" 
                      className="h-12"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN (Optional)</Label>
                    <Input 
                      id="gstin" 
                      placeholder="27AAAAA0000A1Z5" 
                      className="h-12 uppercase"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input 
                      id="taxRate" 
                      type="number" 
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                      className="h-12" 
                    />
                    <p className="text-[10px] text-muted-foreground italic">This will be applied to all products by default.</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <HugeiconsIcon icon={Tag01Icon} className="w-5 h-5 text-primary" />
                    <span className="text-sm">You can set specific tax rates per product later.</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffName">Manager Name</Label>
                    <Input 
                      id="staffName" 
                      placeholder="Full Name" 
                      className="h-12" 
                      value={formData.staffName}
                      onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPin">Access PIN</Label>
                    <Input 
                      id="staffPin" 
                      placeholder="4 or 6 digits" 
                      maxLength={6} 
                      className="h-12"
                      value={formData.staffPin}
                      onChange={(e) => setFormData({ ...formData, staffPin: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Staff use this PIN to log into the POS terminal quickly.</p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center py-10 bg-muted/20">
                    <HugeiconsIcon icon={Package01Icon} className="w-10 h-10 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">You can skip this for now or import via CSV later.</p>
                    <Button variant="outline" className="mt-4">Add First Product</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border bg-card">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Sample Products</p>
                      <Button variant="ghost" size="sm" className="w-full justify-start h-8">Load Sample Apparel</Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start h-8">Load Sample Footwear</Button>
                    </div>
                    <div className="p-4 rounded-xl border bg-card">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Import</p>
                      <Button variant="ghost" size="sm" className="w-full justify-start h-8">Download CSV Template</Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium mb-4">Select active payment methods for your POS:</p>
                  {[
                    { id: 'cash', label: 'Cash', icon: Store01Icon },
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCardIcon },
                    { id: 'upi', label: 'UPI / QR Codes', icon: ArrowRight01Icon },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/40 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                          <HugeiconsIcon icon={method.icon} className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{method.label}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 5 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-medium">Ready to launch!</h3>
                  <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                    Your store configuration is complete. You can now start using the POS terminal and manage your inventory.
                  </p>
                  
                  <div className="mt-8 w-full space-y-3">
                    <div className="flex items-center gap-2 text-xs text-left bg-green-500/5 text-green-600 p-3 rounded-lg border border-green-500/10">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-4 h-4 flex-shrink-0" />
                      <span>Tenant identity verified and provisioned.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-left bg-green-500/5 text-green-600 p-3 rounded-lg border border-green-500/10">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-4 h-4 flex-shrink-0" />
                      <span>Default store and tax rates configured.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-left bg-green-500/5 text-green-600 p-3 rounded-lg border border-green-500/10">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-4 h-4 flex-shrink-0" />
                      <span>License POS_CORE activated.</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 bg-muted/30 border-t border-border/40 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep === 0 || updateProgress.isPending}
            className="h-12 px-6"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={updateProgress.isPending}
            className="h-12 px-8 shadow-lg shadow-primary/20"
          >
            {updateProgress.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {currentStep === STEPS.length - 1 ? "Launch Terminal" : "Save & Continue"} 
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
