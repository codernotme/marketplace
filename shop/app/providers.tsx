"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useBannersStore, useBrandsStore, useCategoriesStore, useCouponsStore, useCustomersStore, useOrdersStore, usePagesStore, useProductsStore, useTicketsStore } from "@/lib/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "demo";

async function fetchBootstrap() {
  const response = await fetch(`${API_BASE_URL}/shop/data/bootstrap`, {
    headers: {
      "X-Tenant-Slug": TENANT_SLUG,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function normalizeCategory(category: any) {
  return {
    ...category,
    isActive: category.isActive ?? category.is_active ?? true,
    productCount: category.productCount ?? category.count ?? 0,
  };
}

function normalizeBrand(brand: any) {
  return {
    ...brand,
    isActive: brand.isActive ?? brand.is_active ?? true,
    productCount: brand.productCount ?? brand.count ?? 0,
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
        useOrdersStore.setState({ orders: payload.orders });
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
