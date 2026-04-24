"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Shield01Icon, FingerPrintIcon, LockIcon } from "@hugeicons/core-free-icons"

export function SecuritySettingsForm() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>
          <CardDescription>Secure your account with an additional layer of security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-primary/5 border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <HugeiconsIcon icon={FingerPrintIcon} className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-primary">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-primary/60">Not currently enabled</p>
              </div>
            </div>
            <Button size="sm">Setup 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Ensure your account is using a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button>Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Active Sessions</CardTitle>
          <CardDescription className="text-destructive/60">Manage and sign out of your active sessions on other devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { device: 'MacBook Pro', location: 'Mumbai, India', current: true },
              { device: 'iPhone 15', location: 'Pune, India', current: false },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{session.device} {session.current && <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded ml-2 uppercase">Current</span>}</p>
                  <p className="text-xs text-muted-foreground">{session.location}</p>
                </div>
                {!session.current && <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Revoke</Button>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
