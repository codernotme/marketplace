"use client"

import * as React from "react"
import { useCartStore } from "@/store/cartStore"
import api from "@/lib/api"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  Store01Icon,
  DeliveryTruck01Icon,
  ShieldCheckIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

interface ProductItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  imageUrl?: string
  variants: Array<{
    id: string
    sku: string
    size: string
    color: string
    stock: number
    imageUrl?: string
  }>
}

const PRODUCTS: ProductItem[] = [
  {
    id: "p1",
    name: "Oxford Cotton Classic Shirt",
    category: "Tops & Shirts",
    price: 1899.00,
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80",
    description: "Crafted from 100% fine long-staple cotton with a tailored button-down collar.",
    variants: [
      { id: "v1_s", sku: "SHT-OXF-WHT-S", size: "S", color: "White", stock: 12 },
      { id: "v1_m", sku: "SHT-OXF-WHT-M", size: "M", color: "White", stock: 24 },
      { id: "v1_l", sku: "SHT-OXF-WHT-L", size: "L", color: "White", stock: 18 },
    ],
  },
  {
    id: "p2",
    name: "Slim Fit Stretch Chino Trouser",
    category: "Trousers & Pants",
    price: 2499.00,
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    description: "Tailored chinos with 2% elastane for comfortable movement from boardroom to casual evenings.",
    variants: [
      { id: "v2_30", sku: "PNT-CHN-KHK-30", size: "30", color: "Khaki", stock: 8 },
      { id: "v2_32", sku: "PNT-CHN-KHK-32", size: "32", color: "Khaki", stock: 15 },
      { id: "v2_34", sku: "PNT-CHN-KHK-34", size: "34", color: "Khaki", stock: 10 },
    ],
  },
  {
    id: "p3",
    name: "Linen Summer Unstructured Blazer",
    category: "Outerwear & Tailoring",
    price: 4999.00,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    description: "Breathable pure European flax linen with horn buttons and pick-stitch detailing.",
    variants: [
      { id: "v3_38", sku: "BLZ-LIN-BEI-38", size: "38", color: "Beige", stock: 6 },
      { id: "v3_40", sku: "BLZ-LIN-BEI-40", size: "40", color: "Beige", stock: 8 },
    ],
  },
  {
    id: "p4",
    name: "Ribbed Knit Midi Silhouette Dress",
    category: "Dresses & Skirts",
    price: 3299.00,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    description: "Sculpted viscose blend knit with elegant side slit and refined round neckline.",
    variants: [
      { id: "v4_s", sku: "DRS-KNT-BLK-S", size: "S", color: "Black", stock: 12 },
      { id: "v4_m", sku: "DRS-KNT-BLK-M", size: "M", color: "Black", stock: 16 },
    ],
  },
  {
    id: "p5",
    name: "Pure Silk Handwoven Jacquard Tie",
    category: "Accessories & Leather",
    price: 1299.00,
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80",
    description: "Mulberry silk woven on heritage looms with wool canvas lining for full knots.",
    variants: [
      { id: "v5_os", sku: "ACC-TIE-MAR-OS", size: "OS", color: "Maroon", stock: 3 },
    ],
  },
  {
    id: "p6",
    name: "Full-Grain Italian Leather Belt",
    category: "Accessories & Leather",
    price: 2199.00,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    description: "Vegetable-tanned full-grain leather completed with solid brushed brass hardware.",
    variants: [
      { id: "v6_m", sku: "ACC-BLT-BRN-M", size: "M", color: "Brown", stock: 25 },
      { id: "v6_l", sku: "ACC-BLT-BLK-M", size: "L", color: "Black", stock: 30 },
    ],
  },
]

export default function HomePage() {
  const [productList, setProductList] = React.useState<ProductItem[]>(PRODUCTS)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL")
  const [selectedVariants, setSelectedVariants] = React.useState<Record<string, string>>({})
  const addItem = useCartStore((s) => s.addItem)

  React.useEffect(() => {
    async function fetchLiveCatalog() {
      try {
        const res = await api.get('/website/catalog')
        const items = res.data?.data ?? res.data
        if (Array.isArray(items) && items.length > 0) {
          const liveMapped: ProductItem[] = items.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.categoryName || 'Apparel',
            price: Number(p.basePrice),
            description: p.description || '',
            imageUrl: p.variants?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
            variants: (p.variants || []).map((v: any) => ({
              id: v.id,
              sku: v.sku,
              size: v.attributeValues?.Size || v.attributeValues?.Waist || v.attributeValues?.Chest || 'Standard',
              color: v.attributeValues?.Color || 'Default',
              stock: v.stockQuantity ?? 10,
              imageUrl: v.imageUrl,
            })),
          }))
          setProductList(liveMapped)
        }
      } catch (_) {
        // Retains rich fallback catalog
      }
    }
    fetchLiveCatalog()
  }, [])

  const categories = ["ALL", "Tops & Shirts", "Trousers & Pants", "Outerwear & Tailoring", "Dresses & Skirts", "Accessories & Leather"]

  const filteredProducts = selectedCategory === "ALL"
    ? productList
    : productList.filter((p) => p.category === selectedCategory)

  const handleAddToCart = (product: ProductItem) => {
    const selectedVariantId = selectedVariants[product.id] || product.variants[0]?.id
    const variant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0]

    if (!variant) return

    addItem({
      variantId: variant.id,
      productName: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: product.price,
      quantity: 1,
      imageUrl: variant.imageUrl || product.imageUrl,
    })

    toast.success(`Added ${product.name} (${variant.size}) to shopping bag`)
  }

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Luxury Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card to-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Autumn / Winter 2026 Collection
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Contemporary Apparel. <br />
              Tailored Precision.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Engineered with sustainable European natural textiles. Shop online with direct store pickup at our Indiranagar Flagship or express courier delivery.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <span>Shop New Arrivals</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Omnichannel Value Props */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Store01Icon} className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Click & Collect (BOPIS)</h4>
              <p className="text-xs text-muted-foreground">Order online, pick up at Indiranagar Store in 2 hours.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={DeliveryTruck01Icon} className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Complimentary Express Courier</h4>
              <p className="text-xs text-muted-foreground">White-glove delivery on all domestic orders over ₹4,999.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={ShieldCheckIcon} className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">14-Day Store Exchange</h4>
              <p className="text-xs text-muted-foreground">Instant store credit issued at any physical retail register.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Catalog Section */}
      <section id="catalog" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/40 bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const selectedVariantId = selectedVariants[product.id] || product.variants[0]?.id
            const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0]
            const cardImg = selectedVariant?.imageUrl || product.imageUrl

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-primary/40 hover:shadow-lg"
              >
                {/* Product Image */}
                {cardImg && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20">
                    <img
                      src={cardImg}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-bold backdrop-blur-md">
                      {selectedVariant?.stock && selectedVariant.stock > 0 ? (
                        <span className="text-emerald-500">In Stock ({selectedVariant.stock})</span>
                      ) : (
                        <span className="text-rose-500">Low Stock</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Category */}
                    <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {product.category}
                    </div>

                    {/* Product Title & Price */}
                    <h3 className="mt-1.5 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-3 text-lg font-extrabold text-foreground">
                      ₹{product.price.toFixed(2)}
                    </div>

                    {/* Variant Size Selector */}
                    <div className="mt-4">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                        Select Size:
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.id]: v.id,
                              }))
                            }
                            className={`flex h-8 min-w-[32px] items-center justify-center rounded border px-2.5 text-xs font-semibold ${
                              selectedVariant?.id === v.id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/60 bg-muted/20 text-foreground hover:border-primary/50"
                            }`}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
