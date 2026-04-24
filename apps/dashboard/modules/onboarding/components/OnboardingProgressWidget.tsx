"use client"

import * as React from "react"
import { useOnboarding } from "../hooks/useOnboarding"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"

export function OnboardingProgressWidget() {
  const { status, isLoading } = useOnboarding()

  if (isLoading || !status || status.onboardingCompleted) {
    return null
  }

  const progress = Math.round((status.onboardingStep / 5) * 100)

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-none overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-24 h-24" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          Complete Your Store Setup
          <span className="text-xs font-normal bg-primary/10 px-2 py-0.5 rounded-full">
            {progress}% Done
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground max-w-md">
          You're almost there! Complete the remaining setup steps to unlock all features of your POS terminal.
        </p>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex justify-end">
          <Button asChild size="sm" className="shadow-lg shadow-primary/20">
            <Link href="/onboarding">
              Continue Setup <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
