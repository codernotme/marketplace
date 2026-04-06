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
        <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform-wide settings and integrations</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="border-b border-border bg-transparent">
          <TabsTrigger
            value="general"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-muted-foreground data-[state=active]:text-foreground"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-muted-foreground data-[state=active]:text-foreground"
          >
            Email & Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="border-b-2 border-transparent data-[state=active]:border-orange-500 text-muted-foreground data-[state=active]:text-foreground"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">General Settings</CardTitle>
              <CardDescription>Platform information and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform_name" className="text-foreground">
                  Platform Name
                </Label>
                <Input
                  id="platform_name"
                  value={settings.platform_name}
                  onChange={(e) =>
                    setSettings({ ...settings, platform_name: e.target.value })
                  }
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_free_products" className="text-foreground">
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
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                <div>
                  <p className="text-foreground font-medium">Allow New Signups</p>
                  <p className="text-sm text-muted-foreground">
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
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Email & Notifications</CardTitle>
              <CardDescription>Configure email and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform_email" className="text-foreground">
                  Platform Email
                </Label>
                <Input
                  id="platform_email"
                  type="email"
                  value={settings.platform_email}
                  onChange={(e) =>
                    setSettings({ ...settings, platform_email: e.target.value })
                  }
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_email" className="text-foreground">
                  Support Email
                </Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settings.support_email}
                  onChange={(e) =>
                    setSettings({ ...settings, support_email: e.target.value })
                  }
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                <div>
                  <p className="text-foreground font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
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

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                <div>
                  <p className="text-foreground font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
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
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Security</CardTitle>
              <CardDescription>API keys and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook_secret" className="text-foreground">
                  Webhook Secret
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook_secret"
                    value={settings.webhook_secret}
                    readOnly
                    className="bg-muted border-border text-foreground"
                  />
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                    Rotate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this secret to verify webhook signatures
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg border border-yellow-500/30">
                <p className="text-sm text-yellow-400 font-medium mb-2">
                  ⚠️ Security Notice
                </p>
                <p className="text-sm text-muted-foreground">
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

