"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store01Icon, Tag01Icon, UserGroupIcon, CheckmarkCircle01Icon, ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const STEPS = [
  { id: "store", title: "Store Profile", icon: Store01Icon, description: "Tell us about your business location" },
  { id: "tax", title: "Tax Settings", icon: Tag01Icon, description: "Configure your default tax rates" },
  { id: "staff", title: "Staff Setup", icon: UserGroupIcon, description: "Add your first team members" },
  { id: "finish", title: "Ready to Go!", icon: CheckmarkCircle01Icon, description: "Your terminal is being prepared" },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const router = useRouter()

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      toast.success("Setup complete!")
      router.push("/")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-2xl w-full mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
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
            <span className={`text-[10px] uppercase tracking-tighter mt-2 font-semibold ${idx <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden min-h-[450px] flex flex-col">
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
                    <Input id="storeName" placeholder="e.g. Downtown Boutique" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Fashion Street, Mumbai" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN (Optional)</Label>
                    <Input id="gstin" placeholder="27AAAAA0000A1Z5" className="h-12 uppercase" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" defaultValue="18" className="h-12" />
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
                    <Input id="staffName" placeholder="Full Name" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPin">Access PIN</Label>
                    <Input id="staffPin" placeholder="4 or 6 digits" maxLength={6} className="h-12" />
                  </div>
                  <p className="text-xs text-muted-foreground">Staff use this PIN to log into the POS terminal quickly.</p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-medium">All set!</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    Your store is configured and ready to start selling. We've prepared some sample products to get you started.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 bg-muted/30 border-t border-border/40 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="h-12 px-6"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={nextStep}
            className="h-12 px-8 shadow-lg shadow-primary/20"
          >
            {currentStep === STEPS.length - 1 ? "Finish Setup" : "Continue"} 
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
