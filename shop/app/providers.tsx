"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useBannersStore, useBrandsStore, useCategoriesStore, useCouponsStore, useCustomersStore, useOrdersStore, usePagesStore, useProductsStore, useTicketsStore } from "@/lib/store";

const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "demo";
const BOOTSTRAP_ENDPOINT = "/api/backend/shop/data/bootstrap";

type BootstrapEntity = Record<string, unknown> & {
  isActive?: boolean;
  is_active?: boolean;
  productCount?: number;
  count?: number;
};

type BootstrapPayload = {
  products?: unknown[];
  orders?: BackendOrder[];
  customers?: unknown[];
  coupons?: unknown[];
  tickets?: unknown[];
  categories?: BootstrapEntity[];
  brands?: BootstrapEntity[];
  banners?: unknown[];
  pages?: unknown[];
};

type BackendOrder = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  email?: string;
  createdAt?: string;
  created_at?: string;
  items?: Array<{ productId?: string; title?: string; variant?: string; qty?: number; price?: number }>;
  pricing?: {
    subtotal?: number;
    shippingFee?: number;
    taxTotal?: number;
    discountTotal?: number;
    grandTotal?: number;
  };
  paymentStatus?: string;
  payment_status?: string;
  paymentMethod?: string;
  payment_method?: string;
  fulfillmentStatus?: string;
  fulfillment_status?: string;
  shippingAddress?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  trackingNumber?: string;
  tracking_number?: string;
  courier?: string;
};

async function fetchBootstrap(): Promise<BootstrapPayload | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(BOOTSTRAP_ENDPOINT, {
      headers: {
        "X-Tenant-Slug": TENANT_SLUG,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("Bootstrap request failed", response.status);
      return null;
    }

    return (await response.json()) as BootstrapPayload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }
    console.warn("Bootstrap request failed", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeCategory(category: BootstrapEntity) {
  return {
    ...category,
    isActive: category.isActive ?? category.is_active ?? true,
    productCount: category.productCount ?? category.count ?? 0,
  };
}

function normalizeBrand(brand: BootstrapEntity) {
  return {
    ...brand,
    isActive: brand.isActive ?? brand.is_active ?? true,
    productCount: brand.productCount ?? brand.count ?? 0,
  };
}

function normalizeOrder(order: BackendOrder) {
  const items = (order.items ?? []).map((item) => ({
    productId: item.productId ?? "",
    title: item.title ?? "Product",
    variant: item.variant ?? "Default",
    qty: item.qty ?? 1,
    price: item.price ?? 0,
  }));

  const subtotal = order.pricing?.subtotal ?? 0;
  const shippingCost = order.pricing?.shippingFee ?? 0;
  const tax = order.pricing?.taxTotal ?? 0;
  const discount = order.pricing?.discountTotal ?? 0;
  const total = order.pricing?.grandTotal ?? subtotal + shippingCost + tax - discount;

  return {
    id: order.id,
    orderNumber: order.orderNumber ?? order.order_number ?? order.id,
    customer: {
      id: order.email ?? order.id,
      name: order.email ? order.email.split("@")[0] : "Customer",
      email: order.email ?? "",
      phone: "",
    },
    items,
    subtotal,
    shippingCost,
    tax,
    discount,
    total,
    paymentStatus: (order.paymentStatus ?? order.payment_status ?? "pending") as
      | "paid"
      | "pending"
      | "failed"
      | "refunded",
    paymentMethod: (order.paymentMethod ?? order.payment_method ?? "cod") as
      | "razorpay"
      | "upi"
      | "cod"
      | "netbanking",
    fulfillmentStatus: (order.fulfillmentStatus ?? order.fulfillment_status ?? "pending") as
      | "pending"
      | "processing"
      | "packed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "returned",
    currentStage: 0,
    shippingAddress: {
      line1: order.shippingAddress?.line1 ?? "",
      city: order.shippingAddress?.city ?? "",
      state: order.shippingAddress?.state ?? "",
      pincode: order.shippingAddress?.pincode ?? "",
    },
    deliveryAgents: [],
    trackingNumber: order.trackingNumber ?? order.tracking_number,
    courier: order.courier,
    createdAt: order.createdAt ?? order.created_at ?? new Date().toISOString(),
    updatedAt: order.createdAt ?? order.created_at ?? new Date().toISOString(),
    source: "admin" as const,
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  useEffect(() => {
    let active = true;

    fetchBootstrap().then((payload) => {
      if (!active || !payload) {
        return;
      }

      if (payload.products) {
        useProductsStore.setState({ products: payload.products });
      }
      if (payload.orders) {
        useOrdersStore.setState({ orders: payload.orders.map(normalizeOrder) });
      }
      if (payload.customers) {
        useCustomersStore.setState({ customers: payload.customers });
      }
      if (payload.coupons) {
        useCouponsStore.setState({ coupons: payload.coupons });
      }
      if (payload.tickets) {
        useTicketsStore.setState({ tickets: payload.tickets });
      }
      if (payload.categories) {
        useCategoriesStore.setState({ categories: payload.categories.map(normalizeCategory) });
      }
      if (payload.brands) {
        useBrandsStore.setState({ brands: payload.brands.map(normalizeBrand) });
      }
      if (payload.banners) {
        useBannersStore.setState({ banners: payload.banners });
      }
      if (payload.pages) {
        usePagesStore.setState({ pages: payload.pages });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
          {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
