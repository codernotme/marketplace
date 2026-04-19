"use client";

import { useState, useEffect } from "react";
import { 
  Input, Button, Card, Select, ListBox, Label, Separator, Spinner
} from "@heroui/react";
import { Save } from "lucide-react";
import { getStoreConfig, updateStoreConfig } from "@/actions/settings";

export default function SettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    const data = await getStoreConfig();
    setConfig(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    
    setSaving(true);
    const result = await updateStoreConfig(config.id, {
      name: config.name,
      email: config.email,
      phone: config.phone,
      currency: config.currency,
      timezone: config.timezone,
      returnWindowDays: parseInt(config.returnWindowDays || "14"),
    });
    setSaving(false);
    
    if (result.success) {
      alert("Settings saved successfully!");
    } else {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 w-full h-full gap-2">
        <Spinner size="lg" />
        <span className="text-foreground">Loading store configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col w-full px-6 py-8 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Store Settings</h1>
          <p className="text-muted">Manage your store's global configuration.</p>
        </div>
        <Button variant="primary" type="submit" isPending={saving}>
          {({isPending}) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <Card.Content className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">General Information</h2>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input 
                  required
                  placeholder="Your Store Name"
                  value={config?.name || ""}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Store Email</Label>
                <Input 
                  type="email"
                  placeholder="support@example.com"
                  value={config?.email || ""}
                  onChange={(e) => setConfig({...config, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Support Phone</Label>
                <Input 
                  placeholder="+91 123 456 7890"
                  value={config?.phone || ""}
                  onChange={(e) => setConfig({...config, phone: e.target.value})}
                />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="shadow-sm">
          <Card.Content className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Regional Settings</h2>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  onSelectionChange={(keys: any) => {
                    const key = Array.from(keys)[0] as string;
                    if (key) setConfig({...config, currency: key});
                  }}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="INR">Indian Rupee (₹)</ListBox.Item>
                      <ListBox.Item id="USD">US Dollar ($)</ListBox.Item>
                      <ListBox.Item id="EUR">Euro (€)</ListBox.Item>
                      <ListBox.Item id="GBP">British Pound (£)</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select 
                  onSelectionChange={(keys: any) => {
                    const key = Array.from(keys)[0] as string;
                    if (key) setConfig({...config, timezone: key});
                  }}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Asia/Kolkata">Asia/Kolkata (IST)</ListBox.Item>
                      <ListBox.Item id="UTC">UTC</ListBox.Item>
                      <ListBox.Item id="America/New_York">America/New_York (EST)</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="shadow-sm">
          <Card.Content className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Policies</h2>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Return Window (Days)</Label>
                <Input 
                  type="number"
                  value={config?.returnWindowDays?.toString() || "14"}
                  onChange={(e) => setConfig({...config, returnWindowDays: e.target.value})}
                />
              </div>
            </div>
            <p className="text-sm text-muted bg-muted/50 p-3 rounded-lg border border-divider italic">
              Edit your full textual policies in the Content Management System module.
            </p>
          </Card.Content>
        </Card>
      </div>
    </form>
  );
}
