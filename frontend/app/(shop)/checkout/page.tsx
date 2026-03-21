'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';

const cartItems = [
  { id: 'p1', title: 'Minimalist Leather Watch', variant: 'Black / Silver', price: 189, qty: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80' },
  { id: 'p7', title: 'DR CRZ Varsity Jacket', variant: 'M', price: 349, qty: 1, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80' },
];

const steps = ['Cart', 'Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div className="bg-[#F9F9F9] min-h-screen font-body pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <PageWrapper>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">m</span>
              </div>
              <span className="font-display font-black text-black tracking-tight">themrktplace</span>
            </Link>
            {/* Step Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-black' : 'text-gray-300'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < step ? 'bg-[#84D347] text-black' : i + 1 === step ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {i + 1 < step ? <Icon icon="mdi:check" /> : i + 1}
                    </div>
                    <span className="text-xs font-semibold">{s}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`w-8 h-px ${i + 1 < step ? 'bg-[#84D347]' : 'bg-gray-200'}`} />}
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

          {/* LEFT: Form Area */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-display text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', placeholder: 'Jane', col: '1' },
                    { label: 'Last Name', placeholder: 'Doe', col: '1' },
                    { label: 'Email', placeholder: 'jane@example.com', col: '2' },
                    { label: 'Phone', placeholder: '+1 (555) 000-0000', col: '1' },
                  ].map(f => (
                    <div key={f.label} className={f.col === '2' ? 'md:col-span-2' : ''}>
                      <label className="font-semibold text-sm text-black block mb-2">{f.label}</label>
                      <input type="text" placeholder={f.placeholder} className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="font-semibold text-sm text-black block mb-2">Street Address</label>
                    <input type="text" placeholder="123 Main Street, Apt 4B" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                  </div>
                  {[
                    { label: 'City', placeholder: 'San Francisco' },
                    { label: 'State', placeholder: 'California' },
                    { label: 'ZIP Code', placeholder: '94103' },
                    { label: 'Country', placeholder: 'United States' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="font-semibold text-sm text-black block mb-2">{f.label}</label>
                      <input type="text" placeholder={f.placeholder} className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-6 p-4 bg-[#F5F5F5] rounded-2xl">
                  <input type="checkbox" id="saveAddr" className="w-4 h-4 accent-black" />
                  <label htmlFor="saveAddr" className="font-body text-sm text-gray-600 cursor-pointer">Save this address for future orders</label>
                </div>
                <button onClick={() => setStep(2)} className="w-full mt-8 h-14 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform font-body">
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-display text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </h2>

                {/* Card Options */}
                <div className="flex flex-col gap-4 mb-8">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: 'mdi:credit-card-outline', selected: true },
                    { id: 'paypal', label: 'PayPal', icon: 'mdi:paypal', selected: false },
                    { id: 'apple', label: 'Apple Pay', icon: 'mdi:apple', selected: false },
                  ].map(option => (
                    <label key={option.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${option.selected ? 'border-black bg-[#F9F9F9]' : 'border-gray-100 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" defaultChecked={option.selected} className="accent-black" />
                      <Icon icon={option.icon} className="text-2xl" />
                      <span className="font-body font-semibold text-sm text-black">{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="font-semibold text-sm text-black block mb-2">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="1234  5678  9012  3456" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm pr-12" />
                      <Icon icon="mdi:credit-card-outline" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-sm text-black block mb-2">Expiry Date</label>
                      <input type="text" placeholder="MM / YY" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                    </div>
                    <div>
                      <label className="font-semibold text-sm text-black block mb-2">CVC</label>
                      <input type="text" placeholder="•••" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black outline-none focus:border-black focus:bg-white transition-all text-sm" />
                    </div>
                  </div>
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

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-display text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Review & Place Order
                </h2>
                <div className="flex flex-col gap-4 mb-8">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-2xl">
                      <div className="w-16 h-16 bg-white rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <p className="font-body font-semibold text-sm text-black">{item.title}</p>
                        <p className="font-body text-xs text-gray-400">{item.variant} · Qty {item.qty}</p>
                      </div>
                      <span className="font-display font-bold text-black">${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col gap-3 mb-8 text-sm font-body">
                  {[
                    { label: 'Delivery to', value: '123 Main St, San Francisco, CA' },
                    { label: 'Payment', value: '**** **** **** 3456' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-gray-500 font-medium">{row.label}</span>
                      <span className="font-semibold text-black">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 h-14 border-2 border-gray-100 text-black font-bold rounded-xl hover:border-gray-300 transition-colors font-body">
                    ← Back
                  </button>
                  <Link href="/checkout/success" className="flex-1 h-14 bg-[#84D347] text-black font-bold rounded-xl hover:scale-[1.02] transition-transform font-body flex items-center justify-center">
                    Place Order — ${total.toFixed(2)}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-display font-bold text-xl text-black mb-5">Order Summary</h3>
              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply p-1" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-black line-clamp-1">{item.title}</p>
                      <p className="font-body text-xs text-gray-400">{item.variant}</p>
                    </div>
                    <span className="font-display font-bold text-sm text-black">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <input type="text" placeholder="Promo code" className="flex-1 bg-[#F5F5F5] rounded-xl px-4 h-10 text-sm font-body outline-none focus:ring-2 focus:ring-black transition-all" />
                <button className="bg-black text-white font-bold rounded-xl px-4 h-10 text-sm font-body hover:scale-105 transition-transform">
                  Apply
                </button>
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

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400 font-body">
                <Icon icon="mdi:lock-outline" className="text-sm text-[#84D347]" />
                Secured by 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
