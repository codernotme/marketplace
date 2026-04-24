import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}{' '}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
