import { Metadata } from "next"
import { OnboardingWizard } from "@/modules/onboarding/components/OnboardingWizard"

export const metadata: Metadata = {
  title: "Setup Your Store | The Mrktplace",
  description: "Complete your store profile and settings",
}

export default function OnboardingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center p-6 bg-background/50">
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to the future of retail.</h1>
        <p className="text-muted-foreground">Let's get your store set up in just a few minutes.</p>
      </div>
      <OnboardingWizard />
    </div>
  )
}
