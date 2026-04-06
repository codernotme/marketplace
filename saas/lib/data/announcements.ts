export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: "info" | "warning" | "maintenance" | "feature";
  visible_to: "all" | "plan:pro" | "plan:enterprise";
  published_at: string;
  expires_at: string | null;
  created_by: string;
}

export const announcements: Announcement[] = [
  {
    id: "ann_001",
    title: "New Analytics Dashboard",
    body: "We've launched an improved analytics dashboard with real-time insights. All Pro and Enterprise customers now have access to advanced analytics.",
    type: "feature",
    visible_to: "all",
    published_at: "2024-04-01T10:00:00Z",
    expires_at: null,
    created_by: "admin_001",
  },
  {
    id: "ann_002",
    title: "Scheduled Maintenance",
    body: "We will be performing scheduled maintenance on April 8th from 2:00 AM to 4:00 AM UTC. Services may be unavailable during this time.",
    type: "maintenance",
    visible_to: "all",
    published_at: "2024-03-28T08:00:00Z",
    expires_at: "2024-04-08T04:00:00Z",
    created_by: "admin_001",
  },
  {
    id: "ann_003",
    title: "Important Security Update",
    body: "Please update your API credentials immediately. We've detected a potential security vulnerability. All customers should refresh their Razorpay API keys.",
    type: "warning",
    visible_to: "all",
    published_at: "2024-03-25T14:30:00Z",
    expires_at: null,
    created_by: "admin_002",
  },
  {
    id: "ann_004",
    title: "Telegram Bot Integration Now Available",
    body: "Enterprise customers can now integrate Telegram bots directly into their platform. Check the integrations section to set it up.",
    type: "feature",
    visible_to: "plan:enterprise",
    published_at: "2024-03-20T09:15:00Z",
    expires_at: null,
    created_by: "admin_001",
  },
  {
    id: "ann_005",
    title: "Storage Upgrade Special",
    body: "Pro plan users get 50% extra storage this month. Enjoy up to 150GB of storage at no extra cost.",
    type: "info",
    visible_to: "plan:pro",
    published_at: "2024-03-18T11:00:00Z",
    expires_at: "2024-04-18T23:59:59Z",
    created_by: "admin_002",
  },
];
