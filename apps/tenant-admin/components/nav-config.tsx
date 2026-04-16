"use client";

import {
  ChartBarSquare01Icon,
  Bag01Icon,
  ShoppingBasket01Icon,
  UserMultiple02Icon,
  CreditCard01Icon,
  DeliveryTruck01Icon,
  Discount01Icon,
  ChartBreakoutSquareIcon,
  Settings01Icon,
  Store01Icon,
  GridViewIcon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: string;
  children?: Omit<NavItem, "icon" | "children">[];
}

export const tenantNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: GridViewIcon,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: PackageIcon,
    children: [
      { label: "All Products", href: "/dashboard/products" },
      { label: "Collections", href: "/dashboard/products/collections" },
      { label: "Inventory", href: "/dashboard/products/inventory" },
    ],
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBasket01Icon,
    children: [
      { label: "All Orders", href: "/dashboard/orders" },
      { label: "Drafts", href: "/dashboard/orders/drafts" },
      { label: "Returns", href: "/dashboard/orders/returns" },
    ],
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: UserMultiple02Icon,
  },
  {
    label: "Marketing",
    href: "/dashboard/marketing",
    icon: Discount01Icon,
    children: [
      { label: "Discounts", href: "/dashboard/marketing/discounts" },
      { label: "Campaigns", href: "/dashboard/marketing/campaigns" },
      { label: "Loyalty", href: "/dashboard/marketing/loyalty" },
    ],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartBarSquare01Icon,
    children: [
      { label: "Overview", href: "/dashboard/analytics" },
      { label: "Sales", href: "/dashboard/analytics/sales" },
      { label: "Products", href: "/dashboard/analytics/products" },
      { label: "Customers", href: "/dashboard/analytics/customers" },
    ],
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard01Icon,
  },
  {
    label: "Shipping",
    href: "/dashboard/shipping",
    icon: DeliveryTruck01Icon,
  },
  {
    label: "Storefront",
    href: "/dashboard/storefront",
    icon: Store01Icon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings01Icon,
  },
];

// Icon renderer helper using HugeIcons
export function NavIcon({ icon: Icon }: { icon: React.ComponentType }) {
  return <HugeiconsIcon icon={Icon} size={18} />;
}
