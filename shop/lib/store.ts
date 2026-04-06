import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  products as initialProducts,
  orders as initialOrders,
  customers as initialCustomers,
  coupons as initialCoupons,
  tickets as initialTickets,
  categories as initialCategories,
  brands as initialBrands,
  banners as initialBanners,
  emailTemplates as initialEmailTemplates,
  blogPosts as initialBlogPosts,
  initialStaticPages,
  type Product,
  type Order,
  type Customer,
  type Coupon,
  type Ticket,
  type TicketStatus,
  type OrderStatus,
  type DeliveryAgent,
  type BlogPost,
  type StaticPage,
} from "./mock-data";

// ──────────────────────────────────────────────────
// UI State Store
// ──────────────────────────────────────────────────
export type ModalType = "product" | "category" | "brand" | "coupon" | "banner" | "order" | "blog" | "page" | null;
export type ModalMode = "add" | "edit";

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  expandedNavKeys: string[];
  activeModal: ModalType;
  modalMode: ModalMode;
  modalData: any;
  toggleSidebarCollapsed: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleNavKey: (key: string) => void;
  expandNavKey: (key: string) => void;
  openModal: (type: ModalType, mode?: ModalMode, data?: any) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      expandedNavKeys: ["dashboard"],
      activeModal: null,
      modalMode: "add",
      modalData: null,
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      toggleNavKey: (key) => {
        const curr = get().expandedNavKeys;
        set({ expandedNavKeys: curr.includes(key) ? curr.filter((k) => k !== key) : [...curr, key] });
      },
      expandNavKey: (key) => {
        const curr = get().expandedNavKeys;
        if (!curr.includes(key)) set({ expandedNavKeys: [...curr, key] });
      },
      openModal: (type, mode = "add", data = null) => set({ activeModal: type, modalMode: mode, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),
    }),
    { name: "tm-ui-store" }
  )
);

// ──────────────────────────────────────────────────
// Products CRUD Store
// ──────────────────────────────────────────────────
interface ProductsStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  toggleFlag: (id: string, flag: "is_new" | "is_featured" | "is_trending") => void;
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (product) => set((s) => ({ products: [product, ...s.products] })),
      updateProduct: (id, updates) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      toggleProductStatus: (id) =>
        set((s) => ({
          products: s.products.map((p) => {
            if (p.id !== id) return p;
            const next = p.status === "active" ? "draft" : p.status === "draft" ? "archived" : "active";
            return { ...p, status: next };
          }),
        })),
      toggleFlag: (id, flag) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, [flag]: !p[flag] } : p)),
        })),
    }),
    { name: "tm-products-store" }
  )
);

// ──────────────────────────────────────────────────
// Orders Store
// ──────────────────────────────────────────────────
interface OrdersStore {
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: Order["paymentStatus"]) => void;
  updateTracking: (id: string, trackingNumber: string, courier: string) => void;
  updateOrderStage: (id: string, stage: number) => void;
  addDeliveryAgent: (id: string, agent: DeliveryAgent) => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: initialOrders,
      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, fulfillmentStatus: status, updatedAt: new Date().toISOString() } : o
          ),
        })),
      updatePaymentStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o
          ),
        })),
      updateTracking: (id, trackingNumber, courier) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, trackingNumber, courier, updatedAt: new Date().toISOString() } : o
          ),
        })),
      updateOrderStage: (id, stage) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, currentStage: stage, updatedAt: new Date().toISOString() } : o
          ),
        })),
      addDeliveryAgent: (id, agent) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, deliveryAgents: [...o.deliveryAgents, agent], updatedAt: new Date().toISOString() } : o
          ),
        })),
    }),
    { name: "tm-orders-store" }
  )
);

// ──────────────────────────────────────────────────
// Blog Store
// ──────────────────────────────────────────────────
interface BlogStore {
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, updates: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  toggleFeatured: (id: string) => void;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set) => ({
      posts: initialBlogPosts,
      addPost: (post) => set((s) => ({ posts: [post, ...s.posts] })),
      updatePost: (id, updates) =>
        set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deletePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
      toggleFeatured: (id) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
        })),
    }),
    { name: "tm-blog-store" }
  )
);

// ──────────────────────────────────────────────────
// Customers Store
// ──────────────────────────────────────────────────
interface CustomersStore {
  customers: Customer[];
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  toggleActive: (id: string) => void;
}

export const useCustomersStore = create<CustomersStore>()(
  persist(
    (set) => ({
      customers: initialCustomers,
      updateCustomer: (id, updates) =>
        set((s) => ({ customers: s.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      addTag: (id, tag) =>
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === id && !c.tags.includes(tag) ? { ...c, tags: [...c.tags, tag] } : c
          ),
        })),
      removeTag: (id, tag) =>
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === id ? { ...c, tags: c.tags.filter((t) => t !== tag) } : c
          ),
        })),
      toggleActive: (id) =>
        set((s) => ({
          customers: s.customers.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        })),
    }),
    { name: "tm-customers-store" }
  )
);

