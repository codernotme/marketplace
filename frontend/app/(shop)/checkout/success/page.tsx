import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/HeroUI';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[--c-bg] min-h-[calc(100vh-130px)] flex items-center justify-center">
      <PageWrapper>
        <div className="py-20 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[--c-success] rounded-full flex items-center justify-center text-white mb-8 shadow-lg">
            <Icon icon="lucide:check" className="w-10 h-10" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-[--c-primary] mb-4">Order Confirmed!</h1>
          <p className="text-[--c-secondary] text-[15px] mb-10 leading-relaxed">
            Thank you for your purchase. We've received your order and will email you the receipt and shipping details shortly.
          </p>
          <div className="flex gap-4 w-full">
            <Button as={Link} href="/orders" variant="bordered" className="flex-1 rounded-full h-14 border-[--c-border] text-[--c-primary] hover:border-[--c-primary]">
              View Order
            </Button>
            <Button as={Link} href="/products" className="flex-1 rounded-full h-14 bg-[--c-primary] text-white">
              Continue Shopping
            </Button>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
