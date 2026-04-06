export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  billing_cycle: "monthly" | "yearly";
  status: "active" | "past_due" | "cancelled" | "trialing";
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  razorpay_subscription_id: string | null;
  created_at: string;
}

export const subscriptions: Subscription[] = [
  {
    id: "sub_001",
    tenant_id: "tenant_001",
    plan_id: "plan_003",
    billing_cycle: "monthly",
    status: "active",
    trial_ends_at: null,
    current_period_start: "2024-03-06T00:00:00Z",
    current_period_end: "2024-04-06T00:00:00Z",
    razorpay_subscription_id: "sub_1001",
    created_at: "2024-01-12T10:30:00Z",
  },
  {
    id: "sub_002",
    tenant_id: "tenant_002",
    plan_id: "plan_002",
    billing_cycle: "monthly",
    status: "active",
    trial_ends_at: null,
    current_period_start: "2024-03-03T00:00:00Z",
    current_period_end: "2024-04-03T00:00:00Z",
    razorpay_subscription_id: "sub_1002",
    created_at: "2024-02-03T11:00:00Z",
  },
  {
    id: "sub_003",
    tenant_id: "tenant_003",
    plan_id: "plan_003",
    billing_cycle: "yearly",
    status: "active",
    trial_ends_at: null,
    current_period_start: "2024-01-22T00:00:00Z",
    current_period_end: "2025-01-22T00:00:00Z",
    razorpay_subscription_id: "sub_1003",
    created_at: "2024-01-22T14:30:00Z",
  },
  {
    id: "sub_004",
    tenant_id: "tenant_004",
    plan_id: "plan_001",
    billing_cycle: "monthly",
    status: "trialing",
    trial_ends_at: "2024-04-28T00:00:00Z",
    current_period_start: "2024-03-28T00:00:00Z",
    current_period_end: "2024-04-28T00:00:00Z",
    razorpay_subscription_id: null,
    created_at: "2024-03-28T07:45:00Z",
  },
  {
    id: "sub_005",
    tenant_id: "tenant_005",
    plan_id: "plan_002",
    billing_cycle: "monthly",
    status: "past_due",
    trial_ends_at: null,
    current_period_start: "2024-03-10T00:00:00Z",
    current_period_end: "2024-04-10T00:00:00Z",
    razorpay_subscription_id: "sub_1005",
    created_at: "2023-12-18T09:00:00Z",
  },
  {
    id: "sub_006",
    tenant_id: "tenant_006",
    plan_id: "plan_004",
    billing_cycle: "yearly",
    status: "active",
    trial_ends_at: null,
    current_period_start: "2024-01-07T00:00:00Z",
    current_period_end: "2025-01-07T00:00:00Z",
    razorpay_subscription_id: "sub_1006",
    created_at: "2024-01-07T10:00:00Z",
  },
  {
    id: "sub_007",
    tenant_id: "tenant_007",
    plan_id: "plan_001",
    billing_cycle: "monthly",
    status: "active",
    trial_ends_at: null,
    current_period_start: "2024-03-15T00:00:00Z",
    current_period_end: "2024-04-15T00:00:00Z",
    razorpay_subscription_id: null,
    created_at: "2024-03-15T09:30:00Z",
  },
  {
    id: "sub_008",
    tenant_id: "tenant_008",
    plan_id: "plan_001",
    billing_cycle: "monthly",
    status: "trialing",
    trial_ends_at: "2024-05-02T00:00:00Z",
    current_period_start: "2024-04-02T00:00:00Z",
    current_period_end: "2024-05-02T00:00:00Z",
    razorpay_subscription_id: null,
    created_at: "2024-04-02T14:20:00Z",
  },
];
