import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products }: { products: any[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};
