// Mock database objects

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: number;
  comparePrice: number | null;
  optionValues: any; // e.g. { color: "Red", size: "M" }
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  featuredImage: string | null;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
}

export const mockCategories: Category[] = [
  {
    id: "cat_1",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and fashion accessories.",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
  },
  {
    id: "cat_2",
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets, devices, and latest tech.",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
  },
  {
    id: "cat_3",
    name: "Accessories",
    slug: "accessories",
    description: "Everyday carry and luxury accessories.",
    imageUrl: "https://images.unsplash.com/photo-1549491176-bf1372af2f48?w=800&q=80"
  }
];

export const mockProducts: Product[] = [
  {
    id: "prod_1",
    name: "Loose Fit Hoodie",
    slug: "loose-fit-hoodie",
    description: "Comfortable, premium cotton, loose fit hoodie perfect for everyday wear.",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    categoryId: "cat_1",
    category: mockCategories[0],
    variants: [
      {
        id: "var_1",
        productId: "prod_1",
        sku: "HOODIE-M",
        title: "Medium / Beige",
        price: 65.00,
        comparePrice: null,
        optionValues: { color: "Beige", size: "M" }
      },
      {
        id: "var_2",
        productId: "prod_1",
        sku: "HOODIE-L",
        title: "Large / Beige",
        price: 65.00,
        comparePrice: null,
        optionValues: { color: "Beige", size: "L" }
      }
    ]
  },
  {
    id: "prod_2",
    name: "Wireless ANC Headphones",
    slug: "wireless-anc-headphones",
    description: "Industry leading noise cancellation with premium sound.",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    categoryId: "cat_2",
    category: mockCategories[1],
    variants: [
      {
        id: "var_3",
        productId: "prod_2",
        sku: "ANC-HPD-BLK",
        title: "Black",
        price: 299.99,
        comparePrice: 349.99,
        optionValues: { color: "Black" }
      }
    ]
  },
  {
    id: "prod_3",
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    description: "Tactile switches, RGB backlight, wireless connectivity.",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    categoryId: "cat_2",
    category: mockCategories[1],
    variants: [
      {
        id: "var_4",
        productId: "prod_3",
        sku: "KB-MCH-WHT",
        title: "White",
        price: 129.00,
        comparePrice: null,
        optionValues: { color: "White" }
      }
    ]
  },
  {
    id: "prod_4",
    name: "Classic Aviator Sunglasses",
    slug: "classic-aviator",
    description: "Polarized lenses, titanium frame.",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    categoryId: "cat_3",
    category: mockCategories[2],
    variants: [
      {
        id: "var_5",
        productId: "prod_4",
        sku: "GLS-AV-GOLD",
        title: "Gold Frame",
        price: 185.00,
        comparePrice: 200.00,
        optionValues: { color: "Gold" }
      }
    ]
  }
];
