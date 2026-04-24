"use client"

import * as React from "react"
import { RevenueChart } from "./RevenueChart"
import { StatCard } from "@/components/common/StatCard"
import { HugeiconsIcon } from "@hugeicons/react"
import { DollarCircleIcon, ShoppingBag01Icon, UserMultipleIcon, TrendingUp } from "@hugeicons/core-free-icons"

export function ReportGrid() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹1,42,500" 
          description="from last month" 
          icon={<HugeiconsIcon icon={DollarCircleIcon} />}
          trend={{ value: 12.5, label: "up", isPositive: true }}
        />
        <StatCard 
          title="Total Orders" 
          value="856" 
          description="from last month" 
          icon={<HugeiconsIcon icon={ShoppingBag01Icon} />}
          trend={{ value: 5.2, label: "up", isPositive: true }}
        />
        <StatCard 
          title="New Customers" 
          value="48" 
          description="from last month" 
          icon={<HugeiconsIcon icon={UserMultipleIcon} />}
          trend={{ value: 2.4, label: "up", isPositive: true }}
        />
        <StatCard 
          title="Average Bill" 
          value="₹1,664" 
          description="from last month" 
          icon={<HugeiconsIcon icon={TrendingUp} />}
          trend={{ value: 1.2, label: "down", isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm border-border/40">
            <h3 className="font-semibold mb-4">Top Products</h3>
            <div className="space-y-4">
              {[
                { name: "Linen Shirt - White", sales: 124, trend: "+12%" },
                { name: "Denim Jeans - Slim", sales: 98, trend: "+8%" },
                { name: "Cotton T-shirt", sales: 85, trend: "+15%" },
                { name: "Formal Blazer", sales: 42, trend: "-2%" },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground">{p.sales} sales</span>
                  </div>
                  <span className={`text-[10px] font-bold ${p.trend.startsWith('+') ? 'text-green-500' : 'text-destructive'}`}>
                    {p.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
