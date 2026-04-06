"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platform_name: "theMrktPlace",
    platform_email: "no-reply@themrktplace.com",
    support_email: "support@themrktplace.com",
    webhook_secret: "whk_test_1234567890",
    enable_new_signups: true,
    max_free_products: 5,
    enable_email_notifications: true,
    enable_sms_notifications: false,
  });

  const handleSave = async () => {
    try {
      // API call would go here
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 mt-1">Configure platform-wide settings and integrations</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="border-b border-slate-800 bg-transparent">
          <TabsTrigger
            value="general"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-slate-400 data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-slate-400 data-[state=active]:text-white"
          >
            Email & Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-slate-400 data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription>Platform information and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform_name" className="text-slate-200">
                  Platform Name
                </Label>
                <Input
                  id="platform_name"
                  value={settings.platform_name}
                  onChange={(e) =>
                    setSettings({ ...settings, platform_name: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_free_products" className="text-slate-200">
                  Max Free Plan Products
                </Label>
                <Input
                  id="max_free_products"
                  type="number"
                  value={settings.max_free_products}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      max_free_products: Number(e.target.value),
                    })
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="text-white font-medium">Allow New Signups</p>
                  <p className="text-sm text-slate-400">
                    Enable or disable new tenant registrations
                  </p>
                </div>
                <Switch
                  checked={settings.enable_new_signups}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enable_new_signups: checked })
                  }
                />
              </div>

              <Button
                onClick={handleSave}
                className="bg-orange-600 hover:bg-orange-700 w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Email & Notifications</CardTitle>
              <CardDescription>Configure email and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform_email" className="text-slate-200">
                  Platform Email
                </Label>
                <Input
                  id="platform_email"
                  type="email"
                  value={settings.platform_email}
                  onChange={(e) =>
                    setSettings({ ...settings, platform_email: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_email" className="text-slate-200">
                  Support Email
                </Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settings.support_email}
                  onChange={(e) =>
                    setSettings({ ...settings, support_email: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">
                    Send email alerts for important events
                  </p>
                </div>
                <Switch
                  checked={settings.enable_email_notifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      enable_email_notifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-sm text-slate-400">
                    Send SMS alerts (requires configuration)
                  </p>
                </div>
                <Switch
                  checked={settings.enable_sms_notifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      enable_sms_notifications: checked,
                    })
                  }
                />
              </div>

              <Button
                onClick={handleSave}
                className="bg-orange-600 hover:bg-orange-700 w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Security</CardTitle>
              <CardDescription>API keys and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook_secret" className="text-slate-200">
                  Webhook Secret
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook_secret"
                    value={settings.webhook_secret}
                    readOnly
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                    Rotate
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Use this secret to verify webhook signatures
                </p>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg border border-yellow-500/30">
                <p className="text-sm text-yellow-400 font-medium mb-2">
                  ⚠️ Security Notice
                </p>
                <p className="text-sm text-slate-300">
                  Never share your webhook secret or API keys. Keep them secure and rotate
                  regularly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
