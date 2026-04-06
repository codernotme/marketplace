"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { AlertCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platform_name: "SaaS Admin Platform",
    platform_email: "noreply@platform.com",
    telegram_channel: "@platform_alerts",
    default_plan: "free",
    maintenance_mode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log("Saving settings:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-2">Configure global platform behavior and messaging</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Platform Name
              </label>
              <Input
                value={settings.platform_name}
                onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
                placeholder="SaaS Admin Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default "From" Email
              </label>
              <Input
                type="email"
                value={settings.platform_email}
                onChange={(e) => setSettings({ ...settings, platform_email: e.target.value })}
                placeholder="noreply@platform.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for all emails sent by the platform via Resend
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default Plan for New Signups
              </label>
              <Select value={settings.default_plan} onValueChange={(value) => setSettings({ ...settings, default_plan: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Telegram Alert Channel
              </label>
              <Input
                value={settings.telegram_channel}
                onChange={(e) => setSettings({ ...settings, telegram_channel: e.target.value })}
                placeholder="@platform_alerts"
              />
              <p className="text-xs text-gray-500 mt-1">
                Platform events (signups, suspensions, errors) sent to this channel
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Maintenance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600 mt-1">
                  When enabled, all tenants see a maintenance page
                </p>
              </div>
              <Toggle
                pressed={settings.maintenance_mode}
                onPressedChange={(pressed) => setSettings({ ...settings, maintenance_mode: pressed })}
                className="data-[state=on]:bg-red-600"
              >
                {settings.maintenance_mode ? "ON" : "OFF"}
              </Toggle>
            </div>

            {settings.maintenance_mode && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Maintenance mode is active</p>
                  <p className="text-sm text-red-800 mt-1">
                    All tenant shops are currently down. Disable this to restore service.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Branding</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Platform Logo URL
              </label>
              <Input
                placeholder="https://cdn.example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 200x50px
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Primary Brand Color
              </label>
              <div className="flex gap-2">
                <div className="w-12 h-10 bg-blue-600 rounded-lg border-2 border-gray-300" />
                <Input
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              These actions cannot be undone. Proceed with caution.
            </p>
            <Button variant="destructive">
              Export All Data
            </Button>
            <Button variant="destructive">
              Reset Platform State
            </Button>
          </div>
        </Card>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-sm font-medium">Settings saved successfully</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
