"use client";

import { useState } from "react";
import { Button, Switch, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig, teamMembers, emailTemplates } from "@/lib/mock-data";

function SettingSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl border border-border/50 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/40">
        <Icon icon={icon} className="text-accent text-xl" />
        <h2 className="font-semibold font-[family-name:var(--font-outfit)]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [storeName, setStoreName] = useState(siteConfig.name);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [codEnabled, setCodEnabled] = useState(true);
  const [onlinePayEnabled, setOnlinePayEnabled] = useState(true);
  const [upiEnabled, setUpiEnabled] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings"
        subtitle="Manage your store configuration"
        icon="solar:settings-minimalistic-bold-duotone"
        actions={
          <Button variant="primary" size="sm" className="gap-2">
            <Icon icon="solar:diskette-bold-duotone" className="text-base" />
            Save Changes
          </Button>
        }
      />

      {/* General */}
      <SettingSection title="General" icon="solar:info-circle-bold-duotone">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Store Name" value={storeName} onValueChange={setStoreName} />
            <Input label="Tagline" value={tagline} onValueChange={setTagline} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Currency" value={siteConfig.currency} isReadOnly />
            <Input label="Timezone" value={siteConfig.timezone} isReadOnly />
            <Input label="Language" value={siteConfig.language} isReadOnly />
          </div>
          <Input label="Contact Email" defaultValue={siteConfig.contactEmail} />
          <Input label="Phone" defaultValue={siteConfig.phone} />
          <Input label="Address" defaultValue={siteConfig.address} />
        </div>
      </SettingSection>

      {/* Branding */}
      <SettingSection title="Branding" icon="solar:pallete-2-bold-duotone">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Logo</p>
              <div className="border-2 border-dashed border-border/60 hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors">
                <Icon icon="solar:gallery-add-bold-duotone" className="text-3xl text-muted mx-auto mb-2" />
                <p className="text-xs text-muted">Upload logo (SVG, PNG)</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Favicon</p>
              <div className="border-2 border-dashed border-border/60 hover:border-accent/50 rounded-xl p-6 text-center cursor-pointer transition-colors">
                <Icon icon="solar:gallery-add-bold-duotone" className="text-3xl text-muted mx-auto mb-2" />
                <p className="text-xs text-muted">Upload favicon (ICO, PNG)</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Primary Color</p>
              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50">
                <input type="color" defaultValue={siteConfig.primaryColor} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
                <span className="text-sm font-mono text-muted">{siteConfig.primaryColor}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Secondary Color</p>
              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/50">
                <input type="color" defaultValue={siteConfig.secondaryColor} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
                <span className="text-sm font-mono text-muted">{siteConfig.secondaryColor}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Instagram URL" defaultValue={siteConfig.socialLinks.instagram} />
            <Input label="Twitter URL" defaultValue={siteConfig.socialLinks.twitter} />
            <Input label="Facebook URL" defaultValue={siteConfig.socialLinks.facebook} />
          </div>
        </div>
      </SettingSection>

      {/* Payments */}
      <SettingSection title="Payments" icon="solar:card-2-bold-duotone">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Razorpay Key ID" defaultValue="rzp_live_••••••••••••••••" type="password" />
            <Input label="Razorpay Secret" defaultValue="rzp_secret_••••••••••••••••" type="password" />
          </div>
          {[
            { label: "COD (Cash on Delivery)", desc: "Allow cash on delivery orders", value: codEnabled, onChange: setCodEnabled },
            { label: "Online Payment", desc: "Razorpay, cards, net banking", value: onlinePayEnabled, onChange: setOnlinePayEnabled },
            { label: "UPI Payment", desc: "GPay, PhonePe, Paytm", value: upiEnabled, onChange: setUpiEnabled },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/40">
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <Switch isSelected={item.value} onValueChange={item.onChange} />
            </div>
          ))}
        </div>
      </SettingSection>

      {/* Team Members */}
      <SettingSection title="Team Members" icon="solar:users-group-rounded-bold-duotone">
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-3.5 bg-background rounded-xl border border-border/40">
              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{member.name}</p>
                  {!member.isActive && <span className="text-xs bg-default text-muted px-1.5 py-0.5 rounded-md">Inactive</span>}
                </div>
                <p className="text-xs text-muted">{member.email}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                member.role === "admin" ? "bg-accent/10 text-accent" :
                member.role === "manager" ? "bg-blue-500/10 text-blue-400" :
                member.role === "support" ? "bg-orange-500/10 text-orange-400" :
                "bg-default text-muted"
              }`}>
                {member.role}
              </span>
              <button className="p-1.5 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors">
                <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-sm" />
              </button>
            </div>
          ))}
          <Button variant="secondary" size="sm" className="gap-2 w-full mt-2">
            <Icon icon="solar:user-plus-bold-duotone" className="text-base" />
            Invite Team Member
          </Button>
        </div>
      </SettingSection>
    </div>
  );
}
