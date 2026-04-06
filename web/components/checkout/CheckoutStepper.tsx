'use client';

import { useState } from 'react';
import { Button, Input, RadioGroup, Radio } from '@/components/HeroUI';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCartStore } from '@/store/cart.store';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

const steps = ['Address', 'Shipping', 'Payment', 'Review'];

export const CheckoutStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { clearCart, items } = useCartStore();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-display text-[--c-primary]">Your cart is empty</h2>
        <Button onPress={() => router.push('/products')} className="mt-6 bg-[--c-primary] text-white rounded-full px-8">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[--c-border] -z-10 -translate-y-1/2"></div>
          <div 
             className="absolute top-1/2 left-0 h-[2px] bg-[--c-primary] -z-10 -translate-y-1/2 transition-all duration-300" 
             style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors ${currentStep >= idx ? 'bg-[--c-primary] border-[--c-primary] text-white' : 'bg-white border-[--c-border] text-[--c-muted]'}`}>
                {currentStep > idx ? <Icon icon="lucide:check" className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium tracking-wide uppercase ${currentStep >= idx ? 'text-[--c-primary]' : 'text-[--c-muted]'}`}>{step}</span>
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[--c-border]">
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-display text-2xl text-[--c-primary]">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="First Name" labelPlacement="outside" placeholder="John" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="Last Name" labelPlacement="outside" placeholder="Doe" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="Email" type="email" labelPlacement="outside" className="md:col-span-2" placeholder="john@example.com" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="Address Line 1" labelPlacement="outside" className="md:col-span-2" placeholder="123 Main St" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="City" labelPlacement="outside" placeholder="Mumbai" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="Postal Code" labelPlacement="outside" placeholder="400001" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="font-display text-2xl text-[--c-primary]">Shipping Method</h3>
               <RadioGroup defaultValue="standard">
                  <div className="flex flex-col gap-3">
                    <Radio value="standard" classNames={{ base: "border border-[--c-border] w-full max-w-full m-0 p-4 rounded-xl data-[selected=true]:border-[--c-primary] transition-all", label: "font-medium text-[--c-primary]" }}>
                      Standard Delivery (Free) - 3-5 Business Days
                    </Radio>
                    <Radio value="express" classNames={{ base: "border border-[--c-border] w-full max-w-full m-0 p-4 rounded-xl data-[selected=true]:border-[--c-primary] transition-all", label: "font-medium text-[--c-primary]" }}>
                      Express Delivery (₹250) - 1-2 Business Days
                    </Radio>
                  </div>
               </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="font-display text-2xl text-[--c-primary]">Payment Method</h3>
               <RadioGroup defaultValue="cc">
                  <div className="flex flex-col gap-3">
                    <Radio value="cc" classNames={{ base: "border border-[--c-border] w-full max-w-full m-0 p-4 rounded-xl data-[selected=true]:border-[--c-primary] transition-all", label: "font-medium text-[--c-primary]" }}>
                      Credit/Debit Card
                    </Radio>
                    <Radio value="upi" classNames={{ base: "border border-[--c-border] w-full max-w-full m-0 p-4 rounded-xl data-[selected=true]:border-[--c-primary] transition-all", label: "font-medium text-[--c-primary]" }}>
                      UPI
                    </Radio>
                    <Radio value="cod" classNames={{ base: "border border-[--c-border] w-full max-w-full m-0 p-4 rounded-xl data-[selected=true]:border-[--c-primary] transition-all", label: "font-medium text-[--c-primary]" }}>
                      Cash on Delivery
                    </Radio>
                  </div>
               </RadioGroup>
               <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[--c-border]">
                 <Input label="Card Number" labelPlacement="outside" className="col-span-2" placeholder="0000 0000 0000 0000" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="Expiry" labelPlacement="outside" placeholder="MM/YY" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
                 <Input label="CVC" labelPlacement="outside" placeholder="123" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none" }} />
               </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="font-display text-2xl text-[--c-primary]">Review Order</h3>
               <p className="text-[--c-secondary] text-sm">Please review your items and shipping details before placing the order.</p>
               <div className="bg-[--c-surface] p-4 rounded-xl mt-4 space-y-2">
                 <p className="text-sm font-medium text-[--c-primary]">Shipping to</p>
                 <p className="text-sm text-[--c-secondary]">John Doe, 123 Main St, Mumbai 400001</p>
               </div>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-[--c-border]">
             {currentStep > 0 ? (
               <Button variant="light" onPress={() => setCurrentStep(s => s - 1)} className="font-medium">
                 Back
               </Button>
             ) : <div></div>}
             
             <Button 
                isLoading={loading}
                onPress={handleNext} 
                className="bg-[--c-primary] text-white rounded-full px-8 font-medium shadow-md hover:shadow-lg transition-all"
             >
               {currentStep === steps.length - 1 ? "Place Order" : "Continue"}
             </Button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0">
         <div className="bg-white p-6 rounded-2xl border border-[--c-border] sticky top-24">
            <h3 className="font-display text-xl mb-6 text-[--c-primary]">Order Summary</h3>
            <CartSummary isCheckout />
         </div>
      </div>
    </div>
  );
};
