import { fetchProducts } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { SortDropdown } from '@/components/product/SortDropdown';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Breadcrumbs, BreadcrumbItem } from '@/components/HeroUI';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const products = await fetchProducts();

  return (
    <PageWrapper>
      <div className="py-8">
        <Breadcrumbs classNames={{ list: "gap-2 mt-2" }}>
          <BreadcrumbItem href="/" classNames={{ item: "text-[--c-muted]" }}>Home</BreadcrumbItem>
          <BreadcrumbItem classNames={{ item: "text-[--c-primary] font-medium" }}>All Products</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 sticky top-24">
            <ProductFilters />
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-gray-900">All Products</h1>
                <p className="font-body text-sm font-medium text-gray-500 mt-1">{products.length} items found</p>
              </div>
              <SortDropdown />
            </div>

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
