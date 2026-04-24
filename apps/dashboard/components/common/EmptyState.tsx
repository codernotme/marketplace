import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PackageOpenIcon } from '@hugeicons/core-free-icons'
import { Button } from '@workspace/ui/components/button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon || <HugeiconsIcon icon={PackageOpenIcon} className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
