export interface Plan {
  id: string;
  name: "free" | "starter" | "pro" | "enterprise";
  display_name: string;
  price_monthly: number;
  price_yearly: number;
  limits: {
    products: number;
    orders_per_month: number;
    storage_gb: number;
    team_members: number;
    custom_domain: boolean;
    telegram_bot: boolean;
    analytics: "basic" | "advanced";
    ads_module: boolean;
  };
  is_active: boolean;
}

export const plans: Plan[] = [
  {
    id: "plan_001",
    name: "free",
    display_name: "Free",
    price_monthly: 0,
    price_yearly: 0,
    limits: {
      products: 50,
      orders_per_month: 100,
      storage_gb: 1,
      team_members: 1,
      custom_domain: false,
      telegram_bot: false,
      analytics: "basic",
      ads_module: false,
    },
    is_active: true,
  },
  {
    id: "plan_002",
    name: "starter",
    display_name: "Starter",
    price_monthly: 29,
    price_yearly: 290,
    limits: {
      products: 500,
      orders_per_month: 1000,
      storage_gb: 10,
      team_members: 3,
      custom_domain: true,
      telegram_bot: true,
      analytics: "basic",
      ads_module: false,
    },
    is_active: true,
  },
  {
    id: "plan_003",
    name: "pro",
    display_name: "Pro",
    price_monthly: 99,
    price_yearly: 990,
    limits: {
      products: 5000,
      orders_per_month: 10000,
      storage_gb: 100,
      team_members: 10,
      custom_domain: true,
      telegram_bot: true,
      analytics: "advanced",
      ads_module: true,
    },
    is_active: true,
  },
  {
    id: "plan_004",
    name: "enterprise",
    display_name: "Enterprise",
    price_monthly: 499,
    price_yearly: 4990,
    limits: {
      products: -1,
      orders_per_month: -1,
      storage_gb: 1000,
      team_members: -1,
      custom_domain: true,
      telegram_bot: true,
      analytics: "advanced",
      ads_module: true,
    },
    is_active: true,
  },
];
