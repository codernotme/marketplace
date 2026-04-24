import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { RocketIcon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'

interface UpgradePromptProps {
  moduleName: string
  description?: string
}

export function UpgradePrompt({ moduleName, description }: UpgradePromptProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md text-center border-primary/20 bg-primary/5 shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <HugeiconsIcon icon={RocketIcon} className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Unlock {moduleName}</CardTitle>
          <CardDescription className="text-base mt-2">
            {description || `This module is not active on your current plan. Upgrade to access advanced features.`}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" size="lg">
            View Pricing Plans
          </Button>
          <p className="text-xs text-muted-foreground">
            Contact sales for enterprise custom solutions.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
