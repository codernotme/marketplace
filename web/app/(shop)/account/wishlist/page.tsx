import { ProductCard } from '@/components/product/ProductCard';
import { fetchProducts } from '@/lib/api';

export default async function AccountWishlistPage() {
  const products = await fetchProducts();
  const wishlistItems = products.filter((item) => item.is_featured).slice(0, 8);

  return (
    <div className="animate-in fade-in duration-300">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Wishlist</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">Saved Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
