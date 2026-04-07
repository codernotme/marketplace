export interface SaaSAdmin {
  id: string;
  name: string;
  email: string;
  role: "saas_admin" | "support";
  created_at: string;
  last_login: string;
}

export const admins: SaaSAdmin[] = [
  {
    id: "admin_001",
    name: "Alice Johnson",
    email: "alice@saas.io",
    role: "saas_admin",
    created_at: "2024-01-15T10:30:00Z",
    last_login: "2024-04-06T14:22:00Z",
  },
  {
    id: "admin_002",
    name: "Bob Smith",
    email: "bob@saas.io",
    role: "support",
    created_at: "2024-02-10T09:15:00Z",
    last_login: "2024-04-06T12:45:00Z",
  },
  {
    id: "admin_003",
    name: "Carol Davis",
    email: "carol@saas.io",
    role: "support",
    created_at: "2024-03-05T11:20:00Z",
    last_login: "2024-04-05T16:30:00Z",
  },
];
