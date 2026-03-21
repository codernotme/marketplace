import { PageWrapper } from '@/components/shared/PageWrapper';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { Breadcrumbs, BreadcrumbItem } from '@/components/HeroUI';

export default function CheckoutPage() {
  return (
    <div className="bg-[--c-bg] min-h-[calc(100vh-130px)]">
      <PageWrapper>
        <div className="py-8">
          <Breadcrumbs classNames={{ list: "gap-2 mb-8" }}>
            <BreadcrumbItem href="/" classNames={{ item: "text-[--c-muted]" }}>Home</BreadcrumbItem>
            <BreadcrumbItem classNames={{ item: "text-[--c-primary] font-medium" }}>Checkout</BreadcrumbItem>
          </Breadcrumbs>
          
          <h1 className="font-display text-4xl mb-12 text-[--c-primary]">Checkout</h1>
          <CheckoutStepper />
        </div>
      </PageWrapper>
    </div>
  );
}
