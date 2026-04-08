'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { createOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';

const steps = ['Cart', 'Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Real form state
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.productId || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        pricing: {
          subtotal: subtotal,
          tax_total: 0, // Simplified tax
          shipping_fee: shipping,
          grand_total: total
        },
        payment_method: payment.method,
        source: "web",
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        shipping_address: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}`
      };

      const res = await createOrder(orderData);
      if (!res) throw new Error('Failed to place order');
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen font-body pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <PageWrapper>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="themrktplace"
                width={96}
                height={36}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-black' : 'text-gray-300'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < step ? 'bg-black text-white' : i + 1 === step ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {i + 1 < step ? <Icon icon="mdi:check" /> : i + 1}
                    </div>
                    <span className="text-xs font-semibold">{s}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`w-8 h-px ${i + 1 < step ? 'bg-black' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <Link href="/cart" className="text-sm text-gray-400 hover:text-black font-medium flex items-center gap-1">
              <Icon icon="lucide:arrow-left" className="text-xs" /> Back to Cart
            </Link>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
                <h2 className="font-display text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-semibold text-sm text-black block mb-2">First Name</label>
                    <input type="text" name="firstName" value={customer.firstName} onChange={handleInputChange} placeholder="Jane" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-black block mb-2">Last Name</label>
                    <input type="text" name="lastName" value={customer.lastName} onChange={handleInputChange} placeholder="Doe" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-semibold text-sm text-black block mb-2">Email</label>
                    <input type="email" name="email" value={customer.email} onChange={handleInputChange} placeholder="jane@example.com" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-semibold text-sm text-black block mb-2">Street Address</label>
                    <input type="text" name="address" value={customer.address} onChange={handleInputChange} placeholder="123 Main Street" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-black block mb-2">City</label>
                    <input type="text" name="city" value={customer.city} onChange={handleInputChange} placeholder="San Francisco" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-black block mb-2">ZIP Code</label>
                    <input type="text" name="zip" value={customer.zip} onChange={handleInputChange} placeholder="94103" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full mt-8 h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform font-body">
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
                <h2 className="font-display text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </h2>
                <div className="flex flex-col gap-4 mb-8">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all border-black bg-[#F9F9F9]`}>
                    <input type="radio" defaultChecked className="accent-black" />
                    <Icon icon="mdi:credit-card-outline" className="text-2xl" />
                    <span className="font-body font-semibold text-sm text-black">Credit / Debit Card</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="font-semibold text-sm text-black block mb-2">Cardholder Name</label>
                    <input type="text" placeholder="Jane Doe" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="flex-1 h-14 border-2 border-gray-100 text-black font-bold rounded-xl hover:border-gray-300 transition-colors font-body">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform font-body">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
                <h2 className="font-display text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Review & Place Order
                </h2>
                <div className="bg-[#F5F5F5] rounded-2xl p-6 flex flex-col gap-4 mb-8 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Delivery to</span>
                    <span className="font-semibold text-black">{customer.address}, {customer.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Email</span>
                    <span className="font-semibold text-black">{customer.email}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 h-14 border-2 border-gray-100 text-black font-bold rounded-xl hover:border-gray-300 transition-colors font-body">
                    ← Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                    className="flex-1 h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all font-body flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-display font-bold text-xl text-black mb-5">Order Summary</h3>
              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply p-1" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-black line-clamp-1">{item.name}</p>
                      <p className="font-body text-xs text-gray-400">{item.variantLabel}</p>
                    </div>
                    <span className="font-display font-bold text-sm text-black">${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 text-sm font-body border-t border-gray-100 pt-5 mb-5">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-[#84D347]' : 'text-black'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center font-display font-bold text-xl text-black pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