// ──────────────────────────────────────────────────
// Coupons Store
// ──────────────────────────────────────────────────
interface CouponsStore {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;
}

export const useCouponsStore = create<CouponsStore>()(
  persist(
    (set) => ({
      coupons: initialCoupons,
      addCoupon: (coupon) => set((s) => ({ coupons: [coupon, ...s.coupons] })),
      updateCoupon: (id, updates) =>
        set((s) => ({ coupons: s.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      deleteCoupon: (id) => set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),
      toggleCoupon: (id) =>
        set((s) => ({
          coupons: s.coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        })),
    }),
    { name: "tm-coupons-store" }
  )
);

// ──────────────────────────────────────────────────
// Tickets Store
// ──────────────────────────────────────────────────
interface TicketsStore {
  tickets: Ticket[];
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addMessage: (id: string, text: string, from: "admin" | "customer") => void;
  deleteTicket: (id: string) => void;
}

export const useTicketsStore = create<TicketsStore>()(
  persist(
    (set) => ({
      tickets: initialTickets,
      updateTicketStatus: (id, status) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          ),
        })),
      addMessage: (id, text, from) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === id
              ? { ...t, messages: [...t.messages, { from, text, at: new Date().toISOString() }], updatedAt: new Date().toISOString() }
              : t
          ),
        })),
      deleteTicket: (id) => set((s) => ({ tickets: s.tickets.filter((t) => t.id !== id) })),
    }),
    { name: "tm-tickets-store" }
  )
);

// ──────────────────────────────────────────────────
// Categories Store
// ──────────────────────────────────────────────────
type Category = typeof initialCategories[0];

interface CategoriesStore {
  categories: Category[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
}

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set) => ({
      categories: initialCategories,
      addCategory: (cat) => set((s) => ({ categories: [...s.categories, cat] })),
      updateCategory: (id, updates) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      toggleCategory: (id) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        })),
    }),
    { name: "tm-categories-store" }
  )
);

// ──────────────────────────────────────────────────
// Brands Store
// ──────────────────────────────────────────────────
type Brand = typeof initialBrands[0];

interface BrandsStore {
  brands: Brand[];
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  toggleBrand: (id: string) => void;
}

export const useBrandsStore = create<BrandsStore>()(
  persist(
    (set) => ({
      brands: initialBrands,
      addBrand: (brand) => set((s) => ({ brands: [...s.brands, brand] })),
      updateBrand: (id, updates) =>
        set((s) => ({ brands: s.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)) })),
      deleteBrand: (id) => set((s) => ({ brands: s.brands.filter((b) => b.id !== id) })),
      toggleBrand: (id) =>
        set((s) => ({
          brands: s.brands.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)),
        })),
    }),
    { name: "tm-brands-store" }
  )
);

// ──────────────────────────────────────────────────
// Banners Store
// ──────────────────────────────────────────────────
type Banner = typeof initialBanners[0];

interface BannersStore {
  banners: Banner[];
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
}

export const useBannersStore = create<BannersStore>()(
  persist(
    (set) => ({
      banners: initialBanners,
      addBanner: (b) => set((s) => ({ banners: [b, ...s.banners] })),
      updateBanner: (id, updates) =>
        set((s) => ({ banners: s.banners.map((b) => (b.id === id ? { ...b, ...updates } : b)) })),
      deleteBanner: (id) => set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),
      toggleBanner: (id) =>
        set((s) => ({ banners: s.banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)) })),
    }),
    { name: "tm-banners-store" }
  )
);

// ──────────────────────────────────────────────────
// Pages Store
// ──────────────────────────────────────────────────
interface PagesStore {
  pages: StaticPage[];
  addPage: (page: StaticPage) => void;
  updatePage: (id: string, updates: Partial<StaticPage>) => void;
  deletePage: (id: string) => void;
  togglePageStatus: (id: string) => void;
}

export const usePagesStore = create<PagesStore>()(
  persist(
    (set) => ({
      pages: initialStaticPages,
      addPage: (page) => set((s) => ({ pages: [page, ...s.pages] })),
      updatePage: (id, updates) =>
        set((s) => ({ pages: s.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deletePage: (id) => set((s) => ({ pages: s.pages.filter((p) => p.id !== id) })),
      togglePageStatus: (id) =>
        set((s) => ({
          pages: s.pages.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "draft" : "active" } : p)),
        })),
    }),
    { name: "tm-pages-store" }
  )
);
